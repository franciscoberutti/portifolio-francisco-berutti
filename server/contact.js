const MAX_BYTES = 16000;
const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const UNAVAILABLE = 'Envio indisponível no momento. Use o link de e-mail ou tente novamente.';

function json(status, payload, headers = {}) {
  return Response.json(payload, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

async function readPayload(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError('Missing body');
  const decoder = new TextDecoder();
  let size = 0;
  let body = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) {
      void reader.cancel().catch(() => {});
      throw new RangeError('Payload too large');
    }
    body += decoder.decode(value, { stream: true });
  }
  return JSON.parse(body + decoder.decode());
}

export async function handleContact(request, env, send = fetch) {
  if (request.method !== 'POST') {
    return json(405, { message: 'Método inválido.' }, { Allow: 'POST' });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json(403, { message: 'Origem inválida.' });
  }
  const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return json(415, { message: 'Formato de envio inválido.' });
  }

  let data;
  try {
    data = await readPayload(request);
  } catch (error) {
    return error instanceof RangeError
      ? json(413, { message: 'A mensagem excede o tamanho permitido.' })
      : json(400, { message: 'Dados de contato inválidos.' });
  }

  if (!data || Array.isArray(data) || typeof data !== 'object') {
    return json(400, { message: 'Dados de contato inválidos.' });
  }

  if (typeof data.website === 'string' && data.website.trim()) {
    return json(400, { message: 'Não foi possível aceitar o formulário.' });
  }
  const { name, email, message } = data;
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100 ||
      typeof email !== 'string' || email.length > 254 || !EMAIL_PATTERN.test(email.trim()) ||
      typeof message !== 'string' || message.trim().length < 10 || message.length > 3000) {
    return json(422, { message: 'Confira o nome, o endereço de e-mail e a mensagem.' });
  }

  const { RESEND_API_KEY, CONTACT_FROM, CONTACT_TO } = env;
  if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) {
    return json(503, { message: UNAVAILABLE });
  }

  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email.trim(),
        subject: 'Nova mensagem do portfólio',
        text: 'Nome: ' + name.trim() + '\nE-mail: ' + email.trim() + '\n\n' + message.trim()
      }),
      signal: AbortSignal.timeout(10000)
    });
    const delivery = response.ok ? await response.json() : null;
    return typeof delivery?.id === 'string'
      ? json(200, { ok: true })
      : json(502, { message: UNAVAILABLE });
  } catch {
    return json(502, { message: UNAVAILABLE });
  }
}


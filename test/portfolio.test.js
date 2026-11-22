import assert from 'node:assert/strict';
import { test } from 'node:test';
import { complete, execute } from '../src/commands.js';
import { handleContact } from '../server/contact.js';

const env = { RESEND_API_KEY: 'fake', CONTACT_FROM: 'site@example.com', CONTACT_TO: 'owner@example.com' };
const payload = { name: 'Pessoa Teste', email: 'visitante@example.com', message: 'Mensagem de teste do portfólio.' };

function request(payload, headers = {}) {
  return new Request('https://portfolio.example.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(payload)
  });
}

test('preserva os comandos e o preenchimento do terminal', () => {
  assert.equal(execute(' EXPERIÊNCIA ').title, 'Experiências');
  assert.equal(execute('projetos   ECONecta').title, 'EConecta');
  assert.equal(execute('constructor').title, 'Comando desconhecido');
  assert.equal(execute('sobre agora').title, 'Confira a sintaxe');
  assert.equal(execute('   '), null);
  assert.equal(complete('projetos ag'), 'projetos agroconecta');
  assert.equal(execute('clear').clear, true);
  assert.ok(execute('contato').links.some(({ href }) => href.startsWith('https://wa.me/')));
});

test('envia para o destinatário configurado com reply-to do visitante', async () => {
  const response = await handleContact(request({ ...payload, to: 'other@example.com' }), env, async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    const mail = JSON.parse(options.body);
    assert.deepEqual(mail.to, [env.CONTACT_TO]);
    assert.equal(mail.reply_to, payload.email);
    assert.ok(mail.text.includes(payload.message));
    return Response.json({ id: 'message-id' });
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test('rejeita chamadas inválidas antes de acionar o provedor', async () => {
  const unexpectedSend = async () => assert.fail('O provedor não deveria ser chamado');
  const inputs = [
    [new Request('https://portfolio.example.com/api/contact'), 405],
    [request(payload, { origin: 'https://outro.example.com' }), 403],
    [request(payload, { 'Content-Type': 'text/plain' }), 415],
    [request(null), 400],
    [request({ ...payload, website: 'spam.test' }), 400],
    [request({ ...payload, email: 'invalido' }), 422],
    [request({ ...payload, message: 'x'.repeat(17000) }), 413]
  ];
  for (const [input, expected] of inputs) {
    assert.equal((await handleContact(input, env, unexpectedSend)).status, expected);
  }
});

test('informa falta de configuração e erro no provedor', async () => {
  assert.equal((await handleContact(request(payload), {})).status, 503);
  const failure = await handleContact(request(payload), env, async () => new Response('rate limited', { status: 429 }));
  assert.equal(failure.status, 502);
  assert.equal((await failure.json()).ok, undefined);
});


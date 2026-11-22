import React, { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState({ type: 'idle', text: '' });

  async function send(event) {
    event.preventDefault();
    if (status.type === 'pending') return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setStatus({ type: 'pending', text: 'Enviando mensagem…' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
        signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setStatus({ type: 'error', text: result.message || 'Envio indisponível. Use o link de e-mail ou tente novamente.' });
        return;
      }
      form.reset();
      setStatus({ type: 'success', text: 'Mensagem aceita para envio. Obrigado pelo contato!' });
    } catch {
      setStatus({ type: 'error', text: 'Não foi possível concluir o envio. Tente novamente ou use o link de e-mail.' });
    }
  }

  return (
    <form className="contact-form" onSubmit={send} aria-busy={status.type === 'pending'}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor="name">Nome</label>
      <input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100} />
      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" autoComplete="email" type="email" required maxLength={254} />
      <label htmlFor="message">Mensagem</label>
      <textarea id="message" name="message" rows={5} required minLength={10} maxLength={3000} />
      <button type="submit" className="button" disabled={status.type === 'pending'}>Enviar mensagem</button>
      <p className={'form-status ' + status.type} role="status">{status.text}</p>
    </form>
  );
}


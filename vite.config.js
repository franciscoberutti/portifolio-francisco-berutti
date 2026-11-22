import { Readable } from 'node:stream';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleContact } from './server/contact.js';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };

  function configure(server) {
    server.middlewares.use('/api/contact', async (incoming, outgoing) => {
      try {
        const protocol = incoming.socket.encrypted ? 'https' : 'http';
        const request = new Request(protocol + '://' + incoming.headers.host + '/api/contact', {
          method: incoming.method,
          headers: incoming.headers,
          ...(!['GET', 'HEAD'].includes(incoming.method) && {
            body: Readable.toWeb(incoming),
            duplex: 'half'
          })
        });
        const response = await handleContact(request, env);
        outgoing.writeHead(response.status, Object.fromEntries(response.headers));
        outgoing.end(await response.text());
      } catch {
        outgoing.writeHead(500, { 'Content-Type': 'application/json' });
        outgoing.end(JSON.stringify({ message: 'Envio indisponível no momento.' }));
      }
    });
  }

  return {
    plugins: [react(), { name: 'portfolio-contact', configureServer: configure, configurePreviewServer: configure }]
  };
});


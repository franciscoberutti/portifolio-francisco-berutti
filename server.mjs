import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname } from "node:path";

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".mjs": "text/javascript",
};

const server = createServer(async (request, response) => {
  const [path] = request.url.split("?");
  const name = path === "/" ? "index.html" : path.slice(1);
  const type = mimeTypes[extname(name)];
  if (!type || !/^[\w.-]+$/.test(name)) {
    response.writeHead(404).end("Arquivo não encontrado.");
    return;
  }

  try {
    const content = await readFile(new URL(`./dist/${name}`, import.meta.url));
    response.writeHead(200, { "Content-Type": `${type}; charset=utf-8` }).end(content);
  } catch (error) {
    const status = error.code === "ENOENT" ? 404 : 500;
    response.writeHead(status).end(status === 404 ? "Arquivo não encontrado." : "Erro ao servir o arquivo.");
  }
});

const port = Number(process.env.PORT ?? 8000);
server.listen(port, "127.0.0.1", () => {
  console.log(`Portfólio em http://127.0.0.1:${server.address().port}/`);
});

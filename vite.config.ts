import { Readable } from 'node:stream';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import analyzePhoto from './api/analyze-photo';
import reverseGeocode from './api/reverse-geocode';

function localFunctions(): Plugin {
  return {
    name: 'leadlens-local-functions',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir, ['GEMINI_', 'NOMINATIM_', 'UPSTASH_']);
      for (const [name, value] of Object.entries(env)) {
        process.env[name] ??= value;
      }
      // Vercel serves these same handlers from /api in deployed environments.
      server.middlewares.use(async (incoming, outgoing, next) => {
        const url = new URL(incoming.url ?? '/', 'http://localhost');
        const handler = url.pathname === '/api/analyze-photo' ? analyzePhoto
          : url.pathname === '/api/reverse-geocode' ? reverseGeocode : undefined;
        if (!handler) return next();

        try {
          const method = incoming.method ?? 'GET';
          const headers = new Headers();
          for (const [name, value] of Object.entries(incoming.headers)) {
            if (value !== undefined) headers.set(name, ([] as string[]).concat(value).join(', '));
          }
          const requestOptions = { method, headers, duplex: 'half' as const };
          const request = new Request(url, method === 'GET' || method === 'HEAD'
            ? requestOptions
            : { ...requestOptions, body: Readable.toWeb(incoming) as ReadableStream });
          const response = await handler.fetch(request);
          outgoing.writeHead(response.status, Object.fromEntries(response.headers));
          outgoing.end(Buffer.from(await response.arrayBuffer()));
        } catch {
          outgoing.writeHead(500, { 'Content-Type': 'application/json' });
          outgoing.end(JSON.stringify({ error: 'The local function could not complete the request.' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localFunctions()],
  server: {
    port: 5173,
    host: true,
  },
});

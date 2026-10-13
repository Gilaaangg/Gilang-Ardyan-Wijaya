import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handler as authHandler } from './netlify/functions/auth.js';
import { handler as gradesHandler } from './netlify/functions/grades.js';
import { handler as discussionsHandler } from './netlify/functions/discussions.js';
import { handler as assignmentsHandler } from './netlify/functions/assignments.js';
import { handler as usersHandler } from './netlify/functions/users.js';

// Local dev middleware simulating Netlify Functions for local `npm run dev`
function netlifyFunctionsLocalPlugin() {
  return {
    name: 'netlify-functions-local',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/') && !req.url.startsWith('/.netlify/functions/')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost');
        const pathname = urlObj.pathname.replace(/^\/\.netlify\/functions\//, '/api/');
        const segments = pathname.replace(/^\/api\//, '').split('/');
        const endpoint = segments[0];

        // Read request body if present
        let body = '';
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          for await (const chunk of req) {
            body += chunk;
          }
        }

        const queryStringParameters = Object.fromEntries(urlObj.searchParams.entries());
        const event = {
          httpMethod: req.method,
          path: pathname,
          queryStringParameters,
          headers: req.headers,
          body,
        };

        const handlerMap = {
          auth: authHandler,
          grades: gradesHandler,
          discussions: discussionsHandler,
          assignments: assignmentsHandler,
          users: usersHandler,
        };

        const targetHandler = handlerMap[endpoint];
        if (!targetHandler) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Function ${endpoint} not found` }));
          return;
        }

        try {
          const result = await targetHandler(event, {});
          res.statusCode = result.statusCode || 200;
          if (result.headers) {
            for (const [key, val] of Object.entries(result.headers)) {
              res.setHeader(key, val);
            }
          }
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json');
          }
          res.end(result.body || '');
        } catch (err) {
          console.error('Error invoking local netlify function:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyFunctionsLocalPlugin()],
  server: {
    port: 5173,
    open: false,
  },
});

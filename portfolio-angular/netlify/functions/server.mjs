import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const handler = async (event, context) => {
  try {
    const url = event.path || '/';

    // Importar dinámicamente el servidor de Angular
    const { default: app } = await import('../../dist/portfolio-angular/server/server.mjs');

    return new Promise((resolve, reject) => {
      // Crear request simulado
      const req = {
        url: url,
        method: event.httpMethod,
        headers: event.headers,
        body: event.body
      };

      // Crear response simulado
      const res = {
        statusCode: 200,
        headers: {},
        body: '',
        setHeader: function(name, value) {
          this.headers[name] = value;
        },
        getHeader: function(name) {
          return this.headers[name];
        },
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        send: function(body) {
          this.body = body;
          resolve({
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.body
          });
        },
        end: function(body) {
          if (body) this.body = body;
          resolve({
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.body
          });
        }
      };

      // Ejecutar la app de Angular
      app(req, res);
    });

  } catch (error) {
    console.error('SSR Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
};

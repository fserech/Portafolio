const jsonServer = require('json-server');
const path = require('path');

const SECRET_PIN = process.env.ADMIN_PIN || 'fr3dy@s3c';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../db.json'));
const middlewares = jsonServer.defaults({ noCors: true, logger: false });

// ─── CORS (debe ir PRIMERO antes de todo) ───────────────────────────────
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-pin');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Responder inmediatamente al preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ─── AUTH ───────────────────────────────
server.use((req, res, next) => {
  if (req.path === '/auth/verify') return next();

  const readOnlyMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (readOnlyMethods.includes(req.method)) return next();

  const pin = req.headers['x-admin-pin'];
  if (!pin) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Se requiere PIN (x-admin-pin)' });
  }
  if (pin !== SECRET_PIN) {
    return res.status(403).json({ error: 'Forbidden', message: 'PIN incorrecto' });
  }
  next();
});

// ─── RUTA AUTH ──────────────────────────
server.post('/auth/verify', (req, res) => {
  const { pin } = req.body;
  if (pin === SECRET_PIN) {
    return res.json({ ok: true, message: 'Autenticado correctamente' });
  }
  return res.status(403).json({ ok: false, message: 'PIN incorrecto' });
});

// ─── ROUTER ─────────────────────────────
server.use(router);

// ─── MODO LOCAL ─────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Local: http://localhost:${PORT}`);
    console.log(`🔐 PIN actual: ${SECRET_PIN}`);
  });
}

module.exports = server;
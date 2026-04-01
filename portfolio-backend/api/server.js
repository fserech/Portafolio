const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();

// ─── CONFIG ─────────────────────────────
const SECRET_PIN = process.env.ADMIN_PIN || 'fr3dy@s3c';

// ─── CORS ───────────────────────────────
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-pin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ─── AUTH ───────────────────────────────
server.use((req, res, next) => {
  const readOnlyMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (readOnlyMethods.includes(req.method)) {
    return next();
  }

  const pin = req.headers['x-admin-pin'];

  if (!pin) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Se requiere PIN (x-admin-pin)'
    });
  }

  if (pin !== SECRET_PIN) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'PIN incorrecto'
    });
  }

  next();
});

// ─── RUTA AUTH ──────────────────────────
server.post('/auth/verify', (req, res) => {
  const { pin } = req.body;

  if (pin === SECRET_PIN) {
    return res.json({ ok: true });
  }

  return res.status(403).json({ ok: false });
});

// ─── ROUTER ─────────────────────────────
server.use(router);

// ─── MODO LOCAL (IMPORTANTE) ────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Local: http://localhost:${PORT}`);
  });
}

// ─── EXPORT PARA VERCEL ─────────────────
module.exports = server;
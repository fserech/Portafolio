// server.js  — Ejecutar con: node server.js
const jsonServer = require('json-server');
const server     = jsonServer.create();
const router     = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
const PORT    = 3000;
const SECRET_PIN = process.env.ADMIN_PIN || 'fr3dy@s3c'; // <── cambia esto

// ─── CORS ─────────────────────────────────────────────────────────────────────
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-pin');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
// GET: público para todos (visitantes pueden ver el portafolio)
// POST/PUT/PATCH/DELETE: solo con PIN correcto en header x-admin-pin
server.use((req, res, next) => {
  const readOnlyMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (readOnlyMethods.includes(req.method)) {
    return next(); // visitantes pueden leer
  }

  const pin = req.headers['x-admin-pin'];

  if (!pin) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Se requiere PIN de administrador (header: x-admin-pin)'
    });
  }

  if (pin !== SECRET_PIN) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'PIN incorrecto'
    });
  }

  next(); // PIN correcto → puede escribir
});

// ─── RUTAS ────────────────────────────────────────────────────────────────────
// Verificar PIN sin hacer cambios (para el login del frontend)
server.post('/auth/verify', (req, res) => {
  const { pin } = req.body;
  if (pin === SECRET_PIN) {
    res.json({ ok: true, message: 'Autenticado correctamente' });
  } else {
    res.status(403).json({ ok: false, message: 'PIN incorrecto' });
  }
});

server.use(router);

server.listen(PORT, () => {
  console.log(`\n🚀 JSON Server corriendo en http://localhost:${PORT}`);
  console.log(`📦 Rutas disponibles:`);
  console.log(`   GET    /skills_dev`);
  console.log(`   GET    /skills_security`);
  console.log(`   GET    /projects_dev`);
  console.log(`   GET    /projects_security`);
  console.log(`   POST   /auth/verify`);
  console.log(`\n🔒 Escritura protegida con PIN (header: x-admin-pin)`);
  console.log(`   Para cambiar el PIN: ADMIN_PIN=tupin node server.js\n`);
});

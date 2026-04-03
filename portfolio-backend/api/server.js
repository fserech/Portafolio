const express = require('express');
const { Pool } = require('pg');

const app = express();
const SECRET_PIN = process.env.ADMIN_PIN || 'fr3dy@s3c';

// ─── DB (Supabase) ────────────────────────────────────────────────────────────
// CORRECCIÓN PRINCIPAL: usar connectionString con DATABASE_URL
// Los # y % en el password rompen el parser de pg cuando se pasan como
// campo "password" separado en algunas versiones. connectionString es más seguro.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,                        // Serverless: pool pequeño
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

pool.connect()
  .then(c => { console.log('✅ DB conectada'); c.release(); })
  .catch(e => console.error('❌ DB error:', e.message));

async function query(sql, params = []) {
  const client = await pool.connect();
  try { return await client.query(sql, params); }
  finally { client.release(); }
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-pin');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json());

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/auth/verify', (req, res) => {
  const { pin } = req.body;
  if (pin === SECRET_PIN) return res.json({ ok: true });
  return res.status(403).json({ ok: false, message: 'PIN incorrecto' });
});

const auth = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const pin = req.headers['x-admin-pin'];
  if (!pin) return res.status(401).json({ error: 'Se requiere PIN' });
  if (pin !== SECRET_PIN) return res.status(403).json({ error: 'PIN incorrecto' });
  next();
};

app.use(auth);

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// SKILLS DEV
// ══════════════════════════════════════════════════════════════════════════════

app.get('/skills_dev', async (req, res) => {
  try {
    const { rows } = await query(`SELECT id, title, skills FROM skills_dev ORDER BY sort_order`);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/skills_dev/:id', async (req, res) => {
  try {
    const { rows } = await query(`SELECT id, title, skills FROM skills_dev WHERE id=$1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/skills_dev', async (req, res) => {
  try {
    const { id = uid(), title, skills = [] } = req.body;
    const { rows } = await query(
      `INSERT INTO skills_dev (id, title, skills) VALUES ($1,$2,$3) RETURNING id, title, skills`,
      [id, title, JSON.stringify(skills)]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/skills_dev/:id', async (req, res) => {
  try {
    const { title, skills = [] } = req.body;
    const { rows } = await query(
      `UPDATE skills_dev SET title=$1, skills=$2 WHERE id=$3 RETURNING id, title, skills`,
      [title, JSON.stringify(skills), req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/skills_dev/:id', async (req, res) => {
  try {
    const { rows: cur } = await query(`SELECT * FROM skills_dev WHERE id=$1`, [req.params.id]);
    if (!cur.length) return res.status(404).json({ error: 'Not found' });
    const title  = req.body.title  ?? cur[0].title;
    const skills = req.body.skills ?? cur[0].skills;
    const { rows } = await query(
      `UPDATE skills_dev SET title=$1, skills=$2 WHERE id=$3 RETURNING id, title, skills`,
      [title, JSON.stringify(skills), req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/skills_dev/:id', async (req, res) => {
  try {
    const { rowCount } = await query(`DELETE FROM skills_dev WHERE id=$1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({});
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// SKILLS SECURITY
// ══════════════════════════════════════════════════════════════════════════════

app.get('/skills_security', async (req, res) => {
  try {
    const { rows } = await query(`SELECT id, title, skills FROM skills_security ORDER BY sort_order`);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/skills_security/:id', async (req, res) => {
  try {
    const { rows } = await query(`SELECT id, title, skills FROM skills_security WHERE id=$1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/skills_security', async (req, res) => {
  try {
    const { id = uid(), title, skills = [] } = req.body;
    const { rows } = await query(
      `INSERT INTO skills_security (id, title, skills) VALUES ($1,$2,$3) RETURNING id, title, skills`,
      [id, title, JSON.stringify(skills)]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/skills_security/:id', async (req, res) => {
  try {
    const { title, skills = [] } = req.body;
    const { rows } = await query(
      `UPDATE skills_security SET title=$1, skills=$2 WHERE id=$3 RETURNING id, title, skills`,
      [title, JSON.stringify(skills), req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/skills_security/:id', async (req, res) => {
  try {
    const { rows: cur } = await query(`SELECT * FROM skills_security WHERE id=$1`, [req.params.id]);
    if (!cur.length) return res.status(404).json({ error: 'Not found' });
    const title  = req.body.title  ?? cur[0].title;
    const skills = req.body.skills ?? cur[0].skills;
    const { rows } = await query(
      `UPDATE skills_security SET title=$1, skills=$2 WHERE id=$3 RETURNING id, title, skills`,
      [title, JSON.stringify(skills), req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/skills_security/:id', async (req, res) => {
  try {
    const { rowCount } = await query(`DELETE FROM skills_security WHERE id=$1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({});
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS DEV
// ══════════════════════════════════════════════════════════════════════════════

const mapProject = r => ({
  id:          r.id,
  title:       r.title,
  description: r.description,
  tags:        r.tags || [],
  image:       r.image,
  demoUrl:     r.demo_url,
  repoUrl:     r.repo_url,
});

app.get('/projects_dev', async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM projects_dev ORDER BY created_at DESC`);
    res.json(rows.map(mapProject));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/projects_dev/:id', async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM projects_dev WHERE id=$1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapProject(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/projects_dev', async (req, res) => {
  try {
    const { id = uid(), title, description, tags = [], image, demoUrl, repoUrl } = req.body;
    const { rows } = await query(
      `INSERT INTO projects_dev (id,title,description,tags,image,demo_url,repo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, title, description, JSON.stringify(tags), image, demoUrl, repoUrl]
    );
    res.status(201).json(mapProject(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/projects_dev/:id', async (req, res) => {
  try {
    const { title, description, tags = [], image, demoUrl, repoUrl } = req.body;
    const { rows } = await query(
      `UPDATE projects_dev SET title=$1,description=$2,tags=$3,image=$4,demo_url=$5,repo_url=$6
       WHERE id=$7 RETURNING *`,
      [title, description, JSON.stringify(tags), image, demoUrl, repoUrl, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapProject(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/projects_dev/:id', async (req, res) => {
  try {
    const { rowCount } = await query(`DELETE FROM projects_dev WHERE id=$1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({});
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS SECURITY
// ══════════════════════════════════════════════════════════════════════════════

const mapProjectSec = r => ({
  id:          r.id,
  title:       r.title,
  description: r.description,
  tags:        r.tags || [],
  image:       r.image,
  demoUrl:     r.demo_url,
  repoUrl:     r.repo_url,
  status:      r.status,
  cve:         r.cve,
});

app.get('/projects_security', async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM projects_security ORDER BY created_at DESC`);
    res.json(rows.map(mapProjectSec));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/projects_security/:id', async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM projects_security WHERE id=$1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapProjectSec(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/projects_security', async (req, res) => {
  try {
    const { id = uid(), title, description, tags = [], image, demoUrl, repoUrl, status, cve } = req.body;
    const { rows } = await query(
      `INSERT INTO projects_security (id,title,description,tags,image,demo_url,repo_url,status,cve)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, title, description, JSON.stringify(tags), image, demoUrl, repoUrl, status ?? null, cve ?? null]
    );
    res.status(201).json(mapProjectSec(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/projects_security/:id', async (req, res) => {
  try {
    const { title, description, tags = [], image, demoUrl, repoUrl, status, cve } = req.body;
    const { rows } = await query(
      `UPDATE projects_security
       SET title=$1,description=$2,tags=$3,image=$4,demo_url=$5,repo_url=$6,status=$7,cve=$8
       WHERE id=$9 RETURNING *`,
      [title, description, JSON.stringify(tags), image, demoUrl, repoUrl, status ?? null, cve ?? null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapProjectSec(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/projects_security/:id', async (req, res) => {
  try {
    const { rowCount } = await query(`DELETE FROM projects_security WHERE id=$1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({});
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// CHANGELOG
// ══════════════════════════════════════════════════════════════════════════════

const mapChangelog = r => ({
  id:          r.id,
  action:      r.action,
  mode:        r.mode,
  title:       r.title,
  description: r.description,
  payload:     r.payload || {},
  targetId:    r.target_id,
  createdAt:   r.created_at,
  version:     r.version,
});

app.get('/changelog', async (req, res) => {
  try {
    const order = req.query._order === 'desc' ? 'DESC' : 'ASC';
    const { rows } = await query(`SELECT * FROM changelog ORDER BY id ${order}`);
    res.json(rows.map(mapChangelog));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/changelog/:id', async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM changelog WHERE id=$1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(mapChangelog(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/changelog', async (req, res) => {
  try {
    const { action, mode, title, description, payload, targetId, createdAt, version } = req.body;
    const { rows: last } = await query(`SELECT id FROM changelog ORDER BY id DESC LIMIT 1`);
    const nextId = last.length ? last[0].id + 1 : 1;
    const { rows } = await query(
      `INSERT INTO changelog (id,action,mode,title,description,payload,target_id,created_at,version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nextId, action, mode, title, description,
       JSON.stringify(payload || {}), targetId ?? null, createdAt, version]
    );
    res.status(201).json(mapChangelog(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/changelog/:id', async (req, res) => {
  try {
    await query(`DELETE FROM changelog WHERE id=$1`, [req.params.id]);
    res.json({});
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── EXPORT ───────────────────────────────────────────────────────────────────
// Vercel Serverless requiere module.exports = app
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
}
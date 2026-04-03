const { Pool } = require('pg');

const pool = new Pool({
  host: 'db.pqizywmrjqbnbfzjvdrp.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Yufre##2558*%94',
  ssl: { rejectUnauthorized: false },
});

const db = require('../db.json');

async function seed() {
  console.log('🔌 Conectando a Supabase...');
  const client = await pool.connect();
  console.log('✅ Conectado');

  try {
    console.log('🔧 Creando tablas...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS skills_dev (
        id TEXT PRIMARY KEY,
        title TEXT,
        skills JSONB DEFAULT '[]',
        sort_order SERIAL
      );
      CREATE TABLE IF NOT EXISTS skills_security (
        id TEXT PRIMARY KEY,
        title TEXT,
        skills JSONB DEFAULT '[]',
        sort_order SERIAL
      );
      CREATE TABLE IF NOT EXISTS projects_dev (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        tags JSONB DEFAULT '[]',
        image TEXT,
        demo_url TEXT,
        repo_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS projects_security (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        tags JSONB DEFAULT '[]',
        image TEXT,
        demo_url TEXT,
        repo_url TEXT,
        status TEXT,
        cve TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS changelog (
        id INTEGER PRIMARY KEY,
        action TEXT,
        mode TEXT,
        title TEXT,
        description TEXT,
        payload JSONB DEFAULT '{}',
        target_id TEXT,
        created_at TEXT,
        version INTEGER
      );
    `);
    console.log('✅ Tablas creadas');

    try {
      await client.query(`
        TRUNCATE skills_dev, skills_security, projects_dev, projects_security, changelog
        RESTART IDENTITY CASCADE
      `);
      console.log('🧹 Tablas limpiadas');
    } catch (e) {
      console.log('ℹ️  TRUNCATE saltado:', e.message);
    }

    for (const s of db.skills_dev) {
      await client.query(
        `INSERT INTO skills_dev (id, title, skills) VALUES ($1, $2, $3)`,
        [s.id, s.title, JSON.stringify(s.skills)]
      );
    }
    console.log(`✅ skills_dev: ${db.skills_dev.length} registros`);

    for (const s of db.skills_security) {
      await client.query(
        `INSERT INTO skills_security (id, title, skills) VALUES ($1, $2, $3)`,
        [s.id, s.title, JSON.stringify(s.skills)]
      );
    }
    console.log(`✅ skills_security: ${db.skills_security.length} registros`);

    for (const p of db.projects_dev) {
      await client.query(
        `INSERT INTO projects_dev (id,title,description,tags,image,demo_url,repo_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [p.id, p.title, p.description, JSON.stringify(p.tags), p.image, p.demoUrl, p.repoUrl]
      );
    }
    console.log(`✅ projects_dev: ${db.projects_dev.length} registros`);

    for (const p of db.projects_security) {
      await client.query(
        `INSERT INTO projects_security (id,title,description,tags,image,demo_url,repo_url,status,cve)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [p.id, p.title, p.description, JSON.stringify(p.tags),
         p.image, p.demoUrl, p.repoUrl, p.status ?? null, p.cve ?? null]
      );
    }
    console.log(`✅ projects_security: ${db.projects_security.length} registros`);

    console.log('\n🎉 SEED COMPLETADO EXITOSAMENTE');
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(() => process.exit(1));
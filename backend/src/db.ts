import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : (process.env.DB_PATH || path.join(__dirname, '..', '..', 'data.db')) as string;

if (!isTest) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    birthdate TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    amount REAL NOT NULL CHECK(amount >= 0),
    date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
  CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_id);
`);

// --- Lightweight migrations (idempotent) ---
try {
  const cols = db.prepare("PRAGMA table_info(clients)").all().map((r: any) => r.name);
  if (!cols.includes('birthdate')) {
    db.prepare("ALTER TABLE clients ADD COLUMN birthdate TEXT").run();
    console.log("[migrate] clients.birthdate adicionado");
  }
  if (!cols.includes('updated_at')) {
    db.prepare("ALTER TABLE clients ADD COLUMN updated_at TEXT DEFAULT (datetime('now'))").run();
    console.log("[migrate] clients.updated_at adicionado");
  }
} catch (e) {
  console.error("[migrate] Falha ao rodar migrações de tabela clients:", e);
}

// Seed default admin user (idempotente)
try {
  const adminEmail = 'admin@avantsoft.com';
  const existing = db.prepare('SELECT 1 FROM users WHERE email = ?').get(adminEmail);
  if (!existing) {
    const hash = bcrypt.hashSync('123456', 10);
    db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(adminEmail, hash);
    // eslint-disable-next-line no-console
    console.log('[seed] Usuário padrão criado: ' + adminEmail);
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('[seed] Falha ao criar usuário padrão:', e);
}

export default db;

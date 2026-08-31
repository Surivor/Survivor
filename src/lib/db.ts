import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let usersTableReady = false;

export async function ensureUsersTable() {
  if (usersTableReady) return;

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users
    (
        id         INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL DEFAULT '',
        name       VARCHAR(255) NOT NULL,
        firstname  VARCHAR(255) NOT NULL DEFAULT '',
        status     VARCHAR(255) NOT NULL DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);

  usersTableReady = true;
}

export default pool;
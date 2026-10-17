CREATE TABLE IF NOT EXISTS accounts (
  name TEXT PRIMARY KEY,
  start_balance REAL NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO accounts (name) VALUES ('replay'), ('paper'), ('real');

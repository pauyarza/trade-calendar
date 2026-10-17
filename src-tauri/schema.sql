CREATE TABLE trades (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '',
  taken INTEGER NOT NULL DEFAULT 1,
  skip_reason TEXT NOT NULL DEFAULT '',
  setup TEXT NOT NULL,
  direction TEXT NOT NULL,
  account TEXT NOT NULL,
  contracts INTEGER NOT NULL DEFAULT 1,
  level TEXT NOT NULL DEFAULT '',
  level_price REAL,
  checklist INTEGER NOT NULL DEFAULT 0,
  entry REAL,
  stop REAL,
  target REAL,
  exit REAL,
  commission REAL NOT NULL DEFAULT 1.85,
  broken_rule TEXT NOT NULL DEFAULT '',
  emotion INTEGER,
  tags TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  capture_before TEXT NOT NULL DEFAULT '',
  capture_after TEXT NOT NULL DEFAULT ''
);
CREATE INDEX trades_date ON trades (date);

CREATE TABLE days (
  date TEXT PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT '',
  levels TEXT NOT NULL DEFAULT ''
);

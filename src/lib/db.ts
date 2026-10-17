import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { appDataDir, join } from '@tauri-apps/api/path';
import Database from '@tauri-apps/plugin-sql';

export type Trade = {
  id?: number;
  date: string;
  time: string;
  taken: number;
  skip_reason: string;
  setup: string;
  direction: 'long' | 'short';
  account: string;
  contracts: number;
  level: string;
  level_price: number | null;
  checklist: number;
  entry: number | null;
  stop: number | null;
  target: number | null;
  exit: number | null;
  commission: number;
  broken_rule: string;
  emotion: number | null;
  tags: string;
  notes: string;
  capture_before: string;
  capture_after: string;
};

export type Day = { date: string; plan: string; levels: string };

const db = await Database.load('sqlite:trades.db');
const capturesDir = await join(await appDataDir(), 'captures');

export async function listTrades() {
  const trades = await db.select<Trade[]>('SELECT * FROM trades ORDER BY date, time, id');
  await invoke('prune_captures', { keep: trades.flatMap((t) => [t.capture_before, t.capture_after]).filter(Boolean) });
  return trades;
}

export async function saveTrade(t: Trade) {
  const { id, ...fields } = t;
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  if (id) await db.execute(`UPDATE trades SET ${keys.map((k, i) => `${k} = $${i + 1}`).join(', ')} WHERE id = $${keys.length + 1}`, [...values, id]);
  else await db.execute(`INSERT INTO trades (${keys.join(', ')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')})`, values);
}

export const deleteTrade = (id: number) => db.execute('DELETE FROM trades WHERE id = $1', [id]);

export async function listBalances() {
  const rows = await db.select<{ name: string; start_balance: number }[]>('SELECT * FROM accounts');
  return Object.fromEntries(rows.map((r) => [r.name, r.start_balance]));
}

export const saveBalance = (name: string, value: number) =>
  db.execute('UPDATE accounts SET start_balance = $1 WHERE name = $2', [value, name]);

export async function getDay(date: string): Promise<Day> {
  const rows = await db.select<Day[]>('SELECT * FROM days WHERE date = $1', [date]);
  return rows[0] ?? { date, plan: '', levels: '' };
}

export const saveDay = (d: Day) =>
  db.execute('INSERT INTO days (date, plan, levels) VALUES ($1, $2, $3) ON CONFLICT (date) DO UPDATE SET plan = $2, levels = $3', [
    d.date,
    d.plan,
    d.levels,
  ]);

export async function saveCapture(file: Blob) {
  const ext = file.type.split('/')[1] ?? 'png';
  return invoke<string>('save_capture', new Uint8Array(await file.arrayBuffer()), { headers: { ext } });
}

export const captureSrc = (name: string) => convertFileSrc(`${capturesDir}/${name}`);

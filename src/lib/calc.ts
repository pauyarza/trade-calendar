import type { Trade } from './db';

export const POINT_USD = 2;
export const MAX_STOP_PTS = 22;
export const ACCOUNTS = ['replay', 'paper', 'real'];
export const LEVELS = ['PDH', 'PDL', 'PDC', 'ONH', 'ONL', 'Swing 15m', 'Rang 15m', 'VWAP', 'Altre'];
export const SKIP_REASONS = ['mida', 'notícia', 'dubte', 'altre'];
export const SETUPS: Record<string, string[]> = {
  "Reversal d'obertura": [
    'Moviment fort a la primera hora',
    'Arriba a un nivell marcat',
    "Canvi d'estructura (LH + LL / HL + HH)",
    'Vela de confirmació (cos > 5 anteriors, tanca al terç extrem)',
    'Espai per a 3R i stop ≤ màxim',
  ],
  'ORB 15 min': ['Primera ruptura del dia, abans de les 16:30', 'Rang ≤ 2× stop màxim (~44 punts)', "OCO: l'altra ordre cancel·lada"],
  'Ruptura fallida del rang': ['Supera el rang ≥ 4 punts', "Vela d'1 min tanca de nou dins del rang"],
  'Escombrada ONH/ONL': ['Entre 15:30 i 16:00', "Supera l'ONH/ONL entre 2 i 15 punts", "Vela d'1 min tanca de nou a dins"],
  'Tancament de gap': ['Gap entre 0,3% i 1%, sense notícia', 'La 2a vela de 5 min trenca la 1a'],
  'Pullback a VWAP': ['Trenca el rang i es manté al costat del VWAP 30 min', 'Primer toc al VWAP', 'Vela de confirmació a favor'],
};

export const riskPts = (t: Trade) => (t.entry != null && t.stop != null ? Math.abs(t.entry - t.stop) : null);

export function pnl(t: Trade) {
  if (t.entry == null || t.exit == null) return null;
  return (t.direction === 'long' ? 1 : -1) * (t.exit - t.entry) * POINT_USD * t.contracts - t.commission;
}

export function rMult(t: Trade) {
  const p = pnl(t);
  const r = riskPts(t);
  return p == null || !r ? null : p / (r * POINT_USD * t.contracts);
}

export function plannedR(t: Trade) {
  const r = riskPts(t);
  return t.target == null || t.entry == null || !r ? null : Math.abs(t.target - t.entry) / r;
}

export const checksDone = (t: Trade) => (SETUPS[t.setup] ?? []).filter((_, i) => t.checklist & (1 << i)).length;
export const compliant = (t: Trade) => !t.broken_rule && checksDone(t) === (SETUPS[t.setup] ?? []).length;
export const closed = (trades: Trade[]) => trades.filter((t) => t.taken && pnl(t) != null);

export function summary(trades: Trade[]) {
  const c = closed(trades);
  const rs = c.map((t) => rMult(t) ?? 0);
  const wins = c.filter((t) => pnl(t)! > 0).length;
  return {
    n: c.length,
    wins,
    winRate: c.length ? wins / c.length : null,
    pnl: c.reduce((s, t) => s + pnl(t)!, 0),
    r: rs.reduce((s, r) => s + r, 0),
    avgR: rs.length ? rs.reduce((s, r) => s + r, 0) / rs.length : null,
  };
}

export function stats(trades: Trade[]) {
  const c = closed(trades);

  // Walk equity
  let cum = 0, cumUsd = 0, peak = 0, maxDD = 0, streak = 0, maxStreak = 0;
  const curve = c.map((t) => {
    const r = rMult(t) ?? 0;
    cum += r;
    cumUsd += pnl(t)!;
    peak = Math.max(peak, cum);
    maxDD = Math.max(maxDD, peak - cum);
    streak = r < 0 ? streak + 1 : 0;
    maxStreak = Math.max(maxStreak, streak);
    return { t, r, cum, cumUsd };
  });

  // Group setups
  const bySetup = Object.keys(SETUPS)
    .map((setup) => ({ setup, ...summary(c.filter((t) => t.setup === setup)) }))
    .filter((s) => s.n);

  return {
    ...summary(c),
    curve,
    maxDD,
    maxStreak,
    streak,
    compliance: c.length ? c.filter(compliant).length / c.length : null,
    bySetup,
    skipped: trades.filter((t) => !t.taken),
  };
}

const num = (v: number, d = 2) => Math.abs(v).toLocaleString('ca-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
const sign = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '');
export const fmtUsd = (v: number | null) => (v == null ? '–' : `${sign(v)}${num(v)} $`);
export const fmtR = (v: number | null) => (v == null ? '–' : `${sign(v)}${num(v)}R`);
export const fmtPct = (v: number | null) => (v == null ? '–' : `${Math.round(v * 100)}%`);
export const fmtPts = (v: number | null) => (v == null ? '–' : num(v));

export const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

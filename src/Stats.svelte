<script lang="ts">
  import { ACCOUNTS, checksDone, compliant, fmtBalance, fmtPct, fmtR, fmtUsd, pnl, rMult, SETUPS, SKIP_REASONS, stats } from './lib/calc';
  import type { Trade } from './lib/db';

  let { trades, unit, start, balances, onbalance }: {
    trades: Trade[];
    unit: 'usd' | 'r';
    start: number;
    balances: Record<string, number>;
    onbalance: (name: string, value: number) => void;
  } = $props();

  let s = $derived(stats(trades));
  let fmt = $derived(unit === 'usd' ? fmtUsd : fmtR);
  let goals = $derived([
    { label: '≥ 90 operacions (replay + directe)', ok: s.n >= 90, value: `${s.n}/90` },
    { label: 'Expectativa ≥ +0,15R', ok: (s.avgR ?? -1) >= 0.15, value: fmtR(s.avgR) },
    { label: 'Caiguda màxima < 10R', ok: s.n > 0 && s.maxDD < 10, value: `${s.maxDD.toFixed(2)}R` },
    { label: 'Compliment de regles ≥ 90%', ok: (s.compliance ?? 0) >= 0.9, value: fmtPct(s.compliance) },
  ]);
  let skippedByReason = $derived(
    SKIP_REASONS.map((reason) => {
      const ts = s.skipped.filter((t) => (t.skip_reason || 'altre') === reason);
      const rs = ts.map(rMult).filter((r) => r != null);
      return { reason, n: ts.length, known: rs.length, r: rs.reduce((a, b) => a + b, 0) };
    }).filter((x) => x.n),
  );

  // Scale chart
  let w = $state(800);
  const h = 260, pad = 36;
  let hover = $state<number | null>(null);
  let base = $derived(unit === 'usd' ? start : 0);
  let ys = $derived(s.curve.map((p) => (unit === 'usd' ? start + p.cumUsd : p.cum)));
  let lo = $derived(Math.min(base, ...ys));
  let hi = $derived(Math.max(base, ...ys, lo + 1));
  const x = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(ys.length - 1, 1);
  const y = (v: number) => h - pad + ((lo - v) * (h - 2 * pad)) / (hi - lo);
  let path = $derived(ys.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(''));
  let ticks = $derived([lo, (lo + hi) / 2, hi]);

  function move(e: MouseEvent) {
    if (!ys.length) return;
    const i = Math.round(((e.offsetX - pad) * Math.max(ys.length - 1, 1)) / (w - 2 * pad));
    hover = Math.max(0, Math.min(ys.length - 1, i));
  }
</script>

<div class="wrap">
  <div class="kpis">
    {#each [
      { label: 'Saldo', value: fmtBalance(start + s.pnl), sign: 0 },
      { label: 'P&L net', value: fmtUsd(s.pnl), sign: s.pnl },
      { label: 'R acumulada', value: fmtR(s.r), sign: s.r },
      { label: 'Trades', value: String(s.n), sign: 0 },
      { label: 'Encert', value: fmtPct(s.winRate), sign: 0 },
      { label: 'R mitjana', value: fmtR(s.avgR), sign: s.avgR ?? 0 },
      { label: 'Caiguda màx.', value: `−${s.maxDD.toFixed(2)}R`, sign: 0 },
      { label: 'Ratxa perd. màx.', value: String(s.maxStreak), sign: 0 },
      { label: 'Compliment', value: fmtPct(s.compliance), sign: 0 },
    ] as k}
      <div class="card tile">
        <span>{k.label}</span>
        <strong class={k.sign > 0 ? 'win' : k.sign < 0 ? 'loss' : ''}>{k.value}</strong>
      </div>
    {/each}
  </div>

  <div class="card chart" bind:clientWidth={w}>
    <h3>{unit === 'usd' ? `Saldo ($, des de ${fmtBalance(start)})` : 'Corba de capital (R)'}</h3>
    {#if ys.length}
      <svg width={w} height={h} role="img" aria-label="Corba de capital" onmousemove={move} onmouseleave={() => (hover = null)}>
        {#each ticks as v}
          <line class="grid" x1={pad} x2={w - pad} y1={y(v)} y2={y(v)} />
          <text class="tick" x={pad - 6} y={y(v) + 4} text-anchor="end">{unit === 'usd' ? Math.round(v) : v.toFixed(1)}</text>
        {/each}
        <line class="zero" x1={pad} x2={w - pad} y1={y(base)} y2={y(base)} />
        <path d={path} />
        {#if hover != null}
          <line class="cross" x1={x(hover)} x2={x(hover)} y1={pad / 2} y2={h - pad} />
          <circle cx={x(hover)} cy={y(ys[hover])} r="5" />
        {/if}
      </svg>
      {#if hover != null}
        {@const p = s.curve[hover]}
        <div class="tip" style:left="{Math.min(x(hover) + 12, w - 220)}px" style:top="{y(ys[hover]) + 20}px">
          <strong>#{hover + 1} · {p.t.date} {p.t.time}</strong>
          <span>{p.t.setup} · {p.t.direction === 'long' ? 'llarg' : 'curt'}</span>
          <span>Trade: <b class={p.r >= 0 ? 'win' : 'loss'}>{unit === 'usd' ? fmtUsd(pnl(p.t)) : fmtR(p.r)}</b></span>
          <span>{unit === 'usd' ? 'Saldo' : 'Acumulat'}: <b>{unit === 'usd' ? fmtBalance(ys[hover]) : fmtR(ys[hover])}</b></span>
        </div>
      {/if}
    {:else}
      <p class="muted">Encara no hi ha trades tancats.</p>
    {/if}
  </div>

  <div class="row">
    <div class="card box">
      <h3>Decisió del dia 90</h3>
      {#each goals as g}
        <div class="goal">
          <span class={g.ok ? 'win' : 'loss'}>{g.ok ? '✓' : '✗'}</span>
          <span>{g.label}</span>
          <strong>{g.value}</strong>
        </div>
      {/each}
      <p class="muted small">El backtest mecànic tampoc no les ha de contradir.</p>
      <h3 class="sub">Capital inicial</h3>
      {#each ACCOUNTS as a}
        <label class="balance">
          <span>{a}</span>
          <input type="number" step="100" value={balances[a] ?? 0} onchange={(e) => onbalance(a, Number(e.currentTarget.value))} />
          <span>$</span>
        </label>
      {/each}
    </div>

    <div class="card box">
      <h3>Per setup</h3>
      <table>
        <thead><tr><th>Setup</th><th>Trades</th><th>Encert</th><th>R mitjana</th><th>{unit === 'usd' ? 'P&L' : 'R total'}</th></tr></thead>
        <tbody>
          {#each s.bySetup as b}
            <tr><td>{b.setup}</td><td>{b.n}</td><td>{fmtPct(b.winRate)}</td><td>{fmtR(b.avgR)}</td><td class={b.pnl >= 0 ? 'win' : 'loss'}>{unit === 'usd' ? fmtUsd(b.pnl) : fmtR(b.r)}</td></tr>
          {:else}
            <tr><td colspan="5" class="muted">–</td></tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="card box">
      <h3>Setups no presos</h3>
      <table>
        <thead><tr><th>Motiu</th><th>Quants</th><th>Haurien fet</th></tr></thead>
        <tbody>
          {#each skippedByReason as k}
            <tr><td>{k.reason}</td><td>{k.n}</td><td class={k.r >= 0 ? 'win' : 'loss'}>{k.known ? `${fmtR(k.r)} (${k.known})` : '–'}</td></tr>
          {:else}
            <tr><td colspan="3" class="muted">–</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="card box">
    <h3>Totes les operacions</h3>
    <table>
      <thead><tr><th>Data</th><th>Setup</th><th>Dir.</th><th>Compte</th><th>Checklist</th><th>R</th><th>P&L</th><th>Acumulat</th><th>Regles</th></tr></thead>
      <tbody>
        {#each s.curve.toReversed() as p}
          <tr>
            <td>{p.t.date} {p.t.time}</td><td>{p.t.setup}</td><td>{p.t.direction === 'long' ? '▲' : '▼'}</td><td>{p.t.account}</td>
            <td>{checksDone(p.t)}/{SETUPS[p.t.setup]?.length ?? 0}</td>
            <td class={p.r >= 0 ? 'win' : 'loss'}>{fmtR(p.r)}</td><td class={p.r >= 0 ? 'win' : 'loss'}>{fmtUsd(pnl(p.t))}</td>
            <td>{fmt(unit === 'usd' ? p.cumUsd : p.cum)}</td>
            <td>{compliant(p.t) ? '✓' : `✗ ${p.t.broken_rule}`}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .wrap { display: flex; flex-direction: column; gap: 16px; }
  .kpis { display: grid; grid-template-columns: repeat(9, 1fr); gap: 10px; }
  .tile { display: grid; gap: 2px; padding: 12px 14px; }
  .tile span { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
  .tile strong { font-size: 20px; }
  h3 { margin: 0 0 10px; font-size: 14px; }
  .chart { position: relative; padding: 16px 0 8px; }
  .chart h3, .chart p { padding: 0 16px; }
  svg { display: block; }
  path { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linejoin: round; }
  circle { fill: var(--accent); stroke: var(--surface); stroke-width: 2; }
  .grid { stroke: var(--border); stroke-dasharray: 2 4; }
  .zero { stroke: var(--muted); }
  .cross { stroke: var(--muted); stroke-dasharray: 3 3; }
  .tick { fill: var(--muted); font-size: 11px; }
  .tip {
    position: absolute;
    display: grid;
    gap: 2px;
    width: 210px;
    padding: 8px 10px;
    font-size: 12px;
    pointer-events: none;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
  }
  .row { display: grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 16px; }
  .box { padding: 16px; }
  .goal { display: grid; grid-template-columns: 18px 1fr auto; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--border); }
  .small { font-size: 12px; margin: 8px 0 0; }
  .sub { margin-top: 16px; }
  .balance { display: grid; grid-template-columns: 60px 1fr auto; align-items: center; gap: 8px; margin-top: 6px; text-transform: capitalize; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; font-weight: 500; color: var(--muted); font-size: 11px; text-transform: uppercase; padding: 4px 6px; }
  td { padding: 6px; border-top: 1px solid var(--border); }
</style>

<script lang="ts">
  import { fmtPct, fmtR, fmtUsd, isoDate, summary } from './lib/calc';
  import type { Trade } from './lib/db';

  let { month, trades, unit, selected, onselect, onshift }: {
    month: Date;
    trades: Trade[];
    unit: 'usd' | 'r';
    selected: string;
    onselect: (d: string) => void;
    onshift: (n: number) => void;
  } = $props();

  const today = isoDate(new Date());
  const fmt = (s: ReturnType<typeof summary>) => (unit === 'usd' ? fmtUsd(s.pnl) : fmtR(s.r));
  const tint = (s: ReturnType<typeof summary>) =>
    s.n ? `color-mix(in srgb, var(${s.pnl >= 0 ? '--win' : '--loss'}) ${12 + 28 * Math.min(Math.abs(s.r) / 3, 1)}%, var(--surface))` : '';

  // Build weeks Mon–Fri
  let weeks = $derived.by(() => {
    const start = new Date(month);
    start.setDate(1 - ((start.getDay() + 6) % 7));
    const out: { days: Date[]; from: string; to: string }[] = [];
    for (const d = start; d.getMonth() === month.getMonth() || d < month; d.setDate(d.getDate() + 7)) {
      const days = [0, 1, 2, 3, 4].map((i) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i));
      out.push({ days, from: isoDate(days[0]), to: isoDate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6)) });
    }
    return out;
  });

  let monthKey = $derived(isoDate(month).slice(0, 7));
  let monthSum = $derived(summary(trades.filter((t) => t.date.startsWith(monthKey))));
  let byDay = $derived(Map.groupBy(trades, (t) => t.date));
</script>

<section class="card">
  <div class="top">
    <button class="ghost" onclick={() => onshift(-1)} aria-label="Mes anterior">‹</button>
    <h2>{month.toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' })}</h2>
    <button class="ghost" onclick={() => onshift(1)} aria-label="Mes següent">›</button>
    <div class="kpis">
      <div><span>P&L del mes</span><strong class={monthSum.pnl > 0 ? 'win' : monthSum.pnl < 0 ? 'loss' : ''}>{fmt(monthSum)}</strong></div>
      <div><span>Trades</span><strong>{monthSum.n}</strong></div>
      <div><span>Encert</span><strong>{fmtPct(monthSum.winRate)}</strong></div>
      <div><span>R mitjana</span><strong>{fmtR(monthSum.avgR)}</strong></div>
    </div>
  </div>

  <div class="grid">
    {#each ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Setmana'] as h}
      <div class="head">{h}</div>
    {/each}
    {#each weeks as w}
      {#each w.days as d}
        {@const key = isoDate(d)}
        {@const dayTrades = byDay.get(key) ?? []}
        {@const s = summary(dayTrades)}
        {@const skipped = dayTrades.filter((t) => !t.taken).length}
        <button
          class="day"
          class:out={d.getMonth() !== month.getMonth()}
          class:sel={key === selected}
          class:today={key === today}
          style:background={tint(s)}
          onclick={() => onselect(key)}
        >
          <span class="num">{d.getDate()}</span>
          {#if s.n}
            <strong class={s.pnl >= 0 ? 'win' : 'loss'}>{fmt(s)}</strong>
            <span class="meta">{s.n} {s.n === 1 ? 'trade' : 'trades'} · {fmtPct(s.winRate)}</span>
          {/if}
          {#if skipped}<span class="meta muted">{skipped} no {skipped === 1 ? 'pres' : 'presos'}</span>{/if}
        </button>
      {/each}
      {@const ws = summary(trades.filter((t) => t.date >= w.from && t.date <= w.to))}
      <div class="week">
        {#if ws.n}
          <strong class={ws.pnl >= 0 ? 'win' : 'loss'}>{fmt(ws)}</strong>
          <span class="meta">{ws.n} trades · {fmtPct(ws.winRate)}</span>
        {:else}
          <span class="muted">–</span>
        {/if}
      </div>
    {/each}
  </div>
</section>

<style>
  section { display: flex; flex-direction: column; padding: 16px; min-height: 0; }
  .top { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .top button { font-size: 22px; padding: 0 10px; }
  h2 { margin: 0; font-size: 20px; text-transform: capitalize; min-width: 200px; text-align: center; }
  .kpis { display: flex; gap: 24px; margin-left: auto; }
  .kpis div { display: grid; text-align: right; }
  .kpis span { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
  .kpis strong { font-size: 18px; }
  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(5, 1fr) 0.9fr;
    grid-auto-rows: minmax(90px, 1fr);
    gap: 6px;
  }
  .grid .head { font-size: 12px; color: var(--muted); text-align: center; align-self: end; padding-bottom: 2px; }
  .day, .week {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid var(--border);
    text-align: left;
  }
  .day { background: var(--surface); }
  .day.out { opacity: 0.45; }
  .day.sel { outline: 2px solid var(--accent); outline-offset: -1px; }
  .day.today .num { background: var(--accent); color: #fff; border-radius: 999px; padding: 0 7px; }
  .day strong, .week strong { font-size: 17px; margin-top: auto; }
  .num { font-size: 12px; color: var(--text-2); }
  .meta { font-size: 11px; color: var(--text-2); }
  .week { background: var(--surface-2); justify-content: center; }
</style>

<script lang="ts">
  import { checksDone, closed, fmtPts, fmtR, fmtUsd, pnl, riskPts, rMult, SETUPS, summary } from './lib/calc';
  import { captureSrc, getDay, saveDay, type Day, type Trade } from './lib/db';

  let { date, trades, unit, onnew, onedit }: {
    date: string;
    trades: Trade[];
    unit: 'usd' | 'r';
    onnew: (taken: boolean) => void;
    onedit: (t: Trade) => void;
  } = $props();

  let day = $state<Day>({ date: '', plan: '', levels: '' });
  $effect(() => {
    getDay(date).then((d) => (day = d));
  });

  let taken = $derived(trades.filter((t) => t.taken));
  let skipped = $derived(trades.filter((t) => !t.taken));
  let s = $derived(summary(trades));
  let losses = $derived(closed(trades).filter((t) => pnl(t)! < 0).length);
  let title = $derived(new Date(`${date}T12:00`).toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' }));
</script>

<aside class="card">
  <div class="head">
    <h3>{title}</h3>
    {#if s.n}
      <strong class={s.pnl >= 0 ? 'win' : 'loss'}>{unit === 'usd' ? fmtUsd(s.pnl) : fmtR(s.r)}</strong>
    {/if}
  </div>

  {#if losses >= 2}
    <p class="alert loss">⛔ 2 pèrdues avui: s'ha acabat el dia.</p>
  {:else if taken.length >= 2}
    <p class="alert warn">⚠ Màxim de 2 operacions/dia assolit.</p>
  {/if}

  <div class="plan">
    <label>
      Pla pre-obertura
      <textarea rows="2" placeholder="Si obre i puja fins a l'ONH, buscaré curt" bind:value={day.plan} onblur={() => saveDay({ ...day, date })}></textarea>
    </label>
    <label>
      Nivells marcats
      <textarea rows="2" placeholder="PDH 31.120 · PDL 30.880 · ONH 31.100 …" bind:value={day.levels} onblur={() => saveDay({ ...day, date })}></textarea>
    </label>
  </div>

  <div class="actions">
    <button class="primary" onclick={() => onnew(true)}>+ Trade</button>
    <button onclick={() => onnew(false)}>+ Setup no pres</button>
  </div>

  <div class="list">
    {#each taken as t (t.id)}
      {@render tradeCard(t)}
    {/each}
    {#if skipped.length}
      <h4>No presos</h4>
      {#each skipped as t (t.id)}
        {@render tradeCard(t)}
      {/each}
    {/if}
    {#if !trades.length}
      <p class="muted empty">Cap operació. La majoria de dies no n'hi ha: és l'estratègia funcionant.</p>
    {/if}
  </div>
</aside>

{#snippet tradeCard(t: Trade)}
  {@const r = rMult(t)}
  {@const p = pnl(t)}
  <button class="trade" class:skipped={!t.taken} onclick={() => onedit(t)}>
    {#if t.capture_before || t.capture_after}
      <img src={captureSrc(t.capture_after || t.capture_before)} alt="" />
    {/if}
    <div class="row">
      <span class="dir {t.direction}">{t.direction === 'long' ? '▲ Llarg' : '▼ Curt'}</span>
      <span>{t.setup}</span>
      <span class="muted">{t.time}</span>
      <strong class="res {p == null ? '' : p >= 0 ? 'win' : 'loss'}">{unit === 'usd' ? fmtUsd(p) : fmtR(r)}</strong>
    </div>
    <div class="row meta">
      {#if t.level}<span>{t.level}{t.level_price != null ? ` ${fmtPts(t.level_price)}` : ''}</span>{/if}
      <span>Risc {fmtPts(riskPts(t))} pt</span>
      <span>Checklist {checksDone(t)}/{SETUPS[t.setup]?.length ?? 0}</span>
      <span class="pill">{t.account}</span>
      {#if !t.taken}<span class="pill">{t.skip_reason || 'no pres'}</span>{/if}
      {#if t.broken_rule}<span class="pill loss">regla trencada</span>{/if}
      {#each t.tags.split(',').map((x) => x.trim()).filter(Boolean) as tag}
        <span class="pill">#{tag}</span>
      {/each}
    </div>
  </button>
{/snippet}

<style>
  aside { display: flex; flex-direction: column; gap: 12px; padding: 16px; min-height: 0; }
  .head { display: flex; align-items: baseline; justify-content: space-between; }
  h3 { margin: 0; font-size: 17px; text-transform: capitalize; }
  .head strong { font-size: 18px; }
  h4 { margin: 8px 0 0; font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
  .alert { margin: 0; padding: 8px 10px; border-radius: 8px; background: var(--surface-2); font-weight: 600; }
  .plan { display: grid; gap: 8px; }
  .actions { display: flex; gap: 8px; }
  .list { display: flex; flex-direction: column; gap: 8px; overflow: auto; flex: 1; }
  .empty { text-align: center; margin-top: 24px; }
  .trade { display: grid; gap: 6px; text-align: left; padding: 10px; background: var(--surface); }
  .trade.skipped { border-style: dashed; opacity: 0.8; }
  .trade img { width: 100%; max-height: 140px; object-fit: cover; border-radius: 6px; }
  .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .res { margin-left: auto; font-size: 15px; }
  .meta { font-size: 12px; color: var(--text-2); }
  .dir { font-weight: 600; font-size: 12px; }
  .dir.long { color: var(--win); }
  .dir.short { color: var(--loss); }
</style>

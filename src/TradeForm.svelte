<script lang="ts">
  import Capture from './Capture.svelte';
  import { ACCOUNTS, fmtPts, fmtR, fmtUsd, LEVELS, MAX_STOP_PTS, plannedR, pnl, POINT_USD, riskPts, rMult, SETUPS, SKIP_REASONS } from './lib/calc';
  import { deleteTrade, saveTrade, type Trade } from './lib/db';

  let { trade, onclose, onsaved }: { trade: Trade; onclose: () => void; onsaved: (date: string) => void } = $props();
  // svelte-ignore state_referenced_locally
  let t = $state(trade);

  let risk = $derived(riskPts(t));
  let planned = $derived(plannedR(t));
  let checks = $derived(SETUPS[t.setup] ?? []);

  // Fill 3R target
  function target3R() {
    if (t.entry != null && risk) t.target = t.entry + (t.direction === 'long' ? 3 : -3) * risk;
  }

  async function save() {
    await saveTrade($state.snapshot(t));
    onsaved(t.date);
  }

  async function remove() {
    if (t.id && confirm('Esborrar aquesta operació?')) {
      await deleteTrade(t.id);
      onsaved(t.date);
    }
  }
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onclose()} />

<div class="backdrop" role="presentation" onclick={(e) => e.target === e.currentTarget && onclose()}>
  <form class="card" onsubmit={(e) => (e.preventDefault(), save())}>
    <header>
      <h3>{t.id ? 'Editar' : 'Nou'} {t.taken ? 'trade' : 'setup no pres'}</h3>
      <div class="seg">
        <button type="button" class:on={t.taken} onclick={() => (t.taken = 1)}>Pres</button>
        <button type="button" class:on={!t.taken} onclick={() => (t.taken = 0)}>No pres</button>
      </div>
    </header>

    <div class="cols">
      <div class="col">
        <div class="g3">
          <label>Data <input type="date" bind:value={t.date} required /></label>
          <label>Hora <input type="time" bind:value={t.time} /></label>
          <label>Compte
            <select bind:value={t.account}>{#each ACCOUNTS as a}<option>{a}</option>{/each}</select>
          </label>
        </div>
        <div class="g3">
          <label class="span2">Setup
            <select bind:value={t.setup} onchange={() => (t.checklist = 0)}>
              {#each Object.keys(SETUPS) as s}<option>{s}</option>{/each}
            </select>
          </label>
          <label>Direcció
            <div class="seg dir">
              <button type="button" class:on={t.direction === 'long'} onclick={() => (t.direction = 'long')}>▲ Llarg</button>
              <button type="button" class:on={t.direction === 'short'} onclick={() => (t.direction = 'short')}>▼ Curt</button>
            </div>
          </label>
        </div>
        <div class="g3">
          <label>Nivell
            <select bind:value={t.level}><option value="">—</option>{#each LEVELS as l}<option>{l}</option>{/each}</select>
          </label>
          <label>Preu del nivell <input type="number" step="0.25" bind:value={t.level_price} /></label>
          {#if !t.taken}
            <label>Motiu
              <select bind:value={t.skip_reason}><option value="">—</option>{#each SKIP_REASONS as r}<option>{r}</option>{/each}</select>
            </label>
          {:else}
            <label>Contractes <input type="number" min="1" step="1" bind:value={t.contracts} required /></label>
          {/if}
        </div>

        <fieldset>
          <legend>Checklist {checks.filter((_, i) => t.checklist & (1 << i)).length}/{checks.length}</legend>
          {#each checks as c, i}
            <label class="check">
              <input type="checkbox" checked={!!(t.checklist & (1 << i))} onchange={() => (t.checklist ^= 1 << i)} />
              {i + 1}. {c}
            </label>
          {/each}
        </fieldset>

        <div class="g4">
          <label>Entrada <input type="number" step="0.25" bind:value={t.entry} /></label>
          <label>Stop <input type="number" step="0.25" bind:value={t.stop} /></label>
          <label>Target
            <span class="inline"><input type="number" step="0.25" bind:value={t.target} /><button type="button" onclick={target3R} title="Target a 3R">3R</button></span>
          </label>
          <label>{t.taken ? 'Sortida' : 'Hauria sortit a'} <input type="number" step="0.25" bind:value={t.exit} /></label>
        </div>

        <div class="calc">
          <div><span>Risc</span><strong>{fmtPts(risk)} pt · {risk ? `${fmtPts(risk * POINT_USD * t.contracts)} $` : '–'}</strong></div>
          <div><span>R planificat</span><strong>{planned == null ? '–' : `${fmtPts(planned)}R`}</strong></div>
          <div><span>Resultat</span><strong class={(pnl(t) ?? 0) >= 0 ? 'win' : 'loss'}>{fmtR(rMult(t))}</strong></div>
          <div><span>P&L net</span><strong class={(pnl(t) ?? 0) >= 0 ? 'win' : 'loss'}>{fmtUsd(pnl(t))}</strong></div>
          <label class="comm">Comissions $ <input type="number" step="0.01" bind:value={t.commission} /></label>
        </div>
        {#if risk && risk > MAX_STOP_PTS}
          <p class="warn">⚠ Stop de {fmtPts(risk)} punts &gt; {MAX_STOP_PTS}: no hi cap per mida.</p>
        {/if}
        {#if planned != null && planned < 3 && t.setup === "Reversal d'obertura"}
          <p class="warn">⚠ Només hi ha espai per a {fmtPts(planned)}R (cal 3R).</p>
        {/if}
      </div>

      <div class="col">
        <div class="g2">
          <Capture label="Abans" bind:value={t.capture_before} />
          <Capture label="Després" bind:value={t.capture_after} />
        </div>
        <label>Regla trencada <input placeholder="Buit si no. Ex: he mogut el stop, he entrat sense nivell…" bind:value={t.broken_rule} /></label>
        <label>Estat emocional
          <div class="seg">
            {#each [1, 2, 3, 4, 5] as n}
              <button type="button" class:on={t.emotion === n} onclick={() => (t.emotion = t.emotion === n ? null : n)}>{n}</button>
            {/each}
          </div>
        </label>
        <label>Etiquetes <input placeholder="fomc, dormit-poc, trail…" bind:value={t.tags} /></label>
        <label>Notes <textarea rows="5" bind:value={t.notes}></textarea></label>
      </div>
    </div>

    <footer>
      {#if t.id}<button type="button" class="danger" onclick={remove}>Esborrar</button>{/if}
      <div class="spacer"></div>
      <button type="button" onclick={onclose}>Cancel·lar</button>
      <button type="submit" class="primary">Desar</button>
    </footer>
  </form>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    background: rgb(0 0 0 / 0.5);
  }
  form { width: min(1100px, 95vw); max-height: 94vh; overflow: auto; padding: 20px; display: grid; gap: 16px; }
  header, footer { display: flex; align-items: center; gap: 12px; }
  h3 { margin: 0; }
  .spacer { flex: 1; }
  .cols { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }
  .col { display: flex; flex-direction: column; gap: 12px; }
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .g4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .span2 { grid-column: span 2; }
  .seg.dir button { flex: 1; padding: 6px 4px; }
  .seg.dir { display: flex; }
  .inline { display: flex; gap: 4px; }
  .inline button { padding: 4px 8px; font-size: 12px; }
  fieldset { border: 1px solid var(--border); border-radius: 10px; display: grid; gap: 6px; padding: 8px 12px 10px; }
  legend { font-size: 12px; color: var(--text-2); padding: 0 4px; }
  .check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text); cursor: pointer; }
  .check input { width: auto; }
  .calc { display: flex; gap: 20px; align-items: end; padding: 10px 12px; border-radius: 10px; background: var(--surface-2); }
  .calc div { display: grid; }
  .calc span { font-size: 11px; color: var(--muted); }
  .calc strong { font-size: 16px; }
  .comm { margin-left: auto; width: 110px; }
  p.warn { margin: 0; font-weight: 600; }
</style>

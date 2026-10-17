<script lang="ts">
  import Calendar from './Calendar.svelte';
  import DayPanel from './DayPanel.svelte';
  import Stats from './Stats.svelte';
  import TradeForm from './TradeForm.svelte';
  import { ACCOUNTS, isoDate } from './lib/calc';
  import { listTrades, type Trade } from './lib/db';

  let all = $state<Trade[]>([]);
  let view = $state<'calendar' | 'stats'>('calendar');
  let unit = $state<'usd' | 'r'>('usd');
  let account = $state('tots');
  let month = $state(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  let selected = $state(isoDate(new Date()));
  let editing = $state<Trade | null>(null);

  let trades = $derived(account === 'tots' ? all : all.filter((t) => t.account === account));

  const reload = async () => (all = await listTrades());
  reload();

  function shiftMonth(n: number) {
    month = new Date(month.getFullYear(), month.getMonth() + n, 1);
  }

  function newTrade(taken: boolean) {
    const last = all.at(-1);
    editing = {
      date: selected,
      time: new Date().toTimeString().slice(0, 5),
      taken: taken ? 1 : 0,
      skip_reason: '',
      setup: last?.setup ?? "Reversal d'obertura",
      direction: 'short',
      account: last?.account ?? 'replay',
      contracts: 1,
      level: '',
      level_price: null,
      checklist: 0,
      entry: null,
      stop: null,
      target: null,
      exit: null,
      commission: 1.85,
      broken_rule: '',
      emotion: null,
      tags: '',
      notes: '',
      capture_before: '',
      capture_after: '',
    };
  }
</script>

<header>
  <div class="brand">
    <strong>Trade Calendar</strong>
    <span class="muted">MNQ · Reversal d'obertura</span>
  </div>
  <div class="seg">
    <button class:on={view === 'calendar'} onclick={() => (view = 'calendar')}>Calendari</button>
    <button class:on={view === 'stats'} onclick={() => (view = 'stats')}>Estadístiques</button>
  </div>
  <div class="spacer"></div>
  <div class="seg">
    {#each ['tots', ...ACCOUNTS] as a}
      <button class:on={account === a} onclick={() => (account = a)}>{a}</button>
    {/each}
  </div>
  <div class="seg">
    <button class:on={unit === 'usd'} onclick={() => (unit = 'usd')}>$</button>
    <button class:on={unit === 'r'} onclick={() => (unit = 'r')}>R</button>
  </div>
</header>

<main class:full={view === 'stats'}>
  {#if view === 'calendar'}
    <Calendar {month} {trades} {unit} {selected} onselect={(d) => (selected = d)} onshift={shiftMonth} />
    <DayPanel
      date={selected}
      trades={trades.filter((t) => t.date === selected)}
      {unit}
      onnew={newTrade}
      onedit={(t) => (editing = { ...t })}
    />
  {:else}
    <Stats {trades} {unit} />
  {/if}
</main>

{#if editing}
  <TradeForm
    trade={editing}
    onclose={() => (editing = null)}
    onsaved={async (date) => {
      selected = date;
      editing = null;
      await reload();
    }}
  />
{/if}

<style>
  header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .brand { display: grid; line-height: 1.2; }
  .brand span { font-size: 12px; }
  .spacer { flex: 1; }
  .seg button { text-transform: capitalize; }
  main {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 16px;
    padding: 16px 20px;
    height: calc(100vh - 61px);
  }
  main.full { grid-template-columns: 1fr; overflow: auto; }
</style>

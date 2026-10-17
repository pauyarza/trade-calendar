<script lang="ts">
  import { captureSrc, saveCapture } from './lib/db';

  let { label, value = $bindable() }: { label: string; value: string } = $props();
  let big = $state(false);
  let input: HTMLInputElement;

  async function take(file: Blob | null | undefined) {
    if (file?.type.startsWith('image/')) value = await saveCapture(file);
  }
</script>

<div
  class="drop"
  role="button"
  tabindex="0"
  onpaste={(e) => take([...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith('image/'))?.getAsFile())}
  ondragover={(e) => e.preventDefault()}
  ondrop={(e) => {
    e.preventDefault();
    take(e.dataTransfer?.files[0]);
  }}
  onkeydown={(e) => e.key === 'Enter' && input.click()}
>
  <span class="label">{label}</span>
  {#if value}
    <button class="thumb" onclick={() => (big = true)}><img src={captureSrc(value)} alt={label} /></button>
    <button class="ghost x" onclick={() => (value = '')} aria-label="Treure captura">✕</button>
  {:else}
    <span class="muted hint">Clica aquí i enganxa (Ctrl+V), arrossega-la o <button class="link" onclick={() => input.click()}>tria un fitxer</button></span>
  {/if}
  <input bind:this={input} type="file" accept="image/*" hidden onchange={() => take(input.files?.[0])} />
</div>

{#if big}
  <button class="lightbox" onclick={() => (big = false)}><img src={captureSrc(value)} alt={label} /></button>
{/if}

<style>
  .drop {
    position: relative;
    display: grid;
    place-items: center;
    gap: 6px;
    min-height: 130px;
    padding: 8px;
    border: 1px dashed var(--border);
    border-radius: 10px;
    background: var(--surface-2);
  }
  .drop:focus { outline: 2px solid var(--accent); }
  .label { position: absolute; top: 6px; left: 10px; font-size: 12px; color: var(--text-2); }
  .hint { font-size: 12px; text-align: center; padding: 16px 12px 0; }
  .link { background: none; border: none; padding: 0; color: var(--accent); text-decoration: underline; }
  .thumb { padding: 0; border: none; background: none; }
  .thumb img { max-width: 100%; max-height: 160px; border-radius: 6px; margin-top: 16px; }
  .x { position: absolute; top: 2px; right: 2px; padding: 2px 8px; }
  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    background: rgb(0 0 0 / 0.85);
    border: none;
    border-radius: 0;
    cursor: zoom-out;
  }
  .lightbox img { max-width: 95vw; max-height: 95vh; }
</style>

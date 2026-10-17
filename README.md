# Trade Calendar

Diari de trades MNQ en forma de calendari (Tauri 2 + Svelte 5 + SQLite), per al pla "Reversal d'obertura MNQ".

## Executar

```
sudo apt install libwebkit2gtk-4.1-dev librsvg2-dev pkg-config libxdo-dev libayatana-appindicator3-dev
npm install
npm run tauri dev      # desenvolupament
npm run tauri build    # paquet .deb a src-tauri/target/release/bundle/deb/
```

Instal·lar-la (i fixar-la al dock de GNOME amb el botó dret → "Afegeix als preferits"):

```
sudo dpkg -i "src-tauri/target/release/bundle/deb/Trade Calendar_0.1.0_amd64.deb"
```

## Arquitectura

```
┌──────────────────────────── Finestra (WebKitGTK) ────────────────────────────┐
│  Svelte 5                                                                    │
│  App.svelte ── estat: tots els trades en memòria, mes, dia triat, $/R        │
│   ├─ Calendar.svelte    calendari mensual + totals setmanals                 │
│   ├─ DayPanel.svelte    pla del dia, nivells, llista de trades               │
│   ├─ TradeForm.svelte   formulari ── Capture.svelte (enganxar/arrossegar)    │
│   └─ Stats.svelte       indicadors, corba de capital, dia 90                 │
│  lib/calc.ts  fórmules (R, P&L, ratxes, caiguda)   lib/db.ts  SQL + captures │
└───────┬──────────────────────────────┬───────────────────────────▲───────────┘
        │ SQL via IPC                  │ bytes de la imatge        │ asset://
        │ (@tauri-apps/plugin-sql)     │ (save_capture)            │ (mostrar imatge)
┌───────▼──────────────────────────────▼───────────────────────────┴───────────┐
│  Rust (src-tauri/src/main.rs)                                                │
│   tauri-plugin-sql (sqlx) ── aplica schema.sql en arrencar si cal            │
│   save_capture ── escriu la imatge i en retorna el nom                       │
│   prune_captures ── esborra les imatges que cap trade no fa servir           │
└───────┬──────────────────────────────┬───────────────────────────────────────┘
        ▼                              ▼
   trades.db (SQLite)             captures/*.png
```

- **Arrencar:** Rust obre la base de dades i aplica la migració si cal. El frontend carrega tots els trades amb un sol `SELECT` i en calcula el calendari i les estadístiques en memòria.
- **Desar un trade:** `INSERT` o `UPDATE` i es torna a carregar la llista sencera, que és instantani per a milers d'operacions.
- **Pla i nivells del dia:** es desen (upsert a `days`) en sortir del camp de text.
- **Captures:** els bytes de la imatge van a Rust, que escriu el fitxer i en retorna el nom. El nom es desa amb el trade, i la imatge es mostra amb el protocol `asset://`, limitat a la carpeta `captures/`.
- **Neteja:** cada cop que es carreguen els trades, `prune_captures` esborra de `captures/` les imatges que ja no fa servir cap trade: les de trades esborrats, les que has tret o substituït i les d'un formulari cancel·lat.

## Dades

| On | Què |
| --- | --- |
| `~/.config/cat.pau.tradecalendar/trades.db` | SQLite en mode WAL; mentre l'app és oberta hi veuràs també un `trades.db-wal` |
| `~/.local/share/cat.pau.tradecalendar/captures/` | les captures, una per fitxer (`<mil·lisegons>.png`) |
| `~/.local/share/cat.pau.tradecalendar/WebKit*` | memòria cau del motor web, no són dades teves |

L'esquema és a [src-tauri/schema.sql](src-tauri/schema.sql):

| Taula | Una fila per | Contingut |
| --- | --- | --- |
| `trades` | operació, presa o no (`taken`) | data, hora, setup, direcció, compte, nivell, `checklist`, entrada/stop/target/sortida, comissions, regla trencada, emoció, etiquetes, notes, nom de les dues captures |
| `days` | dia amb pla escrit | `plan` i `levels`, amb la data com a clau |
| `_sqlx_migrations` | versió de l'esquema | la gestiona el plugin |

- **`checklist`:** és una màscara de bits. El bit 0 és la condició 1, el bit 1 la condició 2, i així successivament; 31 (`11111`) vol dir 5/5.
- **R i P&L:** no es guarden mai, sinó que es calculen a partir dels preus ([src/lib/calc.ts](src/lib/calc.ts)). Si corregeixes un preu o la comissió, tot es recalcula sol.
  - P&L = punts × 2 $ × contractes − comissions.
  - R = P&L / (punts de risc × 2 $ × contractes).

Per fer-ne una còpia de seguretat, n'hi ha prou de copiar `trades.db` i la carpeta `captures/` amb l'app tancada.

## Mida i memòria

| | |
| --- | --- |
| Paquet `.deb` | 4,5 MB |
| Binari instal·lat | 15 MB, amb el frontend (100 KB) a dins |
| Base de dades buida | 28 KB; cada trade ~0,5 KB, i cada captura uns 100–500 KB a part |
| Memòria en arrencar (PSS) | ~280 MB: `trade-calendar` ~88 MB, `WebKitWebProcess` ~161 MB, `WebKitNetworkProcess` ~30 MB |

La major part de la memòria és de WebKit, el motor que dibuixa la finestra. En repòs, la CPU és pràcticament zero.

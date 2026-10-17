# Trade Calendar

Diari de trades MNQ en forma de calendari (Tauri 2 + Svelte 5 + SQLite), per al pla "Reversal d'obertura MNQ".

## Executar

```
sudo apt install libwebkit2gtk-4.1-dev librsvg2-dev pkg-config libxdo-dev libayatana-appindicator3-dev
npm install
npm run tauri dev      # desenvolupament
npm run tauri build    # paquet .deb a src-tauri/target/release/bundle/deb/
```

## Dades

- Trades i plans del dia: `~/.config/cat.pau.tradecalendar/trades.db`
- Captures: `~/.local/share/cat.pau.tradecalendar/captures/`

P&L = punts × 2 $ × contractes − comissions. R = P&L / (punts de risc × 2 $ × contractes).

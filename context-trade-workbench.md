# Context: trade-calendar i workbench de trading (projecte personal)

Resum d'una conversa anterior, per continuar-la aquí. És un projecte **personal**, separat de la meva feina: res de codi, dades, comptes ni estratègies de l'empresa. L'empresa opera opcions de l'S&P 500 (SPX/SPXW), així que jo **mai** opero ES, MES, SPX, SPXW ni SPY.

## 1. L'estratègia actual: "Reversal d'obertura MNQ"

Manual en fase paper (Signal Deck). Està a `Reversal d'obertura MNQ.md`, a l'arrel del repo. En resum:

- **Instrument:** MNQ (2 $/punt, tick de 0,25 = 0,50 $). Compte de 2.000 € (~2.300 $), sempre 1 contracte.
- **Finestra:** 15:30–16:30, hora d'Espanya (tancar-ho tot a les 17:30). Entre el 26 i el 30 d'octubre del 2026 i entre el 15 i el 26 de març del 2027, l'obertura és a les 14:30.
- **Abans de l'obertura:** marcar 4–6 nivells (PDH, PDL, PDC, ONH, ONL i swings de 15 min) i escriure el pla en una línia. Mirar el calendari macro: quedar-se fora 2 min abans i 5 min després de les dades de les 10:00 ET.
- **Checklist (5/5, gràfic d'1 min):**
  1. Moviment fort a la primera hora.
  2. Arriba a un nivell marcat.
  3. Canvi d'estructura (LH + LL per a un curt).
  4. Vela de confirmació amb el cos més gran que les 5 anteriors, que tanca al terç extrem.
  5. Hi ha espai per a 3R fins al nivell següent.
- **Entrada:** Stop Market 1 tick més enllà de la vela de confirmació. Si no s'executa en 2–3 min, es cancel·la.
- **Gestió:**
  - stop 1 tick més enllà del LH;
  - target a 3R;
  - break-even a +1R;
  - trail opcional a partir de +2R;
  - sortida a mercat a les 17:30;
  - el stop no es mou mai més lluny.
- **Risc:** ≤ 2% (~45 $). Stop màxim ~22 punts; si el stop estructural és més ample, l'operació no es pren i s'apunta com a "no pres per mida". Comissions ~1,85 $ per operació (anada i tornada).
- **Límits:**
  - màx. 2 operacions/dia;
  - parar després de 2 pèrdues o −4% el mateix dia;
  - parar la setmana a −6%.
  Freqüència esperada: 1–3 operacions per setmana.
- **Altres setups d'obertura, encara no validats:** ORB de 15 min (el recomanat per començar), ruptura fallida del rang, escombrada de l'ONH/ONL, tancament de gap i pullback a VWAP.
- **Pla de 90 dies:**
  - setmana 1: plataforma;
  - setmanes 2–5: 60 operacions en replay;
  - setmanes 6–12: 30+ operacions en paper en directe.
  - Per passar a real cal complir-ho tot: ≥ 90 operacions, expectativa ≥ +0,15R, caiguda màxima < 10R, compliment de regles ≥ 90% i que el backtest no ho contradigui.
- **Diari per operació:**
  - data, hora i direcció;
  - nivell i checklist;
  - entrada, stop, target i punts de risc;
  - resultat en R;
  - captures d'abans i de després;
  - regla trencada i estat emocional (1–5);
  - també els setups no presos, amb el motiu i com haurien acabat.

## 2. L'app: trade-calendar (feta i funcionant)

Repo local: `/home/pau/PAU/Projects/trade-calendar`, branca `main`. Commits:
- `e494a36` app inicial;
- `c482973` captures guardades pel nom del fitxer i neteja de les òrfenes;
- `c9e3cad` saldo inicial per compte.

Encara no s'ha fet push enlloc.

- **Stack:** Tauri 2 + Svelte 5 + TypeScript (Vite, sense SvelteKit), amb SQLite via `tauri-plugin-sql` (sqlx). La UI és en català.
- **Instal·lació:** `npm run tauri build` genera `src-tauri/target/release/bundle/deb/Trade Calendar_0.1.0_amd64.deb`, que s'instal·la amb `sudo dpkg -i "<camí absolut>"`. Es fixa al dock de GNOME. El paquet fa 4,5 MB i el binari 15 MB. En arrencar ocupa ~280 MB de RAM (la major part és WebKit).
- **Fitxers:**
  - `src/App.svelte`: estat global; filtre de compte (replay/paper/real); botó $/R.
  - `src/Calendar.svelte`: mes de dilluns a divendres, amb colors segons la R i totals setmanals.
  - `src/DayPanel.svelte`: pla del dia i nivells; avisos de 2 operacions i de 2 pèrdues.
  - `src/TradeForm.svelte`:
    - setup amb el seu checklist; entrada, stop i target (amb botó 3R) i sortida;
    - càlcul en directe del risc, la R planificada, la R i el P&L;
    - avisos de stop > 22 punts i de menys de 3R d'espai.
  - `src/Capture.svelte`: captures enganxades amb Ctrl+V, arrossegades o triades d'un fitxer.
  - `src/Stats.svelte`:
    - KPIs, corba de capital amb tooltip i criteris del dia 90;
    - taula per setup, no presos per motiu i taula completa.
  - `src/lib/calc.ts`: fórmules, setups, checklists, comptes i constants.
  - `src/lib/db.ts`: SQL i captures.
  - `src-tauri/src/main.rs`: ordres `save_capture` i `prune_captures`, i migracions.
- **Dades:** totes locals, sense cap servidor.
  - La base de dades és `~/.config/cat.pau.tradecalendar/trades.db`, en mode WAL. Taules: `trades`, `days` (pla i nivells per data), `accounts` (saldo inicial) i `_sqlx_migrations`.
  - El `checklist` és un enter que fa de màscara de bits.
  - La R i el P&L no es guarden: es calculen a partir dels preus. P&L = punts × 2 $ × contractes − comissions. R = P&L / (punts de risc × 2 $ × contractes).
  - Les captures es guarden a `~/.local/share/cat.pau.tradecalendar/captures/`; la base de dades només en guarda el nom de fitxer.
- **Limitació:** els 2 $/punt de l'MNQ estan fixats al codi. Si canvio d'instrument, cal afegir un camp d'instrument amb el seu multiplicador.

## 3. Nova direcció: un workbench de trading automàtic

La idea és tenir-ho tot al mateix lloc: dades, estratègia, execució i diari, en lloc d'anar amb NinjaTrader al costat. Anem per parts, i el primer pas era triar broker.

### Alpaca (investigat l'octubre del 2026)

- **No té futurs**, així que no pot operar MNQ. Ofereix accions i ETFs dels EUA, opcions (també multi-leg) i cripto. Els futurs només surten com a "roadmap"; s'han registrat com a FCM, però per als mercats de prediccions.
- **API:**
  - REST, WebSocket i FIX;
  - SDK de Python (`alpaca-py`);
  - tipus d'ordre: market, limit, stop, stop-limit, bracket, OCO, OTO i trailing stop;
  - limitacions: els bracket no funcionen en horari estès; el trailing stop només s'activa en horari regular;
  - paper trading gratuït, amb dades en temps real i fins a 1 M$.
- **Dades:**
  - **Pla gratuït:** només la borsa IEX en temps real, 30 símbols per WebSocket i 200 crides/min.
  - **Algo Trader Plus (99 $/mes):** totes les borses dels EUA i OPRA.
  - Més de 7 anys d'històric amb barres d'1 minut, que serveixen per al backtest.
- **Costos:** 0 $ de comissió en accions i opcions, més taxes regulatòries.
- **Des d'Espanya:** una FAQ d'octubre del 2025 diu que tots els usuaris no residents als EUA poden obrir compte des d'1 $. No he confirmat que hi entri Espanya, quina entitat seria ni en quina divisa es diposita (probablement USD).
- **Regla PDT eliminada:** des del 4 de juny del 2026 (FINRA, Regulatory Notice 26-10) ja no hi ha el mínim de 25.000 $; el substitueix un marge intradia per a comptes de margen de **més de 2.000 $**. Alpaca ja l'aplica: només compta el `buying_power` i ha retirat els camps PDT.

### Altres brokers considerats (per a MNQ)

- **IBKR (entitat d'Irlanda):** l'API més madura (`ib_async`). Un usuari de fòrum parla d'uns 3.000 $ de marge per MNQ, que potser no hi cap amb 2.000 €. A més, liquida posicions sense avisar.
- **NinjaTrader Europe** (el compte que ja tinc): marge de ~100 $, però l'automatització amb NinjaScript només funciona a Desktop, que és només per a Windows. No he confirmat si l'API de Tradovate està disponible per a la UE.
- **Tradovate:** 1.000 $ de compte, 25 $/mes per l'API i una llicència CME de ~290–500 $/mes.
- **Rithmic** via AMP o semblants: condicions per a Espanya per confirmar.
- **Dades independents del broker:** Databento ofereix la CME en temps real (uns 36 $/mes, segons un fòrum; no verificat).

**Decisió:** Alpaca, canviant d'instrument.

### Instrument proposat amb Alpaca: QQQ (accions de l'ETF)

- **Per què QQQ:** és el mateix índex (Nasdaq-100), molt líquid i amb un spread d'1 cèntim, i no se solapa amb l'empresa.
- **Canvis respecte a l'MNQ:**
  - **Mida variable:** `accions = min(risc$ / stop$, poder de compra / preu)`. Desapareix el "no pres per mida".
  - **Palanquejament molt menor:** a grans trets ~4x amb un manteniment del 25%, uns 9.000 $ (cal mirar el `buying_power` real). Un stop equivalent a 18,5 punts del NQ són uns 0,45 $ a QQQ (ràtio NQ/QQQ aproximada de 41). Amb ~12 accions, el risc és d'uns **5–10 $ per operació**. La R es manté igual.
  - **Nivells de la nit:** l'ONH/ONL passa a ser el màxim i el mínim del pre-market (10:00–15:30 hora d'Espanya).
  - **Ticks i costos:** el tick és d'1 cèntim i la comissió és 0.
- **Alternatives:**
  - opcions 0DTE de QQQ: tornen el palanquejament i el risc queda limitat a la prima, però són no lineals; no per començar;
  - TQQQ (3x): només si el risc en $ de QQQ es fa massa petit.
- **Per verificar amb el suport d'Alpaca:**
  1. Si la normativa PRIIPs/KID impedeix comprar QQQ des d'Espanya. Si és que sí, la via són les opcions de QQQ.
  2. Què passa amb el marge intradia si el compte baixa de 2.000 $.
- **Dades:** el pla gratuït té només IEX en temps real, i els màxims i mínims poden diferir de les dades consolidades. Per al backtest no hi ha problema; per operar en directe, probablement el pla de 99 $.

### Capital per passar a real

- 2.000 $ exactes és massa just, pel llindar de 2.000 $ del marge intradia. Millor ~2.500 $, o els 2.000 € (~2.300 $).
- Regla: si el compte baixa de 2.100 $, s'atura tot i es revisa; no s'ingressen diners per tapar el forat.
- Compte amb el cost de convertir EUR a USD.
- Expectativa realista: +0,2R × ~8 operacions/mes × ~8 $ ≈ 13 $/mes. És el que costa aprendre a executar amb diners reals, no una font d'ingressos.

## 4. Passos següents pendents

1. Confirmar amb el suport d'Alpaca: que Espanya és acceptada, PRIIPs/QQQ, el llindar de 2.000 $ i la divisa.
2. Adaptar el `.md` de l'estratègia a QQQ: mida, nivells del pre-market i regla de l'stop.
3. Al diari: camp d'instrument amb el seu multiplicador, i mida en accions.
4. Backtest mecànic amb barres d'1 min d'Alpaca (7 anys), començant pels setups amb regles exactes (ORB, reversal).
5. Dissenyar el workbench: dades, estratègia, execució en paper i diari integrats en una sola app.

## Preferències de feina

- Menys codi i menys estructura: directe i sense abstraccions innecessàries.
- Res de `try/except` per si de cas; res d'`assert` per a comprovacions en temps d'execució.
- Comentaris tipus `# Verb noun` dins dels mètodes.
- Preguntar abans d'assumir qualsevol cosa que no estigui especificada.
- Les respostes, en català.

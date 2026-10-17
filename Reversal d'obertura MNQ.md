Índex

1. [El pla en una pàgina](#resum)
2. [El setup pas a pas](#setup)
3. [Gestió de la posició](#gestio)
4. [Altres setups d'obertura](#altres)
5. [Risc i mida](#mida)
6. [Els números](#numeros)
7. [NinjaTrader](#ninja)
8. [Pla de 90 dies](#pla)
9. [Diari i revisió](#diari)
10. [Per no cagar-la](#errors)
11. [Recursos](#recursos)
12. [Empresa i impostos](#marc)

Signal Deck · manual · fase paper

# Reversal d'obertura MNQ

Una estratègia discrecional senzilla. Durant la primera hora del mercat americà, busques que un moviment fort es giri en un nivell marcat, entres quan l'estructura ho confirma i arrisques 1 per guanyar-ne 3. Està basada en el vídeo de Riley Coleman, adaptada al Nasdaq micro i a un compte de 2.000 €. Al final hi trobaràs cinc setups curts més per a l'obertura de NY.

Instrument

MNQ · 2 $/punt

Finestra

15:30–16:30 (hora d'Espanya)

Risc per operació

≤ 2% (≈ 45 $)

Objectiu

3R

Màxim

2 operacions/dia

Estat

Paper

## El pla en una pàgina

Cada dia de mercat obres els gràfics a les 15:00, marques els nivells i esperes. Si en els primers 60 minuts el preu fa un moviment fort cap a un nivell i hi gira, i es compleixen les cinc condicions del checklist, entres en contra del moviment. Si no, tanques i fas vida normal. El vídeo parla d'**1 a 3 operacions per setmana**, no per dia. La majoria de dies no hauràs de fer res, i això és l'estratègia funcionant, no fallant.

No fas servir indicadors: només llegeixes l'estructura (màxims i mínims dels swings) i els nivells. Per això funciona igual en paper i en real, però també per això depèn molt de la teva disciplina. Això és el que has d'entrenar.

**Per què MNQ i no MES:** el MES és l'S&P 500, el mateix subjacent que opera l'empresa. Amb l'MNQ evites qualsevol solapament. Cada punt de l'MNQ val 2 $, un tick (0,25 punts) val 0,50 $ i un contracte mou uns 62.000 $ de nocional.

## El setup pas a pas

### Abans de l'obertura (15:00–15:30)

1. **Mira el calendari macro.** Les dades de les 8:30 ET (14:30 a Espanya: IPC, ocupació, peticions d'atur dels dijous) ja han sortit, però hi deixen volatilitat. Les de les 10:00 ET (16:00 a Espanya: ISM, JOLTS, confiança del consumidor) cauen *dins* de la teva finestra. Els dies que n'hi hagi d'importància alta, queda't fora del mercat 2 minuts abans i 5 després. Els dies de FOMC, si vols, no operis.
2. **Marca els nivells** amb línies horitzontals al gràfic de 15 minuts:
   - **Màxim i mínim d'ahir** (PDH, PDL) i el **tancament d'ahir** (PDC).
   - **Màxim i mínim de la nit** (ONH, ONL), de 00:00 a 15:30 hora d'Espanya.
   - Dos o tres **swings clars del gràfic de 15 minuts** dels últims dies, on el preu va girar amb força.

   Amb 4–6 línies n'hi ha prou. Si en marques 15, sempre n'hi haurà una a prop i el filtre deixa de servir.
3. **Mira el context de 15 minuts:** si el mercat ve de tendència o va lateral, i on és el preu respecte dels nivells. Escriu en una línia el que esperes, per exemple: "Si obre i puja fins a l'ONH, buscaré curt".

### Durant la finestra: les cinc condicions

Ho mires en el gràfic d'1 minut i **s'han de complir totes cinc**. Un swing és un màxim (o mínim) amb barres més baixes (o més altes) a banda i banda. Una definició pràctica és el fractal de 3 barres: la barra del mig té el màxim més alt que la de davant i la de darrere.

Exemple esquemàtic (no és un dia real) d'un reversal curt. L'entrada és a 31.071,75, el stop a 31.090,25 i el risc és de 18,5 punts (37 $ amb 1 MNQ). El break-even arriba a 1R i l'objectiu a 3R, que coincideix amb el tancament d'ahir.

### Checklist d'entrada

- [ ] **1. Moviment fort a la primera hora.** Des de l'obertura, el preu s'ha mogut de manera clara en una direcció, i amb barres grans i seguides, no una pujada a poc a poc.
- [ ] **2. Arriba a un nivell marcat.** El moviment toca o supera per poc una de les línies que has marcat abans de l'obertura. Sense nivell no hi ha operació.
- [ ] **3. Canvi d'estructura.** Per a un curt: després del màxim, el preu fa un màxim més baix (LH) i trenca l'últim mínim (LL). Per a un llarg és al revés: un mínim més alt (HL) i un màxim més alt (HH).
- [ ] **4. Vela de confirmació.** Una vela d'1 minut en la nova direcció amb el cos gran (més gran que les 5 anteriors) i que tanca al terç extrem del seu rang.
- [ ] **5. Hi ha espai per a 3R.** Del punt d'entrada fins al següent nivell en la direcció de l'operació hi ha com a mínim 3 vegades la distància del stop, i el stop no supera el teu màxim (veus la calculadora).

### L'entrada

Poses una ordre **Stop Market 1 tick per sota del mínim de la vela de confirmació** (o per sobre del màxim, si entres llarg). Si el preu no la trenca en 2–3 minuts, la cancel·les. Així no entres en una confirmació que no continua. Abans de fer clic, la teva ordre ja ha de portar el stop i el target connectats (el bracket ho explico a la secció de NinjaTrader).

## Gestió de la posició

| Moment | Què fas | Per què |
| --- | --- | --- |
| Entrada | Stop 1 tick per sobre del màxim més baix (LH), en un curt. Target a 3R. | Si el preu torna a superar el LH, el gir ha fallat. No hi ha cap motiu per seguir dins. |
| +1R | Mous el stop a break-even (l'entrada més un parell de ticks per cobrir comissions). | Una operació que ja ha anat a favor no s'ha de convertir en pèrdua. |
| +2R | Opcional: vas movent el stop per sobre de cada nou màxim més baix d'1 minut. | És el "trail" del vídeo. Primer domina la versió fixa i després prova aquesta en paper. |
| 3R o nivell | Surts sencer. | Un contracte no es pot partir. Amb 1 MNQ no hi ha sortides parcials. |
| 17:30 | Si encara hi ets, tanques a mercat. | És un setup d'obertura. Després de dues hores, la tesi ja no val. |

**No moguis mai el stop més lluny.** Moure'l a favor (break-even, trail) està bé. Moure'l en contra converteix una pèrdua d'1R en una de 3R, i és el primer error que se'n porta els comptes petits.

## Altres setups curts per a l'obertura de NY

Tots cinc es fan entre les 15:30 i les 17:00, amb 1 MNQ, i passen pel mateix filtre de mida i les mateixes regles de risc. Són idees conegudes i públiques: **cap no està validada encara**. Totes es poden definir amb regles exactes, així que totes entraran al backtest d'1 minut. En paper, no en provis més de dos alhora. Si no, el diari es converteix en soroll.

| Setup | Tipus | Durada típica | Freqüència | Dificultat |
| --- | --- | --- | --- | --- |
| [Opening Range Breakout](#orb) | Seguir el moviment | 15–60 min | Gairebé cada dia | La més fàcil |
| [Ruptura fallida del rang](#orf) | Reversal | 10–45 min | 2–3/setmana | Mitjana |
| [Escombrada del màxim/mínim de la nit](#sweep) | Reversal | 10–45 min | 1–3/setmana | Mitjana |
| [Tancament de gap](#gap) | Reversal | 30–90 min | 1–2/setmana | Fàcil |
| [Pullback a VWAP](#vwap) | Seguir el moviment | 15–60 min | Dies de tendència | Mitjana |

### 1. Opening Range Breakout (ORB) de 15 minuts

Els primers minuts concentren l'ordre de molts participants. Quan el preu surt del rang inicial, sovint hi continua una estona.

- **Rang:** el màxim i el mínim de les 15:30–15:45.
- **Entrada:** Buy Stop 1 tick per sobre del màxim o Sell Stop 1 tick per sota del mínim. Només la primera ruptura del dia i només fins a les 16:30. Quan s'executa una, cancel·les l'altra (OCO).
- **Stop:** al punt mig del rang. Si el rang fa més de 2 vegades el teu stop màxim (\~44 punts), aquell dia no l'operes.
- **Sortida:** a 2R, o a mercat a les 17:00.
- **Variant:** el rang de 5 minuts (15:30–15:35). Hi ha un estudi publicat sobre ORB de 5 minuts al QQQ (Zarattini, Barbon i Aziz, 2023) que va trobar resultats positius. Ho comprovarem al backtest.

**Per què per començar:** és el més objectiu de tots. No has de decidir res a ull, així que serveix per entrenar l'execució i la disciplina mentre aprens a veure el reversal.

### 2. Ruptura fallida del rang

És la cara oposada de l'ORB: quan el preu surt del rang però no aconsegueix continuar, els que han entrat a la ruptura queden atrapats i el preu tendeix a creuar fins a l'altra banda.

- **Condició:** el preu supera el rang de 15 minuts en ≥ 4 punts i després una vela d'1 minut tanca de nou a dins del rang.
- **Entrada:** Stop Market 1 tick més enllà d'aquesta vela, cap a dins del rang.
- **Stop:** 1 tick més enllà de l'extrem de la ruptura.
- **Sortida:** a l'altra banda del rang o a 3R, el que arribi primer. A mercat a les 17:00.

### 3. Escombrada del màxim o mínim de la nit

Molts stops queden just per sobre del màxim de la nit (ONH) o per sota del mínim (ONL). Si a l'obertura el preu els toca i es gira de seguida, és un senyal de rebuig. És una versió més ràpida i estreta del reversal principal.

- **Condició:** entre les 15:30 i les 16:00, el preu supera l'ONH entre 2 i 15 punts i una vela d'1 minut tanca per sota de l'ONH (o al revés amb l'ONL).
- **Entrada:** Sell Stop 1 tick per sota d'aquesta vela.
- **Stop:** 1 tick per sobre del màxim de l'escombrada. Sol ser curt, i això ajuda amb la mida.
- **Sortida:** a 3R o al preu d'obertura de les 15:30, el que arribi primer. Break-even a 1R.

### 4. Tancament de gap

Quan el mercat obre lluny del tancament d'ahir sense una notícia gran, sovint torna cap a aquest tancament durant la primera hora. En els meus tests amb barres horàries, fer fade del gap va sortir lleugerament positiu a NQ i RTY, però no de manera concloent (t ≈ 1,5–1,9 en 2,4 anys).

- **Condició:** el gap entre l'obertura de les 15:30 i el tancament d'ahir (PDC) és d'entre el 0,3% i l'1% (uns 90–300 punts del NQ). Els gaps més grans solen venir de notícies, així que no els operis.
- **Entrada:** si la segona vela de 5 minuts trenca el mínim de la primera (amb un gap a l'alça), Sell Stop 1 tick per sota. Amb un gap a la baixa, és al revés.
- **Stop:** 1 tick per sobre del màxim del dia.
- **Sortida:** al PDC o a 3R, el que arribi primer. A mercat a les 17:00.

### 5. Pullback a VWAP en dia de tendència

El VWAP és el preu mitjà del dia ponderat pel volum. Molts algoritmes institucionals hi executen. Els dies de tendència clara, el primer retrocés fins al VWAP sol ser una entrada a favor del moviment.

- **Condició:** en els primers 30 minuts, el preu trenca el rang inicial i es manté sempre al mateix costat del VWAP.
- **Entrada:** el primer cop que el preu toca el VWAP, esperes una vela de confirmació a favor de la tendència i entres amb Stop 1 tick més enllà.
- **Stop:** 1 tick més enllà de l'extrem del pullback.
- **Sortida:** al màxim (o mínim) del dia o a 2R. Si el preu creua el VWAP amb força, surts.
- **Nota:** comprova que la teva versió de NinjaTrader té l'indicador VWAP.

**Com triar:** comença amb l'**ORB de 15 minuts** com a disciplina mecànica i el **reversal d'obertura** com a setup principal. Són complementaris: un segueix la ruptura i l'altre en busca el gir. Amb el diari sabràs quin s'adapta millor a la teva manera de mirar el mercat. Quan tinguem les dades d'1 minut, el backtest ens dirà quins tenen edge de debò a l'MNQ, i ens quedarem amb aquests.

## Risc i mida

Amb 2.000 € i 1 MNQ no tens marge per ajustar la mida: sempre és 1 contracte. Per tant, el que filtres és **l'amplada del stop**. Si el stop estructural és més ample que el teu risc màxim, l'operació no és per a tu, encara que el setup sigui perfecte.

### Calculadora: hi cap aquesta operació?

Compte (€) Canvi EUR/USD Risc màxim (%) Stop (punts NQ) Comissions anada i tornada ($)

Risc màxim**–**

Risc d'aquesta operació**–**

Target 3R**–**

Stop màxim permès**–**

–

Amb els valors per defecte, el stop màxim és d'uns 22 punts. Les barres d'1 minut del Nasdaq a l'obertura sovint mouen 15–40 punts. Per tant, una part dels setups no hi cabrà. Apunta-te'ls igualment al diari com a "setup no pres per mida": sabràs quants n'has deixat passar i com haurien acabat.

**Marge:** el marge intradia de NinjaTrader per a l'MNQ ronda els 100 $ (segons comparatives d'abril del 2026). Comprova el valor real a la plataforma, perquè el poden apujar sense avisar quan hi ha volatilitat. El marge només és la garantia. El que arrisques de veritat és la distància al stop. Abans del tancament, cal haver tancat la posició: si no, s'aplica el marge de nit (milers de $) i el broker pot liquidar-te la posició automàticament.

## Els números que has d'entendre

Amb 3R per operació, només et cal encertar **un 25%** per no perdre diners (sense comptar comissions). Si encertes un 30%, l'expectativa és de +0,2R per operació. Sembla poc, però té una conseqüència que el vídeo no explica: **tindràs ratxes llargues de pèrdues seguides**. Amb un 30% d'encert, perdre 8–12 operacions seguides en un any és normal i no vol dir que l'estratègia hagi deixat de funcionar. El simulador ho mostra amb 2.000 escenaris aleatoris.

### Simulador d'expectativa i ratxes

Encert (%) Benefici/risc (R) Risc per operació ($) Comissions per operació ($) Operacions/setmana Setmanes

Expectativa neta**–**

Encert mínim (break-even)**–**

Resultat mitjà**–**

Escenari dolent (5%)**–**

Ratxa perdedora típica**–**

Ratxa llarga (95%)**–**

Pitjor caiguda típica**–**

Probabilitat d'acabar en pèrdues**–**

Fixa't que, encara que l'estratègia funcioni, amb 50 operacions hi ha moltes probabilitats d'acabar en pèrdues només per mala sort. Per això no pots jutjar-la per unes quantes setmanes, ni en paper ni en real. I per això el backtest mecànic és important: et dona centenars d'operacions en lloc de dotzenes.

## NinjaTrader: com funciona

NinjaTrader té dues plataformes: **NinjaTrader Desktop** (l'antiga NinjaTrader 8, només per a Windows) i la **plataforma web**, al navegador, que és la que pots fer servir des de Debian. Oficialment la web només és compatible amb Windows i Mac, però en Linux amb Chrome sol funcionar. Els noms dels menús canvien una mica entre les dues. Els conceptes són els mateixos.

### Els conceptes bàsics

| Concepte | Què és | Què has de fer |
| --- | --- | --- |
| Compte sim | El compte de paper. Per defecte ve amb un saldo molt alt. | Crea'n o reinicia'n un amb **\~2.300 $**. Amb 50.000 $ ficticis no notes el pes de cada pèrdua. |
| Instrument i venciment | Els futurs vencen cada trimestre: març (H), juny (M), setembre (U) i desembre (Z). | Ara toca el MNQ Z26 (desembre de 2026, que venç el 18/12). Cap al 10/12 es passa al MNQ H27. Comprova sempre que no tens el NQ (10 vegades més gran) ni el MES. |
| Gràfics | Vela d'1 minut per entrar i de 15 minuts per al context. | Fes servir la sessió completa (ETH) per veure els màxims i mínims de la nit. Posa la zona horària en què pensis millor i no la canviïs. |
| Chart Trader | Permet operar des del gràfic: compres, vens i arrossegues les ordres. | És el que fa servir el vídeo, i el que t'hauria d'agradar més per a aquest setup. |
| Bracket / ATM | Una plantilla que connecta automàticament un stop i un target a l'entrada (OCO: si s'executa un, es cancel·la l'altre). | Crea una plantilla de 1 contracte amb el stop i el target 3R. Quan entris, arrossega el stop fins al seu lloc estructural i el target al 3R real. |
| Tipus d'ordre | **Market**: al preu que hi hagi. **Limit**: al teu preu o millor. **Stop Market**: s'activa quan el preu toca un nivell. | L'entrada del setup és un **Sell Stop Market** (o Buy Stop) 1 tick més enllà de la vela de confirmació. |
| DOM | La "escala" de preus amb les ordres a cada nivell. | No et cal per a aquest setup. Ignora'l al principi. |
| Tancar-ho tot | Un botó que tanca totes les posicions i cancel·la les ordres (Flatten / Close all). | Troba'l **avui**, abans de necessitar-lo, i practica'l en paper. |
| Market Replay | Reprodueix sessions passades a la velocitat que vulguis i hi pots operar com si fossin en directe. | És la millor eina per aprendre (vegeu el pla de 90 dies). A Desktop és la "Playback connection". A la web, busca "Market Replay" o pregunta al suport si el teu pla l'inclou. |

### Primera configuració (30 minuts)

1. Compte sim amb \~2.300 $ i MNQ Z26 a la llista d'instruments.
2. Un espai de treball amb dos gràfics: 15 minuts a l'esquerra i 1 minut a la dreta, amb sessió ETH.
3. Una plantilla de bracket "MNQ 3R" d'1 contracte.
4. Practica en paper 20 vegades seguides: posar un Sell Stop Market per sota d'una vela, arrossegar el stop i el target, cancel·lar l'ordre i tancar-ho tot. Ho has de poder fer en 10 segons sense pensar-hi.
5. Revisa la pàgina de comissions i marges del teu compte. El pla gratuït cobra 0,39 $ per costat en micros, més les taxes de la borsa i de liquidació. Comptant-ho tot, una operació (anada i tornada) surt per uns 1,7–2 $.

**Dades:** per a paper amb dades en temps real, NinjaTrader ofereix un període de prova i després cobra una petita quota mensual (el vídeo parla de \~4 $/mes). El compte que has obert és de l'entitat europea de NinjaTrader, així que comprova les condicions que t'apliquen a tu.

## Pla de 90 dies

L'objectiu no és guanyar diners en paper. És arribar a fer el setup **sempre igual** i reunir prou operacions per saber si funciona.

Setmana 1

### La plataforma

Fes la configuració de la secció anterior. Mira el mercat a la finestra cada dia sense operar i apunta en una llibreta on haurien estat els setups.

Setmanes 2–5

### Replay: volum d'operacions

Amb Market Replay, fes 3–4 sessions passades al dia (cadascuna és 1 hora i a velocitat x4 et porta 15 minuts). Objectiu: **60 operacions** apuntades, amb captura de pantalla. Aquí és on aprens a veure el setup.

Setmanes 6–12

### Paper en directe

Opera la finestra real cada dia que puguis, amb totes les regles. Objectiu: **30+ operacions** en directe i un compliment de les regles ≥ 90%. Cada diumenge fes la revisió setmanal.

Dia 90

### Decisió

Passes a real només si es compleix **tot** això:

- ≥ 90 operacions sumant les de replay i les de directe.
- Expectativa ≥ +0,15R després de comissions.
- Una caiguda màxima inferior a 10R.
- Compliment de les regles ≥ 90%.
- El backtest mecànic no les contradiu.

Si passes a real: 1 MNQ, un risc de ≤ 25 $ el primer mes i les mateixes regles. Si alguna cosa no es compleix, continues en paper o canvies el setup. És la decisió més barata que prendràs.

## Diari i revisió

### Què apuntar de cada operació

| Camp | Exemple |
| --- | --- |
| Data, hora, direcció | 14/10/2026 · 15:52 · curt |
| Nivell | ONH 31.100 |
| Checklist (5/5?) | 5/5 |
| Entrada, stop, target, punts de risc | 31.071,75 · 31.090,25 · 31.016,25 · 18,5 |
| Resultat en R | +3,0R (−0,05R de comissions) |
| Captura abans i després | Enllaç a la imatge |
| Regla trencada? | No / "he mogut el stop", "he entrat sense nivell"… |
| Estat emocional (1–5) | 3, havia dormit poc |

Apunta també els **setups que no has pres** (per mida, per notícia o per dubte) i com haurien acabat. Sense ells no saps si el filtre ajuda.

### Revisió setmanal (diumenge, 20 minuts)

- Quantes operacions, encert, R mitjana i R acumulada.
- % d'operacions que han complert les regles. És la mètrica que controles tu.
- La millor i la pitjor operació: què les diferencia?
- Hi ha un patró en les perdedores (hora, nivell, direcció, amplada del stop)?
- Un sol canvi per a la setmana vinent. Mai més d'un alhora.

## Per no cagar-la

- **No passis a real abans del dia 90**, ni encara que les dues primeres setmanes vagin molt bé. Unes quantes setmanes no diuen res (mira el simulador).
- **No moguis mai el stop més lluny** ni afegeixis contractes a una posició perdedora.
- **Atura't després de 2 pèrdues el mateix dia** o quan perdis −4% del compte. Atura't la setmana quan perdis −6%.
- **No operis per recuperar.** Després d'una pèrdua que et molesti, tanca la plataforma. L'operació de venjança és la que buida els comptes petits.
- **Revisa l'instrument i la quantitat abans de cada clic.** NQ en lloc de MNQ són 10 vegades més risc. Un 10 en lloc d'un 1, també.
- **No operis just quan surten les dades importants** de les 10:00 ET (16:00 a Espanya) els dies de calendari alt.
- **No canviïs de setup cada setmana.** Necessites unes 100 operacions del mateix setup per saber alguna cosa.
- **Evita els desafiaments de les prop firms, els grups de senyals i els "gurus"** que prometen X $ en Y dies. El mateix vídeo diu que menys del 5% supera els desafiaments.
- **No operis cansat, malalt ni amb pressa.** Si no estàs al 100% a les 15:30, avui no hi ha finestra.
- **Separa els diners:** els 2.000 € han de ser diners que pots perdre sencers sense que et canviï res.

## Recursos per estudiar

| Què | Per a què |
| --- | --- |
| *Trading in the Zone*, Mark Douglas | Psicologia: pensar en probabilitats i acceptar les pèrdues. Comença per aquí. |
| *Trade Your Way to Financial Freedom*, Van Tharp | Múltiples de R, expectativa i mida de posició. És la base matemàtica d'aquesta guia. |
| *Trading Price Action: Reversals*, Al Brooks | Llegir l'estructura de les barres i els girs, que és exactament aquest setup. És dens: llegeix-lo a trossos. |
| *The Daily Trading Coach*, Brett Steenbarger | Com fer servir el diari per millorar de debò. |
| *Fooled by Randomness*, Nassim Taleb | Per desconfiar dels resultats curts, propis i aliens. |
| [CME Group Education](https://www.cmegroup.com/education.html) | Cursos gratuïts sobre futurs, micros, venciments i marges, de la mateixa borsa. |
| [NinjaTrader: preus](https://ninjatrader.com/futures/blogs/how-much-does-ninjatrader-cost) i l'ajuda de la plataforma | Comissions, marges i com funciona cada eina. |
| [El vídeo original](https://www.youtube.com/watch?v=X2WcL536WYQ) | Torna-hi després de 30 operacions: hi veuràs coses que ara se t'escapen. |

## Empresa i impostos

### Separació de la feina

- Compte personal, correu personal i ordinador personal. No ho facis amb cap compte, dada ni eina de l'empresa.
- Mai ES, MES, SPX ni SPXW. Res que s'assembli a les estratègies de l'empresa.
- La finestra de les 15:30–16:30 cau en horari laboral a Espanya. Mira la política de trading personal de l'empresa i parla-ho si cal.

### Canvis d'hora

Els EUA i Europa canvien l'hora en dates diferents. Entre el **26 i el 30 d'octubre de 2026**, i entre el **15 i el 26 de març de 2027**, l'obertura és a les **14:30** hora d'Espanya, no a les 15:30.

### Impostos (Espanya)

Els guanys i les pèrdues amb futurs tributen com a guanys patrimonials a la base de l'estalvi de l'IRPF. Les pèrdues netes es poden compensar durant els quatre anys següents. Com que el broker és estranger, no et retindrà res i ho hauràs de declarar tu. Guarda els extractes anuals i, quan arribi el moment, consulta-ho amb un gestor.

Aquesta guia és material d'aprenentatge per a paper trading, no un consell financer. L'estratègia no està validada: el backtest mecànic sobre dades d'1 minut és el pas següent. Els futurs tenen palanquejament i pots perdre més del que hi poses.
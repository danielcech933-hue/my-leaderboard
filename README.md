# MARKET MILLIONAIRE — The Knowledge Exchange

Česká vědomostní show ve stylu „Chcete být milionářem“ s burzovním terminálovým vizuálem. Hra podporuje 2–9 hráčů, 15 kol, žolíky a milionovou pyramidu.

## Spuštění
```bash
npm install
npm run dev
```

## Multiplayer — důležité
Aktuální prototyp používá sdílený `localStorage` prostor pro synchronizaci více panelů ve stejném prohlížeči (například více oken na jednom zařízení). Pro skutečné hraní přes internet z různých zařízení je nutné doplnit Lovable Cloud / Supabase Realtime, serverově validované odpovědi a oddělit správné odpovědi od veřejných dat. UI a základní herní tok jsou připraveny pro toto napojení.

## Herní pravidla
- 15 otázek, 20 sekund na odpověď.
- Výhry jsou fiktivní herní kredity, nikoli skutečné peníze.
- Bezpečnostní hranice po 5. a 10. otázce.
- Žolíky: 50:50, nápověda a druhá šance.

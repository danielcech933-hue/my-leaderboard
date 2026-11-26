# MARKET MILLIONAIRE — The Knowledge Exchange

Česká vědomostní show ve stylu „Chcete být milionářem“ s burzovním terminálovým vizuálem. Hra je navržena pro 2–9 hráčů, 15 kol, tři žolíky a milionovou pyramidu.

## Spuštění
```bash
bun install
bun run dev
```

## Multiplayer přes Supabase
- Lobby a stav hry jsou uložené v Supabase Postgres databázi; živé aktualizace používají Supabase Realtime Broadcast.
- Prohlížeč používá oficiální Supabase JavaScript SDK v připnuté verzi 2.119.2, načítané z jsDelivr CDN. Není nutné instalovat další npm balíček.
- V repozitáři není žádný Supabase service-role ani secret key. Frontend používá pouze publishable key; databázové RPC funkce ověřují náhodný token hráče a ukládají pouze jeho SHA-256 hash.
- Tabulky `mm_rooms` a `mm_room_players` mají zapnuté RLS a přímý přístup klientů je zamítnutý. Pro herní operace slouží kontrolované RPC funkce.
- Každý hráč dostává vlastní realtime snapshot. Odpovědi ostatních hráčů zůstávají skryté až do odhalení kola.
- Hostitel musí zůstat online po celou hru; po ukončení hostitelské stránky hra přestane přijímat nové aktualizace.
- Místnosti mají expiraci 6 hodin. Přístupové tokeny zůstávají v lokálním úložišti prohlížeče.
- Realtime používá veřejné topic kanály s náhodnými token-derived názvy; klientské RPC navíc ověřují nezávislý token. Nejde o systém pro turnaje s finančními cenami ani proti technicky zdatnému cheatování: správné odpovědi jsou součástí klientského kvízu.

## Databázové migrace
- `supabase/migrations/20261126153717_market_millionaire_supabase_multiplayer.sql`
- `supabase/migrations/20261126153852_harden_market_millionaire_room_access_and_leave.sql`
- `supabase/migrations/20261126155026_fix_market_millionaire_jsonb_answer_count.sql`

## Herní pravidla
- 15 otázek z české všeobecné znalostní banky, bez opakování v rámci jedné hry.
- 20 sekund na odpověď, bezpečnostní hranice po 5. a 10. otázce.
- Žolíky: 50:50, nápověda a druhá šance.
- Všechny částky jsou fiktivní herní kredity, nikoli skutečné peníze.

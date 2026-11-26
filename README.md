# MARKET MILLIONAIRE — The Knowledge Exchange

Česká vědomostní show ve stylu „Chcete být milionářem“ s burzovním terminálovým vizuálem. Hra je navržena pro 2–9 hráčů, 15 kol, tři žolíky a milionovou pyramidu.

## Spuštění
```bash
bun install
bun run dev
```

## Bezplatný online multiplayer
- Místnosti používají PeerJS Cloud na `0.peerjs.com` pro navázání signalizace.
- Herní komunikace pak probíhá přímo mezi prohlížeči přes WebRTC data channels (šifrování DTLS poskytuje prohlížeč).
- Není potřeba Lovable kredit, Supabase projekt, API klíč ani vlastní placený server.
- Hostitel vytváří místnost a musí zůstat online po celou hru; po zavření jeho stránky místnost zanikne.
- PeerJS Cloud je sdílený bezplatný signalizační server. Dostupnost a síťové podmínky nejsou garantované; některé NAT/firewall sítě mohou vyžadovat TURN relay.
- Jde o neformální kvíz, ne bezpečnostně odolnou soutěž: správné odpovědi jsou součástí klientské aplikace a technicky zdatný hráč je může z kódu získat.

## Herní pravidla
- 15 otázek z české všeobecné znalostní banky, bez opakování v rámci jedné hry.
- 20 sekund na odpověď, bezpečnostní hranice po 5. a 10. otázce.
- Žolíky: 50:50, nápověda a druhá šance.
- Všechny částky jsou fiktivní herní kredity, nikoli skutečné peníze.

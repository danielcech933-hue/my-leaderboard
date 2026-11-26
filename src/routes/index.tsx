import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Check, ChevronRight, CircleHelp, Copy, Crown, Headphones, Lightbulb, LockKeyhole, Medal, RefreshCw, Shield, Sparkles, Timer, TrendingUp, Users, X } from "lucide-react";
import { toast } from "sonner";
import { QUESTIONS } from "@/lib/questions";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "MARKET MILLIONAIRE — The Knowledge Exchange" }, { name: "description", content: "Vědomostní investiční show pro 2–9 hráčů." }] }),
  component: MarketMillionaire,
});

type Player = { id: string; name: string; score: number; level: number; correct: number; elapsed: number; alive: boolean; lifelines: string[] };
type GameState = "lobby" | "question" | "reveal" | "finished";
type Room = { code: string; host: string; players: Player[]; round: number; state: GameState; questionIds: number[]; answers: Record<string, number>; deadline: number; used: number[] };
const PRIZES = [100,200,300,500,1000,2000,4000,8000,16000,32000,64000,125000,250000,500000,1000000];
const SAFETY = [4,9];
const fmt = (n:number) => new Intl.NumberFormat("cs-CZ").format(n);
const roomKey = (code:string) => `mm-room-${code}`;
const makeCode = () => Math.random().toString(36).slice(2,8).toUpperCase();
const pickQuestions = () => [...QUESTIONS].sort(()=>Math.random()-.5).slice(0,15).map(q=>q.id);
const playerKey = (id:string) => `mm-player-${id}`;

function MarketMillionaire() {
  const [room,setRoom] = useState<Room|null>(null);
  const [playerId,setPlayerId] = useState("");
  const [nickname,setNickname] = useState("");
  const [joinCode,setJoinCode] = useState("");
  const [view,setView] = useState<"home"|"lobby"|"game">("home");
  const [now,setNow] = useState(Date.now());
  const [selected,setSelected] = useState<number|null>(null);
  const [fifty,setFifty] = useState<number[]>([]);
  const [used,setUsed] = useState<string[]>([]);
  const [showHint,setShowHint] = useState(false);
  const [showRules,setShowRules] = useState(false);
  const [category,setCategory] = useState("mix");

  useEffect(()=>{ const t=window.setInterval(()=>setNow(Date.now()),250); return ()=>clearInterval(t); },[]);
  useEffect(()=>{
    const saved = localStorage.getItem("mm-session");
    if(saved){ try { const s=JSON.parse(saved); setPlayerId(s.playerId); setNickname(s.nickname); const raw=localStorage.getItem(roomKey(s.code)); if(raw){setRoom(JSON.parse(raw));setView(JSON.parse(raw).state==="lobby"?"lobby":"game");}} catch{} }
  },[]);
  useEffect(()=>{
    if(!room) return;
    localStorage.setItem(roomKey(room.code),JSON.stringify(room));
    const interval=window.setInterval(()=>{ const raw=localStorage.getItem(roomKey(room.code)); if(raw){ const next=JSON.parse(raw) as Room; setRoom(cur=>JSON.stringify(cur)!==JSON.stringify(next)?next:cur); } },500);
    const onStorage=(e:StorageEvent)=>{if(e.key===roomKey(room.code)&&e.newValue){setRoom(JSON.parse(e.newValue));}};
    window.addEventListener("storage",onStorage);
    return ()=>{clearInterval(interval);window.removeEventListener("storage",onStorage);};
  },[room?.code,room?.state,room?.round,room?.players,room?.answers,room?.deadline]);
  useEffect(()=>{
    if(!room||room.state!=="question") return;
    if(now>=room.deadline){ setRoom(cur=>cur&&cur.state==="question"?{...cur,state:"reveal"}:cur); }
  },[now,room?.state,room?.deadline]);

  const currentQuestion = useMemo(()=>room?QUESTIONS.find(q=>q.id===room.questionIds[room.round]):undefined,[room]);
  const me=room?.players.find(p=>p.id===playerId);
  const answered=room?.answers[playerId]!==undefined;
  const seconds=room?Math.max(0,Math.ceil((room.deadline-now)/1000)):0;
  const progress=room?Math.max(0,Math.min(100,(room.deadline-now)/20000*100)):0;
  const ranked=room?[...room.players].sort((a,b)=>b.level-a.level||b.correct-a.correct||a.elapsed-b.elapsed):[];
  const ticker=[["\u00a0PX","2 458,10","+0,84 %"],["DAX","19 432,50","+0,31 %"],["NASDAQ","21 108,30","−0,12 %"],["S&P 500","6 812,40","+0,26 %"],["EUR/CZK","24,18","+0,05 %"],["GOLD","4 126,70","−0,18 %"]];

  function updateRoom(fn:(r:Room)=>Room){ setRoom(cur=>cur?fn(cur):cur); }
  function createRoom(){
    if(!nickname.trim()){toast.error("Nejdřív zadej svou přezdívku.");return;}
    const id=crypto.randomUUID(); const code=makeCode();
    const r:Room={code,host:id,players:[{id,name:nickname.trim(),score:0,level:-1,correct:0,elapsed:0,alive:true,lifelines:[]}],round:0,state:"lobby",questionIds:pickQuestions(),answers:{},deadline:0,used:[]};
    localStorage.setItem(roomKey(code),JSON.stringify(r));localStorage.setItem("mm-session",JSON.stringify({playerId:id,nickname:nickname.trim(),code}));
    setPlayerId(id);setRoom(r);setView("lobby");
    toast.success("Místnost vytvořena. Pošli kód ostatním!");
  }
  function joinRoom(){
    if(!nickname.trim()||!joinCode.trim()){toast.error("Vyplň přezdívku i kód místnosti.");return;}
    const code=joinCode.trim().toUpperCase();const raw=localStorage.getItem(roomKey(code));
    if(!raw){toast.error("Místnost nebyla nalezena. Zkontroluj kód.");return;}
    const r=JSON.parse(raw) as Room;
    if(r.state!=="lobby"){toast.error("Tato hra už začala.");return;}
    if(r.players.length>=9){toast.error("Místnost je plná (max. 9 hráčů).");return;}
    if(r.players.some(p=>p.name.toLowerCase()===nickname.trim().toLowerCase())){toast.error("Tato přezdívka už v místnosti je.");return;}
    const id=crypto.randomUUID();r.players.push({id,name:nickname.trim(),score:0,level:-1,correct:0,elapsed:0,alive:true,lifelines:[]});
    localStorage.setItem(roomKey(code),JSON.stringify(r));localStorage.setItem("mm-session",JSON.stringify({playerId:id,nickname:nickname.trim(),code}));
    setPlayerId(id);setRoom(r);setView("lobby");toast.success("Připojeno k burzovnímu parketu.");
  }
  function startGame(){
    if(!room||room.host!==playerId)return;
    if(room.players.length<2){toast.error("Ke startu potřebujete alespoň 2 hráče.");return;}
    const r={...room,state:"question" as GameState,deadline:Date.now()+20000,answers:{},round:0};
    localStorage.setItem(roomKey(r.code),JSON.stringify(r));setRoom(r);setView("game");setSelected(null);
  }
  function submitAnswer(index:number){
    if(!room||answered||room.state!=="question"||!currentQuestion)return;
    const time=Math.max(0,20000-(room.deadline-Date.now()));
    const next={...room,answers:{...room.answers,[playerId]:index}};
    const allDone=next.players.every(p=>next.answers[p.id]!==undefined);
    if(allDone) next.state="reveal";
    setRoom(next);setSelected(index);
    const right=index===currentQuestion.answer;
    if(right){toast.success("Správně! Kurz tvých znalostí roste.");}else{toast.error("Tentokrát trh reagoval červeně.");}
    // Personal result is settled only during reveal. Store answer time in a transient local field.
    localStorage.setItem(`mm-time-${room.code}-${room.round}-${playerId}`,String(time));
  }
  function useLifeline(kind:"fifty"|"hint"|"second"){
    if(!room||!currentQuestion||!me||used.includes(kind))return;
    if(kind==="fifty"){
      const wrong=currentQuestion.options.map((_,i)=>i).filter(i=>i!==currentQuestion.answer);
      setFifty(wrong.sort(()=>Math.random()-.5).slice(0,2));setUsed(x=>[...x,kind]);
    }
    if(kind==="hint"){setShowHint(true);setUsed(x=>[...x,kind]);}
    if(kind==="second"){setUsed(x=>[...x,kind]);toast("Druhá šance aktivována: odpověď můžeš jednou změnit až do uzavření kola.");}
    updateRoom(r=>({...r,players:r.players.map(p=>p.id===playerId?{...p,lifelines:[...p.lifelines,kind]}:p)}));
  }
  function settleRound(){
    if(!room||room.host!==playerId||!currentQuestion)return;
    const nextPlayers=room.players.map(p=>{
      const answer=room.answers[p.id];const correct=answer===currentQuestion.answer;
      const t=Number(localStorage.getItem(`mm-time-${room.code}-${room.round}-${p.id}`)||20000);
      let level=p.level,score=p.score;
      if(correct){level=room.round;score=PRIZES[level];}
      else {level=SAFETY.some(n=>p.level>=n)?SAFETY.filter(n=>p.level>=n).at(-1)!:-1;score=level>=0?PRIZES[level]:0;}
      return {...p,level,score,correct:p.correct+(correct?1:0),elapsed:p.elapsed+t};
    });
    const nextRound=room.round+1;
    const next:Room={...room,players:nextPlayers,answers:{},state:nextRound>=15?"finished":"question",round:Math.min(14,nextRound),deadline:Date.now()+20000};
    localStorage.setItem(roomKey(room.code),JSON.stringify(next));setRoom(next);setSelected(null);setFifty([]);setShowHint(false);setUsed([]);
  }
  function resetHome(){setRoom(null);setView("home");setPlayerId("");setNickname("");localStorage.removeItem("mm-session");}
  function copyCode(){if(room){navigator.clipboard?.writeText(room.code);toast.success("Kód místnosti zkopírován.");}}

  return <main className="market-shell min-h-screen text-slate-100">
    <div className="ticker"><div className="ticker-track">{[...ticker,...ticker].map(([n,v,c],i)=><span key={i} className="ticker-item"><b>{n}</b><span>{v}</span><em className={c.startsWith("−")?"down":"up"}>{c}</em></span>)}</div></div>
    <header className="market-header">
      <div className="brand"><div className="brand-mark"><TrendingUp size={22}/></div><div><b>MARKET<span> MILLIONAIRE</span></b><small>THE KNOWLEDGE EXCHANGE</small></div></div>
      <div className="market-status"><span className="live-dot"/> TRH OTEVŘEN <i/> SIMULOVANÁ DATA <i/> CZK</div>
      <button className="icon-button" onClick={()=>setShowRules(true)} aria-label="Pravidla"><CircleHelp size={19}/></button>
    </header>

    {view==="home"&&<section className="home-layout">
      <div className="hero-copy"><div className="eyebrow"><span/> KNOWLEDGE IS YOUR CAPITAL</div><h1>Investuj do<br/><span>svých znalostí.</span></h1><p>Jediná správná odpověď tě dělí od milionu. Vybuduj své portfolio vědomostí, poraz ostatní tradery a ovládni burzu znalostí.</p>
        <div className="hero-stats"><div><strong>2–9</strong><small>HRÁČŮ</small></div><div><strong>15</strong><small>TRŽNÍCH KOL</small></div><div><strong>1 M</strong><small>JACKPOT</small></div></div>
      </div>
      <div className="terminal-card entry-card">
        <div className="card-top"><span><span className="live-dot"/> NEW SESSION</span><span className="muted-mono">MM-01 / CZ</span></div>
        <label className="field-label">TRADERSKÁ PŘEZDÍVKA</label><input className="market-input" value={nickname} maxLength={18} onChange={e=>setNickname(e.target.value)} placeholder="Např. Warren Buffett"/>
        <button className="primary-action" onClick={createRoom}><TrendingUp size={17}/> ZALOŽIT NOVOU MÍSTNOST <ChevronRight size={17}/></button>
        <div className="or-line"><span/> NEBO SE PŘIPOJ <span/></div>
        <label className="field-label">KÓD MÍSTNOSTI</label><div className="join-row"><input className="market-input code-input" value={joinCode} maxLength={6} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123"/><button className="join-action" onClick={joinRoom}>VSTOUPIT <ChevronRight size={16}/></button></div>
        <div className="secure-note"><Shield size={14}/> Až 9 hráčů · Zdarma · Bez registrace</div>
      </div>
      <div className="market-chart-panel"><div className="panel-heading"><span><Activity size={15}/> MARKET SENTIMENT</span><b className="positive">+8.42%</b></div><svg className="market-chart" viewBox="0 0 1000 115" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#23d69b" stopOpacity=".24"/><stop offset="1" stopColor="#23d69b" stopOpacity="0"/></linearGradient></defs><path d="M0 90 L40 84 65 89 95 68 125 73 155 58 188 66 220 43 250 49 285 29 320 36 350 23 388 40 425 31 465 45 500 25 535 35 575 17 610 24 650 36 690 19 730 30 770 12 805 27 845 18 880 32 920 12 955 19 1000 7 L1000 115 L0 115 Z" fill="url(#chartFill)"/><path d="M0 90 L40 84 65 89 95 68 125 73 155 58 188 66 220 43 250 49 285 29 320 36 350 23 388 40 425 31 465 45 500 25 535 35 575 17 610 24 650 36 690 19 730 30 770 12 805 27 845 18 880 32 920 12 955 19 1000 7" fill="none" stroke="#28d8a0" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/></svg><div className="chart-axis"><span>09:00</span><span>11:00</span><span>13:00</span><span>15:00</span><span>17:00</span></div></div>
    </section>}

    {view==="lobby"&&room&&<section className="game-layout"><div className="section-kicker"><span className="live-dot"/> PRE-MARKET SESSION</div><div className="room-heading"><div><h1>Čekáme na <span>otevření burzy.</span></h1><p>Pozvi ostatní tradery. Soutěž začíná, až se připojí alespoň dva.</p></div><div className="room-code" onClick={copyCode} role="button" tabIndex={0}><small>KÓD MÍSTNOSTI <Copy size={13}/></small><strong>{room.code}</strong></div></div>
      <div className="lobby-grid"><div className="terminal-card"><div className="card-top"><span><Users size={15}/> TRADERS FLOOR</span><b>{room.players.length}/9 ONLINE</b></div>{room.players.map((p,i)=><div className="player-row" key={p.id}><div className="player-avatar">{p.name.slice(0,2).toUpperCase()}</div><div className="player-meta"><b>{p.name}</b><small>{p.id===room.host?"HOST / SPRÁVCE":"TRADER"}</small></div>{p.id===room.host&&<Crown size={17} className="gold-icon"/>}<span className="online-pill">ONLINE</span></div>)}
        {Array.from({length:Math.max(0,9-room.players.length)}).slice(0,3).map((_,i)=><div className="player-row waiting" key={i}><div className="player-avatar">+</div><div className="player-meta"><b>Čekáme na tradera…</b><small>VOLNÉ MÍSTO</small></div></div>)}
        {room.host===playerId?<button className="primary-action start-action" onClick={startGame} disabled={room.players.length<2}>OTEVŘÍT BURZU A ZAČÍT <ChevronRight size={17}/></button>:<div className="waiting-info"><span className="pulse-ring"/> Čekáme, až hostitel spustí hru…</div>}
      </div><div className="terminal-card briefing"><div className="card-top"><span><BarChart3 size={15}/> SESSION BRIEFING</span></div><div className="brief-row"><small>FORMÁT</small><b>15 OTÁZEK / 4 MOŽNOSTI</b></div><div className="brief-row"><small>ČAS NA ODPOVĚĎ</small><b>20 SEKUND</b></div><div className="brief-row"><small>MAX. VÝNOS</small><b className="gold-text">1 000 000 KREDITOŮ</b></div><div className="brief-row"><small>ŽOLÍCI</small><b>3 NA HRÁČE</b></div><p className="fine-print">Všechny částky jsou fiktivní herní kredity. Nejde o skutečné investování ani hazard.</p></div></div>
    </section>}

    {view==="game"&&room&&currentQuestion&&<section className="game-layout">
      {room.state==="finished"?<div className="finish-card terminal-card"><div className="champion-crown"><Crown size={42}/></div><div className="section-kicker">MARKET CLOSED / FINÁLNÍ VÝSLEDKY</div><h1>Burza je <span>uzavřena.</span></h1><p>Vítězem dnešního obchodování se stává</p><div className="winner-name">{ranked[0]?.name}</div><div className="winner-prize">{fmt(ranked[0]?.score||0)} <small>KREDITŮ</small></div><div className="final-ranking">{ranked.map((p,i)=><div className="rank-row" key={p.id}><b>#{i+1}</b><span>{p.name}</span><strong>{fmt(p.score)}</strong><small>{p.correct}/15 SPRÁVNĚ</small></div>)}</div><button className="secondary-action" onClick={()=>{localStorage.removeItem(roomKey(room.code));resetHome();}}>NOVÁ HRA</button></div>:<><div className="game-topline"><div className="section-kicker"><span className="live-dot"/> LIVE TRADING SESSION</div><div className="round-chip">KOLO <b>{room.round+1}</b> / 15</div></div>
        <div className="game-grid"><div className="question-column">
          <div className="question-meta"><span>{currentQuestion.category.toUpperCase()} / MARKET INTELLIGENCE</span><span>LEVEL {room.round+1}</span></div>
          <div className="question-card terminal-card"><div className="question-index">Q{String(room.round+1).padStart(2,"0")} <span>—</span> INVESTIČNÍ ROZHODNUTÍ</div><h2>{currentQuestion.question}</h2>
            <div className="answer-grid">{currentQuestion.options.map((option,i)=>{const removed=fifty.includes(i);const isMine=room.answers[playerId]===i;const reveal=room.state==="reveal";const correct=reveal&&i===currentQuestion.answer;return <button key={i} disabled={answered||removed||room.state!=="question"} className={`answer-option ${isMine?"selected":""} ${correct?"correct":""} ${reveal&&isMine&&!correct?"incorrect":""} ${removed?"removed":""}`} onClick={()=>submitAnswer(i)}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{correct&&<Check size={18}/>}</button>;})}</div>
            {showHint&&<div className="hint-box"><Lightbulb size={16}/><span>{currentQuestion.hint||"Zaměř se na souvislosti a vyluč možnosti, které nedávají smysl."}</span></div>}
            {room.state==="question"?<div className="answer-status">{answered?<><Check size={15}/> ODPOVĚĎ ODESLÁNA · ČEKÁME NA OSTATNÍ</>:<><Timer size={15}/> TVŮJ ČAS NA ROZHODNUTÍ</>}</div>:<div className="reveal-status">{room.answers[playerId]===currentQuestion.answer?"✓ SPRÁVNÁ ODPOVĚĎ — TVŮJ KURZ ROSTE":"✕ NESPRÁVNÁ ODPOVĚĎ — TRH KORIGUJE"}</div>}
          </div>
          <div className="timer-panel"><div className="timer-label"><span><Activity size={14}/> ČAS DO UZAVŘENÍ KOLA</span><strong className={seconds<=5?"urgent":""}>{room.state==="question"?seconds+"s":"REVEAL"}</strong></div><div className="timer-track"><div className="timer-fill" style={{width:room.state==="question"?progress+"%":"0%"}}/></div></div>
          <div className="lifelines"><span className="field-label">INVESTIČNÍ NÁSTROJE</span><div className="lifeline-row"><button disabled={used.includes("fifty")||answered||room.state!=="question"} onClick={()=>useLifeline("fifty")}><span>½</span><b>50:50</b><small>VYŘADIT 2</small></button><button disabled={used.includes("hint")||answered||room.state!=="question"} onClick={()=>useLifeline("hint")}><Lightbulb/><b>NÁPOVĚDA</b><small>TRŽNÍ SIGNÁL</small></button><button disabled={used.includes("second")||room.state!=="question"} onClick={()=>useLifeline("second")}><RefreshCw/><b>DRUHÁ ŠANCE</b><small>JEDNOU ZA HRU</small></button></div></div>
          {room.state==="reveal"&&room.host===playerId&&<button className="primary-action next-action" onClick={settleRound}>{room.round===14?"ZOBRAZIT VÝSLEDKY":"DALŠÍ KOLO"} <ChevronRight size={17}/></button>}
        </div>
        <aside className="side-column"><div className="terminal-card ladder-card"><div className="card-top"><span><TrendingUp size={15}/> CESTA K MILIONU</span></div>{PRIZES.map((prize,i)=><div key={i} className={`ladder-row ${i===room.round?"active":""} ${SAFETY.includes(i)?"safe":""} ${i<room.round?"passed":""}`}><span>{String(i+1).padStart(2,"0")}</span><b>{fmt(prize)}</b>{SAFETY.includes(i)&&<LockKeyhole size={12}/>}</div>).reverse()}</div>
          <div className="terminal-card leaderboard-card"><div className="card-top"><span><Medal size={15}/> LIVE RANKING</span></div>{ranked.map((p,i)=><div className="mini-rank" key={p.id}><b className="rank-number">{i+1}</b><span>{p.name}</span><strong>{fmt(p.score)}</strong>{p.id===playerId&&<i>TY</i>}</div>)}</div>
          <div className="answered-card"><span>ODPOVĚDĚLO</span><strong>{Object.keys(room.answers).length}<small> / {room.players.length}</small></strong><div className="answer-dots">{room.players.map(p=><i key={p.id} className={room.answers[p.id]!==undefined?"done":""}/>)}</div></div>
        </aside></div></>}
    </section>}

    <footer className="market-footer"><span>MARKET MILLIONAIRE © 2026</span><span>SIMULATED MARKET DATA · EDUCATIONAL GAME ONLY</span><span>POWERED BY KNOWLEDGE <Sparkles size={12}/></span></footer>
    {showRules&&<div className="modal-backdrop" onClick={()=>setShowRules(false)}><div className="terminal-card rules-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowRules(false)}><X/></button><div className="section-kicker">HOW TO TRADE KNOWLEDGE</div><h2>Pravidla hry</h2><p>Každý hráč odpovídá na stejných 15 otázek. Na každou otázku máte 20 sekund. Správná odpověď vás posune na další příčku milionové pyramidy.</p><p>Po 5. a 10. otázce se nachází bezpečnostní hranice. Při chybě se vrátíte na poslední dosaženou bezpečnostní hranici.</p><p>Každý trader má tři žolíky: 50:50, nápovědu a druhou šanci. Každý lze použít jednou za hru.</p><p>Vítězí hráč s nejvyšším dosaženým výnosem. Všechny kredity jsou pouze herní.</p><button className="primary-action" onClick={()=>setShowRules(false)}>ROZUMÍM <Check size={16}/></button></div></div>}
  </main>;
}

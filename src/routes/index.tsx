/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, BarChart3, Check, ChevronRight, CircleHelp, Copy, Crown, Lightbulb, LockKeyhole, Medal, RefreshCw, Shield, Sparkles, Timer, TrendingUp, Users, X } from "lucide-react";
import { toast } from "sonner";
import { QUESTIONS, type Question } from "@/lib/questions";
import { loadPeerJS, PEER_OPTIONS, type PeerClient, type PeerDataConnection } from "@/lib/peer";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "MARKET MILLIONAIRE — The Knowledge Exchange" }, { name: "description", content: "Vědomostní investiční show pro 2–9 hráčů." }] }),
  component: MarketMillionaire,
});

type GameState = "lobby" | "question" | "reveal" | "finished";
type Player = {
  id: string;
  peerId: string;
  name: string;
  score: number;
  level: number;
  correct: number;
  elapsed: number;
  online: boolean;
  lifelines: string[];
  secondReady: boolean;
  secondRetryUsed: boolean;
};
type Room = {
  code: string;
  host: string;
  hostPeerId: string;
  players: Player[];
  round: number;
  state: GameState;
  questionIds: number[];
  answers: Record<string, number>;
  times: Record<string, number>;
  deadline: number;
  revealAt: number | null;
  answeredCount: number;
};
type WireMessage =
  | { type: "join"; playerId: string; name: string }
  | { type: "answer"; answer: number }
  | { type: "lifeline"; lifeline: "fifty" | "hint" | "second" }
  | { type: "state"; room: Room }
  | { type: "error"; message: string }
  | { type: "retry" };

const PRIZES = [100,200,300,500,1000,2000,4000,8000,16000,32000,64000,125000,250000,500000,1000000];
const SAFETY = [4,9];
const fmt = (n:number) => new Intl.NumberFormat("cs-CZ").format(n);
const roomPeerId = (code:string) => `mm-room-${code.toLowerCase()}`;
const roomStorageKey = (code:string) => `mm-room-state-${code}`;
const sessionStorageKey = "mm-session-v2";
const shuffle = <T,>(items:T[]) => [...items].sort(()=>Math.random()-.5);
const chooseQuestions = () => shuffle(QUESTIONS).slice(0,15).map(q=>q.id);

function MarketMillionaire() {
  const [room,setRoom] = useState<Room|null>(null);
  const [playerId,setPlayerId] = useState("");
  const [nickname,setNickname] = useState("");
  const [joinCode,setJoinCode] = useState("");
  const [view,setView] = useState<"home"|"lobby"|"game">("home");
  const [now,setNow] = useState(Date.now());
  const [fifty,setFifty] = useState<number[]>([]);
  const [showHint,setShowHint] = useState(false);
  const [showRules,setShowRules] = useState(false);
  const [retryPrompt,setRetryPrompt] = useState(false);
  const [connecting,setConnecting] = useState(false);
  const [connectionLabel,setConnectionLabel] = useState("PŘIPRAVENO");
  const peerRef = useRef<PeerClient|null>(null);
  const roomRef = useRef<Room|null>(null);
  const hostRef = useRef(false);
  const connectionsRef = useRef<Map<string,PeerDataConnection>>(new Map());
  const connectionPlayersRef = useRef<Map<string,string>>(new Map());
  const serverConnectionRef = useRef<PeerDataConnection|null>(null);

  const isHost = Boolean(room && playerId && room.host === playerId);
  const me = room?.players.find(p=>p.id===playerId);
  const currentQuestion = useMemo<Question|undefined>(()=>room?QUESTIONS.find(q=>q.id===room.questionIds[room.round]):undefined,[room?.questionIds,room?.round]);
  const answered = Boolean(room && room.answers[playerId] !== undefined);
  const seconds = room && room.state==="question" ? Math.max(0,Math.ceil((room.deadline-now)/1000)) : 0;
  const progress = room && room.state==="question" ? Math.max(0,Math.min(100,(room.deadline-now)/20000*100)) : 0;
  const ranked = room ? [...room.players].sort((a,b)=>b.level-a.level||b.correct-a.correct||a.elapsed-b.elapsed) : [];
  const ticker = [["PX","2 458,10","+0,84 %"],["DAX","19 432,50","+0,31 %"],["NASDAQ","21 108,30","−0,12 %"],["S&P 500","6 812,40","+0,26 %"],["EUR/CZK","24,18","+0,05 %"],["GOLD","4 126,70","−0,18 %"]];

  useEffect(()=>{const t=window.setInterval(()=>setNow(Date.now()),250);return()=>window.clearInterval(t);},[]);
  useEffect(()=>{const code=new URLSearchParams(window.location.search).get("room");if(code)setJoinCode(code.toUpperCase());},[]);
  useEffect(()=>{roomRef.current=room;},[room]);

  function sendRoomToConnection(conn:PeerDataConnection,next:Room,recipientId:string){
    if(!conn.open)return;
    const ownAnswer=next.answers[recipientId];
    const privateRoom:Room={...next,answers:ownAnswer===undefined?{}:{[recipientId]:ownAnswer},answeredCount:Object.keys(next.answers).length};
    try{conn.send({type:"state",room:privateRoom} satisfies WireMessage);}catch{ /* disconnected peer */ }
  }
  function broadcastHostRoom(next:Room){
    for(const [peerId,conn] of connectionsRef.current.entries()){
      const recipient=connectionPlayersRef.current.get(peerId);
      if(recipient)sendRoomToConnection(conn,next,recipient);
    }
  }
  function commitHostRoom(next:Room){
    const normalized={...next,answeredCount:Object.keys(next.answers).length};
    roomRef.current=normalized;
    setRoom(normalized);
    try{localStorage.setItem(roomStorageKey(normalized.code),JSON.stringify(normalized));}catch{/* storage can be disabled */}
    broadcastHostRoom(normalized);
  }
  function sendToHost(message:WireMessage){
    const conn=serverConnectionRef.current;
    if(conn?.open){try{conn.send(message);}catch{toast.error("Spojení s hostitelem se přerušilo.");}}
    else toast.error("Nejsi připojený k hostiteli.");
  }
  function closePeer(){
    try{peerRef.current?.destroy();}catch{/* ignore */}
    peerRef.current=null;
    connectionsRef.current.clear();
    connectionPlayersRef.current.clear();
    serverConnectionRef.current=null;
    hostRef.current=false;
  }

  function handleHostCommand(senderId:string,message:WireMessage,connection?:PeerDataConnection){
    const current=roomRef.current;
    if(!current||!hostRef.current||current.state!=="question"&&message.type!=="lifeline")return;
    const player=current.players.find(p=>p.id===senderId);
    if(!player)return;
    if(message.type==="lifeline"){
      if(current.state!=="question"||player.lifelines.includes(message.lifeline))return;
      const updated=current.players.map(p=>p.id===senderId?{
        ...p,
        lifelines:[...p.lifelines,message.lifeline],
        secondReady:message.lifeline==="second"?true:p.secondReady,
      }:p);
      commitHostRoom({...current,players:updated,revealAt:message.lifeline==="second"?null:current.revealAt});
      return;
    }
    if(message.type!=="answer"||!Number.isInteger(message.answer)||message.answer<0||message.answer>3)return;
    if(current.answers[senderId]!==undefined)return;
    const question=QUESTIONS.find(q=>q.id===current.questionIds[current.round]);
    if(!question)return;
    const updatedPlayers=current.players.map(p=>{
      if(p.id!==senderId)return p;
      if(p.secondReady&&message.answer!==question.answer&&!p.secondRetryUsed){
        if(connection?.open)connection.send({type:"retry"} satisfies WireMessage);
        else setRetryPrompt(true);
        return {...p,secondRetryUsed:true};
      }
      return {...p,secondReady:false,secondRetryUsed:false};
    });
    const updatedAnswers={...current.answers,[senderId]:message.answer};
    const updatedTimes={...current.times,[senderId]:Math.max(0,20000-Math.max(0,current.deadline-Date.now()))};
    const allAnswered=Object.keys(updatedAnswers).length>=current.players.length;
    commitHostRoom({...current,players:updatedPlayers,answers:updatedAnswers,times:updatedTimes,revealAt:allAnswered?Date.now()+2500:null});
  }

  function attachHostConnection(peerId:string,conn:PeerDataConnection){
    connectionsRef.current.set(peerId,conn);
    conn.on("data",(raw:unknown)=>{
      const msg=raw as WireMessage;
      if(msg.type==="join"){
        const current=roomRef.current;
        if(!current||!hostRef.current)return;
        if(!msg.playerId||!msg.name||msg.name.trim().length<1)return;
        const existing=current.players.find(p=>p.id===msg.playerId);
        if(!existing&&current.players.length>=9){
          conn.send({type:"error",message:"Místnost je plná (maximálně 9 hráčů)."} satisfies WireMessage);
          conn.close();
          return;
        }
        if(!existing&&current.state!=="lobby"){
          conn.send({type:"error",message:"Tato hra už začala."} satisfies WireMessage);
          conn.close();
          return;
        }
        const duplicate=current.players.find(p=>p.name.toLowerCase()===msg.name.trim().toLowerCase()&&p.id!==msg.playerId);
        if(duplicate){
          conn.send({type:"error",message:"Tato přezdívka už v místnosti je."} satisfies WireMessage);
          conn.close();
          return;
        }
        const newPlayers=existing
          ?current.players.map(p=>p.id===msg.playerId?{...p,peerId,online:true,name:msg.name.trim()}:p)
          :[...current.players,{id:msg.playerId,peerId,name:msg.name.trim(),score:0,level:-1,correct:0,elapsed:0,online:true,lifelines:[],secondReady:false,secondRetryUsed:false}];
        connectionPlayersRef.current.set(peerId,msg.playerId);
        const next={...current,players:newPlayers};
        commitHostRoom(next);
        sendRoomToConnection(conn,next,msg.playerId);
        return;
      }
      const sender=connectionPlayersRef.current.get(peerId);
      if(sender)handleHostCommand(sender,msg,conn);
    });
    conn.on("close",()=>{
      connectionsRef.current.delete(peerId);
      const token=connectionPlayersRef.current.get(peerId);
      connectionPlayersRef.current.delete(peerId);
      const current=roomRef.current;
      if(token&&current&&hostRef.current){
        const next={...current,players:current.players.map(p=>p.id===token?{...p,online:false}:p)};
        commitHostRoom(next);
      }
    });
    conn.on("error",()=>{ /* peer can retry by rejoining with its room code */ });
  }

  async function createRoom(){
    if(connecting)return;
    if(!nickname.trim()){toast.error("Nejdřív zadej svou přezdívku.");return;}
    setConnecting(true);setConnectionLabel("VYTVÁŘÍM SPOJENÍ");
    closePeer();
    try{
      const Peer=await loadPeerJS();
      let selectedCode="";
      let peer:PeerClient|null=null;
      for(let attempt=0;attempt<3;attempt++){
        const code=Math.random().toString(36).slice(2,10).toUpperCase();
        try{
          const candidate=new Peer(roomPeerId(code),PEER_OPTIONS);
          peer=candidate;
          await new Promise<void>((resolve,reject)=>{
            const timeout=window.setTimeout(()=>reject(new Error("Vypršel čas připojení k bezplatnému signalizačnímu serveru.")),12000);
            candidate.on("open",()=>{window.clearTimeout(timeout);selectedCode=code;resolve();});
            candidate.on("error",(error:{type?:string;message?:string})=>{
              if(error?.type==="unavailable-id"){window.clearTimeout(timeout);reject(new Error("Kód místnosti už někdo používá."));}
              else if(!selectedCode){window.clearTimeout(timeout);reject(new Error(error?.message||"Nepodařilo se připojit k PeerJS."));}
            });
          });
          break;
        }catch(error){
          candidateDestroy(peer);peer=null;
          if(attempt===2)throw error;
        }
      }
      if(!peer||!selectedCode)throw new Error("Místnost se nepodařilo vytvořit.");
      peerRef.current=peer;hostRef.current=true;
      const room:Room={
        code:selectedCode,host:"host",hostPeerId:roomPeerId(selectedCode),
        players:[{id:"host",peerId:roomPeerId(selectedCode),name:nickname.trim(),score:0,level:-1,correct:0,elapsed:0,online:true,lifelines:[],secondReady:false,secondRetryUsed:false}],
        round:0,state:"lobby",questionIds:chooseQuestions(),answers:{},times:{},deadline:0,revealAt:null,answeredCount:0,
      };
      setPlayerId("host");
      sessionStorage.setItem(sessionStorageKey,JSON.stringify({role:"host",code:selectedCode,playerId:"host",nickname:nickname.trim()}));
      peer.on("connection",(conn:PeerDataConnection)=>attachHostConnection(conn.peer,conn));
      commitHostRoom(room);setView("lobby");setConnectionLabel("HOST ONLINE");
      toast.success("Místnost vytvořena. Pošli ostatním kód nebo odkaz.");
    }catch(error){
      closePeer();setConnectionLabel("OFFLINE");
      toast.error(error instanceof Error?error.message:"Místnost se nepodařilo vytvořit.");
    }finally{setConnecting(false);}
  }
  function candidateDestroy(peer:PeerClient|null){try{peer?.destroy();}catch{/* ignore */}}

  async function joinRoom(){
    if(connecting)return;
    if(!nickname.trim()||!joinCode.trim()){toast.error("Vyplň přezdívku i kód místnosti.");return;}
    const code=joinCode.trim().toUpperCase();
    if(!/^[A-Z0-9]{6,10}$/.test(code)){toast.error("Kód musí obsahovat 6 až 10 písmen nebo číslic.");return;}
    setConnecting(true);setConnectionLabel("PŘIPOJUJI SE");
    closePeer();
    try{
      const Peer=await loadPeerJS();
      const peer=new Peer(undefined,PEER_OPTIONS);peerRef.current=peer;hostRef.current=false;
      const playerId=localStorage.getItem(`mm-player-${code}`)||crypto.randomUUID();
      localStorage.setItem(`mm-player-${code}`,playerId);
      setPlayerId(playerId);
      sessionStorage.setItem(sessionStorageKey,JSON.stringify({role:"guest",code,playerId,nickname:nickname.trim()}));
      peer.on("error",(error:{message?:string})=>{if(error?.message)toast.error(error.message);});
      peer.on("open",()=>{
        const conn=peer.connect(roomPeerId(code),{reliable:true,serialization:"json"});
        serverConnectionRef.current=conn;
        conn.on("open",()=>{
          conn.send({type:"join",playerId,name:nickname.trim()} satisfies WireMessage);
          setConnectionLabel("SPOJENO S HOSTITELEM");
        });
        conn.on("data",(raw:unknown)=>{
          const msg=raw as WireMessage;
          if(msg.type==="state"){
            roomRef.current=msg.room;setRoom(msg.room);setView(msg.room.state==="lobby"?"lobby":"game");
            setConnectionLabel("ONLINE");
          }else if(msg.type==="error"){
            toast.error(msg.message);closePeer();setConnectionLabel("OFFLINE");
          }else if(msg.type==="retry"){
            setRetryPrompt(true);toast.error("První odpověď nebyla správná. Máš ještě jeden pokus!");
          }
        });
        conn.on("close",()=>{setConnectionLabel("ODPOJENO");toast.error("Spojení s hostitelem se přerušilo.");});
        conn.on("error",()=>{setConnectionLabel("CHYBA SPOJENÍ");toast.error("Nepodařilo se navázat spojení s místností.");});
      });
    }catch(error){
      closePeer();setConnectionLabel("OFFLINE");
      toast.error(error instanceof Error?error.message:"Připojení se nezdařilo.");
    }finally{setConnecting(false);}
  }

  function startGame(){
    const current=roomRef.current;
    if(!current||!hostRef.current)return;
    if(current.players.length<2){toast.error("Ke startu potřebujete alespoň 2 hráče.");return;}
    commitHostRoom({...current,state:"question",deadline:Date.now()+20000,revealAt:null,answers:{},times:{},round:0});
    setView("game");setFifty([]);setShowHint(false);setRetryPrompt(false);
  }
  function submitAnswer(index:number){
    const current=roomRef.current;
    if(!current||current.state!=="question"||!currentQuestion||answered)return;
    setRetryPrompt(false);
    const msg:WireMessage={type:"answer",answer:index};
    if(hostRef.current)handleHostCommand(playerId,msg);
    else sendToHost(msg);
  }
  function activateLifeline(kind:"fifty"|"hint"|"second"){
    if(!room||!me||answered||room.state!=="question"||me.lifelines.includes(kind))return;
    if(kind==="fifty"){
      if(!currentQuestion)return;
      const wrong=currentQuestion.options.map((_,i)=>i).filter(i=>i!==currentQuestion.answer);
      setFifty(shuffle(wrong).slice(0,2));
    }
    if(kind==="hint")setShowHint(true);
    if(kind==="second")toast("Druhá šance aktivována. Při chybné první odpovědi dostaneš ještě jeden pokus.");
    const msg:WireMessage={type:"lifeline",lifeline:kind};
    if(hostRef.current)handleHostCommand(playerId,msg);
    else sendToHost(msg);
  }
  function settleRound(){
    const current=roomRef.current;
    if(!current||!hostRef.current||!currentQuestion)return;
    const nextPlayers=current.players.map(p=>{
      const correct=current.answers[p.id]===currentQuestion.answer;
      const elapsed=current.times[p.id]??20000;
      let level=p.level,score=p.score;
      if(correct){level=current.round;score=PRIZES[level];}
      else{level=SAFETY.filter(n=>p.level>=n).at(-1)??-1;score=level>=0?PRIZES[level]:0;}
      return {...p,level,score,correct:p.correct+(correct?1:0),elapsed:p.elapsed+elapsed,secondReady:false,secondRetryUsed:false};
    });
    const nextRound=current.round+1;
    const next:Room={...current,players:nextPlayers,answers:{},times:{},state:nextRound>=15?"finished":"question",round:Math.min(14,nextRound),deadline:nextRound>=15?0:Date.now()+20000,revealAt:null};
    commitHostRoom(next);setFifty([]);setShowHint(false);setRetryPrompt(false);
  }
  function copyRoomLink(){
    if(!room)return;
    const url=new URL(window.location.href);url.searchParams.set("room",room.code);
    navigator.clipboard?.writeText(url.toString()).then(()=>toast.success("Odkaz na místnost zkopírován.")).catch(()=>toast.error("Kopírování se nepodařilo."));
  }
  function leaveRoom(){
    closePeer();roomRef.current=null;setRoom(null);setView("home");setPlayerId("");setRetryPrompt(false);setFifty([]);setShowHint(false);sessionStorage.removeItem(sessionStorageKey);setConnectionLabel("PŘIPRAVENO");
  }

  useEffect(()=>{
    if(!room||!isHost||room.state!=="question")return;
    if(now>=room.deadline||(room.revealAt!==null&&now>=room.revealAt)){
      commitHostRoom({...room,state:"reveal",revealAt:null});
    }
  },[now,room?.state,room?.deadline,room?.revealAt,isHost]);

  useEffect(()=>()=>{try{peerRef.current?.destroy();}catch{/* ignore */}},[]);

  return <main className="market-shell min-h-screen text-slate-100">
    <div className="ticker"><div className="ticker-track">{[...ticker,...ticker].map(([n,v,c],i)=><span key={i} className="ticker-item"><b>{n}</b><span>{v}</span><em className={c.startsWith("−")?"down":"up"}>{c}</em></span>)}</div></div>
    <header className="market-header">
      <div className="brand"><div className="brand-mark"><TrendingUp size={22}/></div><div><b>MARKET<span> MILLIONAIRE</span></b><small>THE KNOWLEDGE EXCHANGE</small></div></div>
      <div className="market-status"><span className="live-dot"/>{connectionLabel}<i/> PEER-TO-PEER <i/> CZK</div>
      <button className="icon-button" onClick={()=>setShowRules(true)} aria-label="Pravidla"><CircleHelp size={19}/></button>
    </header>

    {view==="home"&&<section className="home-layout">
      <div className="hero-copy"><div className="eyebrow"><span/> KNOWLEDGE IS YOUR CAPITAL</div><h1>Investuj do<br/><span>svých znalostí.</span></h1><p>Jediná správná odpověď tě dělí od milionu. Vybuduj své portfolio vědomostí, poraz ostatní tradery a ovládni burzu znalostí.</p>
        <div className="hero-stats"><div><strong>2–9</strong><small>HRÁČŮ</small></div><div><strong>15</strong><small>TRŽNÍCH KOL</small></div><div><strong>1 M</strong><small>JACKPOT</small></div></div>
      </div>
      <div className="terminal-card entry-card">
        <div className="card-top"><span><span className="live-dot"/> NEW SESSION</span><span className="muted-mono">MM-01 / CZ</span></div>
        <label className="field-label">TRADERSKÁ PŘEZDÍVKA</label><input className="market-input" value={nickname} maxLength={18} onChange={e=>setNickname(e.target.value)} placeholder="Např. Warren Buffett"/>
        <button className="primary-action" onClick={createRoom} disabled={connecting}>{connecting?"NAVAZUJI SPOJENÍ…": "ZALOŽIT NOVOU MÍSTNOST"} <ChevronRight size={17}/></button>
        <div className="or-line"><span/> NEBO SE PŘIPOJ <span/></div>
        <label className="field-label">KÓD MÍSTNOSTI</label><div className="join-row"><input className="market-input code-input" value={joinCode} maxLength={10} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="AB12CD34"/><button className="join-action" onClick={joinRoom} disabled={connecting}>{connecting?"…":"VSTOUPIT"} <ChevronRight size={16}/></button></div>
        <div className="secure-note"><Shield size={14}/> Až 9 hráčů · Peer-to-peer · Bez placeného backendu</div>
        <p className="fine-print">Hostitel musí zůstat připojený po celou hru. Bezplatný signalizační server PeerJS slouží jen k navázání spojení; hra běží mezi prohlížeči.</p>
      </div>
      <div className="market-chart-panel"><div className="panel-heading"><span><Activity size={15}/> MARKET SENTIMENT</span><b className="positive">+8.42%</b></div><svg className="market-chart" viewBox="0 0 1000 115" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#23d69b" stopOpacity=".24"/><stop offset="1" stopColor="#23d69b" stopOpacity="0"/></linearGradient></defs><path d="M0 90 L40 84 65 89 95 68 125 73 155 58 188 66 220 43 250 49 285 29 320 36 350 23 388 40 425 31 465 45 500 25 535 35 575 17 610 24 650 36 690 19 730 30 770 12 805 27 845 18 880 32 920 12 955 19 1000 7 L1000 115 L0 115 Z" fill="url(#chartFill)"/><path d="M0 90 L40 84 65 89 95 68 125 73 155 58 188 66 220 43 250 49 285 29 320 36 350 23 388 40 425 31 465 45 500 25 535 35 575 17 610 24 650 36 690 19 730 30 770 12 805 27 845 18 880 32 920 12 955 19 1000 7" fill="none" stroke="#28d8a0" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/></svg><div className="chart-axis"><span>09:00</span><span>11:00</span><span>13:00</span><span>15:00</span><span>17:00</span></div></div>
    </section>}

    {view==="lobby"&&room&&<section className="game-layout"><div className="section-kicker"><span className="live-dot"/> PRE-MARKET SESSION</div><div className="room-heading"><div><h1>Čekáme na <span>otevření burzy.</span></h1><p>Pozvi ostatní tradery. Soutěž začíná, až se připojí alespoň dva.</p></div><div className="room-code" onClick={copyRoomLink} role="button" tabIndex={0}><small>KÓD / KLIKNI PRO ODKAZ <Copy size={13}/></small><strong>{room.code}</strong></div></div>
      <div className="lobby-grid"><div className="terminal-card"><div className="card-top"><span><Users size={15}/> TRADERS FLOOR</span><b>{room.players.filter(p=>p.online).length}/{room.players.length} ONLINE · MAX 9</b></div>{room.players.map(p=><div className="player-row" key={p.id}><div className="player-avatar">{p.name.slice(0,2).toUpperCase()}</div><div className="player-meta"><b>{p.name}</b><small>{p.id===room.host?"HOST / SPRÁVCE":"TRADER"}</small></div>{p.id===room.host&&<Crown size={17} className="gold-icon"/>}<span className={p.online?"online-pill":"offline-pill"}>{p.online?"ONLINE":"OFFLINE"}</span></div>)}
        {Array.from({length:Math.max(0,Math.min(3,9-room.players.length))}).map((_,i)=><div className="player-row waiting" key={i}><div className="player-avatar">+</div><div className="player-meta"><b>Čekáme na tradera…</b><small>VOLNÉ MÍSTO</small></div></div>)}
        {isHost?<button className="primary-action start-action" onClick={startGame} disabled={room.players.length<2}>OTEVŘÍT BURZU A ZAČÍT <ChevronRight size={17}/></button>:<div className="waiting-info"><span className="pulse-ring"/> Čekáme, až hostitel spustí hru…</div>}
      </div><div className="terminal-card briefing"><div className="card-top"><span><BarChart3 size={15}/> SESSION BRIEFING</span></div><div className="brief-row"><small>FORMÁT</small><b>15 OTÁZEK / 4 MOŽNOSTI</b></div><div className="brief-row"><small>ČAS NA ODPOVĚĎ</small><b>20 SEKUND</b></div><div className="brief-row"><small>MAX. VÝNOS</small><b className="gold-text">1 000 000 KREDITŮ</b></div><div className="brief-row"><small>ŽOLÍCI</small><b>3 NA HRÁČE</b></div><p className="fine-print">Všechny částky jsou fiktivní herní kredity. Hostitel musí zůstat online. Odpovědi jsou před odhalením skryté v uživatelském rozhraní.</p><button className="secondary-action leave-action" onClick={leaveRoom}>ODEJÍT Z MÍSTNOSTI</button></div></div>
    </section>}

    {view==="game"&&room&&currentQuestion&&<section className="game-layout">
      {room.state==="finished"?<div className="finish-card terminal-card"><div className="champion-crown"><Crown size={42}/></div><div className="section-kicker">MARKET CLOSED / FINÁLNÍ VÝSLEDKY</div><h1>Burza je <span>uzavřena.</span></h1><p>Vítězem dnešního obchodování se stává</p><div className="winner-name">{ranked[0]?.name}</div><div className="winner-prize">{fmt(ranked[0]?.score||0)} <small>KREDITŮ</small></div><div className="final-ranking">{ranked.map((p,i)=><div className="rank-row" key={p.id}><b>#{i+1}</b><span>{p.name}</span><strong>{fmt(p.score)}</strong><small>{p.correct}/15 SPRÁVNĚ</small></div>)}</div>{isHost&&<button className="secondary-action" onClick={leaveRoom}>NOVÁ HRA</button>}</div>:<><div className="game-topline"><div className="section-kicker"><span className="live-dot"/> LIVE TRADING SESSION</div><div className="round-chip">KOLO <b>{room.round+1}</b> / 15</div></div>
        <div className="game-grid"><div className="question-column">
          <div className="question-meta"><span>{currentQuestion.category.toUpperCase()} / MARKET INTELLIGENCE</span><span>LEVEL {room.round+1}</span></div>
          <div className="question-card terminal-card"><div className="question-index">Q{String(room.round+1).padStart(2,"0")} <span>—</span> INVESTIČNÍ ROZHODNUTÍ</div><h2>{currentQuestion.question}</h2>
            <div className="answer-grid">{currentQuestion.options.map((option,i)=>{const removed=fifty.includes(i);const isMine=room.answers[playerId]===i;const reveal=room.state==="reveal";const correct=reveal&&i===currentQuestion.answer;return <button key={i} disabled={answered||removed||room.state!=="question"} className={`answer-option ${isMine?"selected":""} ${correct?"correct":""} ${reveal&&isMine&&!correct?"incorrect":""} ${removed?"removed":""}`} onClick={()=>submitAnswer(i)}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{correct&&<Check size={18}/>}</button>;})}</div>
            {showHint&&<div className="hint-box"><Lightbulb size={16}/><span>{currentQuestion.hint||"Zaměř se na souvislosti a vyluč možnosti, které nedávají smysl."}</span></div>}
            {retryPrompt&&<div className="hint-box"><RefreshCw size={16}/><span>První odpověď nebyla správná. Vyber ještě jednou — tento pokus už rozhodne.</span></div>}
            {room.state==="question"?<div className="answer-status">{answered?<><Check size={15}/> ODPOVĚĎ ODESLÁNA · ČEKÁME NA OSTATNÍ</>:retryPrompt?<>DRUHÝ POKUS — ROZHODNI SE</>:<><Timer size={15}/> TVŮJ ČAS NA ROZHODNUTÍ</>}</div>:<div className="reveal-status">{room.answers[playerId]===currentQuestion.answer?"✓ SPRÁVNÁ ODPOVĚĎ — TVŮJ KURZ ROSTE":"✕ NESPRÁVNÁ ODPOVĚĎ — TRH KORIGUJE"}</div>}
          </div>
          <div className="timer-panel"><div className="timer-label"><span><Activity size={14}/> ČAS DO UZAVŘENÍ KOLA</span><strong className={seconds<=5?"urgent":""}>{room.state==="question"?seconds+"s":"REVEAL"}</strong></div><div className="timer-track"><div className="timer-fill" style={{width:room.state==="question"?progress+"%":"0%"}}/></div></div>
          <div className="lifelines"><span className="field-label">INVESTIČNÍ NÁSTROJE</span><div className="lifeline-row"><button disabled={me?.lifelines.includes("fifty")||answered||room.state!=="question"} onClick={()=>activateLifeline("fifty")}><span>½</span><b>50:50</b><small>VYŘADIT 2</small></button><button disabled={me?.lifelines.includes("hint")||answered||room.state!=="question"} onClick={()=>activateLifeline("hint")}><Lightbulb/><b>NÁPOVĚDA</b><small>TRŽNÍ SIGNÁL</small></button><button disabled={me?.lifelines.includes("second")||answered||room.state!=="question"} onClick={()=>activateLifeline("second")}><RefreshCw/><b>DRUHÁ ŠANCE</b><small>JEDNOU ZA HRU</small></button></div></div>
          {room.state==="reveal"&&isHost&&<button className="primary-action next-action" onClick={settleRound}>{room.round===14?"ZOBRAZIT VÝSLEDKY":"DALŠÍ KOLO"} <ChevronRight size={17}/></button>}
        </div>
        <aside className="side-column"><div className="terminal-card ladder-card"><div className="card-top"><span><TrendingUp size={15}/> CESTA K MILIONU</span></div>{PRIZES.map((prize,i)=><div key={i} className={`ladder-row ${i===room.round?"active":""} ${SAFETY.includes(i)?"safe":""} ${i<room.round?"passed":""}`}><span>{String(i+1).padStart(2,"0")}</span><b>{fmt(prize)}</b>{SAFETY.includes(i)&&<LockKeyhole size={12}/>}</div>).reverse()}</div>
          <div className="terminal-card leaderboard-card"><div className="card-top"><span><Medal size={15}/> LIVE RANKING</span></div>{ranked.map((p,i)=><div className="mini-rank" key={p.id}><b className="rank-number">{i+1}</b><span>{p.name}</span><strong>{fmt(p.score)}</strong>{p.id===playerId&&<i>TY</i>}</div>)}</div>
          <div className="answered-card"><span>ODPOVĚDĚLO</span><strong>{room.answeredCount}<small> / {room.players.length}</small></strong><div className="answer-dots">{room.players.map(p=><i key={p.id} className={room.answers[p.id]!==undefined||(!isHost&&answered&&p.id===playerId)?"done":""}/>)}</div></div>
        </aside></div></>}
    </section>}

    <footer className="market-footer"><span>MARKET MILLIONAIRE © 2026</span><span>PEER-TO-PEER · SIMULATED MARKET DATA</span><span>POWERED BY KNOWLEDGE <Sparkles size={12}/></span></footer>
    {showRules&&<div className="modal-backdrop" onClick={()=>setShowRules(false)}><div className="terminal-card rules-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowRules(false)}><X/></button><div className="section-kicker">HOW TO TRADE KNOWLEDGE</div><h2>Pravidla hry</h2><p>Každý hráč odpovídá na stejných 15 otázek. Na každou otázku máte 20 sekund. Správná odpověď vás posune na další příčku milionové pyramidy.</p><p>Po 5. a 10. otázce se nachází bezpečnostní hranice. Při chybě se vrátíte na poslední dosaženou bezpečnostní hranici.</p><p>Každý trader má tři žolíky: 50:50, nápovědu a druhou šanci. Druhá šance se aktivuje před odpovědí a při špatném prvním pokusu otevře ještě jeden pokus.</p><p>Vítězí hráč s nejvyšším dosaženým výnosem. Všechny kredity jsou pouze herní. Hostitel musí zůstat online po celou dobu hry.</p><button className="primary-action" onClick={()=>setShowRules(false)}>ROZUMÍM <Check size={16}/></button></div></div>}
  </main>;
}

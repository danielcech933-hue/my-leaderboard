/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, BarChart3, Check, ChevronRight, CircleHelp, Copy, Crown, Lightbulb, LockKeyhole, Medal, RefreshCw, Shield, Sparkles, Timer, TrendingUp, Users, X } from "lucide-react";
import { toast } from "sonner";
import { QUESTIONS, type Question } from "@/lib/questions";
import { getSupabaseClient, type RealtimeChannelLike, type SupabaseClientLike } from "@/lib/supabase";

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
type GameAction =
  | { type: "answer"; answer: number }
  | { type: "lifeline"; lifeline: "fifty" | "hint" | "second" };

const PRIZES = [100,200,300,500,1000,2000,4000,8000,16000,32000,64000,125000,250000,500000,1000000];
const SAFETY = [4,9];
const fmt = (n:number) => new Intl.NumberFormat("cs-CZ").format(n);
const sessionStorageKey = "mm-session-v3";
const playerTokenKey = (code:string) => `mm-token-${code}`;
const playerIdKey = (code:string) => `mm-player-${code}`;
const shuffle = <T,>(items:T[]) => [...items].sort(()=>Math.random()-.5);
const chooseQuestions = () => shuffle(QUESTIONS).slice(0,15).map(q=>q.id);
const makeRoomCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(values, value => alphabet[value % alphabet.length]).join("");
};
const makePlayerToken = () => crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
async function hashPlayerToken(token:string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
}
function readBroadcast(raw:unknown):Record<string,unknown> {
  if(typeof raw==="object" && raw!==null && "payload" in raw) {
    const payload=(raw as {payload?:unknown}).payload;
    if(typeof payload==="object" && payload!==null)return payload as Record<string,unknown>;
  }
  return typeof raw==="object" && raw!==null ? raw as Record<string,unknown> : {};
}

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
  const roomRef = useRef<Room|null>(null);
  const playerIdRef = useRef("");
  const playerTokenRef = useRef("");
  const roomCodeRef = useRef("");
  const channelRef = useRef<RealtimeChannelLike|null>(null);
  const supabaseRef = useRef<SupabaseClientLike|null>(null);
  const hostRef = useRef(false);
  const hostUpdateQueueRef = useRef<Promise<void>>(Promise.resolve());
  const hostRevisionRef = useRef(0);

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
  useEffect(()=>{playerIdRef.current=playerId;},[playerId]);
  useEffect(()=>{setFifty([]);setShowHint(false);setRetryPrompt(false);},[room?.round]);
  useEffect(()=>{
    if(me?.secondReady&&me.secondRetryUsed)setRetryPrompt(true);
  },[me?.secondReady,me?.secondRetryUsed]);

  function closeRealtime(){
    const channel=channelRef.current;
    channelRef.current=null;
    if(channel&&supabaseRef.current)void supabaseRef.current.removeChannel(channel);
    hostRef.current=false;
  }
  function resetLocalRoom(message?:string){
    closeRealtime();
    roomRef.current=null;playerIdRef.current="";playerTokenRef.current="";roomCodeRef.current="";
    setRoom(null);setPlayerId("");setView("home");setRetryPrompt(false);setFifty([]);setShowHint(false);
    sessionStorage.removeItem(sessionStorageKey);setConnectionLabel("PŘIPRAVENO");
    if(message)toast.error(message);
  }
  function applyRoomSnapshot(next:Room){
    const localId=playerIdRef.current;
    if(!next||next.code!==roomCodeRef.current||!next.players?.some(p=>p.id===localId))return;
    roomRef.current=next;setRoom(next);
    setView(next.state==="lobby"?"lobby":"game");
    setConnectionLabel(hostRef.current?"HOST ONLINE":"SUPABASE ONLINE");
  }
  async function subscribeRoomChannel(code:string,token:string){
    const client=await getSupabaseClient();
    supabaseRef.current=client;
    const tokenHash=await hashPlayerToken(token);
    const topic=\`mm:\${code}:\${tokenHash}\`;
    const channel=client.channel(topic,{config:{broadcast:{ack:true}}});
    channel
      .on("broadcast",{event:"state"},(raw:unknown)=>{
        const message=readBroadcast(raw);
        if(message.type==="state"&&message.room)applyRoomSnapshot(message.room as Room);
      })
      .on("broadcast",{event:"action"},(raw:unknown)=>{
        const message=readBroadcast(raw);
        if(message.type==="action"&&typeof message.playerId==="string"&&message.action&&hostRef.current){
          void handleHostCommand(message.playerId,message.action as GameAction);
        }
      })
      .on("broadcast",{event:"closed"},(raw:unknown)=>{
        const message=readBroadcast(raw);
        resetLocalRoom(typeof message.message==="string"?message.message:"Hostitel ukončil místnost.");
      });

    await new Promise<void>((resolve,reject)=>{
      let settled=false;
      const timeout=window.setTimeout(()=>{
        if(settled)return;
        settled=true;
        reject(new Error("Supabase Realtime neodpověděl. Zkontroluj připojení k internetu a nastavení Realtime v Supabase."));
      },15000);
      channel.subscribe((status,error)=>{
        if(settled)return;
        if(status==="SUBSCRIBED"){
          settled=true;window.clearTimeout(timeout);resolve();
        }else if(status==="CHANNEL_ERROR"||status==="TIMED_OUT"||status==="CLOSED"){
          settled=true;window.clearTimeout(timeout);
          const detail=error&&"message" in error?String(error.message):"";
          reject(new Error(\`Supabase Realtime: \${status}.\${detail?" "+detail:""}\`));
        }
      });
    }).catch(async error=>{
      await client.removeChannel(channel);
      throw error;
    });
    return channel;
  }

  async function commitHostRoom(next:Room){
    const normalized={...next,answeredCount:Object.keys(next.answers).length};
    roomRef.current=normalized;setRoom(normalized);
    const revision=++hostRevisionRef.current;
    const queued=hostUpdateQueueRef.current.catch(()=>{}).then(async()=>{
      const client=await getSupabaseClient();
      supabaseRef.current=client;
      const {data,error}=await client.rpc("mm_host_update_room",{
        p_code:normalized.code,
        p_player_id:"host",
        p_token:playerTokenRef.current,
        p_room:normalized as unknown as Record<string,unknown>,
      });
      if(error){
        if(revision===hostRevisionRef.current)toast.error(\`Uložení hry do Supabase selhalo: \${error.message}\`);
        return;
      }
      if(revision===hostRevisionRef.current&&data){
        const confirmed=data as unknown as Room;
        const latest=roomRef.current;
        if(latest&&latest.code===confirmed.code){
          const merged={...latest,players:confirmed.players,answeredCount:latest.answeredCount};
          roomRef.current=merged;setRoom(merged);
        }
      }
    });
    hostUpdateQueueRef.current=queued;
    await queued;
  }

  async function sendToHost(message:GameAction){
    const current=roomRef.current;
    const token=playerTokenRef.current;
    if(!current||!token){toast.error("Chybí spojení s místností. Připoj se znovu.");return;}
    const client=await getSupabaseClient();
    supabaseRef.current=client;
    const {error}=await client.rpc("mm_submit_action",{
      p_code:current.code,
      p_player_id:playerIdRef.current,
      p_token:token,
      p_action:message as unknown as Record<string,unknown>,
    });
    if(error)toast.error(error.message||"Akci se nepodařilo odeslat hostiteli.");
  }

  async function handleHostCommand(senderId:string,message:GameAction){
    const current=roomRef.current;
    if(!current||!hostRef.current||current.state!=="question"||Date.now()>=current.deadline)return;
    const player=current.players.find(p=>p.id===senderId);
    if(!player||current.answers[senderId]!==undefined)return;

    if(message.type==="lifeline"){
      if(player.lifelines.includes(message.lifeline))return;
      const updated=current.players.map(p=>p.id===senderId?{
        ...p,
        lifelines:[...p.lifelines,message.lifeline],
        secondReady:message.lifeline==="second"?true:p.secondReady,
      }:p);
      await commitHostRoom({...current,players:updated,revealAt:message.lifeline==="second"?null:current.revealAt});
      return;
    }

    if(message.type!=="answer"||!Number.isInteger(message.answer)||message.answer<0||message.answer>3)return;
    const question=QUESTIONS.find(q=>q.id===current.questionIds[current.round]);
    if(!question)return;

    if(player.secondReady&&message.answer!==question.answer&&!player.secondRetryUsed){
      const updatedPlayers=current.players.map(p=>p.id===senderId?{...p,secondRetryUsed:true}:p);
      await commitHostRoom({...current,players:updatedPlayers,revealAt:null});
      return;
    }

    const updatedPlayers=current.players.map(p=>p.id===senderId?{...p,secondReady:false,secondRetryUsed:false}:p);
    const updatedAnswers={...current.answers,[senderId]:message.answer};
    const updatedTimes={...current.times,[senderId]:Math.max(0,20000-Math.max(0,current.deadline-Date.now()))};
    const allAnswered=Object.keys(updatedAnswers).length>=current.players.filter(p=>p.online).length;
    await commitHostRoom({...current,players:updatedPlayers,answers:updatedAnswers,times:updatedTimes,revealAt:allAnswered?Date.now()+2500:null});
  }

  async function createRoom(){
    if(connecting)return;
    if(!nickname.trim()){toast.error("Nejdřív zadej svou přezdívku.");return;}
    setConnecting(true);setConnectionLabel("PŘIPOJUJI SUPABASE REALTIME");
    closeRealtime();playerTokenRef.current="";
    const name=nickname.trim();
    try{
      const client=await getSupabaseClient();
      supabaseRef.current=client;
      let created=false;
      for(let attempt=0;attempt<4&&!created;attempt++){
        const code=makeRoomCode();
        const token=makePlayerToken();
        roomCodeRef.current=code;playerIdRef.current="host";
        const channel=await subscribeRoomChannel(code,token);
        const initialRoom:Room={
          code,host:"host",hostPeerId:"supabase",
          players:[{id:"host",peerId:"supabase",name,score:0,level:-1,correct:0,elapsed:0,online:true,lifelines:[],secondReady:false,secondRetryUsed:false}],
          round:0,state:"lobby",questionIds:chooseQuestions(),answers:{},times:{},deadline:0,revealAt:null,answeredCount:0,
        };
        const {data,error}=await client.rpc("mm_create_room",{
          p_code:code,p_player_id:"host",p_token:token,p_name:name,p_room:initialRoom as unknown as Record<string,unknown>,
        });
        if(error){
          await client.removeChannel(channel);
          if(error.code==="23505"&&attempt<3)continue;
          throw new Error(error.message||"Místnost se nepodařilo vytvořit v Supabase.");
        }
        channelRef.current=channel;playerTokenRef.current=token;hostRef.current=true;
        localStorage.setItem(playerIdKey(code),"host");
        localStorage.setItem(playerTokenKey(code),token);
        sessionStorage.setItem(sessionStorageKey,JSON.stringify({role:"host",code,playerId:"host",nickname:name}));
        const next=(data as unknown as Room)||initialRoom;
        roomRef.current=next;setRoom(next);setPlayerId("host");setView("lobby");
        setConnectionLabel("HOST ONLINE / SUPABASE");
        toast.success("Místnost vytvořena. Pošli ostatním kód nebo odkaz.");
        created=true;
      }
      if(!created)throw new Error("Nepodařilo se vytvořit volný kód místnosti.");
    }catch(error){
      closeRealtime();setConnectionLabel("OFFLINE");
      roomCodeRef.current="";playerIdRef.current="";playerTokenRef.current="";
      toast.error(error instanceof Error?error.message:"Místnost se nepodařilo vytvořit.");
    }finally{setConnecting(false);}
  }

  async function joinRoom(){
    if(connecting)return;
    if(!nickname.trim()||!joinCode.trim()){toast.error("Vyplň přezdívku i kód místnosti.");return;}
    const code=joinCode.trim().toUpperCase();
    if(!/^[A-Z0-9]{8}$/.test(code)){toast.error("Kód místnosti musí mít přesně 8 znaků.");return;}
    setConnecting(true);setConnectionLabel("PŘIPOJUJI DO LOBBY");
    closeRealtime();
    try{
      const client=await getSupabaseClient();
      supabaseRef.current=client;
      const playerId=localStorage.getItem(playerIdKey(code))||crypto.randomUUID();
      const token=localStorage.getItem(playerTokenKey(code))||makePlayerToken();
      roomCodeRef.current=code;playerIdRef.current=playerId;playerTokenRef.current=token;hostRef.current=false;
      const channel=await subscribeRoomChannel(code,token);
      channelRef.current=channel;
      const {data,error}=await client.rpc("mm_join_room",{
        p_code:code,p_player_id:playerId,p_token:token,p_name:nickname.trim(),
      });
      if(error)throw new Error(error.message||"Do lobby se nepodařilo připojit.");
      const joinedRoom=data as unknown as Room;
      if(!joinedRoom||joinedRoom.code!==code||!joinedRoom.players?.some(p=>p.id===playerId)){
        throw new Error("Supabase nevrátilo potvrzení připojení do lobby.");
      }
      localStorage.setItem(playerIdKey(code),playerId);
      localStorage.setItem(playerTokenKey(code),token);
      sessionStorage.setItem(sessionStorageKey,JSON.stringify({role:"guest",code,playerId,nickname:nickname.trim()}));
      roomRef.current=joinedRoom;setRoom(joinedRoom);setPlayerId(playerId);
      setView(joinedRoom.state==="lobby"?"lobby":"game");setConnectionLabel("SUPABASE ONLINE");
      toast.success("Úspěšně ses připojil do lobby.");
    }catch(error){
      closeRealtime();setConnectionLabel("OFFLINE");
      roomCodeRef.current="";playerIdRef.current="";playerTokenRef.current="";
      setPlayerId("");setRoom(null);setView("home");sessionStorage.removeItem(sessionStorageKey);
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
    const msg:GameAction={type:"answer",answer:index};
    if(hostRef.current)void handleHostCommand(playerIdRef.current,msg);
    else void sendToHost(msg);
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
    const msg:GameAction={type:"lifeline",lifeline:kind};
    if(hostRef.current)void handleHostCommand(playerIdRef.current,msg);
    else void sendToHost(msg);
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
    void commitHostRoom(next);setFifty([]);setShowHint(false);setRetryPrompt(false);
  }
  async function copyRoomLink(){
    if(!room)return;
    const url=new URL(window.location.href);url.searchParams.set("room",room.code);
    try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(url.toString());
      else{
        const field=document.createElement("textarea");
        field.value=url.toString();field.style.position="fixed";field.style.opacity="0";
        document.body.appendChild(field);field.select();
        const copied=document.execCommand("copy");field.remove();
        if(!copied)throw new Error("Kopírování není dostupné.");
      }
      toast.success("Odkaz na místnost zkopírován.");
    }catch{toast.error("Kopírování se nepodařilo. Zkopíruj kód místnosti ručně.");}
  }
  async function leaveRoom(){
    const current=roomRef.current;
    const token=playerTokenRef.current;
    if(current&&token){
      const client=await getSupabaseClient();
      supabaseRef.current=client;
      const {error}=await client.rpc("mm_leave_room",{
        p_code:current.code,p_player_id:playerIdRef.current,p_token:token,
      });
      if(error)toast.error(`Místnost se nepodařilo bezpečně opustit: ${error.message}`);
    }
    resetLocalRoom();
  }

  useEffect(()=>{
    if(!room||!isHost||room.state!=="question")return;
    if(now>=room.deadline||(room.revealAt!==null&&now>=room.revealAt)){
      commitHostRoom({...room,state:"reveal",revealAt:null});
    }
  },[now,room?.state,room?.deadline,room?.revealAt,isHost]);

  useEffect(()=>()=>{const channel=channelRef.current;if(channel&&supabaseRef.current)void supabaseRef.current.removeChannel(channel);},[]);

  return <main className="market-shell min-h-screen text-slate-100">
    <div className="ticker"><div className="ticker-track">{[...ticker,...ticker].map(([n,v,c],i)=><span key={i} className="ticker-item"><b>{n}</b><span>{v}</span><em className={c.startsWith("−")?"down":"up"}>{c}</em></span>)}</div></div>
    <header className="market-header">
      <div className="brand"><div className="brand-mark"><TrendingUp size={22}/></div><div><b>MARKET<span> MILLIONAIRE</span></b><small>THE KNOWLEDGE EXCHANGE</small></div></div>
      <div className="market-status"><span className="live-dot"/>{connectionLabel}<i/> SUPABASE REALTIME <i/> CZK</div>
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
        <label className="field-label">KÓD MÍSTNOSTI</label><div className="join-row"><input className="market-input code-input" value={joinCode} maxLength={8} onChange={e=>setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))} placeholder="AB12CD34"/><button className="join-action" onClick={joinRoom} disabled={connecting}>{connecting?"…":"VSTOUPIT"} <ChevronRight size={16}/></button></div>
        <div className="secure-note"><Shield size={14}/> Až 9 hráčů · Supabase Realtime · Sdílená lobby</div>
        <p className="fine-print">Hostitel musí zůstat připojený po celou hru. Lobby a průběh hry synchronizuje Supabase Realtime.</p>
      </div>
      <div className="market-chart-panel"><div className="panel-heading"><span><Activity size={15}/> MARKET SENTIMENT</span><b className="positive">+8.42%</b></div><svg className="market-chart" viewBox="0 0 1000 115" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#23d69b" stopOpacity=".24"/><stop offset="1" stopColor="#23d69b" stopOpacity="0"/></linearGradient></defs><path d="M0 90 L40 84 65 89 95 68 125 73 155 58 188 66 220 43 250 49 285 29 320 36 350 23 388 40 425 31 465 45 500 25 535 35 575 17 610 24 650 36 690 19 730 30 770 12 805 27 845 18 880 32 920 12 955 19 1000 7 L1000 115 L0 115 Z" fill="url(#chartFill)"/><path d="M0 90 L40 84 65 89 95 68 125 73 155 58 188 66 220 43 250 49 285 29 320 36 350 23 388 40 425 31 465 45 500 25 535 35 575 17 610 24 650 36 690 19 730 30 770 12 805 27 845 18 880 32 920 12 955 19 1000 7" fill="none" stroke="#28d8a0" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/></svg><div className="chart-axis"><span>09:00</span><span>11:00</span><span>13:00</span><span>15:00</span><span>17:00</span></div></div>
    </section>}

    {view==="lobby"&&room&&<section className="game-layout"><div className="section-kicker"><span className="live-dot"/> PRE-MARKET SESSION</div><div className="room-heading"><div><h1>Čekáme na <span>otevření burzy.</span></h1><p>Pozvi ostatní tradery. Soutěž začíná, až se připojí alespoň dva.</p></div><div className="room-code" onClick={copyRoomLink} role="button" tabIndex={0}><small>KÓD / KLIKNI PRO ODKAZ <Copy size={13}/></small><strong>{room.code}</strong></div></div>
      <div className="lobby-grid"><div className="terminal-card"><div className="card-top"><span><Users size={15}/> TRADERS FLOOR</span><b>{room.players.filter(p=>p.online).length}/{room.players.length} ONLINE · MAX 9</b></div>{room.players.map(p=><div className="player-row" key={p.id}><div className="player-avatar">{p.name.slice(0,2).toUpperCase()}</div><div className="player-meta"><b>{p.name}</b><small>{p.id===room.host?"HOST / SPRÁVCE":"TRADER"}</small></div>{p.id===room.host&&<Crown size={17} className="gold-icon"/>}<span className={p.online?"online-pill":"offline-pill"}>{p.online?"ONLINE":"OFFLINE"}</span></div>)}
        {Array.from({length:Math.max(0,Math.min(3,9-room.players.length))}).map((_,i)=><div className="player-row waiting" key={i}><div className="player-avatar">+</div><div className="player-meta"><b>Čekáme na tradera…</b><small>VOLNÉ MÍSTO</small></div></div>)}
        {isHost?<button className="primary-action start-action" onClick={startGame} disabled={room.players.length<2}>OTEVŘÍT BURZU A ZAČÍT <ChevronRight size={17}/></button>:<div className="waiting-info"><span className="pulse-ring"/> Čekáme, až hostitel spustí hru…</div>}
      </div><div className="terminal-card briefing"><div className="card-top"><span><BarChart3 size={15}/> SESSION BRIEFING</span></div><div className="brief-row"><small>FORMÁT</small><b>15 OTÁZEK / 4 MOŽNOSTI</b></div><div className="brief-row"><small>ČAS NA ODPOVĚĎ</small><b>20 SEKUND</b></div><div className="brief-row"><small>MAX. VÝNOS</small><b className="gold-text">1 000 000 KREDITŮ</b></div><div className="brief-row"><small>ŽOLÍCI</small><b>3 NA HRÁČE</b></div><p className="fine-print">Všechny částky jsou fiktivní herní kredity. Hostitel musí zůstat online. Každý hráč dostává přes Supabase pouze vlastní odpověď až do odhalení.</p><button className="secondary-action leave-action" onClick={leaveRoom}>ODEJÍT Z MÍSTNOSTI</button></div></div>
    </section>}

    {view==="game"&&room&&currentQuestion&&<section className="game-layout">
      {room.state==="finished"?<div className="finish-card terminal-card"><div className="champion-crown"><Crown size={42}/></div><div className="section-kicker">MARKET CLOSED / FINÁLNÍ VÝSLEDKY</div><h1>Burza je <span>uzavřena.</span></h1><p>Vítězem dnešního obchodování se stává</p><div className="winner-name">{ranked[0]?.name}</div><div className="winner-prize">{fmt(ranked[0]?.score||0)} <small>KREDITŮ</small></div><div className="final-ranking">{ranked.map((p,i)=><div className="rank-row" key={p.id}><b>#{i+1}</b><span>{p.name}</span><strong>{fmt(p.score)}</strong><small>{p.correct}/15 SPRÁVNĚ</small></div>)}</div>{isHost&&<button className="secondary-action" onClick={leaveRoom}>NOVÁ HRA</button>}</div>:<><div className="game-topline"><div className="section-kicker"><span className="live-dot"/> LIVE TRADING SESSION</div><div className="game-topline-actions"><div className="round-chip">KOLO <b>{room.round+1}</b> / 15</div><button className="secondary-action exit-game-action" onClick={leaveRoom}><X size={14}/> ODEJÍT</button></div></div>
        <div className="game-grid"><div className="question-column">
          <div className="question-meta"><span>{currentQuestion.category.toUpperCase()} / MARKET INTELLIGENCE</span><span>LEVEL {room.round+1}</span></div>
          <div className="question-card terminal-card"><div className="question-index">Q{String(room.round+1).padStart(2,"0")} <span>—</span> INVESTIČNÍ ROZHODNUTÍ</div><h2>{currentQuestion.question}</h2>
            <div className="answer-grid">{currentQuestion.options.map((option,i)=>{const removed=fifty.includes(i);const isMine=room.answers[playerId]===i;const reveal=room.state==="reveal";const correct=reveal&&i===currentQuestion.answer;return <button key={i} disabled={answered||removed||room.state!=="question"} className={`answer-option ${isMine?"selected":""} ${correct?"correct":""} ${reveal&&isMine&&!correct?"incorrect":""} ${removed?"removed":""}`} onClick={()=>submitAnswer(i)}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{correct&&<Check size={18}/>}</button>;})}</div>
            {showHint&&<div className="hint-box"><Lightbulb size={16}/><span>{currentQuestion.hint||"Zaměř se na souvislosti a vyluč možnosti, které nedávají smysl."}</span></div>}
            {retryPrompt&&<div className="hint-box"><RefreshCw size={16}/><span>První odpověď nebyla správná. Vyber ještě jednou — tento pokus už rozhodne.</span></div>}
            {room.state==="question"?<div className="answer-status">{answered?<><Check size={15}/> ODPOVĚĎ ODESLÁNA · ČEKÁME NA OSTATNÍ</>:retryPrompt?<>DRUHÝ POKUS — ROZHODNI SE</>:<><Timer size={15}/> TVŮJ ČAS NA ROZHODNUTÍ</>}</div>:<div className="reveal-status">{room.answers[playerId]===undefined?"ČAS VYPRŠEL — ODPOVĚĎ NEBYLA ODESLÁNA":room.answers[playerId]===currentQuestion.answer?"✓ SPRÁVNÁ ODPOVĚĎ — TVŮJ KURZ ROSTE":"✕ NESPRÁVNÁ ODPOVĚĎ — TRH KORIGUJE"}</div>}
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

    <footer className="market-footer"><span>MARKET MILLIONAIRE © 2026</span><span>SUPABASE REALTIME · SIMULATED MARKET DATA</span><span>POWERED BY KNOWLEDGE <Sparkles size={12}/></span></footer>
    {showRules&&<div className="modal-backdrop" onClick={()=>setShowRules(false)}><div className="terminal-card rules-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowRules(false)}><X/></button><div className="section-kicker">HOW TO TRADE KNOWLEDGE</div><h2>Pravidla hry</h2><p>Každý hráč odpovídá na stejných 15 otázek. Na každou otázku máte 20 sekund. Správná odpověď vás posune na další příčku milionové pyramidy.</p><p>Po 5. a 10. otázce se nachází bezpečnostní hranice. Při chybě se vrátíte na poslední dosaženou bezpečnostní hranici.</p><p>Každý trader má tři žolíky: 50:50, nápovědu a druhou šanci. Druhá šance se aktivuje před odpovědí a při špatném prvním pokusu otevře ještě jeden pokus.</p><p>Vítězí hráč s nejvyšším dosaženým výnosem. Všechny kredity jsou pouze herní. Hostitel musí zůstat online po celou dobu hry.</p><button className="primary-action" onClick={()=>setShowRules(false)}>ROZUMÍM <Check size={16}/></button></div></div>}
  </main>;
}

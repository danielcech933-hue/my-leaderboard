import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Trophy, Lock, Unlock, Trash2, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Žebříček makléřů – kdo vydělal nejvíc" },
      { name: "description", content: "Prodejní žebříček makléřů podle provizí a objemu obchodů." },
      { property: "og:title", content: "Žebříček makléřů" },
      { property: "og:description", content: "Kdo z makléřů letos vydělal nejvíc?" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Broker = { id: string; name: string; branch: string };
type Deal = { id: string; brokerId: string; amount: number; note: string; date: string };
type Period = "month" | "quarter" | "year" | "all";

const ADMIN_PIN = "1234";
const KEY = "broker-leaderboard-v1";
const czk = (n: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(n);
const uid = () => Math.random().toString(36).slice(2, 10);

function inPeriod(date: string, p: Period) {
  const d = new Date(date);
  const now = new Date();
  if (p === "all") return true;
  if (d.getFullYear() !== now.getFullYear()) return false;
  if (p === "year") return true;
  if (p === "month") return d.getMonth() === now.getMonth();
  return Math.floor(d.getMonth() / 3) === Math.floor(now.getMonth() / 3);
}

function Index() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [period, setPeriod] = useState<Period>("month");
  const [admin, setAdmin] = useState(false);
  const [pin, setPin] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      setBrokers(s.brokers ?? []);
      setDeals(s.deals ?? []);
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify({ brokers, deals }));
  }, [brokers, deals, loaded]);

  const ranking = useMemo(() => {
    const f = deals.filter((d) => inPeriod(d.date, period));
    return brokers
      .map((b) => {
        const mine = f.filter((d) => d.brokerId === b.id);
        const total = mine.reduce((s, d) => s + d.amount, 0);
        return { ...b, total, count: mine.filter((d) => d.amount > 0).length };
      })
      .sort((a, b) => b.total - a.total);
  }, [brokers, deals, period]);

  const teamTotal = ranking.reduce((s, r) => s + r.total, 0);
  const biggest = deals.filter((d) => inPeriod(d.date, period)).reduce((m, d) => Math.max(m, d.amount), 0);
  const medal = ["text-gold", "text-silver", "text-bronze"];

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Prodejní žebříček</p>
            <h1 className="font-display text-4xl font-extrabold md:text-5xl">Makléři roku</h1>
          </div>
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(["month", "quarter", "year", "all"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {{ month: "Měsíc", quarter: "Kvartál", year: "Rok", all: "Celkem" }[p]}
              </button>
            ))}
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Provize týmu" value={czk(teamTotal)} />
          <Stat label="Největší obchod" value={czk(biggest)} />
          <Stat label="Počet makléřů" value={String(brokers.length)} />
        </section>

        <section className="mt-8 space-y-3">
          {ranking.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Zatím tu nikdo není. Odemkni správu a přidej makléře.
            </p>
          )}
          {ranking.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-center gap-4 rounded-xl border border-border bg-card p-4 ${i === 0 ? "ring-2 ring-gold" : ""}`}
            >
              <div className={`w-10 text-center font-display text-2xl font-extrabold ${medal[i] ?? "text-muted-foreground"}`}>
                {i < 3 ? <Trophy className="mx-auto h-7 w-7" /> : i + 1}
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-bold text-primary">
                {r.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.branch || "—"} · {r.count} obchodů</p>
              </div>
              <p className="font-display text-xl font-extrabold text-primary md:text-2xl">{czk(r.total)}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-xl border border-border bg-card p-6">
          {!admin ? (
            <form
              className="flex flex-wrap items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (pin === ADMIN_PIN) { setAdmin(true); setPin(""); }
                else toast.error("Špatný PIN");
              }}
            >
              <Lock className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Správa</span>
              <Input type="password" inputMode="numeric" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="w-32" />
              <Button type="submit">Odemknout</Button>
            </form>
          ) : (
            <AdminPanel brokers={brokers} deals={deals} setBrokers={setBrokers} setDeals={setDeals} onLock={() => setAdmin(false)} />
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4 text-primary" />{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function AdminPanel(props: {
  brokers: Broker[]; deals: Deal[];
  setBrokers: (f: (b: Broker[]) => Broker[]) => void;
  setDeals: (f: (d: Deal[]) => Deal[]) => void;
  onLock: () => void;
}) {
  const { brokers, deals, setBrokers, setDeals } = props;
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [brokerId, setBrokerId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const nameOf = (id: string) => brokers.find((b) => b.id === id)?.name ?? "?";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><Unlock className="h-5 w-5 text-primary" />Správa</h2>
        <Button variant="secondary" onClick={props.onLock}>Zamknout</Button>
      </div>

      <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setBrokers((b) => [...b, { id: uid(), name: name.trim(), branch: branch.trim() }]);
        setName(""); setBranch(""); toast.success("Makléř přidán");
      }}>
        <Input placeholder="Jméno makléře" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Pobočka (nepovinné)" value={branch} onChange={(e) => setBranch(e.target.value)} />
        <Button type="submit"><Plus className="h-4 w-4" />Přidat makléře</Button>
      </form>

      <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" onSubmit={(e) => {
        e.preventDefault();
        const n = Number(amount);
        if (!brokerId || !n) return toast.error("Vyber makléře a zadej částku");
        setDeals((d) => [{ id: uid(), brokerId, amount: n, note, date }, ...d]);
        setAmount(""); setNote(""); toast.success("Zapsáno");
      }}>
        <select value={brokerId} onChange={(e) => setBrokerId(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Makléř…</option>
          {brokers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <Input type="number" placeholder="Částka Kč (− odečte)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Popis obchodu" value={note} onChange={(e) => setNote(e.target.value)} />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button type="submit">Zapsat obchod</Button>
      </form>

      <div>
        <h3 className="mb-2 font-semibold">Poslední zápisy</h3>
        <ul className="divide-y divide-border">
          {deals.slice(0, 20).map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-2 text-sm">
              <span className="w-24 text-muted-foreground">{d.date}</span>
              <span className="flex-1 truncate">{nameOf(d.brokerId)}{d.note && ` — ${d.note}`}</span>
              <span className={d.amount < 0 ? "text-destructive" : "text-primary"}>{czk(d.amount)}</span>
              <button onClick={() => setDeals((x) => x.filter((y) => y.id !== d.id))} aria-label="Smazat"><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
            </li>
          ))}
          {deals.length === 0 && <li className="py-2 text-sm text-muted-foreground">Žádné zápisy.</li>}
        </ul>
        {brokers.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {brokers.map((b) => (
              <Button key={b.id} size="sm" variant="secondary" onClick={() => {
                if (!confirm(`Odebrat ${b.name}?`)) return;
                setBrokers((x) => x.filter((y) => y.id !== b.id));
                setDeals((x) => x.filter((y) => y.brokerId !== b.id));
              }}><Trash2 className="h-3 w-3" />{b.name}</Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

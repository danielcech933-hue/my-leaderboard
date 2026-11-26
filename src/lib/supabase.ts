export type SupabaseError = { message: string; code?: string };

export interface RealtimeChannelLike {
  on(
    type: "broadcast",
    filter: { event: string },
    callback: (payload: unknown) => void,
  ): RealtimeChannelLike;
  subscribe(callback?: (status: string, error?: { message?: string }) => void): RealtimeChannelLike;
}

export interface SupabaseClientLike {
  channel(topic: string, options?: Record<string, unknown>): RealtimeChannelLike;
  removeChannel(channel: RealtimeChannelLike): Promise<unknown>;
  rpc(
    functionName: string,
    args?: Record<string, unknown>,
  ): Promise<{ data: unknown; error: SupabaseError | null }>;
}

declare global {
  interface Window {
    supabase?: {
      createClient: (
        url: string,
        key: string,
        options?: Record<string, unknown>,
      ) => SupabaseClientLike;
    };
  }
}

const SUPABASE_URL = "https://ntzjirsejfvgvuhmbqvt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_h6OPgk8kd5c1wvqLlQ02g_VdQ9Vjw1";
const SUPABASE_SDK_URL =
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/dist/umd/supabase.js";
const SUPABASE_SCRIPT_ID = "market-millionaire-supabase-sdk";

let clientPromise: Promise<SupabaseClientLike> | null = null;

function loadSdk(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Supabase klient lze načíst pouze v prohlížeči."));
  }
  if (window.supabase?.createClient) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let script = document.getElementById(SUPABASE_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SUPABASE_SCRIPT_ID;
      script.src = SUPABASE_SDK_URL;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
    const onLoad = () => {
      cleanup();
      if (window.supabase?.createClient) resolve();
      else reject(new Error("Supabase JavaScript SDK se nenačetlo správně."));
    };
    const onError = () => {
      cleanup();
      script?.remove();
      reject(
        new Error(
          "Nepodařilo se načíst Supabase SDK. Zkontroluj připojení k internetu a zkus obnovit stránku.",
        ),
      );
    };
    const cleanup = () => {
      script?.removeEventListener("load", onLoad);
      script?.removeEventListener("error", onError);
    };
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (window.supabase?.createClient) onLoad();
  });
}

export function getSupabaseClient(): Promise<SupabaseClientLike> {
  if (clientPromise) return clientPromise;
  clientPromise = loadSdk()
    .then(() => {
      const sdk = window.supabase;
      if (!sdk?.createClient) {
        throw new Error("Supabase SDK není v prohlížeči dostupné.");
      }
      return sdk.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
        realtime: {
          params: { eventsPerSecond: 10 },
        },
      });
    })
    .catch((error: unknown) => {
      clientPromise = null;
      throw error;
    });
  return clientPromise;
}

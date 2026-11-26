/* eslint-disable @typescript-eslint/no-explicit-any, prettier/prettier */
export type PeerDataConnection = {
  peer: string;
  open: boolean;
  on(event: string, handler: (...args: any[]) => void): void;
  send(data: unknown): void;
  close(): void;
};

export type PeerClient = {
  id: string;
  destroyed: boolean;
  on(event: string, handler: (...args: any[]) => void): void;
  connect(peerId: string, options?: Record<string, unknown>): PeerDataConnection;
  destroy(): void;
  disconnect(): void;
};

export type PeerConstructor = new (
  id?: string,
  options?: Record<string, unknown>,
) => PeerClient;

declare global {
  interface Window {
    Peer?: PeerConstructor;
  }
}

let peerScriptPromise: Promise<PeerConstructor> | null = null;

export function loadPeerJS(): Promise<PeerConstructor> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PeerJS lze načíst pouze v prohlížeči."));
  }
  if (window.Peer) return Promise.resolve(window.Peer);
  if (peerScriptPromise) return peerScriptPromise;

  peerScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      if (window.Peer) resolve(window.Peer);
      else {
        peerScriptPromise = null;
        reject(new Error("Knihovna PeerJS se nenačetla správně."));
      }
    };
    script.onerror = () => {
      peerScriptPromise = null;
      reject(new Error("Nepodařilo se načíst PeerJS z CDN. Zkontroluj připojení k internetu."));
    };
    document.head.appendChild(script);
  });
  return peerScriptPromise;
}

// Do not specify host/key: this selects the official free PeerJS Cloud service.
// Overriding the host bypasses PeerJS Cloud's automatic default configuration.
export const PEER_OPTIONS = {
  debug: 2,
};

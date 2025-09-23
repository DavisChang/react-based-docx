import "./index.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** 預設子頁（public/iframe-child.html） */
const DEFAULT_CHILD_URL = `${import.meta.env.BASE_URL}iframe-child.html`;
// 若本頁被外部嵌入，嘗試取得外層父頁的 ORIGIN 以便轉傳資料
const OUTER_PARENT_ORIGIN: string = (() => {
  try { return new URL(document.referrer).origin; } catch { return ""; }
})();

/** Child → Parent 訊息型別 */
type FromChild =
  | { type: "READY" }
  | { type: "SCORE_UPDATE"; userId: string; name?: string; delta?: number; score?: number; ts: number }
  | { type: "ORDER_UPDATE"; order: "asc" | "desc"; ts: number }
  | { type: "GAME_OVER"; userId: string; name?: string; final: number; ts: number };

/** Parent → Child 訊息型別（必要最少） */
type ToChild =
  | { type: "HELLO"; version: 1 }
  | { type: "REQUEST_END" };

type Row = { userId: string; name: string; score: number };

const IframeGameTest = (): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [eventLog, setEventLog] = useState<Array<{ ts: number; text: string; raw?: unknown }>>([]);
  const [board, setBoard] = useState<Record<string, Row>>({});
  const [childUrl, setChildUrl] = useState<string>(DEFAULT_CHILD_URL);
  const [urlInput, setUrlInput] = useState<string>(DEFAULT_CHILD_URL);

  const childOrigin = useMemo<string>(() => {
    try { return new URL(childUrl, window.location.href).origin; } catch { return ""; }
  }, [childUrl]);

  // 安全封裝：只發給指定 ORIGIN
  const postToChild = useCallback((msg: ToChild) => {
    const target = childOrigin || "*";
    iframeRef.current?.contentWindow?.postMessage(msg, target);
  }, [childOrigin]);

  // Reset all local states when loading a new URL
  const resetAllState = useCallback(() => {
    setReady(false);
    setBoard({});
    setEventLog([]);
  }, []);

  const loadNewUrl = useCallback((nextUrl: string) => {
    const finalUrl = nextUrl || DEFAULT_CHILD_URL;
    resetAllState();
    setChildUrl(finalUrl);
  }, [resetAllState]);

  // 將子 iframe 的事件轉傳給外層父頁（若存在）
  const postToOuter = useCallback((msg: FromChild) => {
    if (window.parent && window.parent !== window) {
      const target = OUTER_PARENT_ORIGIN || "*";
      window.parent.postMessage({ source: "IframeGameHost", data: msg }, target);
    }
  }, []);

  // ⛳ 握手：iframe 載入後送 HELLO；若沒回 READY，重送幾次
  useEffect(() => {
    let tries = 0;
    let timer: number | undefined;
    const sendHello = () => {
      if (ready || tries >= 5) return;
      tries++;
      postToChild({ type: "HELLO", version: 1 });
      timer = window.setTimeout(sendHello, 800);
    };
    const onLoad = () => {
      tries = 0;
      sendHello();
      iframeRef.current?.contentWindow?.focus();
    };
    const el = iframeRef.current;
    el?.addEventListener("load", onLoad);

    return () => {
      el?.removeEventListener("load", onLoad);
      if (timer) window.clearTimeout(timer);
    };
  }, [postToChild, ready]);

  // 監聽 Child 訊息
  useEffect(() => {
    const onMessage = (ev: MessageEvent<FromChild>) => {
      if (childOrigin && ev.origin !== childOrigin) return;
      const m = ev.data;
      if (!m || typeof m !== "object") return;

      // 轉傳給外層父頁（若有）
      postToOuter(m);

      switch (m.type) {
        case "READY":
          setReady(true);
          setEventLog((l) => [{ ts: Date.now(), text: "Child READY", raw: m }, ...l].slice(0, 50));
          break;

        case "ORDER_UPDATE":
          setEventLog((l) => [
            { ts: Date.now(), text: `Order update → ${m.order}` , raw: m},
            ...l,
          ].slice(0, 50));
          break;

        case "SCORE_UPDATE": {
          const { userId, name = userId, delta, score } = m;
          setBoard((prev) => {
            const curr = prev[userId]?.score ?? 0;
            const next = Number.isFinite(score as number)
              ? Number(score)
              : curr + (Number(delta) || 0);
            return { ...prev, [userId]: { userId, name, score: next } };
          });
          setEventLog((l) => [
            { ts: Date.now(), text: `Score update → ${userId} ${name} Δ${delta ?? 0} S=${score ?? "-"}`, raw: m },
            ...l,
          ].slice(0, 50));
          break;
        }

        case "GAME_OVER": {
          const { userId, name = userId, final } = m;
          setBoard((prev) => ({ ...prev, [userId]: { userId, name, score: Number(final) || 0 } }));
          setEventLog((l) => [
            { ts: Date.now(), text: `Game over → ${userId} ${name} ${final}`, raw: m },
            ...l,
          ].slice(0, 50));
          break;
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postToOuter, childOrigin]);

  // 父頁也可以請子頁結束 / 重新送 HELLO
  const requestEnd = useCallback(() => postToChild({ type: "REQUEST_END" }), [postToChild]);
  const resendHello = useCallback(() => postToChild({ type: "HELLO", version: 1 }), [postToChild]);

  // 全螢幕控制（針對 iframe 本身）
  const toggleFullscreen = useCallback(() => {
    const isFs = document.fullscreenElement != null;
    if (!isFs) {
      iframeRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(document.fullscreenElement != null);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // styles moved to CSS (index.css)

  const scoreRows = useMemo(() => {
    const rows = Object.values(board);
    // 顯示即可，避免排名語意，依名稱排序
    rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }, [board]);

  return (
    <div ref={hostRef} className="igt-root">
      {/* 控制列 */}
      <div className="igt-control">
        <span className={`igt-status ${ready ? "ready" : "not-ready"}`}>{ready ? "READY" : "NOT READY"}</span>
        <button onClick={toggleFullscreen}>{isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}</button>
        <button onClick={resendHello}>Resend HELLO</button>
        <button onClick={requestEnd}>Ask Child To End</button>
        <div className="igt-url">
          <input
            className="igt-url-input"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") loadNewUrl(urlInput); }}
            placeholder="https://example.com/app"
          />
          <button onClick={() => loadNewUrl(urlInput)}>Load</button>
        </div>
      </div>

      

      {/* 右側欄：Scores + Events */}
      <div className="igt-rightcol">
        {/* 分數列表 */}
        <div className="igt-panel igt-panel-scores">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Scores</div>
          {scoreRows.length === 0 && <div style={{ opacity: .8 }}>No scores yet</div>}
          {scoreRows.map((r) => (
            <div key={r.userId} className="igt-score-row">
              <span>{r.name}</span>
              <span>{r.score}</span>
            </div>
          ))}
        </div>

        {/* 訊息紀錄 */}
        <div className="igt-panel igt-panel-events">
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Events</div>
          {eventLog.length === 0 && <div style={{ opacity: .8 }}>No events</div>}
          {eventLog.map((e) => (
          <div key={`${e.ts}-${e.text}`} className="igt-event-item">
            <div>{new Date(e.ts).toLocaleTimeString()} - {e.text}</div>
            {e.raw !== undefined && (
              <pre className="igt-pre">{JSON.stringify(e.raw, null, 2)}</pre>
            )}
          </div>
          ))}
        </div>
        
        {/* 串接教學 */}
        <div className="igt-panel igt-panel-guide">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>串接教學（Integration Guide）</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            <div>1) 父頁載入本頁並嵌入子頁（iframe-child.html）。</div>
            <div>2) 父頁在 iframe onload 後送出 HELLO；子頁收到後回 READY。</div>
            <div>3) 遊戲過程中，子頁可送 SCORE_UPDATE（delta 或 score）、ORDER_UPDATE。</div>
            <div>4) 結束時，子頁送 GAME_OVER；或父頁送 REQUEST_END 要求子頁結束。</div>
            <div>5) 為安全，雙方都使用固定 ORIGIN 做 postMessage 過濾。</div>
            <div>6) 此頁也會將子頁事件轉傳給更外層父頁（若本頁被 iframe 嵌入）。</div>
          </div>
          <div style={{ fontWeight: 600, marginTop: 8 }}>Message Types</div>
          <pre className="igt-pre">{`Parent → Child:
  { type: "HELLO", version: 1 }
  { type: "REQUEST_END" }
Child → Parent:
  { type: "READY" }
  { type: "SCORE_UPDATE", userId, name?, delta?, score?, ts }
  { type: "ORDER_UPDATE", order: "asc" | "desc", ts }
  { type: "GAME_OVER", userId, name?, final, ts }`}</pre>
          <div style={{ fontWeight: 600, marginTop: 8 }}>Child 端（iframe-child.html）重點</div>
          <pre className="igt-pre">{`window.addEventListener('message', (e) => {
  // 驗證 e.origin 是否為父頁
  if (e.data?.type === 'HELLO') postToParent({ type: 'READY' });
  if (e.data?.type === 'REQUEST_END') reportEnd(currentScore);
});
function reportScoreDelta(delta, userId = 'p1', name = 'Player 1') {
  postToParent({ type: 'SCORE_UPDATE', userId, name, delta, ts: Date.now() });
}
function reportScoreAbsolute(score, userId = 'p1', name = 'Player 1') {
  postToParent({ type: 'SCORE_UPDATE', userId, name, score, ts: Date.now() });
}
function reportOrder(order /* 'asc' | 'desc' */) {
  postToParent({ type: 'ORDER_UPDATE', order, ts: Date.now() });
}
function reportEnd(finalScore, userId = 'p1', name = 'Player 1') {
  postToParent({ type: 'GAME_OVER', userId, name, final: finalScore, ts: Date.now() });
}`}</pre>
        </div>
      </div>

      {/* 測試子頁 iframe */}
      <iframe
        ref={iframeRef}
        key={childUrl}
        src={childUrl}
        title="Iframe Child"
        allow="fullscreen; autoplay; pointer-lock; gamepad; clipboard-read; clipboard-write"
        allowFullScreen
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        className="igt-iframe"
      />
    </div>
  );
};

export default IframeGameTest;

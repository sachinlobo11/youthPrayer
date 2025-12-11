// src/pages/AIChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// IMPORTANT: adjust path if your ai helper is at different path
// Example: import { askAI } from "../utils/ai"; or import askAI from "../ai";
import {askAI} from "../ai";

const THINKING_PHRASES = [
  "Praying for wisdom…",
  "Searching Scripture…",
  "Reflecting on truth…",
  "Seeking clarity…",
  "Cross-checking references…",
];

export default function AIChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingWrongs = location.state?.wrongAnswers || {};

  const [messages, setMessages] = useState([]);
  const [thinkingText, setThinkingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const startedRef = useRef(false); // prevents double-call (StrictMode)
  const thinkingTimerRef = useRef(null);
  const assistantMsgIdRef = useRef(null);
  const chatEndRef = useRef(null);

  // Autoscroll whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinkingText, loading]);

  // Helper: random integer in range [min, max]
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Start recursive randomized thinking phrase rotation
  const startThinkingLoop = () => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      const idx = Math.floor(Math.random() * THINKING_PHRASES.length);
      setThinkingText(THINKING_PHRASES[idx]);
      const nextDelay = randInt(700, 1400);
      thinkingTimerRef.current = setTimeout(run, nextDelay);
    };
    run();
    return () => {
      cancelled = true;
      clearTimeout(thinkingTimerRef.current);
    };
  };

  // Typing delay heuristics: spaces fast, punctuation slower, letters medium, with jitter
  const getDelayForChar = (ch) => {
    const base =
      ch === " "
        ? randInt(8, 22)
        : ".,;:!?".includes(ch)
        ? randInt(70, 120)
        : randInt(20, 40);
    // Occasionally add a slightly longer pause after periods to mimic human pause
    return base;
  };

  // Append initial user message (the list of wrong questions)
  const buildUserMessageText = (wrongs) => {
    const pairs = Object.entries(wrongs || {});
    if (!pairs.length) return "";
    return (
      "I answered these incorrectly: " +
      pairs
        .map(([q, a]) => `"${q}" (you chose: ${String(a)})`)
        .join("; ")
    );
  };

  // Main effect: run once if wrong answers exist
  useEffect(() => {
    // guard: only run if there are real wrong answers
    if (!incomingWrongs || Object.keys(incomingWrongs).length === 0) {
      // no wrong answers -> show encouragement
      setMessages([]);
      setThinkingText("");
      setLoading(false);
      return;
    }
    if (startedRef.current) return; // prevents double-run (StrictMode)
    startedRef.current = true;

    // show user message
    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: buildUserMessageText(incomingWrongs),
    };
    setMessages([userMsg]);
    setErrorText("");

    // start thinking animation (randomized)
    const stopThinking = startThinkingLoop();

    // call AI once
    (async () => {
      setLoading(true);
      try {
        // call your existing ai helper; expect it to return a plain string
        const aiRaw = await askAI(incomingWrongs);
        const aiText = typeof aiRaw === "string" ? aiRaw : JSON.stringify(aiRaw);

        // stop thinking
        stopThinking();
        setThinkingText("");
        setLoading(false);

        // add assistant empty message placeholder and remember its id
        const aid = `a-${Date.now()}`;
        assistantMsgIdRef.current = aid;
        setMessages((m) => [...m, { id: aid, role: "assistant", text: "" }]);

        // smooth realistic typing (accumulate typedText locally)
        let typedText = "";
        let i = 0;

        const typeNext = () => {
          if (i >= aiText.length) {
            // finished typing: ensure state cleared for refresh-protection
            assistantMsgIdRef.current = null;
            // clear router location state so refresh doesn't re-trigger API
            try {
              // replace state with empty wrongAnswers
              navigate(location.pathname, { replace: true, state: { wrongAnswers: {} } });
            } catch (e) {
              // ignore navigation errors in some setups
            }
            return;
          }

          const ch = aiText.charAt(i);
          typedText += ch;
          setMessages((m) =>
            m.map((msg) => (msg.id === aid ? { ...msg, text: typedText } : msg))
          );

          i++;
          const delay = getDelayForChar(ch);
          // slight random jitter
          const jitter = Math.random() * 12 - 6;
          setTimeout(typeNext, Math.max(6, Math.round(delay + jitter)));
        };

        // start typing; small initial delay so typing dots show for a moment
        setTimeout(typeNext, randInt(80, 220));
      } catch (err) {
        // stop thinking & show error bubble + retry option
        stopThinking();
        setThinkingText("");
        setLoading(false);
        console.error("askAI error:", err);
        const errId = `err-${Date.now()}`;
        setMessages((m) => [
          ...m,
          { id: errId, role: "assistant", text: "⚠️ Error fetching AI answer. Tap Retry." },
        ]);
        setErrorText("Failed to fetch AI answer. Check network or try again.");
        // clear location state to avoid re-trigger on refresh
        try {
          navigate(location.pathname, { replace: true, state: { wrongAnswers: {} } });
        } catch {}
      }
    })();

    // cleanup on unmount
    return () => {
      clearTimeout(thinkingTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once per mount

  // retry handler: allows user to retry calling AI (useful after network error)
  const handleRetry = async () => {
    // reset guard so effect can rerun logic here manually
    startedRef.current = false;
    setMessages([]);
    setErrorText("");
    // manually re-trigger by calling a helper (simple approach: reload page state)
    window.location.reload(); // quick and safe: reload will re-run effect but location.state is still present -> starts again
  };

  // UI: if no wrong answers show congrats (full-screen)
  const noWrongs =
    !incomingWrongs || Object.keys(incomingWrongs).length === 0;

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col">
      {/* Subtle animated header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
            AI
          </div>
          <div>
            <div className="text-lg font-semibold">AI Bible Helper</div>
            <div className="text-xs text-gray-400">Concise, scripture-aware guidance</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {errorText ? (
            <button
              onClick={handleRetry}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-sm"
            >
              Retry
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm"
            >
              Back
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col p-6">
        {noWrongs && !loading ? (
          <div className="mx-auto my-auto text-center max-w-2xl">
            <div className="text-4xl font-bold mb-4 text-green-400">🎉 Well done!</div>
            <p className="text-gray-300 mb-6">
              You answered everything correctly. Keep growing in grace and knowledge.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500"
            >
              Back to Studies
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden rounded-lg">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] px-4 py-3 rounded-2xl break-words transform transition-all duration-200 ${
                      m.role === "user"
                        ? "self-end bg-blue-600 text-white rounded-br-none shadow-md"
                        : "self-start bg-gray-800 text-gray-100 rounded-bl-none shadow-sm"
                    }`}
                    style={{ animation: "bubbleIn .18s ease-out" }}
                  >
                    <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                  </div>
                ))}

                {loading && thinkingText && (
                  <div className="self-start bg-gray-700 text-gray-200 px-4 py-2 rounded-2xl inline-flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
                    </div>
                    <div className="text-sm opacity-90">{thinkingText}</div>
                  </div>
                )}
              </div>

              <div ref={chatEndRef} />
            </div>

            {/* footer caution */}
            <div className="mt-4 px-4 py-3 border-t border-gray-800">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-gray-400">
                  ⚠️ AI may make mistakes — verify in Scripture.
                </div>
                {errorText ? (
                  <div className="text-sm text-red-400">{errorText}</div>
                ) : (
                  <div className="text-xs text-gray-500">
                    Powered by your AI gateway
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Tailwind-like inline CSS for small custom animations */}
      <style>{`
        @keyframes bubbleIn {
          from { transform: translateY(6px) scale(.995); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.30s; }

        /* little ripple background / subtle gradient - very light for performance */
        body, #root {
          background: radial-gradient(1200px 400px at 10% 10%, rgba(64,64,122,0.04), transparent 12%),
                      radial-gradient(1000px 300px at 90% 90%, rgba(142,80,204,0.03), transparent 12%),
                      #000;
        }
      `}</style>
    </div>
  );
}

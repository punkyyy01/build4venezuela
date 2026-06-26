"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/projects/browser-supabase";

const names = [
  "Arepa Builder",
  "Caracas Coder",
  "Orinoco Hacker",
  "Guayana Maker",
  "Merida Dreamer",
  "Maracaibo Spark",
  "Avila Friend",
  "Llanos Helper",
  "Canaima Builder",
  "Margarita Maker",
  "Cacao Coder",
  "Tequeno Fan",
];

const colors = [
  "#ffd83d",
  "#16c7e8",
  "#ff4a63",
  "#7cff6b",
  "#b77cff",
  "#ff9f1c",
  "#00f5d4",
  "#f15bb5",
  "#fee440",
  "#9bffea",
];

const emojis = ["❤️", "🙏", "🔥", "✨", "🇻🇪", "💛", "💙", "💪"];

type VisitorProfile = {
  visitorId: string;
  tabId: string;
  name: string;
  color: string;
  updatedAt: number;
};

type CursorPresence = VisitorProfile & {
  [key: string]: unknown;
  x: number;
  y: number;
};

type CursorPayload = CursorPresence;

type ReactionPayload = {
  [key: string]: unknown;
  id: string;
  tabId: string;
  emoji: string;
  color: string;
  x: number;
  y: number;
};

type Reaction = ReactionPayload & {
  createdAt: number;
};

function indexFromHash(hash: string, modulo: number, salt: number) {
  let total = salt;

  for (let index = 0; index < hash.length; index += 1) {
    total = (total * 31 + hash.charCodeAt(index)) >>> 0;
  }

  return total % modulo;
}

function createTabId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createProfile(visitorId: string): VisitorProfile {
  return {
    visitorId,
    tabId: createTabId(),
    name: names[indexFromHash(visitorId, names.length, 7)],
    color: colors[indexFromHash(visitorId, colors.length, 19)],
    updatedAt: Date.now(),
  };
}

function viewportPoint(x: number, y: number) {
  const pageHeight = Math.max(
    document.documentElement.scrollHeight,
    window.innerHeight,
  );

  return {
    left: `${Math.round(x * window.innerWidth)}px`,
    top: `${Math.round(y * pageHeight - window.scrollY)}px`,
  };
}

function documentY(clientY: number) {
  const pageHeight = Math.max(
    document.documentElement.scrollHeight,
    window.innerHeight,
  );

  return Math.min(1, Math.max(0, (clientY + window.scrollY) / pageHeight));
}

function randomEmoji(visitorId: string) {
  return emojis[indexFromHash(`${visitorId}-${Date.now()}`, emojis.length, 31)];
}

function isCursor(cursor: CursorPresence | null): cursor is CursorPresence {
  return cursor !== null;
}

export function RealtimeVisitors({ visitorId }: { visitorId: string }) {
  const [profile] = useState(() => createProfile(visitorId));
  const [localCursor, setLocalCursor] = useState<CursorPresence | null>(null);
  const [cursors, setCursors] = useState<CursorPresence[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [, setScrollVersion] = useState(0);
  const lastCursorRef = useRef(0);

  useEffect(() => {
    const supabase = createBrowserSupabase();

    if (!supabase) {
      return;
    }

    const channel = supabase
      .channel("home-visitors", {
        config: {
          broadcast: { self: false },
          presence: { key: profile.visitorId },
        },
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<CursorPresence>();
        const nextCursors = Object.values(state)
          .flat()
          .filter((cursor) => cursor.tabId !== profile.tabId)
          .sort((left, right) => right.updatedAt - left.updatedAt);

        setCursors(nextCursors);
      })
      .on<CursorPayload>("broadcast", { event: "cursor" }, ({ payload }) => {
        if (payload.tabId === profile.tabId) {
          return;
        }

        setCursors((current) => {
          const withoutCursor = current.filter(
            (cursor) => cursor.tabId !== payload.tabId,
          );

          return [payload, ...withoutCursor].sort(
            (left, right) => right.updatedAt - left.updatedAt,
          );
        });
      })
      .on<ReactionPayload>("broadcast", { event: "emoji" }, ({ payload }) => {
        if (payload.tabId === profile.tabId) {
          return;
        }

        const reaction = { ...payload, createdAt: Date.now() };
        setReactions((current) => [...current.slice(-18), reaction]);
        window.setTimeout(() => {
          setReactions((current) =>
            current.filter((item) => item.id !== reaction.id),
          );
        }, 1300);
      })
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }

        void channel.track({
          ...profile,
          x: 0.5,
          y: 0.5,
          updatedAt: Date.now(),
        });
      });

    function trackPointer(event: PointerEvent) {
      const now = Date.now();

      if (now - lastCursorRef.current < 55) {
        return;
      }

      lastCursorRef.current = now;
      const cursor = {
        ...profile,
        x: Math.min(1, Math.max(0, event.clientX / window.innerWidth)),
        y: documentY(event.clientY),
        updatedAt: now,
      };

      setLocalCursor(cursor);

      void channel.send({
        type: "broadcast",
        event: "cursor",
        payload: cursor,
      });
    }

    function sendReaction(event: PointerEvent) {
      const reaction: Reaction = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        tabId: profile.tabId,
        emoji: randomEmoji(profile.visitorId),
        color:
          colors[
            indexFromHash(
              `${profile.visitorId}-${Date.now()}`,
              colors.length,
              43,
            )
          ],
        x: Math.min(1, Math.max(0, event.clientX / window.innerWidth)),
        y: documentY(event.clientY),
        createdAt: Date.now(),
      };

      setReactions((current) => [...current.slice(-18), reaction]);
      window.setTimeout(() => {
        setReactions((current) =>
          current.filter((item) => item.id !== reaction.id),
        );
      }, 1300);

      void channel.send({
        type: "broadcast",
        event: "emoji",
        payload: reaction,
      });
    }

    function syncScrollPosition() {
      setScrollVersion((version) => version + 1);
    }

    window.addEventListener("pointermove", trackPointer, { passive: true });
    window.addEventListener("pointerdown", sendReaction, { passive: true });
    window.addEventListener("scroll", syncScrollPosition, { passive: true });

    return () => {
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("pointerdown", sendReaction);
      window.removeEventListener("scroll", syncScrollPosition);
      void channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [profile]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    >
      {[localCursor, ...cursors].filter(isCursor).map((cursor) => (
        <div
          className="absolute transition-transform duration-75 ease-linear"
          key={`${cursor.visitorId}-${cursor.tabId}`}
          style={{
            color: cursor.color,
            transform: `translate3d(${viewportPoint(cursor.x, cursor.y).left}, ${viewportPoint(cursor.x, cursor.y).top}, 0)`,
          }}
        >
          <div
            className="h-0 w-0 border-t-[16px] border-r-[10px] border-r-transparent drop-shadow-[0_0_10px_currentColor]"
            style={{ borderTopColor: cursor.color }}
          />
          <div
            className="mt-1 rounded-full border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] shadow-[0_0_18px_currentColor]"
            style={{
              backgroundColor: cursor.color,
              borderColor: cursor.color,
              color: "#000000",
            }}
          >
            {cursor.name}
          </div>
        </div>
      ))}

      {reactions.map((reaction) => {
        const point = viewportPoint(reaction.x, reaction.y);

        return (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-[ping_1.3s_cubic-bezier(0,0,0.2,1)_forwards] text-4xl drop-shadow-[0_0_18px_currentColor]"
            key={reaction.id}
            style={{
              color: reaction.color,
              left: point.left,
              top: point.top,
            }}
          >
            {reaction.emoji}
          </div>
        );
      })}
    </div>
  );
}

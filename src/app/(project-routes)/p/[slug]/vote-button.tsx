"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/lib/projects/browser-supabase";

type VoteButtonProps = {
  projectId: string;
  initialCount: number;
  initialSignedIn: boolean;
  initialVoted: boolean;
};

export function VoteButton({
  projectId,
  initialCount,
  initialSignedIn,
  initialVoted,
}: VoteButtonProps) {
  const { isSignedIn } = useUser();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [pending, startTransition] = useTransition();
  const signedIn = isSignedIn ?? initialSignedIn;

  useEffect(() => {
    const supabase = createBrowserSupabase();

    if (!supabase) {
      return;
    }

    async function refreshVotes() {
      const response = await fetch(`/api/projects/${projectId}/votes`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { count: number; voted: boolean };
      setCount(data.count);
      setVoted(data.voted);
    }

    const channel = supabase
      .channel(`project-votes-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_votes",
          filter: `project_id=eq.${projectId}`,
        },
        refreshVotes,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  function vote() {
    const nextVoted = !voted;
    const nextCount = Math.max(0, count + (nextVoted ? 1 : -1));

    setVoted(nextVoted);
    setCount(nextCount);

    startTransition(async () => {
      const response = await fetch(`/api/projects/${projectId}/votes`, {
        method: "POST",
      });

      if (!response.ok) {
        setVoted(voted);
        setCount(count);
        return;
      }

      const data = (await response.json()) as { count: number; voted: boolean };
      setCount(data.count);
      setVoted(data.voted);
    });
  }

  if (!signedIn) {
    return (
      <SignInButton mode="modal">
        <Button
          className="h-12 px-5 text-sm uppercase tracking-[0.18em]"
          type="button"
        >
          Sign in to vote ({count})
        </Button>
      </SignInButton>
    );
  }

  return (
    <Button
      className="h-12 px-5 text-sm uppercase tracking-[0.18em]"
      disabled={pending}
      onClick={vote}
      type="button"
    >
      {pending ? "Saving..." : voted ? `Voted (${count})` : `Vote (${count})`}
    </Button>
  );
}

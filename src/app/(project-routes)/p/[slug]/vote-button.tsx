"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/lib/projects/browser-supabase";
import {
  fetchProjectVote,
  projectQueryKeys,
  toggleProjectVote,
} from "@/lib/projects/queries";

type VoteButtonProps = {
  projectId: string;
  initialCount: number;
  initialSignedIn: boolean;
  initialVoted: boolean;
};

type VoteState = {
  count: number;
  voted: boolean;
};

export function VoteButton({
  projectId,
  initialCount,
  initialSignedIn,
  initialVoted,
}: VoteButtonProps) {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const voteQueryKey = projectQueryKeys.votes(projectId);
  const { data: voteState = { count: initialCount, voted: initialVoted } } =
    useQuery({
      initialData: { count: initialCount, voted: initialVoted },
      queryFn: () => fetchProjectVote(projectId),
      queryKey: voteQueryKey,
    });
  const voteMutation = useMutation({
    mutationFn: () => toggleProjectVote(projectId),
    onError: (
      _error,
      _variables,
      context: { previousVote?: VoteState } | undefined,
    ) => {
      if (context?.previousVote) {
        queryClient.setQueryData(voteQueryKey, context.previousVote);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: voteQueryKey });
      const previousVote = queryClient.getQueryData<VoteState>(voteQueryKey);

      queryClient.setQueryData<VoteState>(voteQueryKey, (current) => {
        const nextVote = !(current ?? voteState).voted;

        return {
          count: Math.max(
            0,
            (current ?? voteState).count + (nextVote ? 1 : -1),
          ),
          voted: nextVote,
        };
      });

      return { previousVote };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(voteQueryKey, data);
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list() });
    },
  });
  const signedIn = isSignedIn ?? initialSignedIn;

  useEffect(() => {
    const supabase = createBrowserSupabase();

    if (!supabase) {
      return;
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
        () =>
          queryClient.invalidateQueries({
            queryKey: projectQueryKeys.votes(projectId),
          }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  function vote() {
    if (voteMutation.isPending) {
      return;
    }

    voteMutation.mutate();
  }

  if (!signedIn) {
    return (
      <SignInButton mode="modal">
        <Button
          className="h-12 px-5 text-sm uppercase tracking-[0.18em]"
          type="button"
        >
          Sign in to vote ({voteState.count})
        </Button>
      </SignInButton>
    );
  }

  return (
    <Button
      className="h-12 px-5 text-sm uppercase tracking-[0.18em]"
      aria-disabled={voteMutation.isPending}
      onClick={vote}
      type="button"
    >
      {voteState.voted
        ? `Voted (${voteState.count})`
        : `Vote (${voteState.count})`}
    </Button>
  );
}

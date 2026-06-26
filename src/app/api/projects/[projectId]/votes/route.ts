import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getVoteCount, hasVoted, toggleVote } from "@/lib/projects/store";

type Props = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { projectId } = await params;
  const { userId } = await auth();

  return NextResponse.json({
    count: await getVoteCount(projectId),
    voted: await hasVoted(projectId, userId ?? undefined),
  });
}

export async function POST(_request: Request, { params }: Props) {
  const { projectId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Sign in to vote." }, { status: 401 });
  }

  return NextResponse.json(await toggleVote(projectId, userId));
}

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/projects/store";
import { validateProjectSubmission } from "@/lib/projects/submissions";

export async function GET() {
  return NextResponse.json({ projects: await listProjects() });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { errors: { form: "Sign in to submit a project." } },
      { status: 401 },
    );
  }

  const values = (await request.json()) as Record<string, string>;
  const result = await validateProjectSubmission(values);

  if (!result.ok) {
    return NextResponse.json(
      { values: result.values, errors: result.errors },
      { status: 400 },
    );
  }

  const project = await createProject({
    ...result.data,
    ownerUserId: userId,
    spamScore: result.spam.confidence,
    spamReason: result.spam.reason,
  });

  revalidatePath("/projects");
  return NextResponse.json({ project }, { status: 201 });
}

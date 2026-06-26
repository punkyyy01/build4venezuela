import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { canEditProject, updateProject } from "@/lib/projects/store";
import { validateProjectSubmission } from "@/lib/projects/submissions";

type Props = {
  params: Promise<{ projectId: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  const { projectId } = await params;
  const { userId } = await auth();
  const values = (await request.json()) as Record<string, string>;

  if (!userId) {
    return NextResponse.json(
      { values, errors: { form: "Sign in to edit this project." } },
      { status: 401 },
    );
  }

  if (!(await canEditProject(projectId, userId))) {
    return NextResponse.json(
      {
        values,
        errors: {
          form: "You can only edit projects submitted from your account.",
        },
      },
      { status: 403 },
    );
  }

  const result = await validateProjectSubmission(values, projectId);

  if (!result.ok) {
    return NextResponse.json(
      { values: result.values, errors: result.errors },
      { status: 400 },
    );
  }

  const project = await updateProject(projectId, {
    ...result.data,
    spamScore: result.spam.confidence,
    spamReason: result.spam.reason,
  });

  revalidatePath("/projects");
  revalidatePath(`/p/${project.slug}`);
  return NextResponse.json({ project });
}

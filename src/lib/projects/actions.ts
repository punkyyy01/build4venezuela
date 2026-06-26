"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  formDataToValues,
  type ProjectFormInput,
  type ProjectFormState,
  projectFormSchema,
  validationErrors,
} from "./schema";
import { checkProjectForSpam } from "./spam";
import {
  canEditProject,
  createProject,
  isSlugAvailable,
  updateProject,
} from "./store";

function errorState(
  values: Record<string, string>,
  errors: Record<string, string>,
) {
  return { values, errors } satisfies ProjectFormState;
}

async function validateProjectSubmission(
  formData: FormData,
  currentProjectId?: string,
): Promise<
  | {
      ok: true;
      data: ProjectFormInput;
      spam: Awaited<ReturnType<typeof checkProjectForSpam>>;
    }
  | {
      ok: false;
      values: Record<string, string>;
      errors: Record<string, string>;
    }
> {
  const values = formDataToValues(formData);
  const parsed = projectFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, values, errors: validationErrors(parsed.error) };
  }

  if (!(await isSlugAvailable(parsed.data.slug, currentProjectId))) {
    return {
      ok: false,
      values,
      errors: { slug: "That slug is already taken." },
    };
  }

  const spam = await checkProjectForSpam(parsed.data);

  if (spam.isSpam && spam.confidence >= 0.7) {
    return {
      ok: false,
      values,
      errors: {
        form: `This looks like spam: ${spam.reason}`,
      },
    };
  }

  return {
    ok: true,
    data: parsed.data,
    spam,
  };
}

export async function createProjectAction(
  _previousState: ProjectFormState,
  formData: FormData,
) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/submit" });
  }

  const result = await validateProjectSubmission(formData);

  if (!result.ok) {
    return errorState(result.values, result.errors);
  }

  const project = await createProject({
    ...result.data,
    ownerUserId: userId,
    spamScore: result.spam.confidence,
    spamReason: result.spam.reason,
  });

  revalidatePath("/projects");
  redirect(`/p/${project.slug}`);
}

export async function updateProjectAction(
  _previousState: ProjectFormState,
  formData: FormData,
) {
  const { userId, redirectToSignIn } = await auth();
  const projectId = String(formData.get("projectId") ?? "");

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/projects" });
  }

  if (!(await canEditProject(projectId, userId))) {
    return errorState(formDataToValues(formData), {
      form: "You can only edit projects submitted from your account.",
    });
  }

  const result = await validateProjectSubmission(formData, projectId);

  if (!result.ok) {
    return errorState(result.values, result.errors);
  }

  const project = await updateProject(projectId, {
    ...result.data,
    spamScore: result.spam.confidence,
    spamReason: result.spam.reason,
  });

  revalidatePath("/projects");
  revalidatePath(`/p/${project.slug}`);
  redirect(`/p/${project.slug}`);
}

import {
  type ProjectFormInput,
  projectFormSchema,
  validationErrors,
} from "./schema";
import { checkProjectForSpam } from "./spam";
import { isSlugAvailable } from "./store";

export type ProjectSubmissionResult =
  | {
      ok: true;
      data: ProjectFormInput;
      spam: Awaited<ReturnType<typeof checkProjectForSpam>>;
    }
  | {
      ok: false;
      values: Record<string, string>;
      errors: Record<string, string>;
    };

export async function validateProjectSubmission(
  values: Record<string, string>,
  currentProjectId?: string,
): Promise<ProjectSubmissionResult> {
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

  if (!spam.validationPassed) {
    return {
      ok: false,
      values,
      errors: { form: spam.reason },
    };
  }

  if (spam.isSpam && spam.confidence >= 0.7) {
    return {
      ok: false,
      values,
      errors: { form: `This looks like spam: ${spam.reason}` },
    };
  }

  return {
    ok: true,
    data: parsed.data,
    spam,
  };
}

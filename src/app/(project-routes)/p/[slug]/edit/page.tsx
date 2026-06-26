import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { projectToFormValues } from "@/lib/projects/schema";
import { canEditProject, getProjectBySlug } from "@/lib/projects/store";
import { ProjectShell } from "../../../project-shell";
import { ProjectForm } from "../../../submit/project-form";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { userId } = await auth();

  if (!(await canEditProject(project.id, userId))) {
    notFound();
  }

  return (
    <ProjectShell>
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-primary">
              Edit
            </p>
            <h1 className="mt-5 font-mono text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.85] tracking-[-0.07em]">
              Update your project
            </h1>
            <p className="mt-6 max-w-md font-mono text-base uppercase leading-7 tracking-[0.12em] text-muted-foreground">
              Change any field, including the slug. The page URL updates after
              saving.
            </p>
          </div>
          <div className="border border-border bg-card p-5 sm:p-7">
            <ProjectForm
              initialState={{
                values: projectToFormValues(project),
                errors: {},
              }}
              projectId={project.id}
              submitLabel="Save changes"
            />
          </div>
        </div>
      </section>
    </ProjectShell>
  );
}

import { createProjectAction } from "@/lib/projects/actions";
import { emptyProjectFormState } from "@/lib/projects/schema";
import { ProjectShell } from "../project-shell";
import { ProjectForm } from "./project-form";

export default function SubmitProjectPage() {
  return (
    <ProjectShell>
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-primary">
              Submit
            </p>
            <h1 className="mt-5 font-mono text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.85] tracking-[-0.07em]">
              Add your project
            </h1>
            <p className="mt-6 max-w-md font-mono text-base uppercase leading-7 tracking-[0.12em] text-muted-foreground">
              Every accepted project gets a permanent page at /p/your-slug. You
              can edit the slug later from this browser.
            </p>
          </div>
          <div className="border border-border bg-card p-5 sm:p-7">
            <ProjectForm
              action={createProjectAction}
              initialState={emptyProjectFormState}
              submitLabel="Submit project"
            />
          </div>
        </div>
      </section>
    </ProjectShell>
  );
}

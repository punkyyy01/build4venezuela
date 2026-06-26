import { listProjects } from "@/lib/projects/store";
import { ProjectShell } from "../project-shell";
import { RealtimeProjectsGrid } from "./realtime-projects-grid";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <ProjectShell>
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-6 border-border border-b pb-8 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent">
                Project list
              </p>
              <h1 className="mt-4 font-mono text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.85] tracking-[-0.07em]">
                Shipped work
              </h1>
            </div>
            <a
              className="inline-flex border border-primary bg-primary px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-primary/80"
              href="/submit"
            >
              Submit yours
            </a>
          </div>

          <RealtimeProjectsGrid initialProjects={projects} />
        </div>
      </section>
    </ProjectShell>
  );
}

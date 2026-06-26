"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectFormState } from "@/lib/projects/schema";

type ProjectFormProps = {
  action: (
    state: ProjectFormState,
    formData: FormData,
  ) => Promise<ProjectFormState>;
  initialState: ProjectFormState;
  projectId?: string;
  submitLabel: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 text-destructive text-xs uppercase tracking-[0.16em]">
      {message}
    </p>
  );
}

export function ProjectForm({
  action,
  initialState,
  projectId,
  submitLabel,
}: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = state.values;

  return (
    <form action={formAction} className="grid gap-6">
      {projectId ? (
        <input type="hidden" name="projectId" value={projectId} />
      ) : null}

      {state.errors.form ? (
        <div className="border border-destructive bg-destructive/10 p-4 font-mono text-sm uppercase tracking-[0.12em] text-destructive">
          {state.errors.form}
        </div>
      ) : null}

      <label className="grid gap-2" htmlFor="project-slug">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Project slug
        </span>
        <Input
          id="project-slug"
          name="slug"
          defaultValue={values.slug}
          placeholder="cool-slug"
          required
        />
        <FieldError message={state.errors.slug} />
      </label>

      <label className="grid gap-2" htmlFor="project-name">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Project name
        </span>
        <Input
          id="project-name"
          name="name"
          defaultValue={values.name}
          required
        />
        <FieldError message={state.errors.name} />
      </label>

      <label className="grid gap-2" htmlFor="project-url">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Project link
        </span>
        <Input
          id="project-url"
          name="projectUrl"
          defaultValue={values.projectUrl}
          placeholder="https://..."
          required
          type="url"
        />
        <FieldError message={state.errors.projectUrl} />
      </label>

      <label className="grid gap-2" htmlFor="project-countries">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Participant countries
        </span>
        <Input
          id="project-countries"
          name="countries"
          defaultValue={values.countries}
          placeholder="Venezuela, Colombia, United States"
          required
        />
        <FieldError message={state.errors.countries} />
      </label>

      <label className="grid gap-2" htmlFor="project-participant-name">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Team or participant name
        </span>
        <Input
          id="project-participant-name"
          name="participantName"
          defaultValue={values.participantName}
          required
        />
        <FieldError message={state.errors.participantName} />
      </label>

      <label className="grid gap-2" htmlFor="project-video-url">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Demo video link
        </span>
        <Input
          id="project-video-url"
          name="videoUrl"
          defaultValue={values.videoUrl}
          placeholder="https://youtu.be/..."
          required
          type="url"
        />
        <FieldError message={state.errors.videoUrl} />
      </label>

      <label className="grid gap-2" htmlFor="project-description">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Markdown description
        </span>
        <Textarea
          className="min-h-64 text-sm leading-6"
          id="project-description"
          name="descriptionMarkdown"
          defaultValue={values.descriptionMarkdown}
          placeholder={
            "## What did you build?\n\nWho is it for? How does it help? What should people try first?"
          }
          required
        />
        <FieldError message={state.errors.descriptionMarkdown} />
      </label>

      <Button
        className="h-12 text-sm uppercase tracking-[0.18em]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Checking..." : submitLabel}
      </Button>
    </form>
  );
}

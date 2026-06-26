import type {
  Project,
  ProjectComment,
  ProjectFormState,
} from "@/lib/projects/schema";

export const projectQueryKeys = {
  all: ["projects"] as const,
  comments: (projectId: string) =>
    [...projectQueryKeys.detail(projectId), "comments"] as const,
  detail: (projectId: string) => [...projectQueryKeys.all, projectId] as const,
  list: () => [...projectQueryKeys.all, "list"] as const,
  votes: (projectId: string) =>
    [...projectQueryKeys.detail(projectId), "votes"] as const,
};

type ProjectVote = {
  count: number;
  voted: boolean;
};

type CommentErrorResponse = {
  error?: string;
  errors?: Record<string, string>;
};

export type ProjectFormValues = ProjectFormState["values"];

type ProjectFormErrorResponse = {
  values?: ProjectFormValues;
  errors?: Record<string, string>;
};

export type ProjectMutationInput = {
  projectId?: string;
  values: ProjectFormValues;
};

export class ProjectFormError extends Error {
  values: ProjectFormValues;
  errors: Record<string, string>;

  constructor(response: ProjectFormErrorResponse, fallback: string) {
    super(response.errors?.form ?? fallback);
    this.name = "ProjectFormError";
    this.values = response.values ?? {};
    this.errors = response.errors ?? { form: fallback };
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function responseError(response: Response, fallback: string) {
  try {
    const data = await parseJson<CommentErrorResponse>(response);
    return new Error(data.errors?.body ?? data.error ?? fallback);
  } catch {
    return new Error(fallback);
  }
}

export async function fetchProjects() {
  const response = await fetch("/api/projects", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Could not load projects.");
  }

  const data = await parseJson<{ projects: Project[] }>(response);
  return data.projects;
}

export async function fetchProjectVote(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}/votes`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load votes.");
  }

  return parseJson<ProjectVote>(response);
}

export async function toggleProjectVote(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}/votes`, {
    method: "POST",
  });

  if (!response.ok) {
    throw await responseError(response, "Could not vote.");
  }

  return parseJson<ProjectVote>(response);
}

export async function fetchProjectComments(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}/comments`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load comments.");
  }

  const data = await parseJson<{ comments: ProjectComment[] }>(response);
  return data.comments;
}

export async function createProjectComment(projectId: string, body: string) {
  const response = await fetch(`/api/projects/${projectId}/comments`, {
    body: JSON.stringify({ body }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    throw await responseError(response, "Could not add comment.");
  }

  return parseJson<ProjectComment>(response);
}

export async function toggleProjectCommentVote(
  projectId: string,
  commentId: string,
) {
  const response = await fetch(
    `/api/projects/${projectId}/comments/${commentId}/votes`,
    { method: "POST" },
  );

  if (!response.ok) {
    throw await responseError(response, "Could not vote.");
  }

  return parseJson<ProjectVote>(response);
}

export async function saveProject({ projectId, values }: ProjectMutationInput) {
  const response = await fetch(
    projectId ? `/api/projects/${projectId}` : "/api/projects",
    {
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
      method: projectId ? "PATCH" : "POST",
    },
  );

  if (!response.ok) {
    throw new ProjectFormError(
      await parseJson<ProjectFormErrorResponse>(response),
      "Could not save project.",
    );
  }

  const data = await parseJson<{ project: Project }>(response);
  return data.project;
}

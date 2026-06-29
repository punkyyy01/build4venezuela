import { expect, test } from "bun:test";
import { type Project, sortProjectsByVotes } from "./schema";

function project(overrides: Partial<Project>): Project {
  return {
    id: "project-id",
    slug: "project-slug",
    name: "Project",
    status: "published",
    lifecycleStatus: "ready_to_use",
    projectUrl: "https://example.com",
    countries: ["Venezuela"],
    participantName: "Team",
    videoUrl: "",
    contributeInUrl: "",
    descriptionMarkdown: "Description",
    ownerName: "Owner",
    ownerImageUrl: "",
    publishedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    votesCount: 0,
    ...overrides,
  };
}

test("sortProjectsByVotes prioritizes video when vote counts tie", () => {
  const sorted = sortProjectsByVotes([
    project({
      id: "newer-no-video",
      votesCount: 5,
      publishedAt: "2026-02-01T00:00:00.000Z",
    }),
    project({
      id: "older-with-video",
      votesCount: 5,
      videoUrl: "https://youtube.com/watch?v=abc12345678",
    }),
    project({ id: "highest-votes", votesCount: 6 }),
  ]);

  expect(sorted.map((item) => item.id)).toEqual([
    "highest-votes",
    "older-with-video",
    "newer-no-video",
  ]);
});

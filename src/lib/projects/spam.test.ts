import { expect, test } from "bun:test";
import { checkProjectForSpam } from "./spam";

const validProject = {
  slug: "civic-dashboard",
  name: "Civic Dashboard",
  projectUrl: "https://example.com",
  countries: "Venezuela",
  participantName: "Build Team",
  videoUrl: "https://youtube.com/watch?v=abc12345678",
  descriptionMarkdown:
    "A civic dashboard that helps organizers track community needs, coordinate volunteers, and publish transparent progress updates for local recovery projects.",
};

test("spam validation fails closed when AI Gateway API key is missing", async () => {
  await expect(checkProjectForSpam(validProject, false)).resolves.toEqual({
    isSpam: false,
    confidence: 0,
    reason: "AI Gateway is not configured.",
    validationPassed: false,
  });
});

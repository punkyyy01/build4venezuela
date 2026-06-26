import { NextResponse } from "next/server";
import { listProjects } from "@/lib/projects/store";

export async function GET() {
  return NextResponse.json({ projects: await listProjects() });
}

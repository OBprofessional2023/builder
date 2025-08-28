// app/api/match/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { jobDescriptionn } = await req.json();

  const response = await fetch("http://localhost:8000/matchScore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: jobDescriptionn }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

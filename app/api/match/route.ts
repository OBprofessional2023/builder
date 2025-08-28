// app/api/match/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { jobDescription } = await req.json();

  const response = await fetch("http://localhost:8000/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: jobDescription }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

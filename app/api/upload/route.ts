// app/api/upload/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  // Convert FormData to body for FastAPI
  const file = formData.get("file") as File;

  const forwardForm = new FormData();
  forwardForm.append("file", file);

  const response = await fetch("http://localhost:8000/upload", {
    method: "POST",
    body: forwardForm,
  });

  const data = await response.json();
  return NextResponse.json(data);
}

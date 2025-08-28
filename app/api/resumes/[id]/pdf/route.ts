// app/api/resumes/[id]/pdf/route.ts
import { ResumePDFTwo, ResumeStateTwo } from "../../../../components/ResumeFormTwo";
import { NextResponse } from "next/server";
import { pdf  } from "@react-pdf/renderer";
import pool from "@/lib/db";

// 👇 force Node.js runtime
export const runtime = "nodejs";

export async function GET(req: Request, context: { params: any }) {
  try {
    // Await the params first
    const { params } = await context;
    const { id } = params;

    // fetch resume from DB
    const result = await pool.query("SELECT * FROM resume WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Resume not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resume = result.rows[0];
    // resume.json();

    // generate PDF
    const pdfBuffer = await pdf(<ResumePDFTwo resume={resume} />).toBuffer();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=resume.pdf",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
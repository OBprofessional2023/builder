import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await req.json();

    const {
      name,
      street,
      phone,
      email,
      linkedin,
      github,
      job_description,
      skills,
      experience,
      education,
    } = body;

    // Convert arrays/objects to JSON/text for storage
    const skillsText = JSON.stringify(skills || []);
    const experienceText = JSON.stringify(experience || []);
    const educationText = JSON.stringify(education || []);

    const result = await pool.query(
      `
      UPDATE resume
      SET
        name = $1,
        street = $2,
        phone = $3,
        email = $4,
        linkedin = $5,
        github = $6,
        job_description = $7,
        skills = $8,
        experience = $9,
        education = $10,
        last_updated = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *;
      `,
      [
        name,
        street,
        phone,
        email,
        linkedin,
        github,
        job_description,
        skillsText,
        experienceText,
        educationText,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id, resume: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
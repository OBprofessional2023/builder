import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST() {
  try {
    const result = await pool.query(
      `INSERT INTO resume DEFAULT VALUES RETURNING *`
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("Error creating resume:", err);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM resume WHERE email IS NOT NULL;"
    );

    console.log("Fetched resumes:", result.rows); // 👈 logs to terminal

    return NextResponse.json({ resumes: result.rows });
  } catch (err) {
    console.error("Error fetching resumes:", err);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

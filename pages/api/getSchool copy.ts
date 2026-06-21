import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // 1️⃣ Get student info
    const [studentInfo] = await sql`
      SELECT schoolid, course
      FROM tblstudent
      WHERE email = ${email}
      LIMIT 1
    `;

    if (!studentInfo) {
      return res.status(404).json({ error: "Student not found" });
    }

    const { schoolid, course } = studentInfo;

    // 2️⃣ Get school name from refschool
    const [school] = await sql`
      SELECT schoolname, campus
      FROM refschool
      WHERE schoolid = ${schoolid}
      LIMIT 1
    `;

    // 3️⃣ Get subjects from refschoolmasterfile
    const subjects = await sql`
      SELECT subjectcode, subjectdescription
      FROM refschoolmasterfile
      WHERE schoolid = ${schoolid} AND course = ${course}
    `;

    return res.status(200).json({
      schoolid,
      schoolname: school?.schoolname || "-",
      campus: school?.campus || "-",
      courses: subjects.map((s) => ({
        subjectcode: s.subjectcode,
        subjectdescription: s.subjectdescription,
      })),
    });
  } catch (err) {
    console.error("Error fetching school data:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
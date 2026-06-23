import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      error: "Email is required",
    });
  }

  try {
    // Get student information
    const [studentInfo] = await sql`
      SELECT
        a.scholardid,
        a.school,
        a.course
      FROM tblscholarsdata a
      INNER JOIN tblUsers b
        ON a.scholardid = b.scholardid
      WHERE b.email = ${email}
      LIMIT 1
    `;

    if (!studentInfo) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    const { scholardid, school, course } = studentInfo;

    // Get enrolled subjects
    const subjects = await sql`
      SELECT
        enrollmentid,
        academicyear,
        semester,
        subjectname,
        subjectcode,
        units
      FROM tblscholarsubjects
      WHERE scholarid = ${scholardid}
      ORDER BY academicyear DESC,
               semester,
               subjectcode
    `;

    return res.status(200).json({
      scholardid,
      schoolname: school || "-",
      course: course || "-",
      courses: subjects.map((s) => ({
        enrollmentid: s.enrollmentid,
        academicyear: s.academicyear,
        semester: s.semester,
        subjectcode: s.subjectcode,
        subjectname: s.subjectname,
        units: s.units,
      })),
    });
  } catch (err) {
    console.error("Error fetching school data:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
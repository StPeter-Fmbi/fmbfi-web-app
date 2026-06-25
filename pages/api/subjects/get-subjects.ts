import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    // Get Scholar ID
    const [student] = await sql`
      SELECT a.scholardid
      FROM tblscholarsdata a
      INNER JOIN tblUsers b
        ON a.scholardid = b.scholardid
      WHERE b.email = ${email}
      LIMIT 1
    `;

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get Subjects
    const subjects = await sql`
    SELECT
    enrollmentid,
    academicyear,
    semester,
    subjectcode,
    subjectname,
    units
  FROM tblscholarsubjects
  WHERE scholarid = ${student.scholardid}
    AND finalgrade IS NULL or finalgrade = 0.00
    AND "IsActive" = 0
  ORDER BY
    academicyear DESC,
    semester,
    subjectcode
`;

    return res.status(200).json({
      success: true,
      subjects,
    });
  } catch (error: any) {
    console.error("Get Subjects Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
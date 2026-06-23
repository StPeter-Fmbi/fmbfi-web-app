import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const body = req.body;

    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
      });
    }

    // Validate required fields
    const invalidRow = body.find(
      (item) =>
        !item.year ||
        !item.sem ||
        !item.subject ||
        !item.subjectcode ||
        !item.StudentID,
    );

    if (invalidRow) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // Check duplicate subject codes in request
    const subjectCodes = body.map((x) =>
      String(x.subjectcode).trim().toUpperCase(),
    );

    const hasDuplicateCodes =
      new Set(subjectCodes).size !== subjectCodes.length;

    if (hasDuplicateCodes) {
      return res.status(400).json({
        success: false,
        message: "Duplicate subject codes found.",
      });
    }

    const currentYear = new Date().getFullYear();

    const latestEnrollment = await sql`
      SELECT enrollmentid
      FROM tblscholarsubjects
      WHERE enrollmentid LIKE ${`ENR-${currentYear}-%`}
      ORDER BY enrollmentid DESC
      LIMIT 1
    `;

    let nextNumber = 1;

    if (latestEnrollment.length > 0) {
      const lastId = latestEnrollment[0].enrollmentid;

      const parts = lastId.split("-");

      if (parts.length === 3) {
        nextNumber = parseInt(parts[2], 10) + 1;
      }
    }

const generatedIds: string[] = [];

for (let i = 0; i < body.length; i++) {
  const item = body[i];

  const enrollmentid =
    `ENR-${currentYear}-${String(nextNumber + i).padStart(5, "0")}`;

  generatedIds.push(enrollmentid);

  await sql`
    INSERT INTO tblscholarsubjects
    (
      enrollmentid,
      academicyear,
      semester,
      subjectname,
      subjectcode,
      units,
      scholarid
    )
    VALUES
    (
      ${enrollmentid},
      ${item.year},
      ${item.sem},
      ${item.subject},
      ${item.subjectcode},
      ${Number(item.units) || 0},
      ${item.StudentID}
    )
  `;
}

return res.status(200).json({
  success: true,
  enrollmentids: generatedIds,
  message: "Subjects submitted successfully.",
});

  } catch (error) {
    console.error("Subject Insert Error:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}

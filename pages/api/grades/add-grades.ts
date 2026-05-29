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

    if (!Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
      });
    }

    await sql.transaction(
      body.map(
        (item: any) =>
          sql`
          INSERT INTO "TblGrades"
          (
            "StudentId",
            "Subject",
            "SubjectCode",
            "Grade"
          )
          VALUES
          (
            ${item.StudentId},
            ${item.subject},
            ${item.subjectcode},
            ${item.grade}
          )
        `,
      ),
    );

    return res.status(200).json({
      success: true,
      message: "Inserted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: String(error),
    });
  }
}

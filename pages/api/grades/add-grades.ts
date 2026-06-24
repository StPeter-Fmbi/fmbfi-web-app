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
      body.flatMap((item: any) => [

        // Update Scholar Subject
        sql`
          UPDATE "tblscholarsubjects"
          SET
            "finalgrade" = ${item.grade}
          WHERE
            "scholarid" = ${item.StudentId}
            AND "subjectcode" = ${item.SubjectCode}
        `,
      ]),
    );

    return res.status(200).json({
      success: true,
      message: "Grades submitted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: String(error),
    });
  }
}
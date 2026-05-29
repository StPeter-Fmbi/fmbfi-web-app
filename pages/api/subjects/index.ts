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

  try {
    const subjects = await sql`
      SELECT
        "Subject",
        "SubjectCode"
      FROM "TblSubject"
      ORDER BY "Subject" ASC
    `;

    return res.status(200).json(subjects);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: String(error),
    });
  }
}

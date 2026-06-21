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

    const year = new Date().getFullYear();

  const result = await sql`
    SELECT enrollmentid
    FROM tblscholarsubjects
    WHERE enrollmentid LIKE ${`ENR-${year}-%`}
    ORDER BY enrollmentid DESC
    LIMIT 1
  `;

  let nextNumber = 1;

  if (result.length > 0) {
    nextNumber =
      parseInt(result[0].enrollmentid.split("-")[2], 10) + 1;
  }

  const enrollmentid =
    "ENR-" +
    year +
    "-" +
    String(nextNumber).padStart(5, "0");

    await sql.transaction(
      body.map(
        (item: any) =>
          sql`
          INSERT INTO "tblscholarsubjects"
          (
            "enrollmentid",
            "year",
            "semester",
            "subjectname",
            "subjectcode",
            "scholarid"
          )
          VALUES
          (
            ${enrollmentid},
            ${item.year},
            ${item.sem},
            ${item.subject},
            ${item.subjectcode},
            ${item.StudentID}
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

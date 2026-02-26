import { sql } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export interface ISubject {
  schoolid: string;
  schoolname: string;
  course: string;
  subjectcode: string;
  subjectdescription: string;
}

// Fetch subjects
async function getSubjects(res: NextApiResponse) {
  try {
    const result = await sql`
      SELECT schoolid, schoolname, course, subjectcode, subjectdescription
      FROM refschoolmasterfile
    `;

    const subjects: ISubject[] = result.map((row: Record<string, any>) => ({
      schoolid: row.schoolid,
      schoolname: row.schoolname,
      course: row.course,
      subjectcode: row.subjectcode,
      subjectdescription: row.subjectdescription,
    }));

    return res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ error: "Failed to fetch subjects" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getSubjects(res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

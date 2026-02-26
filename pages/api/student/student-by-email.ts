import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const [student] = await sql`
      SELECT scholarid, lastname, firstname, middlename, schoolid, email, mobileno, coursecode, courseyear, course, gpa, dateofbirth, batchno, schoolyear, endofscholarshipdate, status
      FROM tblstudent
      WHERE email = ${email}
      LIMIT 1
    `;

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

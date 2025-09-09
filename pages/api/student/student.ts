import { sql } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// export async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { name, age } = req.body;

//     if (!name || !age) {
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     await sql`
//       INSERT INTO student (name, age)
//       VALUES (${name}, ${age})
//     `;

//     return res.status(201).json({ message: "Student added successfully" });
//   } catch (err) {
//     console.error("Error inserting student:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// }

export interface IGrades {
  subject: string;
  yearandsem: string;
  grade: number;
}

async function insertGrades(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Expecting an array of grades in the body
    // e.g., [{ student_id: 1, grade: 95 }, { student_id: 2, grade: 88 }]
    const grades: IGrades[] = req.body;

    console.log("Grades : ", grades);

    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: "Grades array is required" });
    }

    // Build parameter placeholders like ($1, $2), ($3, $4) ...
    // const values: any[] = [];
    // const placeholders = grades
    //   .map((a, i) => {
    //     values.push(a.subject, a.yearandsem, a.grade);
    //     const startIndex = i * 2 + 1;
    //     return `($${startIndex}, $${startIndex + 1})`;
    //   })
    //   .join(", ");

    // // Insert all rows in one query
    // const result = await sql.query(
    //   `INSERT INTO tblgrades (subject, yearandsem, grade) VALUES ${placeholders};`,
    //   values
    // );

    const values = grades
      .map((g, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
      .join(", ");

    const params = grades.flatMap((g) => [g.subject, g.yearandsem, g.grade]);

    const result = await sql.query(
      `INSERT INTO tblgrades (subject, yearandsem, grade)
       VALUES ${values}
       RETURNING *;`,
      params
    );

    return res.status(200).json({ message: "Record inserted successfully!" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

async function getStudents(res: NextApiResponse) {
  const students = await sql`SELECT * FROM tblUser`;
  return res.status(200).json(students);
}

// Default export (entry point)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") return getStudents(res);
    if (req.method === "POST") return insertGrades(req, res);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Error in student API:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

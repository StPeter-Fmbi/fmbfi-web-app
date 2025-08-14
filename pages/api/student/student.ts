import { sql } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

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
    // if (req.method === "POST") return addStudent(req, res);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Error in student API:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// pages/api/register.ts

import { sql } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await sql`SELECT * FROM tblusers WHERE email = ${email} LIMIT 1`;
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Insert user - password stored plaintext (not secure!)
    await sql`
      INSERT INTO tbluser (email, password)
      VALUES (${email}, ${password})
    `;

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import { sql } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Fetch all at once — much cleaner and future-proof
    const result = await sql`
      SELECT scholarid, username, email, password, auditdate, role
      FROM tblusers
      WHERE email = ${email}
      LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result[0];

    // Basic password validation (replace with hashing)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const safeUser = {
      scholarid: user.scholarid,
      username: user.username,
      email: user.email,
      auditdate: user.auditdate,
      role: user.role || "User",
    };

    return res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

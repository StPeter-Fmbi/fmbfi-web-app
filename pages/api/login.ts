import { sql } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  try {
    const result = await sql`
      SELECT
        scholarid,
        username,
        email,
        password,
        auditdate,
        role,
        "isPasswordChanged"
      FROM tblusers
      WHERE email = ${email}
      LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const user = result[0];

    let isValidPassword = false;

    // Legacy users (plaintext password)
    if (!user.isPasswordChanged) {
      isValidPassword = user.password === password;
    }
    // Users with bcrypt password
    else {
      isValidPassword = await bcrypt.compare(
        password,
        user.password
      );
    }

    const compareResult = await bcrypt.compare(
  password,
  user.password
);

console.log("Entered Password:", password);
console.log("Stored Hash:", user.password);
console.log("Compare Result:", compareResult);

isValidPassword = compareResult;

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const safeUser = {
      scholarid: user.scholarid,
      username: user.username,
      email: user.email,
      auditdate: user.auditdate,
      role: user.role || "User",
      isPasswordChanged: user.isPasswordChanged,
    };

    return res.status(200).json({
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
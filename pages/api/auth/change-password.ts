import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const users = await sql`
      SELECT
        password,
        "isPasswordChanged"
      FROM tblusers
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const currentPassword = users[0].password;
    const isPasswordChanged = users[0].isPasswordChanged;

    let isSamePassword = false;

    // Old accounts (plaintext password)
    if (!isPasswordChanged) {
      isSamePassword = password === currentPassword;
    }
    // New accounts (bcrypt password)
    else {
      isSamePassword = await bcrypt.compare(
        password,
        currentPassword,
      );
    }

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from your current password.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    // Update password
    await sql`
      UPDATE tblusers
      SET
        password = ${hashedPassword},
        "isPasswordChanged" = 1
      WHERE email = ${email}
    `;

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the password.",
    });
  }
}
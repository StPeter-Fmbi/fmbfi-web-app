import { NextApiRequest, NextApiResponse } from "next";
import { allowCors } from "../../lib/cors";
import { getUserData } from "../../lib/googleSheets"; // Import the function

// Main handler function
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await getUserData(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const role = user[2]; // Role is in the third column (index 2)
    return res.status(200).json({ email, role });
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default allowCors(handler); // Use the CORS handler

import { NextApiRequest, NextApiResponse } from "next";
import { allowCors } from "../../lib/cors";
import { fetchSheetData, transformRowsToData } from "../../lib/googleSheets"; // Import the functions

// Main handler function
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests are allowed" });
  }

  try {
    const rows = await fetchSheetData();

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const data = transformRowsToData(rows);

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default allowCors(handler); // Use the CORS handler

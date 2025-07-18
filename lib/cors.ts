// lib/cors.ts
import { NextApiRequest, NextApiResponse } from "next";

// Helper function to handle CORS
export const allowCors = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust the CORS policy as needed
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight request
  }

  return handler(req, res);
};

import { NextApiRequest, NextApiResponse } from "next";
import { submitUserData } from "../../lib/googleSheets"; // Import submitUserData function

type SheetForm = {
  name: string;
  email: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests are allowed" });
  }

  const body = req.body as SheetForm;

  try {
    // Submit the user data to Google Sheets
    const response = await submitUserData(body.name, body.email);

    return res.status(200).json({
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { Readable } from "stream";

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

auth.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      fileName,
      mimeType,
      fileContent,
      lastName,
    } = req.body;

    if (!fileName || !fileContent || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const drive = google.drive({
      version: "v3",
      auth,
    });

    const parentFolderId = process.env.GOOGLE_DRIVE_GRADES_FOLDER_ID!;

    // ===========================================
    // Look for existing folder
    // ===========================================
    const existingFolder = await drive.files.list({
      q: `'${parentFolderId}' in parents
          and mimeType='application/vnd.google-apps.folder'
          and name='${lastName}'
          and trashed=false`,
      fields: "files(id,name)",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    let folderId: string;

    if (existingFolder.data.files?.length) {
      folderId = existingFolder.data.files[0].id!;
    } else {
      const folder = await drive.files.create({
        requestBody: {
          name: lastName,
          mimeType: "application/vnd.google-apps.folder",
          parents: [parentFolderId],
        },
        fields: "id",
        supportsAllDrives: true,
      });

      folderId = folder.data.id!;
    }

    // ===========================================
    // Upload File
    // ===========================================

    const buffer = Buffer.from(fileContent, "base64");

    const upload = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: Readable.from(buffer),
      },
      supportsAllDrives: true,
      fields: "id,name",
    });

    const fileId = upload.data.id!;

    // ===========================================
    // Make Public (Optional)
    // ===========================================

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
      supportsAllDrives: true,
    });

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      fileId,
      folderId,
      fileUrl: `https://drive.google.com/file/d/${fileId}/view`,
    });

  } catch (error: any) {
    console.error("UPLOAD ERROR");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed.",
    });
  }
}
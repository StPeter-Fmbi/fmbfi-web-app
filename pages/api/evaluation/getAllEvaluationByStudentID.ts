import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

export interface IEvaluation {
  enrollmentid: string;
  scholarid: string;
  subjectname: string;
  subjectcode: string;
  semester: string;
  academicyear: string;
  year: string;
  units: number;
  finalgrade: number | null;
  isactive: number;
  auditdate: Date | null;
  audituser: string | null;
  editdate: Date | null;
  edituser: string | null;
}

export interface IGetEvaluationResponse {
  success: boolean;
  message?: string;
  data?: IEvaluation[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGetEvaluationResponse>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { scholarid } = req.query;

    if (!scholarid || typeof scholarid !== "string") {
      return res.status(400).json({
        success: false,
        message: "Scholar ID is required.",
      });
    }

    const result = (await sql`
      SELECT
        enrollmentid,
        scholarid,
        subjectname,
        subjectcode,
        semester,
        academicyear,
        year,
        units,
        finalgrade,
        auditdate,
        audituser,
        editdate,
        edituser,
        isactive
      FROM "tblscholarsubjects"
      WHERE scholarid = ${scholarid}
      ORDER BY
        academicyear DESC,
        semester DESC,
        year ASC,
        subjectname ASC
    `) as IEvaluation[];

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getallbyStudentID:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

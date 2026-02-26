// types/student.ts
export type Student = {
  scholarid: number;
  lastname: string;
  firstname: string;
  middlename?: string | null;
  schoolid: string;
  email: string;
  mobileno: string;
  coursecode: string;
  courseyear: string;
  course?: string | null;
  gpa?: number | null;
  dateofbirth: string;
  batchno: string;
  schoolyear: string;
  endofscholarshipdate?: string | null;
  status?: string | null;
  announcements?: { title: string; date?: string }[];
};
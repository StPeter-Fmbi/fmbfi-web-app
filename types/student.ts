// types/student.ts
export type Student = {
  scholardid: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  school: string;
  email: string;
  mobile_no: string;
  sy: string;
  course?: string | null;
  batch: string;
  year_start: string;
  //endofscholarshipdate?: string | null;
  status?: string | null;
  announcements?: { title: string; date?: string }[];
};
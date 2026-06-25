import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";

export function useStudent() {
  const { data: session, status } = useSession({ required: true });

  const [student, setStudent] = useState<Student | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.email) return;

    const fetchData = async () => {
      try {
        setLoadingData(true);

        const studentRes = await fetch(
          `/api/student/student-by-email?email=${encodeURIComponent(
            session.user.email,
          )}`,
        );

        if (!studentRes.ok)
          throw new Error("Failed to fetch student data");

        const studentData: Student = await studentRes.json();

        setStudent(studentData);

        const schoolRes = await fetch(
          `/api/student/getSchool?email=${encodeURIComponent(
            studentData.email,
          )}`,
        );

        if (!schoolRes.ok)
          throw new Error("Failed to load school info");

        const schoolData = await schoolRes.json();

        setSchoolName(schoolData.schoolname || "");
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [session, status]);

  return {
    session,
    status,
    student,
    schoolName,
    image: session?.user?.image,
    error,
    isLoading: status === "loading" || loadingData,
  };
}
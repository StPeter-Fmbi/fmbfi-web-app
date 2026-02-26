import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Footer from "@/components/Footer";
import { Student } from "@/types/student"; // path to the shared type
import StudentHeader from "@/components/StudentHeader";

const StudentProfile = () => {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [error, setError] = useState("");

  const fetchSchoolInfo = async (email: string) => {
    try {
      const res = await fetch(
        `/api/student/getSchool?email=${encodeURIComponent(email)}`,
      );
      if (!res.ok) throw new Error("Failed to load school info");

      const data = await res.json();
      setSchoolName(data.schoolname || "");
    } catch (err) {
      console.error(err);
    }
  };
  
  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "User") {
      router.replace("/login");
    }
  }, [status, session, router]);
  

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.email) return;

    const fetchStudentAndSchool = async () => {
      try {
        // Fetch student info
        const studentRes = await fetch(
          `/api/student/student-by-email?email=${encodeURIComponent(session.user.email)}`,
        );
        if (!studentRes.ok) throw new Error("Failed to fetch student data");
        const studentData: Student = await studentRes.json();
        setStudent(studentData);

        // Fetch school info (depends on student email)
        const schoolRes = await fetch(
          `/api/getSchool?email=${encodeURIComponent(studentData.email)}`,
        );
        if (!schoolRes.ok) throw new Error("Failed to load school info");
        const schoolData = await schoolRes.json();

        // Set school name
        if (schoolData.schoolname) setSchoolName(schoolData.schoolname);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch data");
      }
    };

    fetchStudentAndSchool();
  }, [session, status]);

  useEffect(() => {
    if (student) {
      fetchSchoolInfo(student.email);
    }
  }, [student]);

  if (status === "loading") return <p className="p-6">Loading…</p>;
  if (!session || session.user?.role !== "User") return <p>Redirecting…</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  if (!student) {
    return (
      <div className="p-6 text-center text-gray-500 mt-24 xl:ml-64">
        Loading your information…
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>FMBFI | Scholar Dashboard</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        {/* MAIN */}
        <div className="flex-grow xl:ml-64 pt-24 p-6 font-body">
          {/* HEADER */}
          <StudentHeader
            student={student}
            image={session?.user?.image}
            schoolName={schoolName}
          />

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Current GPA */}
            <div className="bg-white border rounded-lg shadow p-4 text-center">
              <p className="text-gray-500 text-sm">Current GPA</p>
              <p className="text-2xl font-bold text-[#d12f27]">
                {student.gpa ?? "N/A"}
              </p>
            </div>

            {/* Scholarship Status */}
            <div className="bg-white border rounded-lg shadow p-4 text-center">
              <p className="text-gray-500 text-sm">Scholarship Status</p>
              <p
                className={`text-2xl font-bold ${
                  student.status === "Active"
                    ? "text-green-600"
                    : "text-[#d12f27]"
                }`}
              >
                {student.status ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* PERSONAL INFORMATION CARD */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 md:p-6 space-y-4 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-[#d12f27] mb-3">
                Personal Information
              </h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {[
                  { label: "Scholar ID", value: student.scholarid },
                  { label: "Course", value: student.course || "—" },
                  { label: "Year Level", value: student.courseyear },
                ].map((item, idx) => (
                  <div
                    key={`personal-${idx}`}
                    className="flex flex-col md:flex-row md:justify-between py-2"
                  >
                    <span className="text-gray-500 text-sm md:text-base">
                      {item.label}
                    </span>
                    <span className="text-gray-800 text-sm md:text-base mt-1 md:mt-0">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SCHOLARSHIP INFORMATION CARD */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 md:p-6 space-y-4 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-[#d12f27] mb-3">
                Scholarship Information
              </h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {[
                  { label: "Batch No", value: student.batchno },
                  { label: "Academic Year", value: student.schoolyear },
                  {
                    label: "End of Scholarship",
                    value: student.endofscholarshipdate
                      ? new Date(
                          student.endofscholarshipdate,
                        ).toLocaleDateString()
                      : "—",
                  },
                ].map((item, idx) => (
                  <div
                    key={`scholarship-${idx}`}
                    className="flex flex-col md:flex-row md:justify-between py-2"
                  >
                    <span className="text-gray-500 text-sm md:text-base">
                      {item.label}
                    </span>
                    <span className="text-gray-800 text-sm md:text-base mt-1 md:mt-0">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Notifications / Announcements */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            {/* Announcements */}
            <div className="bg-white border rounded-lg shadow p-4">
              <h3 className="text-red-600 font-semibold mb-2">Announcements</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {student.announcements?.length ? (
                  student.announcements.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{item.title}</span> —{" "}
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : ""}
                    </li>
                  ))
                ) : (
                  <li>No announcements yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StudentProfile;

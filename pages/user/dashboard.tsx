import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Footer from "@/components/Footer";
import { Student } from "@/types/student";
import StudentHeader from "@/components/StudentHeader";

const StudentProfile = () => {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

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
        setLoadingData(true);

        const studentRes = await fetch(
          `/api/student/student-by-email?email=${encodeURIComponent(
            session.user.email,
          )}`,
        );

        if (!studentRes.ok) throw new Error("Failed to fetch student data");

        const studentData: Student = await studentRes.json();
        setStudent(studentData);

        const schoolRes = await fetch(
          `/api/getSchool?email=${encodeURIComponent(studentData.email)}`,
        );

        if (!schoolRes.ok) throw new Error("Failed to load school info");

        const schoolData = await schoolRes.json();

        if (schoolData.schoolname) {
          setSchoolName(schoolData.schoolname);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchStudentAndSchool();
  }, [session, status]);

  useEffect(() => {
    if (student) {
      fetchSchoolInfo(student.email);
    }
  }, [student]);

  // ✅ FIX: ONLY depend on loadingData + auth status
  const isLoading = status === "loading" || loadingData;

  return (
    <>
      <Head>
        <title>FMBFI | Scholar Dashboard</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        {/* MAIN */}
        <div className="flex-1 w-full xl:ml-64 pt-20 md:pt-24 p-3 sm:p-4 md:p-6 font-body overflow-x-hidden">
          {/* HEADER (only when ready) */}
          {student && (
            <StudentHeader
              student={student}
              image={session?.user?.image}
              schoolName={schoolName}
            />
          )}

          {/* LOADING (NO BUG NOW) */}
          {isLoading && (
            <div className="flex items-center gap-4 mb-6 animate-pulse">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && <p className="text-red-500 p-4">{error}</p>}

          {/* CONTENT */}
          {!isLoading && student && (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border rounded-lg shadow p-4 text-center">
                  <p className="text-gray-500 text-sm">Current GPA</p>
                  <p className="text-2xl font-bold text-[#d12f27]">{"N/A"}</p>
                </div>

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

              {/* CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* PERSONAL */}
                <div className="bg-white border rounded-xl shadow-sm p-5 md:p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-[#d12f27]">
                    Personal Information
                  </h2>

                  <div className="flex flex-col divide-y divide-gray-100">
                    {[
                      { label: "Scholar ID", value: student.scholardid },
                      { label: "Course", value: student.course || "—" },
                      { label: "Year Level", value: student.sy },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row md:justify-between py-2"
                      >
                        <span className="text-gray-500 text-sm">
                          {item.label}
                        </span>
                        <span className="text-gray-800 text-sm">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SCHOLARSHIP */}
                <div className="bg-white border rounded-xl shadow-sm p-5 md:p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-[#d12f27]">
                    Scholarship Information
                  </h2>

                  <div className="flex flex-col divide-y divide-gray-100">
                    {[
                      { label: "Batch No", value: student.batch },
                      { label: "Academic Year", value: student.sy },
                      // {
                      //   label: "End of Scholarship",
                      //   value: student.endofscholarshipdate
                      //     ? new Date(
                      //         student.endofscholarshipdate
                      //       ).toLocaleDateString()
                      //     : "—",
                      // },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row md:justify-between py-2"
                      >
                        <span className="text-gray-500 text-sm">
                          {item.label}
                        </span>
                        <span className="text-gray-800 text-sm">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ANNOUNCEMENTS */}
              <div className="bg-white border rounded-lg shadow p-4">
                <h3 className="text-red-600 font-semibold mb-2">
                  Announcements
                </h3>

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
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StudentProfile;

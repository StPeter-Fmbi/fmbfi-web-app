import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Student } from "@/types/student";
import StudentHeader from "@/components/StudentHeader";
import { FaTrash } from "react-icons/fa";

interface GradeEntry {
  subject: string;
  subjectcode: string;
  units: string;
  enrollmentid: string;
}

const SchoolSection = () => {
  const { data: session, status } = useSession({ required: true });

  const [student, setStudent] = useState<Student | null>(null);
  const [schoolName, setSchoolName] = useState<string>("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([
    {
      subject: "",
      subjectcode: "",
      units: "",
      enrollmentid: "",
    },
  ]);

  // FETCH DATA ONLY ONCE (NO RE-FLICKER)
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.email) return;

    let isMounted = true;

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

        if (!isMounted) return;
        setStudent(studentData);

        const schoolRes = await fetch(
          `/api/getSchool?email=${encodeURIComponent(studentData.email)}`,
        );

        if (!schoolRes.ok) throw new Error("Failed to load school info");

        const schoolData = await schoolRes.json();

        if (!isMounted) return;
        setSchoolName(schoolData.schoolname || "");
      } catch (err: any) {
        console.error(err);
        if (isMounted) setError(err.message || "Failed to fetch data");
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    fetchStudentAndSchool();

    return () => {
      isMounted = false;
    };
  }, [session, status]);

  const handleChange = (
    index: number,
    field: keyof GradeEntry,
    value: string,
  ) => {
    const updated = [...gradeEntries];
    updated[index][field] = value;
    setGradeEntries(updated);
  };

  const handleSubmit = async () => {
    if (!student) return;

    if (!selectedYear || !selectedSemester) {
      setError("Please select Year and Semester.");
      return;
    }

    const filled = gradeEntries.filter((e) => e.subject && e.subjectcode);

    if (!filled.length) {
      setError("Please complete at least one subject.");
      return;
    }

    try {
      const payload = filled.map((entry) => ({
        email: student.email,
        year: selectedYear,
        sem: selectedSemester,
        subject: entry.subject,
        subjectcode: entry.subjectcode,
        units: entry.units,
        StudentID: student.scholardid,
        enrollmentid: entry.enrollmentid,
      }));

      const res = await fetch("/api/subjects/add-subject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit");
      }

      setError("");

      setSelectedYear("");
      setSelectedSemester("");

      setGradeEntries([
        {
          subject: "",
          subjectcode: "",
          units: "",
          enrollmentid: "",
        },
      ]);

      alert("Submitted successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit grades");
    }
  };

  // ✅ CLEAN LOADING STATE (NO RE-FLASH AFTER LOAD)
  const isInitialLoading = status === "loading" || (loadingData && !student);

  return (
    <>
      <Head>
        <title>FMBFI | Subject</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 w-full xl:ml-64 pt-20 md:pt-24 p-3 sm:p-4 md:p-6 font-body overflow-x-hidden">
          {/* HEADER (ONLY WHEN READY) */}
          {student && (
            <StudentHeader
              student={student}
              image={session?.user?.image}
              schoolName={schoolName}
            />
          )}

          {/* ✅ SKELETON (ONLY FIRST LOAD — NEVER AGAIN) */}
          {isInitialLoading && (
            <div className="bg-white border rounded-lg p-4 sm:p-6 animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}

          {/* CONTENT */}
          {!isInitialLoading && student && (
            <section className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
              <h2 className="text-lg font-semibold text-[#d12f27] mb-3">
                Academic Information
              </h2>

              {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Year
                  </label>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Select Year</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Semester
                  </label>

                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Select Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3">Subject Code</th>

                      <th className="text-left px-4 py-3">Subject Title</th>

                      <th className="text-left px-4 py-3 w-24">Units</th>

                      <th className="text-center px-4 py-3 w-20">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {gradeEntries.map((entry, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">
                          <input
                            value={entry.subjectcode}
                            onChange={(e) =>
                              handleChange(index, "subjectcode", e.target.value)
                            }
                            className="w-full border rounded px-2 py-2"
                            placeholder="Enter Subject Code"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            value={entry.subject}
                            onChange={(e) =>
                              handleChange(index, "subject", e.target.value)
                            }
                            className="w-full border rounded px-2 py-2"
                            placeholder="Enter Subject Title"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            value={entry.units}
                            onChange={(e) =>
                              handleChange(index, "units", e.target.value)
                            }
                            className="w-full border rounded px-2 py-2"
                            placeholder="0"
                          />
                        </td>

                        <td className="text-center">
                          {gradeEntries.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setGradeEntries(
                                  gradeEntries.filter((_, i) => i !== index),
                                )
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Remove Subject"
                            >
                              <FaTrash size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setGradeEntries([
                      ...gradeEntries,
                      {
                        subject: "",
                        subjectcode: "",
                        units: "",
                        enrollmentid: "",
                      },
                    ])
                  }
                  className="border px-4 py-2 rounded bg-gray-50 hover:bg-gray-100"
                >
                  + Add New Subject Row
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="px-5 py-2 text-gray-500">
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#d12f27] hover:bg-[#b72821] text-white px-6 py-2 rounded"
                >
                  Submit Subjects for Evaluation
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SchoolSection;

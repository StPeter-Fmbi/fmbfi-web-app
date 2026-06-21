import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Student } from "@/types/student";
import StudentHeader from "@/components/StudentHeader";

interface GradeEntry {
  year: string;
  sem: string;
  subject: string;
  subjectcode: string;
  enrollmentid: string;
}

const SchoolSection = () => {
  const { data: session, status } = useSession({ required: true });

  const [student, setStudent] = useState<Student | null>(null);
  const [schoolName, setSchoolName] = useState<string>("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([
    { year: "", sem: "", subject: "", subjectcode: "", enrollmentid: "" },
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

    const filled = gradeEntries.filter(
      (e) => e.year && e.sem && e.subject && e.subjectcode,
    );

    if (!filled.length) {
      setError("Please complete at least one row.");
      return;
    }

    try {
      const payload = filled.map((entry) => ({
        email: student.email,
        year: entry.year,
        sem: entry.sem,
        subject: entry.subject,
        subjectcode: entry.subjectcode,
        StudentID: student.scholardid,
        enrollmentid: entry.enrollmentid
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

      setGradeEntries([
        {
          year: "",
          sem: "",
          subject: "",
          subjectcode: "",
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

          {/* ERROR */}
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          {/* CONTENT */}
          {!isInitialLoading && student && (
            <section className="bg-white border rounded-lg p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-[#d12f27] mb-4">
                Academic Information
              </h2>

              {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

              {/* DESKTOP HEADER (hidden on mobile) */}
              <div className="hidden md:grid grid-cols-[120px_120px_1fr_160px_24px] gap-3 text-sm text-gray-500 mb-2">
                <span>Year</span>
                <span>Semester</span>
                <span>Subject</span>
                <span>Subject Code</span>
                <span />
              </div>

              {/* ROWS */}
              <div className="space-y-3">
                {gradeEntries.map((entry, index) => (
                  <div key={index}>
                    {/* ================= DESKTOP VIEW ================= */}
                    <div className="hidden md:grid grid-cols-[120px_120px_1fr_160px_24px] gap-3 items-center">
                      {/* YEAR */}
                      <select
                        value={entry.year}
                        onChange={(e) =>
                          handleChange(index, "year", e.target.value)
                        }
                        className="w-full px-2 py-2 border rounded-md"
                      >
                        <option value="">Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="5th Year">5th Year</option>
                      </select>

                      {/* SEM */}
                      <select
                        value={entry.sem}
                        onChange={(e) =>
                          handleChange(index, "sem", e.target.value)
                        }
                        className="w-full px-2 py-2 border rounded-md"
                      >
                        <option value="">Sem</option>
                        <option value="1st Sem">1st Sem</option>
                        <option value="2nd Sem">2nd Sem</option>
                      </select>

                      {/* SUBJECT */}
                      <input
                        value={entry.subject}
                        onChange={(e) =>
                          handleChange(index, "subject", e.target.value)
                        }
                        className="border rounded px-2 py-2"
                        placeholder="Subject"
                      />

                      {/* CODE */}
                      <input
                        value={entry.subjectcode}
                        onChange={(e) =>
                          handleChange(index, "subjectcode", e.target.value)
                        }
                        className="border rounded px-2 py-2"
                        placeholder="Code"
                      />

                      {/* REMOVE */}
                      {gradeEntries.length > 1 && (
                        <button
                          onClick={() =>
                            setGradeEntries(
                              gradeEntries.filter((_, i) => i !== index),
                            )
                          }
                          className="text-red-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* ================= MOBILE VIEW (CARD STYLE) ================= */}
                    <div className="md:hidden border rounded-lg p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* YEAR */}
                        <select
                          value={entry.year}
                          onChange={(e) =>
                            handleChange(index, "year", e.target.value)
                          }
                          className="w-full px-2 py-2 border rounded-md"
                        >
                          <option value="">Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="5th Year">5th Year</option>
                        </select>

                        {/* SEM */}
                        <select
                          value={entry.sem}
                          onChange={(e) =>
                            handleChange(index, "sem", e.target.value)
                          }
                          className="w-full px-2 py-2 border rounded-md"
                        >
                          <option value="">Sem</option>
                          <option value="1st Sem">1st Sem</option>
                          <option value="2nd Sem">2nd Sem</option>
                        </select>
                      </div>

                      {/* SUBJECT */}
                      <input
                        value={entry.subject}
                        onChange={(e) =>
                          handleChange(index, "subject", e.target.value)
                        }
                        className="w-full border rounded px-2 py-2"
                        placeholder="Subject"
                      />

                      {/* CODE */}
                      <input
                        value={entry.subjectcode}
                        onChange={(e) =>
                          handleChange(index, "subjectcode", e.target.value)
                        }
                        className="w-full border rounded px-2 py-2"
                        placeholder="Code"
                      />

                      {/* REMOVE */}
                      {gradeEntries.length > 1 && (
                        <button
                          onClick={() =>
                            setGradeEntries(
                              gradeEntries.filter((_, i) => i !== index),
                            )
                          }
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4">
                <button
                  onClick={() =>
                    setGradeEntries([
                      ...gradeEntries,
                      { year: "", sem: "", subject: "", subjectcode: "", enrollmentid: "" },
                    ])
                  }
                  className="text-sm text-gray-500 hover:text-red-500"
                >
                  + Add
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#d12f27] text-white px-4 py-2 rounded"
                >
                  Submit
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

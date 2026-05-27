import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Student } from "@/types/student";
import StudentHeader from "@/components/StudentHeader";

interface Course {
  course: string;
  subjectcode: string;
  subjectdescription: string;
}

interface GradeEntry {
  subject: string;
  grade: string;
}

const GradesSection = () => {
  const { data: session, status } = useSession({ required: true });

  const [student, setStudent] = useState<Student | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [course, setCourse] = useState("");
  const [subjects, setSubjects] = useState<Course[]>([]);
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([
    { subject: "", grade: "" },
  ]);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.email) return;

    let mounted = true;

    const fetchStudentAndSchool = async () => {
      try {
        setLoadingData(true);

        const studentRes = await fetch(
          `/api/student/student-by-email?email=${encodeURIComponent(session.user.email)}`,
        );

        if (!studentRes.ok) throw new Error("Failed to fetch student data");

        const studentData: Student = await studentRes.json();
        if (!mounted) return;
        setStudent(studentData);

        const schoolRes = await fetch(
          `/api/getSchool?email=${encodeURIComponent(studentData.email)}`,
        );

        if (!schoolRes.ok) throw new Error("Failed to load school info");

        const schoolData = await schoolRes.json();
        if (!mounted) return;

        if (schoolData.schoolname) setSchoolName(schoolData.schoolname);

        if (schoolData.courses?.length > 0) {
          const firstCourse = schoolData.courses[0].course;
          setCourse(firstCourse);

          setSubjects(
            schoolData.courses.filter((c: Course) => c.course === firstCourse),
          );
        }
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to fetch data");
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    fetchStudentAndSchool();

    return () => {
      mounted = false;
    };
  }, [session, status]);

  const handleChange = (
    index: number,
    field: "subject" | "grade",
    value: string,
  ) => {
    const updated = [...gradeEntries];
    updated[index][field] = value;
    setGradeEntries(updated);
  };

  const handleSubmit = () => {
    if (!student) return;

    const filled = gradeEntries.filter((e) => e.subject && e.grade);

    if (!filled.length) {
      setError("Please enter at least one subject and grade.");
      return;
    }

    const payload = filled.map((entry) => ({
      email: student.email,
      course,
      subject: entry.subject,
      grade: Number(entry.grade),
    }));

    fetch("/api/add-grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        setError("");
        setGradeEntries([{ subject: "", grade: "" }]);
        alert("Grades submitted successfully!");
      })
      .catch(() => setError("Failed to submit grades"));
  };

  const isInitialLoading = status === "loading" || (loadingData && !student);

  return (
    <>
      <Head>
        <title>FMBFI | Grades</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 w-full xl:ml-64 pt-20 md:pt-24 p-3 sm:p-4 md:p-6 font-body overflow-x-hidden">
          {/* HEADER */}
          {student && (
            <StudentHeader
              student={student}
              image={session?.user?.image}
              schoolName={schoolName}
            />
          )}

          {/* LOADING */}
          {isInitialLoading && (
            <div className="bg-white border rounded-lg p-4 sm:p-6 animate-pulse mb-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="h-4 w-60 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-52 bg-gray-200 rounded" />
            </div>
          )}

          {/* ERROR */}
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          {/* CONTENT */}
          {!isInitialLoading && student && (
            <>
              {/* GPA */}
              <section className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#d12f27] mb-3">
                  Academic Performance
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#d12f27]">
                    {student.gpa ? student.gpa.toFixed(1) : "—"}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Current GPA</p>
                    <p>Based on submitted grades</p>
                  </div>
                </div>
              </section>

              {/* GRADES */}
              <section className="bg-white border rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-[#d12f27] mb-4">
                  Grades
                </h2>

                {/* ================= MOBILE CARDS ================= */}
                <div className="block md:hidden space-y-3">
                  {gradeEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <select
                        value={entry.subject}
                        onChange={(e) =>
                          handleChange(index, "subject", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select subject</option>
                        {subjects.map((s) => (
                          <option
                            key={s.subjectcode}
                            value={s.subjectdescription}
                          >
                            {s.subjectdescription}
                          </option>
                        ))}
                      </select>

                      <input
                        value={
                          entry.subject
                            ? subjects.find(
                                (s) => s.subjectdescription === entry.subject,
                              )?.subjectcode || ""
                            : ""
                        }
                        disabled
                        className="w-full border rounded px-3 py-2 bg-gray-100 text-center"
                      />

                      <input
                        type="number"
                        value={entry.grade}
                        onChange={(e) =>
                          handleChange(index, "grade", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-center"
                      />

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
                  ))}
                </div>

                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-[1fr_120px_80px_24px] gap-3 text-sm text-gray-400 mb-2">
                      <span>Subject Description</span>
                      <span>Subject Code</span>
                      <span className="text-center">Grade</span>
                      <span />
                    </div>

                    <div className="space-y-2">
                      {gradeEntries.map((entry, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr_120px_80px_24px] gap-3 items-center"
                        >
                          <select
                            value={entry.subject}
                            onChange={(e) =>
                              handleChange(index, "subject", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">--Select subject--</option>
                            {subjects.map((s) => (
                              <option
                                key={s.subjectcode}
                                value={s.subjectdescription}
                              >
                                {s.subjectdescription}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            value={
                              entry.subject
                                ? subjects.find(
                                    (s) =>
                                      s.subjectdescription === entry.subject,
                                  )?.subjectcode || ""
                                : ""
                            }
                            disabled
                            className="w-full px-3 py-2 text-center bg-gray-100 border rounded-md"
                          />

                          <input
                            type="number"
                            value={entry.grade}
                            onChange={(e) =>
                              handleChange(index, "grade", e.target.value)
                            }
                            className="w-full px-3 py-2 text-center border rounded-md"
                          />

                          {gradeEntries.length > 1 && (
                            <button
                              onClick={() =>
                                setGradeEntries(
                                  gradeEntries.filter((_, i) => i !== index),
                                )
                              }
                              className="text-gray-400 hover:text-red-500"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4">
                  <button
                    onClick={() =>
                      setGradeEntries([
                        ...gradeEntries,
                        { subject: "", grade: "" },
                      ])
                    }
                    className="text-sm text-gray-500 hover:text-red-500"
                  >
                    + Add
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="bg-[#d12f27] text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Submit
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GradesSection;

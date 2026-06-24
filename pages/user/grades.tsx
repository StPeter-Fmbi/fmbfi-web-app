import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Head from "next/head";
import { useState, useEffect } from "react";
import StudentHeader from "@/components/StudentHeader";
import { useStudent } from "@/hooks/useStudent";

interface GradeEntry {
  subject: string;
  grade: string;
}

interface ISubject {
  enrollmentid: string;
  academicyear: string;
  semester: string;
  subjectcode: string;
  subjectname: string;
  units: number;
}

const GradesSection = () => {
  const { student, schoolName, image, error, isLoading } = useStudent();

  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [formError, setFormError] = useState("");

  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([
    {
      subject: "",
      grade: "",
    },
  ]);

  const [grades, setGrades] = useState<Record<string, string>>({});

  const availableSubjects = (currentIndex: number) => {
    const selectedSubjects = gradeEntries
      .filter((_, i) => i !== currentIndex)
      .map((g) => g.subject)
      .filter(Boolean);

    return subjects.filter((s) => !selectedSubjects.includes(s.subjectname));
  };

  const handleAddRow = () => {
    const hasIncompleteRow = gradeEntries.some(
      (entry) => !entry.subject.trim() || !entry.grade.trim(),
    );

    if (hasIncompleteRow) {
      setFormError(
        "Please complete the current subject and grade before adding another row.",
      );
      return;
    }

    setFormError("");

    setGradeEntries([
      ...gradeEntries,
      {
        subject: "",
        grade: "",
      },
    ]);
  };

  useEffect(() => {
    if (!student?.email) return;

    const fetchSubjects = async () => {
      try {
        const url = `/api/subjects/get-subjects?email=${encodeURIComponent(
          student.email,
        )}`;

        console.log("Fetching:", url);

        const res = await fetch(url);

        console.log("Status:", res.status);

        const data = await res.json();

        console.log("Response:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to load subjects");
        }

        setSubjects(data.subjects || []);
      } catch (err: any) {
        console.error(err);
        setFormError(err.message || "Failed to load subjects");
      }
    };

    fetchSubjects();
  }, [student]);

  const handleChange = (
    index: number,
    field: "subject" | "grade",
    value: string,
  ) => {
    const updated = [...gradeEntries];
    updated[index][field] = value;

    setGradeEntries(updated);

    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async () => {
    if (!student) return;

    const payload = subjects
      .filter((s) => grades[s.enrollmentid]?.trim())
      .map((s) => ({
        StudentId: student.scholardid,
        EnrollmentId: s.enrollmentid,
        SubjectName: s.subjectname,
        SubjectCode: s.subjectcode,
        grade: Number(grades[s.enrollmentid]),
      }));

    if (!payload.length) {
      setFormError("Please enter at least one grade.");
      return;
    }

    const invalidGrade = payload.some(
      (x) => x.grade < 1 || x.grade > 5 || isNaN(x.grade),
    );

    if (invalidGrade) {
      setFormError("Grade must be between 1.00 and 5.00.");
      return;
    }

    try {
      const res = await fetch("/api/grades/add-grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit grades");
      }

      setFormError("");
      setGrades({});

      alert("Grades submitted successfully!");
    } catch (err: any) {
      setFormError(err.message || "Failed to submit grades");
    }
  };
  return (
    <>
      <Head>
        <title>FMBFI | Grades</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 w-full xl:ml-64 pt-20 md:pt-24 p-3 sm:p-4 md:p-6 font-body overflow-x-hidden">
          {student && (
            <StudentHeader
              student={student}
              schoolName={schoolName}
              image={image}
            />
          )}

          {isLoading && (
            <div className="bg-white border rounded-lg p-4 sm:p-6 animate-pulse mb-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="h-4 w-60 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-52 bg-gray-200 rounded" />
            </div>
          )}

          {!isLoading && student && (
            <>
              {/* ================= 1. ACADEMIC PERFORMANCE ================= */}
              <section className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#d12f27] mb-3">
                  Academic Performance
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#d12f27]">
                    —
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Current GPA</p>
                    <p>Based on submitted grades</p>
                  </div>
                </div>
              </section>

              {/* ================= 2. SUBJECT INFORMATION ================= */}
              <section className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#d12f27] mb-4">
                  Subject Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md bg-gray-50">
                    <p className="text-sm text-gray-500">Total Subjects</p>
                    <p className="text-lg font-semibold">{subjects.length}</p>
                  </div>

                  <div className="p-3 border rounded-md bg-gray-50">
                    <p className="text-sm text-gray-500">Selected Entries</p>
                    <p className="text-lg font-semibold">
                      {gradeEntries.length}
                    </p>
                  </div>
                </div>
              </section>

              {/* ================= 3. GRADES ================= */}
              <section className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#d12f27] mb-4">
                  Subject List
                </h2>

                {formError && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                <div className="space-y-3">
                  {subjects.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg bg-gray-50">
                      <p className="text-gray-500">
                        There are no subject encodings available for grade
                        submission.
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Please encode your subjects first before submitting
                        grades.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {subjects.map((subject) => (
                        <div
                          key={subject.enrollmentid}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-3"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {subject.subjectname}
                            </p>

                            <p className="text-sm text-gray-500">
                              {subject.subjectcode} • {subject.units} Units
                            </p>
                          </div>

                          <input
                            type="number"
                            step="0.25"
                            min="1"
                            max="5"
                            value={grades[subject.enrollmentid] || ""}
                            onChange={(e) =>
                              setGrades((prev) => ({
                                ...prev,
                                [subject.enrollmentid]: e.target.value,
                              }))
                            }
                            className="w-full md:w-32 border rounded-md px-3 py-2 text-center"
                            placeholder="1.00"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* ================= 4. ACTIONS (SEPARATE SECTION) ================= */}
              <section className="flex justify-between items-center">
                <button
                  onClick={handleAddRow}
                  className="border px-4 py-2 rounded bg-gray-50 hover:bg-gray-100"
                >
                  + Add New Subject Row
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={subjects.length === 0}
                  className={`px-6 py-2 rounded text-white ${
                    subjects.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#d12f27] hover:bg-[#b72821]"
                  }`}
                >
                  Submit Grades
                </button>
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

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

  const totalSubjects = subjects.length;

  const encodedSubjects = subjects.filter((subject) =>
    grades[subject.enrollmentid]?.trim(),
  ).length;

  const progressPercentage =
    totalSubjects > 0 ? Math.round((encodedSubjects / totalSubjects) * 100) : 0;

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

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError("Only PDF, JPG, and PNG files are allowed.");
      return;
    }

    setFileError("");
    setFile(selectedFile);
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
              {/* ================= 2. SUBJECT INFORMATION ================= */}
              <section className="bg-white border rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <h2 className="text-xl font-bold text-[#d12f27]">
                    Subject Information
                  </h2>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full w-fit">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-700">
                      Ready for Grade Submission
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Academic Year */}
                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-red-400 to-red-600 text-white p-5 min-h-[120px]">
                    <div className="absolute top-0 right-0 text-6xl opacity-10">
                      📅
                    </div>

                    <p className="text-sm opacity-90">Academic Year</p>
                    <p className="text-2xl font-bold mt-2">
                      {subjects?.[0]?.academicyear || "—"}
                    </p>
                  </div>

                  {/* Semester */}
                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-400 to-blue-600 text-white p-5 min-h-[120px]">
                    <div className="absolute top-0 right-0 text-6xl opacity-10">
                      🎓
                    </div>

                    <p className="text-sm opacity-90">Semester</p>
                    <p className="text-2xl font-bold mt-2">
                      {subjects?.[0]?.semester || "—"}
                    </p>
                  </div>

                  {/* Total Subjects */}
                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-400 to-green-600 text-white p-5 min-h-[120px]">
                    <div className="absolute top-0 right-0 text-6xl opacity-10">
                      📚
                    </div>

                    <p className="text-sm opacity-90">Total Subjects</p>
                    <p className="text-3xl font-bold mt-2">
                      {subjects?.length || 0}
                    </p>
                  </div>

                  {/* Total Units */}
                  <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-orange-400 to-orange-600 text-white p-5 min-h-[120px]">
                    <div className="absolute top-0 right-0 text-6xl opacity-10">
                      🧮
                    </div>

                    <p className="text-sm opacity-90">Total Units</p>
                    <p className="text-3xl font-bold mt-2">
                      {subjects?.reduce(
                        (total, subject) => total + Number(subject.units || 0),
                        0,
                      ) || 0}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[#d12f27]">
                      Encoding Progress
                    </h2>

                    <p className="text-sm text-gray-500">
                      {encodedSubjects} of {totalSubjects} grades encoded
                    </p>
                  </div>

                  <span className="text-xl font-bold text-[#d12f27]">
                    {progressPercentage}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-[#d12f27] transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
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
                          className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="p-3 md:p-4">
                            <div className="flex items-center justify-between gap-3">
                              {/* Subject Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap gap-2 mb-1">
                                  <span className="px-2 py-1 text-xs font-semibold bg-red-50 text-[#d12f27] border border-red-200 rounded">
                                    {subject.subjectcode}
                                  </span>

                                  <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded">
                                    {subject.units} Units
                                  </span>
                                </div>

                                <h3 className="font-semibold text-gray-900 text-sm md:text-lg leading-tight">
                                  {subject.subjectname}
                                </h3>
                              </div>

                              {/* Grade */}
                              <div className="w-24 md:w-32 flex-shrink-0">
                                <label className="block text-[11px] md:text-xs font-medium text-gray-500 text-center mb-1">
                                  Final Grade
                                </label>

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
                                  className="w-full border-2 border-gray-300 rounded-lg px-2 py-2 text-center font-bold text-lg focus:border-[#d12f27] focus:outline-none"
                                  placeholder="1.00"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#d12f27] mb-3">
                  Upload Grade Supporting Document
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  Upload signed grade sheet (PDF or image format).
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-2 cursor-pointer"
                />

                {fileError && (
                  <p className="text-red-500 text-sm mt-2">{fileError}</p>
                )}

                {file && (
                  <p className="text-green-600 text-sm mt-2">
                    Selected file: {file.name}
                  </p>
                )}
              </section>

              {/* ================= 4. ACTIONS (SEPARATE SECTION) ================= */}
              <section className="flex justify-end">
                <button
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to submit your grades? Once submitted, changes may require administrator approval.",
                    );
                    if (confirmed) {
                      handleSubmit();
                    }
                  }}
                  disabled={subjects.length === 0}
                  className={`px-6 py-2 border rounded-xl text-white ${
                    subjects.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#d12f27] hover:bg-[#b72821]"
                  }`}
                >
                  Submit Subjects for Evaluation
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

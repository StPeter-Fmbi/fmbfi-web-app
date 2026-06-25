import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Head from "next/head";
import { useState, useEffect } from "react";
import StudentHeader from "@/components/StudentHeader";
import { useStudent } from "@/hooks/useStudent";
import { FaSpinner } from "react-icons/fa";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setFileError("");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setFormError("Please upload your signed grade sheet.");
      return;
    }

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
      setIsSubmitting(true);
      setIsUploading(true);
      setFormError("");

      // Generate Google Drive filename
      const ext = file.name.split(".").pop();

      const fileName = `${student.last_name}, ${student.first_name} - ${student.batch}.${ext}`;

      // Convert file to Base64
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to Google Drive
      // 1. Upload supporting document
      const uploadRes = await fetch("/api/grades/upload-grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student.scholardid,
          fileName,
          mimeType: file.type,
          fileContent,
          lastName: student.last_name, // <-- THIS
        }),
      });

      const uploadResult = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadResult.message);
      }

      // 2. Submit grades
      const gradeRes = await fetch("/api/grades/add-grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const gradeResult = await gradeRes.json();

      if (!gradeRes.ok) {
        throw new Error(gradeResult.message);
      }

      setFormError("");
      setGrades({});
      setFile(null);

      setShowSuccess(true);

      // Refresh the page after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);

      setGrades({});
      setFile(null);
      setShowSuccess(true);
    } catch (err: any) {
      setFormError(err.message || "Failed to submit grades.");
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
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

          {isSubmitting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center gap-4 min-w-[340px]">
                <FaSpinner className="animate-spin text-[#d12f27] text-5xl" />

                <h3 className="text-xl font-semibold text-gray-800">
                  Submitting Grades...
                </h3>

                <p className="text-gray-500 text-center">
                  Please wait while we upload your supporting document and
                  submit your grades for evaluation.
                </p>
              </div>
            </div>
          )}

          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center gap-4 min-w-[360px]">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-green-600">
                  Submission Successful!
                </h3>

                <p className="text-gray-600 text-center">
                  Your grades have been submitted successfully.
                </p>

                <p className="text-gray-500 text-center text-sm">
                  Your supporting document has also been uploaded to the
                  scholarship records. Your submission is now pending
                  administrator evaluation.
                </p>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-3 px-6 py-2 bg-[#d12f27] hover:bg-[#b72821] text-white rounded-lg transition"
                >
                  OK
                </button>
              </div>
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
                  Upload signed grade sheet (PDF, JPG, PNG)
                </p>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200
  ${
    dragActive
      ? "border-red-500 bg-red-50 scale-[1.01]"
      : "border-gray-300 hover:border-red-300"
  }`}
                >
                  <input
                    type="file"
                    id="gradeUpload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <label
                    htmlFor="gradeUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="text-6xl mb-3">📂</div>

                    <p className="font-semibold text-gray-700">
                      Drag & Drop Grade Sheet
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      PDF, JPG, JPEG or PNG
                    </p>
                  </label>
                </div>

                {fileError && (
                  <p className="text-red-500 text-sm mt-3">{fileError}</p>
                )}

                {file && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-700">
                          Ready to Upload
                        </p>

                        <p className="text-sm text-green-600">{file.name}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* ================= 4. ACTIONS (SEPARATE SECTION) ================= */}
              <section className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={
                    subjects.length === 0 || isSubmitting || showSuccess
                  }
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                    subjects.length === 0 || isSubmitting || showSuccess
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#d12f27] hover:bg-[#b72821] shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Uploading Grades...
                    </>
                  ) : showSuccess ? (
                    <>✓ Grades Submitted</>
                  ) : (
                    "Submit Subjects for Evaluation"
                  )}
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

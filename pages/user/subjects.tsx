import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import StudentHeader from "@/components/StudentHeader";
import { FaTrash } from "react-icons/fa";
import { useStudent } from "@/hooks/useStudent";
import router from "next/router";

interface GradeEntry {
  subject: string;
  subjectcode: string;
  units: string;
  enrollmentid: string;
}

const SchoolSection = () => {
  const { student, schoolName, error, image, isLoading } = useStudent();

  const [formError, setFormError] = useState("");

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

  const completedSubjects = gradeEntries.filter(
    (item) =>
      item.subject.trim() !== "" &&
      item.subjectcode.trim() !== "" &&
      item.units.trim() !== "",
  ).length;

  const totalUnits = gradeEntries
    .filter(
      (item) =>
        item.subject.trim() !== "" &&
        item.subjectcode.trim() !== "" &&
        item.units.trim() !== "",
    )
    .reduce((total, item) => total + Number(item.units || 0), 0);

  const handleChange = (
    index: number,
    field: keyof GradeEntry,
    value: string,
  ) => {
    const updated = [...gradeEntries];
    updated[index][field] = value;
    setGradeEntries(updated);
  };

  const canAddRow = (() => {
    const last = gradeEntries[gradeEntries.length - 1];
    return (
      last.subject.trim() !== "" &&
      last.subjectcode.trim() !== "" &&
      last.units.trim() !== ""
    );
  })();

  const hasDuplicateSubjectCode = () => {
    const codes = gradeEntries.map((e) => e.subjectcode).filter(Boolean);
    return new Set(codes).size !== codes.length;
  };

  const handleSubmit = async () => {
    if (!student) return;

    if (!selectedYear || !selectedSemester) {
      setFormError("Please select Year and Semester.");
      return;
    }

    const filled = gradeEntries.filter((e) => e.subject && e.subjectcode);

    if (!filled.length) {
      setFormError("Please complete at least one subject.");
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

      setFormError("");

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

      router.push("/user/grades");
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to submit grades");
    }
  };

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
              schoolName={schoolName}
              image={image}
            />
          )}

          {/* ✅ SKELETON (ONLY FIRST LOAD — NEVER AGAIN) */}
          {isLoading && (
            <div className="bg-white border rounded-lg p-4 sm:p-6 animate-pulse mb-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="h-4 w-60 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-52 bg-gray-200 rounded" />
            </div>
          )}

          {!isLoading && student && (
            <>
              <>
                {/* Subject Information */}
                <section className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-[#d12f27]">
                      Subject Information
                    </h2>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>

                      <span className="text-xs font-semibold text-green-700">
                        Ready for Submission
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Academic Year */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white p-5">
                      <div className="absolute top-0 right-0 text-6xl opacity-10">
                        📅
                      </div>

                      <p className="text-sm opacity-90">Academic Year</p>

                      <p className="text-2xl font-bold mt-2">
                        {selectedYear || "-"}
                      </p>
                    </div>

                    {/* Semester */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5">
                      <div className="absolute top-0 right-0 text-6xl opacity-10">
                        🎓
                      </div>

                      <p className="text-sm opacity-90">Semester</p>

                      <p className="text-2xl font-bold mt-2">
                        {selectedSemester || "-"}
                      </p>
                    </div>

                    {/* Subjects */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white p-5">
                      <div className="absolute top-0 right-0 text-6xl opacity-10">
                        📚
                      </div>

                      <p className="text-sm opacity-90">Subjects Encoded</p>

                      <p className="text-4xl font-bold mt-2">
                        {completedSubjects}
                      </p>
                    </div>

                    {/* Units */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white p-5">
                      <div className="absolute top-0 right-0 text-6xl opacity-10">
                        📝
                      </div>

                      <p className="text-sm opacity-90">Total Units</p>

                      <p className="text-4xl font-bold mt-2">{totalUnits}</p>
                    </div>
                  </div>
                </section>

                {/* Academic Information */}
                <section className="bg-white border rounded-xl p-5 sm:p-6 mb-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#d12f27] mb-4">
                    Academic Information Encoding
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Academic Year
                      </label>

                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
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
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">Select Semester</option>
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                        <option value="Summer">Summer</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Subject Encoding */}
                <section className="bg-white border rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
                  {/* Header + Actions */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Left: Title */}
                    <div>
                      <h2 className="text-xl font-bold text-[#d12f27]">
                        Subject Encoding
                      </h2>

                      <p className="text-sm text-gray-500">
                        Add all enrolled subjects for evaluation.
                      </p>
                    </div>

                    {/* Right: Button */}
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (!canAddRow) {
                            setFormError(
                              "Please complete Subject Code, Subject Title, and Units before adding another subject.",
                            );
                            return;
                          }

                          if (hasDuplicateSubjectCode()) {
                            setFormError(
                              "Duplicate subject codes detected. Each subject must have a unique code.",
                            );
                            return;
                          }

                          setFormError("");

                          setGradeEntries([
                            ...gradeEntries,
                            {
                              subject: "",
                              subjectcode: "",
                              units: "",
                              enrollmentid: "",
                            },
                          ]);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#d12f27] text-white rounded-lg hover:bg-[#b72821] transition-colors whitespace-nowrap"
                      >
                        + Add Subject
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {formError && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-600">
                        {formError}
                      </p>
                    </div>
                  )}

                  {/* Table */}
                  <div className="space-y-4">
                    {gradeEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="grid md:grid-cols-[180px_1fr_120px_60px] gap-3 items-end border-b pb-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Subject Code
                          </label>

                          <input
                            value={entry.subjectcode}
                            onChange={(e) =>
                              handleChange(index, "subjectcode", e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="MATH101"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Subject Title
                          </label>

                          <input
                            value={entry.subject}
                            onChange={(e) =>
                              handleChange(index, "subject", e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="College Algebra"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Units
                          </label>

                          <input
                            type="number"
                            value={entry.units}
                            onChange={(e) =>
                              handleChange(index, "units", e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="3"
                          />
                        </div>

                        <div className="flex justify-center">
                          {gradeEntries.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setGradeEntries(
                                  gradeEntries.filter((_, i) => i !== index),
                                )
                              }
                              className="h-10 w-10 rounded-lg text-red-500 hover:bg-red-50"
                            >
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Ensure all subject information is accurate before submitting
                    for evaluation.
                  </p>
                </section>

                {/* Submit */}
                <section className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-[#d12f27] hover:bg-[#b72821] text-white px-8 py-3 rounded-lg font-medium shadow-sm"
                  >
                    Submit Subjects for Grades Encoding
                  </button>
                </section>
              </>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SchoolSection;

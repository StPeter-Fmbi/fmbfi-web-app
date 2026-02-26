import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Student } from "@/types/student"; // path to the shared type
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
  const [schoolName, setSchoolName] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [subjects, setSubjects] = useState<Course[]>([]);
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([
    { subject: "", grade: "" },
  ]);
  const [error, setError] = useState("");

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

        // Filter subjects for the first course
        if (schoolData.courses && schoolData.courses.length > 0) {
          const firstCourse = schoolData.courses[0].course;
          setCourse(firstCourse);
          const filteredSubjects = schoolData.courses.filter(
            (c: any) => c.course === firstCourse,
          );
          setSubjects(filteredSubjects);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch data");
      }
    };

    fetchStudentAndSchool();
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

  if (status === "loading") return <p className="p-6">Loading…</p>;
  if (!student)
    return <p className="text-gray-500 p-6">Loading your information…</p>;

  return (
    <>
      <Head>
        <title>FMBFI | Grades</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow xl:ml-64 pt-24 p-6 font-body">
          {/* HEADER */}
          <StudentHeader
            student={student}
            image={session?.user?.image}
            schoolName={schoolName}
          />

          {/* GPA SECTION */}
          <section className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#d12f27] mb-3">
              Academic Performance
            </h2>

            <div className="flex items-center gap-6">
              <div className="text-5xl font-extrabold text-[#d12f27]">
                {student.gpa ? student.gpa.toFixed(1) : "—"}
              </div>
              <div className="text-sm text-gray-600 leading-snug">
                <p className="font-medium">Current GPA</p>
                <p>Based on submitted grades</p>
              </div>
            </div>
          </section>

          {/* GRADES */}
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#d12f27] mb-4">
              Grades
            </h2>
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            {/* HEADER */}
            <div className="grid grid-cols-[1fr_120px_80px_24px] gap-3 text-base text-gray-400 mb-2">
              <span>Subject Description</span>
              <span>Subject Code</span>
              <span className="text-center">Grade</span>
              <span />
            </div>

            {/* ROWS */}
            <div className="space-y-2">
              {gradeEntries.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_120px_80px_24px] gap-3 items-center"
                >
                  {/* SUBJECT SELECT */}
                  <select
                    value={entry.subject}
                    onChange={(e) =>
                      handleChange(index, "subject", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d12f27] bg-white"
                  >
                    <option value="">--Select subject--</option>
                    {subjects.map((s) => (
                      <option key={s.subjectcode} value={s.subjectdescription}>
                        {s.subjectdescription}
                      </option>
                    ))}
                  </select>

                  {/* SUBJECT CODE */}
                  <input
                    type="text"
                    value={
                      entry.subject
                        ? subjects.find(
                            (s) => s.subjectdescription === entry.subject,
                          )?.subjectcode || ""
                        : ""
                    }
                    disabled
                    className="w-full px-3 py-2 text-sm text-center border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />

                  {/* GRADE INPUT */}
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={entry.grade}
                    onChange={(e) =>
                      handleChange(index, "grade", e.target.value)
                    }
                    // placeholder="0-100"
                    className="w-full px-3 py-2 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d12f27] bg-white"
                  />

                  {/* REMOVE BUTTON */}
                  {gradeEntries.length > 1 && (
                    <button
                      onClick={() =>
                        setGradeEntries(
                          gradeEntries.filter((_, i) => i !== index),
                        )
                      }
                      className="text-gray-400 hover:text-red-500 text-lg leading-none"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() =>
                  setGradeEntries([...gradeEntries, { subject: "", grade: "" }])
                }
                className="text-sm text-gray-500 hover:text-red-500"
              >
                + Add
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#d12f27] text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition"
              >
                Submit
              </button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GradesSection;

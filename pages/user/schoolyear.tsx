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
}

const SchoolSection = () => {
  const { data: session, status } = useSession({ required: true });

  const [student, setStudent] = useState<Student | null>(null);
  const [schoolName, setSchoolName] = useState<string>("");
  const [error, setError] = useState("");

  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([
    {
      year: "",
      sem: "",
      subject: "",
      subjectcode: "",
    },
  ]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.email) return;

    const fetchStudentAndSchool = async () => {
      try {
        // Fetch student info
        const studentRes = await fetch(
          `/api/student/student-by-email?email=${encodeURIComponent(
            session.user.email,
          )}`,
        );

        if (!studentRes.ok)
          throw new Error("Failed to fetch student data");

        const studentData: Student = await studentRes.json();
        setStudent(studentData);

        // Fetch school info
        const schoolRes = await fetch(
          `/api/getSchool?email=${encodeURIComponent(studentData.email)}`,
        );

        if (!schoolRes.ok)
          throw new Error("Failed to load school info");

        const schoolData = await schoolRes.json();

        if (schoolData.schoolname) {
          setSchoolName(schoolData.schoolname);
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
      }));

      const res = await fetch("/api/add-grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setError("");

      setGradeEntries([
        {
          year: "",
          sem: "",
          subject: "",
          subjectcode: "",
        },
      ]);

      alert("Submitted successfully!");
    } catch (err) {
      setError("Failed to submit grades");
    }
  };

  if (status === "loading") {
    return <p className="p-6">Loading…</p>;
  }

  if (!student) {
    return (
      <p className="text-gray-500 p-6">
        Loading your information…
      </p>
    );
  }

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

          {/* FORM */}
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#d12f27] mb-4">
              Academic Information
            </h2>

            {error && (
              <p className="text-sm text-red-500 mb-3">
                {error}
              </p>
            )}

            {/* HEADER */}
            <div className="grid grid-cols-[120px_120px_1fr_160px_24px] gap-3 text-sm text-gray-500 mb-2">
              <span>Year</span>
              <span>Semester</span>
              <span>Subject</span>
              <span>Subject Code</span>
              <span />
            </div>

            {/* ROWS */}
            <div className="space-y-2">
              {gradeEntries.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[120px_120px_1fr_160px_24px] gap-3 items-center"
                >
                  {/* YEAR */}
                  <input
                    type="text"
                    value={entry.year}
                    onChange={(e) =>
                      handleChange(index, "year", e.target.value)
                    }
                    placeholder="2026"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d12f27]"
                  />

                  {/* SEM */}
                  <input
                    type="text"
                    value={entry.sem}
                    onChange={(e) =>
                      handleChange(index, "sem", e.target.value)
                    }
                    placeholder="1st Sem"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d12f27]"
                  />

                  {/* SUBJECT */}
                  <input
                    type="text"
                    value={entry.subject}
                    onChange={(e) =>
                      handleChange(index, "subject", e.target.value)
                    }
                    placeholder="Subject"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d12f27]"
                  />

                  {/* SUBJECT CODE */}
                  <input
                    type="text"
                    value={entry.subjectcode}
                    onChange={(e) =>
                      handleChange(index, "subjectcode", e.target.value)
                    }
                    placeholder="Subject Code"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d12f27]"
                  />

                  {/* REMOVE */}
                  {gradeEntries.length > 1 && (
                    <button
                      onClick={() =>
                        setGradeEntries(
                          gradeEntries.filter((_, i) => i !== index),
                        )
                      }
                      className="text-gray-400 hover:text-red-500 text-lg leading-none"
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
                  setGradeEntries([
                    ...gradeEntries,
                    {
                      year: "",
                      sem: "",
                      subject: "",
                      subjectcode: "",
                    },
                  ])
                }
                className="text-sm text-gray-500 hover:text-red-500"
              >
                + Add
              </button>

              <button
                onClick={handleSubmit}
                className="bg-[#d12f27] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
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

export default SchoolSection;
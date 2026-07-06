import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import StudentHeader from "@/components/StudentHeader";
import { useStudent } from "@/hooks/useStudent";
import { useEffect, useState } from "react";
import {
  IEvaluation,
  IGetEvaluationResponse,
} from "../api/evaluation/getAllEvaluationByStudentID";
import { useSession } from "next-auth/react";
import { Student } from "@/types/student";

const EvaluationPage = () => {
  const subjects = [
    {
      code: "CS 101",
      title: "Introduction to Computer Science",
      units: 3,
      status: "Pending",
    },
    {
      code: "MATH 100",
      title: "Calculus I",
      units: 4,
      status: "Pending",
    },
    {
      code: "FIL 40",
      title: "Wika, Kultura, at Lipunan",
      units: 3,
      status: "Pending",
    },
    {
      code: "GEOL 10",
      title: "Earth Science",
      units: 3,
      status: "Pending",
    },
    {
      code: "ED 111",
      title: "Foundation of Ed",
      units: 3,
      status: "Pending",
    },
    {
      code: "PE 2",
      title: "Aerobics",
      units: 2,
      status: "Approved",
    },
  ];

  const [evaluations, setEvaluations] = useState<IEvaluation[]>([]);
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedSemester, setSelectedSemester] = useState("1st Semester");
  const totalUnits = subjects.reduce((sum, s) => sum + s.units, 0);
  const { student, schoolName, image, error, isLoading } = useStudent();

  // const approvedSubjects = subjects.filter(
  //   (s) => s.status === "Approved",
  // ).length;

  // const pendingSubjects = subjects.filter((s) => s.status === "Pending").length;

  //fetch evaluations from the API by scholarId
  const fetchEvaluations = async (scholarId: string) => {
    try {
      console.log("Fetching evaluations for scholarId:", scholarId);

      const res = await fetch(
        `/api/evaluation/getAllEvaluationByStudentID?scholarid=${encodeURIComponent(scholarId)}`,
      );

      const data: IGetEvaluationResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load evaluations.");
      }

      setEvaluations(data.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (student) {
      fetchEvaluations(student.scholardid);
    }
  }, [student]);

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 w-full xl:ml-64 pt-20 md:pt-24 p-3 sm:p-4 md:p-6 font-body overflow-x-hidden">
          {/* HEADER (ONLY WHEN READY) */}
          {student && (
            <StudentHeader
              student={student}
              image={image}
              schoolName={schoolName}
            />
          )}

          {/* SUMMARY */}
          {/* Subject Evaluation Summary */}
          <section className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#d12f27]">
                Evaluation Summary
              </h2>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>

                <span className="text-xs font-semibold text-yellow-700">
                  Evaluation In Progress
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Academic Year */}
              <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-red-400 to-red-600 text-white p-5">
                <div className="absolute top-0 right-0 text-6xl opacity-10">
                  📅
                </div>

                <p className="text-sm opacity-90">Academic Year</p>

                <p className="text-2xl font-bold mt-2">2024-2025</p>
              </div>

              {/* Semester */}
              <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-400 to-blue-600 text-white p-5">
                <div className="absolute top-0 right-0 text-6xl opacity-10">
                  🎓
                </div>

                <p className="text-sm opacity-90">Semester</p>

                <p className="text-2xl font-bold mt-2">1st Sem</p>
              </div>

              {/* Total Subjects */}
              <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-400 to-green-600 text-white p-5">
                <div className="absolute top-0 right-0 text-6xl opacity-10">
                  📚
                </div>

                <p className="text-sm opacity-90">Total Subjects</p>

                <p className="text-4xl font-bold mt-2">{subjects.length}</p>
              </div>

              {/* Total Units */}
              <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-orange-400 to-orange-600 text-white p-5">
                <div className="absolute top-0 right-0 text-6xl opacity-10">
                  📝
                </div>

                <p className="text-sm opacity-90">Total Units</p>

                <p className="text-4xl font-bold mt-2">{totalUnits}</p>
              </div>
            </div>
          </section>

          {/* SUBJECT LIST */}
          <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-[#d12f27]">
                  Submitted Subjects
                </h2>

                <p className="text-sm text-gray-500">
                  AY {selectedYear} • {selectedSemester}
                </p>
              </div>

              <span className="px-4 py-2 rounded-xl bg-red-50 border text-[#d12f27] font-semibold">
                {subjects.length} Subjects
              </span>
            </div>

            <div className="space-y-3">
              {evaluations.map((subject, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#d12f27]">
                        {subject.subjectcode}
                      </p>

                      <h3 className="font-semibold text-gray-900">
                        {subject.subjectname}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {subject.units} Units
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        // subject.isactive === "Approved"
                        subject.isactive === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {subject.isactive === 1 ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* REMARKS */}
          <section className="bg-white rounded-lg border shadow-sm p-4">
            <h2 className="font-semibold text-lg mb-3">
              Admin Remarks & Actions
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700 mb-3">
              Your subjects have been submitted and are under review. Check this
              page regularly for updates.
            </div>

            <label className="text-sm text-gray-600 block mb-1">
              Comments regarding your current subject list:
            </label>

            <textarea
              rows={3}
              className="w-full border rounded-md px-3 py-2"
              readOnly
              value=""
            />

            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50">
                Request Subject Revision
              </button>

              <button className="px-4 py-2 bg-[#d12f27] text-white rounded-md hover:bg-red-700">
                Print Subject List
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EvaluationPage;

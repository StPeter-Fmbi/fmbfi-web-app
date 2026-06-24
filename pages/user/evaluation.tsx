import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import StudentHeader from "@/components/StudentHeader";
import { useStudent } from "@/hooks/useStudent";

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

  const totalUnits = subjects.reduce((sum, s) => sum + s.units, 0);
  const { student, schoolName, image, error, isLoading } = useStudent();

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
          <section className="bg-white rounded-lg border shadow-sm p-4 mb-4">
            <h2 className="font-semibold text-lg mb-3">
              Current Subjects & Evaluation Summary
            </h2>

            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Academic Year
                </label>

                <select className="w-full border rounded-md px-3 py-2">
                  <option>2024-2025</option>
                  <option>2025-2026</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Semester
                </label>

                <select className="w-full border rounded-md px-3 py-2">
                  <option>1st Semester</option>
                  <option>2nd Semester</option>
                </select>
              </div>

              <div className="border rounded-md px-4 py-2 flex items-center">
                <div>
                  <div className="text-sm text-gray-500">Total Units</div>
                  <div className="font-bold text-xl">{totalUnits}</div>
                </div>
              </div>

              <div className="border rounded-md px-4 py-2 flex items-center justify-between">
                <span className="text-sm">Evaluation Status</span>

                <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
                  Pending
                </span>
              </div>
            </div>
          </section>

          {/* SUBJECT LIST */}
          <section className="bg-white rounded-lg border shadow-sm p-4 mb-4">
            <h2 className="font-semibold text-lg mb-3">
              List of Current Subjects (AY 2024-2025, 1st Sem)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-3 py-2 text-left">Subject Code</th>
                    <th className="border px-3 py-2 text-left">
                      Subject Title
                    </th>
                    <th className="border px-3 py-2 text-center">Units</th>
                    <th className="border px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="border px-3 py-2">{subject.code}</td>

                      <td className="border px-3 py-2">{subject.title}</td>

                      <td className="border px-3 py-2 text-center">
                        {subject.units}
                      </td>

                      <td className="border px-3 py-2 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            subject.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {subject.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

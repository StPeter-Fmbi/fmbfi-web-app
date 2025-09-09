"use client";
import { IGrades } from "@/pages/api/student/student";
import axios from "axios";
import { useState } from "react";

export default function GradeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState(0);
  const [yearandsem, setYearAndSem] = useState("");
  const [list, setList] = useState<IGrades[]>([]);

  const handleSubmit = async () => {
    const res = await axios.post("/api/student/student", list);

    alert(res.data.message);
  };
  const addToList = () => {
    if (!subject || !grade || !yearandsem) return;
    setList([...list, { subject, yearandsem, grade }]);
    setSubject("");
    setYearAndSem("");
    setGrade(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Open Modal Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
      >
        Add Grade
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Add Subject Grade</h2>

            <div className="flex flex-col gap-3 mb-4">
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Year & Semester"
                value={yearandsem}
                onChange={(e) => setYearAndSem(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Grade"
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value))}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Action Buttons */}
              <div className="flex justify-between mt-2">
                <button
                  onClick={addToList}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Add to List
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Log List
                </button>
              </div>
            </div>

            {/* Table/List Inside Modal */}
            {list.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Subject</th>
                      <th className="border px-3 py-2 text-left">
                        Year & Semester
                      </th>
                      <th className="border px-3 py-2 text-left">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">{item.subject}</td>
                        <td className="border px-3 py-2">{item.yearandsem}</td>
                        <td className="border px-3 py-2">{item.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

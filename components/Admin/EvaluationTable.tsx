"use client";

import { useMemo, useState } from "react";
import StatusBadge from "./StatusLayout";

const scholars = [
  {
    id: "2026ADMIN001",
    name: "Abuloc, Rafly Gonzalo",
    batch: 100,
    enrolled: true,
  },
  {
    id: "2026ADMIN002",
    name: "Dela Cruz, Juan",
    batch: 99,
    enrolled: false,
  },
  {
    id: "2026ADMIN003",
    name: "Santos, Maria Clara",
    batch: 100,
    enrolled: true,
  },
  {
    id: "2026ADMIN004",
    name: "Maria Santos",
    batch: 100,
    enrolled: true,
  },
  {
    id: "2026ADMIN005",
    name: "Reyes, Carlo",
    batch: 98,
    enrolled: false,
  },
  {
    id: "2026ADMIN006",
    name: "Garcia, Angela",
    batch: 100,
    enrolled: true,
  },
  {
    id: "2026ADMIN007",
    name: "Torres, Michael",
    batch: 99,
    enrolled: true,
  },
  {
    id: "2026ADMIN008",
    name: "Ramos, Patricia",
    batch: 97,
    enrolled: false,
  },
  {
    id: "2026ADMIN009",
    name: "Villanueva, James",
    batch: 101,
    enrolled: true,
  },
  {
    id: "2026ADMIN010",
    name: "Flores, Jasmine",
    batch: 100,
    enrolled: true,
  },
  {
    id: "2026ADMIN011",
    name: "Navarro, Christian",
    batch: 98,
    enrolled: false,
  },
  {
    id: "2026ADMIN012",
    name: "Aquino, Sarah",
    batch: 99,
    enrolled: true,
  },
  {
    id: "2026ADMIN013",
    name: "Perez, Joshua",
    batch: 100,
    enrolled: true,
  },
  {
    id: "2026ADMIN014",
    name: "Mendoza, Alyssa",
    batch: 101,
    enrolled: false,
  },
  {
    id: "2026ADMIN015",
    name: "Cruz, Vincent",
    batch: 99,
    enrolled: true,
  },
  {
    id: "2026ADMIN016",
    name: "Lopez, Michelle",
    batch: 98,
    enrolled: true,
  },
  {
    id: "2026ADMIN017",
    name: "Castillo, Ryan",
    batch: 100,
    enrolled: false,
  },
  {
    id: "2026ADMIN018",
    name: "Fernandez, Nicole",
    batch: 101,
    enrolled: true,
  },
  {
    id: "2026ADMIN019",
    name: "Domingo, Kevin",
    batch: 100,
    enrolled: true,
  },
  {
    id: "2026ADMIN020",
    name: "Gutierrez, Hannah",
    batch: 99,
    enrolled: false,
  },
];

const PAGE_SIZE = 8;

export default function EvaluationTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(scholars.length / PAGE_SIZE);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return scholars.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3"></th>
              <th className="p-3">Scholar ID</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Enrollment Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((scholar) => (
              <tr key={scholar.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" />
                </td>

                <td className="p-3">{scholar.id}</td>

                <td className="p-3">{scholar.name}</td>

                <td className="p-3">{scholar.batch}</td>

                <td className="p-3">
                  <StatusBadge enrolled={scholar.enrolled} />
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200">
                      Subjects
                    </button>

                    <button className="rounded bg-indigo-600 px-3 py-1 text-white">
                      Edit
                    </button>

                    <button className="rounded bg-red-600 px-3 py-1 text-white">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {currentData.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t p-4">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * PAGE_SIZE + 1} -
            {Math.min(currentPage * PAGE_SIZE, scholars.length)} of{" "}
            {scholars.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

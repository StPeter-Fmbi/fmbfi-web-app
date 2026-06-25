import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Footer from "@/components/Footer";
import { Student } from "@/types/student";
import StudentHeader from "@/components/StudentHeader";
import { useStudent } from "@/hooks/useStudent";

const StudentProfile = () => {
  const { student, schoolName, image, error, isLoading } = useStudent();

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-md text-gray-500">{label}</span>

      <span className="text-md font-semibold text-gray-900">
        {value || "—"}
      </span>
    </div>
  );

  return (
    <>
      <Head>
        <title>FMBFI | Scholar Dashboard</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        {/* MAIN */}
        <div className="flex-1 w-full xl:ml-64 pt-20 md:pt-24 p-3 sm:p-4 md:p-6 font-body overflow-x-hidden">
          {/* HEADER (only when ready) */}
          {student && (
            <StudentHeader
              student={student}
              schoolName={schoolName}
              image={image}
            />
          )}

          {/* LOADING (NO BUG NOW) */}
          {isLoading && (
            <div className="flex items-center gap-4 mb-6 animate-pulse">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && <p className="text-red-500 p-4">{error}</p>}

          {/* CONTENT */}
          {!isLoading && student && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#d12f27]">
                  Scholar Overview
                </h2>

                <div
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-full ${
                    student.status === "Active"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      student.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />

                  <span
                    className={`text-xs font-semibold ${
                      student.status === "Active"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {student.status || "Unknown Status"}
                  </span>
                </div>
              </div>

              {/* DASHBOARD STATS */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* GPA */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 to-red-600 text-white p-5 shadow-lg">
                  <div className="absolute top-0 right-0 text-6xl opacity-10">
                    🎓
                  </div>

                  <p className="text-sm opacity-90">Current GPA</p>
                  <p className="text-4xl font-bold mt-2">N/A</p>
                </div>

                {/* Status */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white p-5 shadow-lg">
                  <div className="absolute top-0 right-0 text-6xl opacity-10">
                    ✅
                  </div>

                  <p className="text-sm opacity-90">Scholarship Status</p>

                  <p className="text-3xl font-bold mt-2">
                    {student.status || "N/A"}
                  </p>
                </div>

                {/* Category */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white p-5 shadow-lg">
                  <div className="absolute top-0 right-0 text-6xl opacity-10">
                    📚
                  </div>

                  <p className="text-sm opacity-90">Category</p>

                  <p className="text-3xl font-bold mt-2">
                    {student.category || "N/A"}
                  </p>
                </div>

                {/* Batch */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white p-5 shadow-lg">
                  <div className="absolute top-0 right-0 text-6xl opacity-10">
                    🏆
                  </div>

                  <p className="text-sm opacity-90">Batch</p>

                  <p className="text-4xl font-bold mt-2">
                    {student.batch || "N/A"}
                  </p>
                </div>
              </div>

              {/* INFORMATION CARDS */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* PERSONAL INFO */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                    <h2 className="font-bold text-white text-lg">
                      Personal Information
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <InfoRow label="Scholar ID" value={student.scholardid} />
                    <InfoRow
                      label="Category"
                      value={student.category || "N/A"}
                    />
                    <InfoRow label="Year Level" value={student.sy} />
                  </div>
                </div>

                {/* SCHOLARSHIP INFO */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                    <h2 className="font-bold text-white text-lg">
                      Scholarship Information
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <InfoRow label="Batch Number" value={student.batch} />

                    <InfoRow label="Academic Year" value={student.sy} />

                    <InfoRow label="Status" value={student.status} />
                  </div>
                </div>
              </div>

              {/* ANNOUNCEMENTS */}
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-white font-bold text-base sm:text-lg">
                    Latest Announcements
                  </h2>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {student.announcements?.length ? (
                    <div className="space-y-3 sm:space-y-4">
                      {student.announcements.map((item, idx) => (
                        <div
                          key={idx}
                          className="group relative bg-gray-50 hover:bg-white border border-gray-100 hover:border-red-200 rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {/* Accent line */}
                          <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-l-xl" />

                          <div className="ml-2 sm:ml-3">
                            {/* Title */}
                            <p className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-[#d12f27] transition-colors">
                              {item.title}
                            </p>

                            {/* Date */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                {item.date
                                  ? new Date(item.date).toLocaleDateString()
                                  : "No date"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-2">📢</div>
                      <p className="text-gray-600 font-medium">
                        No announcements available
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Check back later for updates
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StudentProfile;

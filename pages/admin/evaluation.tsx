import EvaluationTable from "@/components/Admin/EvaluationTable";
import EvaluationToolbar from "@/components/Admin/EvaluationToolbar";
import StatusCard from "@/components/Admin/StatusCard";
import Sidebar from "@/components/Sidebar";
import React from "react";

const evaluation = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-60 min-h-screen">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-screen-2xl">
            {/* Status Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatusCard
                title="Total Active Scholars"
                value="124"
                color="bg-red-500"
                icon="👥"
              />

              <StatusCard
                title="Subject Enrollment Status"
                value="110 Enrolled / 14 Pending"
                color="bg-green-500"
                icon="📚"
              />

              <StatusCard
                title="Pending Evaluations"
                value="5"
                color="bg-blue-500"
                icon="📝"
              />

              <StatusCard
                title="Recent Graduates"
                value="32"
                color="bg-orange-500"
                icon="🎓"
              />
            </div>

            {/* Table Section */}
            <section className="mt-6 overflow-hidden rounded-xl bg-white shadow">
              <div className="border-b px-4 py-4 sm:px-6">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Scholar Overview & Enrollment
                </h2>
              </div>

              <EvaluationToolbar />

              <div className="overflow-x-auto">
                <EvaluationTable />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default evaluation;

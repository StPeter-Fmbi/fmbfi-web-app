import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import GradeModal from "@/components/Student/GradeModal";

// Define types for any expected data (for example, session)
interface SessionData {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

const ScholarDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Check if session is not null, and the user exists
  const user = session?.user as SessionData["user"] | null;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Dashboard Content */}
      <div
        className={`flex-1 xl:ml-64 ml-0 bg-gray-100 min-h-screen p-8 transition-all duration-300 ${
          user ? "xl:ml-64" : ""
        } ${user && "pt-16 xl:pt-8"}`} // Add top padding when sidebar is on top
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
          {user && (
            <div className="flex items-center space-x-2">
              <img
                src={user.image || "/images/default-profile.png"}
                alt="Profile Picture"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl">{user.name}</span>
            </div>
          )}
        </div>

        {/* Stats / Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">
              Recent Grades
            </h2>
            <div className="mt-4 text-gray-600">
              <ul>
                <li>Math: A+</li>
                <li>Science: B+</li>
                <li>English: A</li>
              </ul>
            </div>
            <GradeModal />
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">
              Upcoming Evaluations
            </h2>
            <div className="mt-4 text-gray-600">
              <ul>
                <li>Math Exam - 20th Feb</li>
                <li>History Quiz - 22nd Feb</li>
              </ul>
            </div>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">
              Profile Settings
            </h2>
            <div className="mt-4">
              <button
                onClick={() => router.push("/user/profile")}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="mt-8 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">
            Latest Announcements
          </h2>
          <div className="mt-4 text-gray-600">
            <ul>
              <li>New semester starts on March 1st!</li>
              <li>Reminder: Submit your assignment by 25th Feb.</li>
              <li>Career Fair next month - Don't miss it!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarDashboard;

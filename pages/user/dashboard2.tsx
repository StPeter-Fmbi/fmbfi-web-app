// pages/user/dashboard.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.role !== "User") {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("/api/getData");
        const data = await response.json();
        
        const user = data.data.find(
          (user: any) => user.email === session.user?.email
        );
        
        if (user) {
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (!userData) {
      fetchData();
    }
  }, [session, status, router, userData]);

  if (status === "loading" || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* User Info */}
          <div className="flex justify-center items-center mb-8">
            <img
              src={userData?.profilePicture || "/images/default-avatar.png"}
              alt="User Picture"
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-[#d12f27]">
            Welcome, {userData.firstName}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">{session?.user?.email}</p>
        </div>

        {/* Grid of Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Submit Grades Button */}
          <div>
            <button
              onClick={() => router.push("/user/submit-grades")}
              className="w-full bg-[#d12f27] text-white py-4 px-6 rounded-lg shadow hover:bg-[#b3271d] transition"
            >
              Submit Grades
            </button>
          </div>

          {/* Show Evaluation Button */}
          <div>
            <button
              onClick={() => router.push("/user/evaluation")}
              className="w-full bg-[#d12f27] text-white py-4 px-6 rounded-lg shadow hover:bg-[#b3271d] transition"
            >
              Show Evaluation
            </button>
          </div>

          {/* View Grades Button */}
          <div>
            <button
              onClick={() => router.push("/user/grades")}
              className="w-full bg-[#d12f27] text-white py-4 px-6 rounded-lg shadow hover:bg-[#b3271d] transition"
            >
              View Grades
            </button>
          </div>

          {/* Another Button Example */}
          <div>
            <button
              onClick={() => router.push("/user/other-action")}
              className="w-full bg-[#d12f27] text-white py-4 px-6 rounded-lg shadow hover:bg-[#b3271d] transition"
            >
              Another Action
            </button>
          </div>

          {/* Another Button Example */}
          <div>
            <button
              onClick={() => router.push("/user/other-action")}
              className="w-full bg-[#d12f27] text-white py-4 px-6 rounded-lg shadow hover:bg-[#b3271d] transition"
            >
              Another Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

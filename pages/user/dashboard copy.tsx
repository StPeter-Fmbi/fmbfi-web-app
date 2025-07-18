"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SheetData } from "../../types/sheetData";
import Sidebar from "../../components/Sidebar";
import Footer from "@/components/Footer";

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<SheetData | null>(null);

  // Fetch user data when session is ready
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
          (user: SheetData) => user.email === session.user?.email
        );

        if (user) {
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Only fetch if userData isn't already set
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

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto flex-grow mt-16"> {/* Added mt-16 for spacing */}
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-extrabold text-[#d12f27]">
            Welcome, {userData.firstName}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">Here are your account details</p>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-heading font-semibold text-[#d12f27]">Your Information</h2>
            <p className="mt-2 text-gray-700">All the details we have for your account are displayed below.</p>

            <div className="mt-6 space-y-4">
              <p><span className="font-semibold">Email:</span> {session?.user?.email}</p>
              <p><span className="font-semibold">Role:</span> {session?.user?.role}</p>
              <p><span className="font-semibold">Student ID:</span> {userData?.studentId}</p>
              <p><span className="font-semibold">Batch:</span> {userData?.batch}</p>
              <p><span className="font-semibold">School Year:</span> {userData?.sy}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-heading font-semibold text-[#d12f27]">Personal Details</h2>

            <div className="mt-6 space-y-4">
              <p><span className="font-semibold">First Name:</span> {userData?.firstName}</p>
              <p><span className="font-semibold">Last Name:</span> {userData?.lastName}</p>
              <p><span className="font-semibold">Middle Name:</span> {userData?.middleName}</p>
              <p><span className="font-semibold">School:</span> {userData?.school}</p>
              <p><span className="font-semibold">Course:</span> {userData?.course}</p>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-[#d12f27] text-white font-body font-semibold rounded-lg hover:bg-[#b3271d] transition"
          >
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;

"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session || session.user?.role !== "Admin") {
    // Redirect to login page if the user is not logged in or not an Admin
    // router.push("/login");
    router.replace("/login");
    return <p>Redirecting...</p>;
  }

  return (
    <div>
      <h1>Welcome to Admin Dashboard</h1>
      <p>Welcome back, {session.user?.email}!</p>
      <p>Your Role: {session.user?.role}</p>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
};

export default AdminDashboard;

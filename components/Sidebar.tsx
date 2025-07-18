// Sidebar component
import { FiHome, FiFileText, FiLogOut, FiMenu, FiX } from "react-icons/fi"; // Added FiX for close icon
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for toggling sidebar on mobile/tablet
  const [isMobile, setIsMobile] = useState(false); // State to detect if it’s mobile or not

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleResize = () => {
    if (window.innerWidth <= 1024) {
      setIsMobile(true); // Mobile/tablet view
    } else {
      setIsMobile(false); // Large screen view
    }
  };

  // Watch for window resize
  useEffect(() => {
    handleResize(); // Set the initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Top Bar for small screens (Mobile and Tablet view only) */}
      {isMobile && !isSidebarOpen && (
        <div className="xl:hidden flex justify-between items-center p-4 bg-red-600 fixed top-0 left-0 right-0 z-40">
          <button onClick={toggleSidebar} className="text-white">
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
            />
            <span className="text-xs sm:text-sm lg:text-lg font-heading font-extrabold text-white">
              FRANCISCO M BAUTISTA FOUNDATION INC.
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg font-body"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Sidebar for mobile screens (Mobile view) */}
      <div
        className={`xl:hidden ${
          isSidebarOpen ? "flex" : "hidden"
        } fixed inset-0 bg-red-600 shadow-lg p-6 h-screen z-50 flex-col`}
      >
        {/* Close button inside the sidebar */}
        <button
          onClick={toggleSidebar}
          className="text-white absolute top-4 right-4 p-2"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2 mb-8 px-4">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
          />
          <span className="text-xs sm:text-sm lg:text-lg xl:text-xl font-heading font-extrabold text-white">
            FRANCISCO M BAUTISTA FOUNDATION INC.
          </span>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col space-y-6">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg flex items-center space-x-2 font-body"
          >
            <FiHome className="w-5 h-5" />
            <span className="text-lg">Dashboard</span>
          </button>

          <button
            onClick={() => router.push("/user/grades")}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg flex items-center space-x-2 font-body"
          >
            <FiFileText className="w-5 h-5" />
            <span className="text-lg">Grades</span>
          </button>

          <button
            onClick={() => router.push("/user/evaluation")}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg flex items-center space-x-2 font-body"
          >
            <FiFileText className="w-5 h-5" />
            <span className="text-lg">Evaluation</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg flex items-center space-x-2 font-body mt-auto"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-lg">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sidebar for large screens (always visible, no toggle) */}
      <div className="hidden xl:flex w-64 bg-red-600 shadow-lg p-6 h-screen fixed left-0 top-0 z-30 flex-col">
        {/* Logo & Sign Out aligned on top */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
            />
            <span className="text-sm sm:text-sm lg:text-lg xl:text-xl font-heading font-extrabold text-white">
              FRANCISCO M BAUTISTA FOUNDATION INC.
            </span>
          </div>
        </div>

        {/* Sidebar Links (Visible only on large screens) */}
        <div className="flex flex-col space-y-6">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg flex items-center space-x-2 font-body"
          >
            <FiHome className="w-5 h-5" />
            <span className="text-lg">Dashboard</span>
          </button>

          <button
            onClick={() => router.push("/user/grades")}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg flex items-center space-x-2 font-body"
          >
            <FiFileText className="w-5 h-5" />
            <span className="text-lg">Grades</span>
          </button>

          <button
            onClick={() => router.push("/user/evaluation")}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg flex items-center space-x-2 font-body"
          >
            <FiFileText className="w-5 h-5" />
            <span className="text-lg">Evaluation</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="text-white hover:bg-red-700 hover:text-white px-4 py-3 rounded-lg flex items-center space-x-2 font-body mt-auto"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-lg">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

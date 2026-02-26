import {
  FiHome,
  FiFileText,
  FiLogOut,
  FiSettings,
  FiEdit,
  FiX,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Handle Sign Out
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Toggles
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

  // Detect mobile/tablet screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation links data to avoid repetition
  const navLinks = [
    { name: "Dashboard", icon: FiHome, path: "/user/dashboard" },
    { name: "Grades", icon: FiFileText, path: "/user/grades" },
    { name: "Evaluation", icon: FiFileText, path: "/user/evaluation" },
  ];

  // Logo component for reuse
  const Logo = () => (
    <div className="flex items-center space-x-2">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
      />
      <span className="text-xs sm:text-md lg:text-lg font-heading font-extrabold text-white whitespace-nowrap">
        FRANCISCO M BAUTISTA FOUNDATION INC.
      </span>
    </div>
  );

  // Desktop Settings Menu (collapsible)
  const SettingsMenuDesktop = () => (
    <div className="flex flex-col">
      <button
        onClick={toggleSettings}
        className="text-white hover:bg-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 font-body w-full"
        aria-expanded={isSettingsOpen}
        aria-controls="desktop-settings-menu"
      >
        <FiSettings className="w-5 h-5" />
        <span className="text-lg">Settings</span>
        <FiChevronDown
          className={`ml-auto w-4 h-4 transition-transform ${
            isSettingsOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isSettingsOpen && (
        <div
          id="desktop-settings-menu"
          className="flex flex-col ml-6 mt-2 space-y-2"
          role="region"
          aria-label="Settings submenu"
        >
          <button
            onClick={() => router.push("/user/update-info")}
            className="text-white hover:bg-red-700 px-4 py-2 rounded-lg flex items-center space-x-2 font-body"
            aria-label="Update Info"
          >
            <FiEdit className="w-4 h-4" />
            <span>Update Info</span>
          </button>
          <button
            onClick={handleSignOut}
            className="text-white hover:bg-red-700 px-4 py-2 rounded-lg flex items-center space-x-2 font-body"
            aria-label="Sign Out"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Topbar */}
      {isMobile && (
        <header className="xl:hidden flex justify-between items-center p-4 bg-red-600 fixed top-0 left-0 right-0 z-40 shadow-md">
          {/* Hamburger / Close Button */}
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center text-white"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>

          <Logo />

          {/* Settings Button */}
          <div className="relative">
            <button
              onClick={toggleSettings}
              className={`text-white w-10 h-10 flex items-center justify-center rounded-full transition-transform duration-300 ${
                isSettingsOpen
                  ? "rotate-90 bg-red-700"
                  : "rotate-0 bg-transparent"
              }`}
              aria-label="Settings menu"
              aria-expanded={isSettingsOpen}
            >
              <FiSettings className="w-5 h-5 transition-transform duration-300" />
            </button>
          </div>
        </header>
      )}

      {/* Mobile Settings Menu (full-width below topbar) */}
      {isMobile && isSettingsOpen && (
        <div className="fixed top-20 right-0 bg-red-600 text-white shadow-md z-50 flex flex-col rounded-md p-4 w-48">
          <button
            onClick={() => {
              router.push("/user/update-info");
              setIsSettingsOpen(false);
            }}
            className="flex items-center space-x-3 hover:bg-red-700 w-full text-left text-lg px-3 py-2 rounded"
            aria-label="Update Info"
          >
            <FiEdit className="w-5 h-5" />
            <span>Update Info</span>
          </button>
          <button
            onClick={() => {
              handleSignOut();
              setIsSettingsOpen(false);
            }}
            className="flex items-center space-x-3 hover:bg-red-700 w-full text-left text-lg px-3 py-2 rounded"
            aria-label="Sign Out"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`xl:hidden fixed top-20 left-0 right-0 bg-red-600 shadow-lg p-6 z-50 flex flex-col transform transition-transform duration-300 rounded-lg ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <nav
          className="flex flex-col space-y-4" // reduced spacing slightly
          aria-label="Mobile main navigation"
        >
          {navLinks.map(({ name, icon: Icon, path }) => (
            <button
              key={name}
              onClick={() => {
                router.push(path);
                setIsSidebarOpen(false);
              }}
              className="text-white hover:bg-red-700 px-3 py-2 rounded-lg flex items-start space-x-2 font-body text-lg"
            >
              <Icon className="w-5 h-5 mt-1" />
              <span className="pt-1">{name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* <aside
        className="hidden xl:flex w-64 bg-gradient-to-b from-red-400 to-red-800 shadow-lg p-6 h-screen fixed left-0 top-0 z-30 flex-col"
        aria-label="Desktop sidebar"
      > */}
      <aside
        className="hidden xl:flex w-64 bg-red-700 shadow-lg p-6 h-screen fixed left-0 top-0 z-30 flex-col"
        aria-label="Desktop sidebar"
      >
        <div className="flex flex-col items-center mb-10 px-4 text-center">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-24 w-24 rounded-full mb-2"
          />
          <span className="text-sm sm:text-md lg:text-lg font-body font-bold text-white leading-snug whitespace-normal">
            FRANCISCO M<br />
            BAUTISTA
            <br />
            FOUNDATION
            <br />
            INC.
          </span>
          {/* Divider line */}
          <div className="border-b border-red-300 w-full mt-4"></div>
        </div>

        <nav
          className="flex flex-col space-y-6"
          aria-label="Desktop main navigation"
        >
          {navLinks.map(({ name, icon: Icon, path }) => {
            const isActive = router.pathname === path;
            return (
              <button
                key={name}
                onClick={() => router.push(path)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-lg font-body w-full transition-colors ${
                  isActive
                    ? "bg-red-800 text-white"
                    : "text-white hover:bg-red-00"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </button>
            );
          })}
          <SettingsMenuDesktop />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

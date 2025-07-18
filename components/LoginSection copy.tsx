import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter for routing
import { signIn, useSession } from "next-auth/react"; // Import NextAuth's signIn function

// Extend the Session type to include the role property
declare module "next-auth" {
  interface Session {
    role?: "admin" | "scholar";
  }
}

const LoginSection = () => {
  const [activeTab, setActiveTab] = useState<"scholar" | "admin">("scholar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { data: session } = useSession(); // Destructure session data
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Redirect based on role
      if (session.role === "admin") {
        router.replace("/admin/dashboard"); // Redirect to admin dashboard
      } else {
        router.replace("/user/dashboard"); // Redirect to scholar dashboard
      }
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role: activeTab,
    });

    if (res?.error) {
      setMessage(res.error);
    } else if (res?.ok) {
      // Redirect based on role after successful login
      if (session?.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }
  };

  return (
    <section
      id="login"
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
    >
      {/* Background Image with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/FMBFI.JPG")', // Local image path
          opacity: 0.5, // Set opacity to 50% for background image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      {/* Overlay for background opacity */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content Container */}
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-xl w-[90%] sm:w-[400px] relative z-10 mt-12 sm:mt-16 md:mt-20">
        {/* Logo Centered at the Top (Bottom Half Sticking to Top) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mb-6">
          <img
            src="/images/logo.png" // Replace with your logo image path
            alt="Logo"
            className="w-24 h-auto" // Adjust size as needed
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 sm:space-x-6 border-b pb-4 mb-6 pt-6 sm:pt-8 md:pt-10">
          <button
            aria-selected={activeTab === "scholar" ? "true" : "false"}
            className={`text-lg sm:text-xl font-extrabold ${
              activeTab === "scholar"
                ? "border-b-2 border-[#d12f27] text-[#d12f27]"
                : "text-gray-600"
            } hover:text-[#d12f27] focus:outline-none font-body`}
            onClick={() => setActiveTab("scholar")}
          >
            Scholar
          </button>
          <button
            aria-selected={activeTab === "admin" ? "true" : "false"}
            className={`text-lg sm:text-xl font-extrabold ${
              activeTab === "admin"
                ? "border-b-2 border-[#d12f27] text-[#d12f27]"
                : "text-gray-600"
            } hover:text-[#d12f27] focus:outline-none font-body`}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        </div>

        {/* Form for both tabs */}
        <div>
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-6 font-semibold text-[#2a2a2a] font-body">
            {activeTab === "scholar" ? "Scholar Log-in" : "Admin Log-in"}
          </h2>

          {/* Conditional rendering of form based on active tab */}
          {activeTab === "scholar" ? (
            <form className="py-8 space-y-6" onSubmit={handleSubmit}>
              {message && (
                <div className="bg-red-500 text-white p-4 rounded-md">
                  {message}
                </div>
              )}

              <div className="flex items-center justify-center">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4"
                  placeholder="Your Email"
                />
              </div>

              <div className="flex items-center justify-center">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4"
                  placeholder="Your StudentId"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full max-w-lg rounded-md shadow py-4 px-6 text-lg sm:text-xl lg:text-2xl text-white bg-red-900 hover:bg-white hover:text-red-900 border-4 border-transparent hover:border-red-900 transition-colors duration-300"
                >
                  Log-in
                </button>
              </div>
            </form>
          ) : (
            <form className="py-8 space-y-6" onSubmit={handleSubmit}>
              {message && (
                <div className="bg-red-500 text-white p-4 rounded-md">
                  {message}
                </div>
              )}

              <div className="flex items-center justify-center">
                <label htmlFor="email-admin" className="sr-only">
                  Admin Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email-admin"
                  className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4"
                  placeholder="Admin Email"
                />
              </div>

              <div className="flex items-center justify-center">
                <label htmlFor="password-admin" className="sr-only">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password-admin"
                  className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4"
                  placeholder="Your Admin Password"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full max-w-lg rounded-md shadow py-4 px-6 text-lg sm:text-xl lg:text-2xl text-white bg-red-900 hover:bg-white hover:text-red-900 border-4 border-transparent hover:border-red-900 transition-colors duration-300"
                >
                  Log-in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoginSection;

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router"; // Import useRouter
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginSection = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize useRouter
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(""); // New state for name
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login"); // State for toggling tabs
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(""); // Clear previous error message

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setErrorMessage(res.error); // Set error message if login fails
    } else if (res?.ok) {
      if (session?.user?.role === "Admin") {
        router.push("/admin/dashboard");
      } else if (session?.user?.role === "User") {
        router.push("/user/dashboard");
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(""); // Clear previous error message

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Save the user data to the Google Sheet
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        setErrorMessage("Registration successful! Please log in.");
      } else {
        setErrorMessage("Failed to save user to sheet.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while saving your data.");
    }
  };

  // Check the session and navigate on initial load or session change
  useEffect(() => {
    if (status === "loading") return; // Prevent unnecessary redirects while loading

    if (session) {
      if (session.user?.role === "Admin") {
        router.push("/admin/dashboard");
      } else if (session.user?.role === "User") {
        router.push("/user/dashboard");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-white rounded-full"></div>
      </div>
    );
  }

  return (
    <section
      id="login"
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/FMBFI.JPG")',
          opacity: 0.5,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-xl w-[90%] sm:w-[500px] md:w-[600px] relative z-10 mt-12 sm:mt-16 md:mt-20">
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mb-6 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="/images/logo.png" alt="Logo" className="w-24 h-auto" />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-6 sm:space-x-8 border-b pb-6 mb-8 pt-8 sm:pt-10 md:pt-12">
          <button
            aria-selected={activeTab === "login" ? "true" : "false"}
            className={`text-xl sm:text-2xl font-extrabold ${
              activeTab === "login"
                ? "border-b-2 border-[#d12f27] text-[#d12f27]"
                : "text-gray-600"
            } hover:text-[#d12f27] focus:outline-none font-body`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>

          {/* Separator */}
          <span className="text-gray-600">|</span>

          <button
            aria-selected={activeTab === "register" ? "true" : "false"}
            className={`text-xl sm:text-2xl font-extrabold ${
              activeTab === "register"
                ? "border-b-2 border-[#d12f27] text-[#d12f27]"
                : "text-gray-600"
            } hover:text-[#d12f27] focus:outline-none font-body`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {errorMessage && (
              <div className="bg-red-500 text-white p-4 rounded-md">
                {errorMessage}
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
                required
              />
            </div>

            <div className="flex items-center justify-center relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4 pr-14" // Add extra padding to the right
                placeholder="Your Password"
                required
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={24} />
                  ) : (
                    <FaEye size={24} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="flex items-center justify-center w-full max-w-lg rounded-full shadow py-2 px-6 text-lg sm:text-xl lg:text-2xl text-white bg-[#d12f27] hover:bg-transparent hover:text-[#d12f27] hover:border-[#d12f27] border-4 border-transparent transition-colors duration-300"
              >
                Log-in
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {errorMessage && (
              <div className="bg-red-500 text-white p-4 rounded-md">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-center">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                name="name"
                id="name"
                className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4"
                placeholder="Your Name"
                required
              />
            </div>

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
                required
              />
            </div>

            <div className="flex items-center justify-center relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4 pr-14" // Add extra right padding
                placeholder="Your Password"
                required
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={24} />
                  ) : (
                    <FaEye size={24} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4 pr-14" // Add extra right padding
                placeholder="Confirm Password"
                required
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={24} />
                  ) : (
                    <FaEye size={24} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="flex items-center justify-center w-full max-w-lg rounded-full shadow py-2 px-6 text-lg sm:text-xl lg:text-2xl text-white bg-[#d12f27] hover:bg-transparent hover:text-[#d12f27] hover:border-[#d12f27] border-4 border-transparent transition-colors duration-300"
              >
                Register
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default LoginSection;

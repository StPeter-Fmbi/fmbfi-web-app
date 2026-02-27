import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginSection = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Use NextAuth signIn with Credentials provider
    const result = await signIn("credentials", {
      redirect: false, // prevent automatic redirect to handle it manually
      email,
      password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
      return;
    }

    if (result?.ok) {
      // Get session to check user role
      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      );

      const userRole = session?.user?.role || "User";

      if (userRole === "Admin") {
        router.push("/admin/dashboard");
      } else if (userRole === "User") {
        router.push("/user/dashboard");
      } else {
        router.push("/"); // fallback
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setErrorMessage("Registration successful! Please log in.");
        setActiveTab("login");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to register.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during registration.");
    }
  };

  useEffect(() => {
    if (status === "loading") return;

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
          opacity: 70,
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
            Log-in
          </button>

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
                className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4 pr-14"
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

            <div className="flex flex-col items-center space-y-4 font-body">
              {/* Regular Log-in button */}
              <div className="flex items-center justify-center w-full max-w-lg">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full rounded-full shadow py-2 px-6 text-lg sm:text-xl lg:text-2xl text-white bg-[#d12f27] hover:bg-transparent hover:text-[#d12f27] hover:border-[#d12f27] border-4 border-transparent transition-colors duration-300 font-heading"
                >
                  Log-in
                </button>
              </div>

              {/* --or-- separator */}
              <div className="flex items-center w-full max-w-lg">
                <hr className="flex-grow border-gray-300" />
                <span className="px-4 text-md sm:text-lg lg:text-xl text-[#d12f27]  font-heading">
                  or
                </span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Google sign-in button */}
              <div className="flex items-center justify-center w-full max-w-lg">
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="flex items-center justify-center w-full rounded-full shadow py-2 px-6 text-lg sm:text-xl lg:text-2xl text-[#d12f27] bg-white border-4 border-[#d12f27] hover:bg-[#d12f27] hover:text-white transition-colors duration-300 font-heading"
                >
                  <img
                    src="/images/google-icon.svg"
                    alt="Google"
                    className="w-6 h-6 mr-4"
                  />
                  Sign in with Google
                </button>
              </div>
            </div>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
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
                className="shadow-md focus:ring-red-900 focus:border-red-900 block w-full max-w-lg sm:text-lg lg:text-xl border-gray-300 rounded-md p-4 pr-14"
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

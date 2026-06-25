import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";

const LoginSection = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoggingIn(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password: loginPassword,
    });

    setIsLoggingIn(false);

    if (result?.error) {
      const errorMap: Record<string, string> = {
        CredentialsSignin: "Invalid Email or Password.",
        AccessDenied: "Access denied.",
        OAuthSignin: "Google sign-in failed.",
        OAuthCallback: "Authentication callback failed.",
      };

      setErrorMessage(errorMap[result.error] || result.error);
      return;
    }

    if (result?.ok) {
      const session = await fetch("/api/auth/session").then((res) =>
        res.json(),
      );

      const userRole = session?.user?.role || "User";
      const isPasswordChanged = session?.user?.isPasswordChanged;

      if (!isPasswordChanged) {
        router.push("/user/change-password");
        return;
      }

      if (userRole === "Admin") router.push("/admin/dashboard");
      else router.push("/user/dashboard");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: registerPassword }),
      });

      if (response.ok) {
        setErrorMessage("Registration successful! Please log in.");
        setActiveTab("login");
        setEmail("");
        setRegisterPassword("");
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
    <>
      <Head>
        <title>FMBFI | Login | Register</title>
      </Head>
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
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="backdrop-blur-lg bg-white/95 rounded-3xl shadow-2xl overflow-hidden border border-white/30 w-[90%] sm:w-[500px] md:w-[600px] relative z-10">
          <div className="relative bg-gradient-to-r from-red-600 to-red-700 px-8 py-8 text-center">
            <div className="absolute inset-0 opacity-50">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: 'url("/images/FMBFI.JPG")',
                }}
              />
            </div>

            <div className="relative">
              <div
                className="mx-auto mb-4 h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer"
                onClick={() => router.push("/")}
              >
                <img
                  src="/images/logo.png"
                  alt="FMBFI Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <h1 className="text-3xl font-bold text-white font-title">
                Welcome to the Scholar Portal
              </h1>

              <p className="text-red-100 text-sm mt-2">
                Sign in to manage your scholarship information and academic
                records.
              </p>
            </div>
          </div>

          {isLoggingIn && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 min-w-[320px]">
                <FaSpinner className="animate-spin text-red-600 text-5xl" />

                <h3 className="text-lg font-semibold text-gray-700">
                  Signing In...
                </h3>

                <p className="text-gray-500 text-center">
                  Please wait while we verify your account.
                </p>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex justify-center gap-8 border-b border-gray-200 pt-8 pb-4">
            <button
              aria-selected={activeTab === "login" ? "true" : "false"}
              className={`text-xl sm:text-2xl font-extrabold ${
                activeTab === "login"
                  ? "border-b-2 border-[#d12f27] text-[#d12f27]"
                  : "text-gray-600"
              } hover:text-[#d12f27] focus:outline-none font-body`}
              onClick={() => {
                setActiveTab("login");
                setErrorMessage(""); // ✅ clear error when going back
              }}
            >
              Log-in
            </button>

            <span className="text-gray-600">|</span>

            <button
              aria-selected={activeTab === "register" ? "true" : "false"}
              className={`text-xl sm:text-2xl font-extrabold ${
                activeTab === "register"
                  ? "border-b-2 border-[#d12f27] text-[#d12f27]"
                  : "text-gray-400"
              } hover:text-[#d12f27] focus:outline-none font-body`}
              onClick={() => {
                setActiveTab("register");
                // setErrorMessage("Registration is currently disabled.");
              }}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" ? (
            <div className="p-8">
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="bg-red-500 text-white p-4 rounded-md flex items-center gap-2">
                    <FaExclamationCircle className="text-lg flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    className="w-full shadow-md border border-gray-300 rounded-lg p-4 focus:ring-red-900 focus:border-red-900"
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    className="w-full shadow-md border border-gray-300 rounded-lg p-4 pr-14 focus:ring-red-900 focus:border-red-900 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    placeholder="Password"
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d12f27] hover:bg-[#b72821] text-white py-3 rounded-lg font-semibold transition"
                >
                  Log-in
                </button>

                <div className="flex items-center">
                  <hr className="flex-grow border-gray-300" />
                  <span className="px-4 text-[#d12f27] font-medium">or</span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="w-full border-2 border-[#d12f27] text-[#d12f27] hover:bg-[#d12f27] hover:text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-3"
                >
                  <img
                    src="/images/google-icon.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Sign in with Google
                </button>
              </form>
            </div>
          ) : (
            // Register Form
            <div className="p-8">
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="bg-red-500 text-white p-4 rounded-md flex items-center gap-2">
                    <FaExclamationCircle className="text-lg flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    className="w-full shadow-md border border-gray-300 rounded-lg p-4 focus:ring-red-900 focus:border-red-900"
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    type={showRegisterPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    className="w-full shadow-md border border-gray-300 rounded-lg p-4 pr-14 focus:ring-red-900 focus:border-red-900 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    placeholder="Password"
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                  >
                    {showRegisterPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d12f27] hover:bg-[#b72821] text-white py-3 rounded-lg font-semibold transition"
                >
                  Register
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default LoginSection;

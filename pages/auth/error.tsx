import Footer from "@/components/Footer";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaExclamationCircle } from "react-icons/fa";

const AuthErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;

  const getMessage = (error?: string | string[]) => {
    switch (error) {
      case "AccessDenied":
        return "Access denied. Your account is not registered or not allowed to sign in.";
      case "OAuthSignin":
        return "Google sign-in failed. Please try again.";
      case "OAuthCallback":
        return "Authentication callback failed.";
      case "OAuthAccountNotLinked":
        return "This email is already registered using another login method.";
      case "CredentialsSignin":
        return "Invalid email or password.";
      default:
        return "Something went wrong during authentication. Please try again.";
    }
  };

  return (
    <>
      <Head>
        <title>Authentication Error</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 px-6 font-body relative overflow-hidden">

        {/* soft background glow */}
        <div className="absolute w-[500px] h-[500px] bg-red-200 rounded-full blur-3xl opacity-30 -top-40 -left-40" />
        <div className="absolute w-[400px] h-[400px] bg-red-300 rounded-full blur-3xl opacity-20 -bottom-40 -right-40" />

        {/* CARD */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-red-100 shadow-2xl rounded-3xl p-10 text-center relative">

          {/* ICON */}
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-6 shadow-md">
            <FaExclamationCircle className="text-5xl animate-pulse" />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-3">
            Authentication Failed
          </h1>

          {/* ERROR CODE */}
          {error && (
            <div className="inline-block text-sm text-red-700 bg-red-50 px-4 py-1 rounded-full mb-4 font-mono">
              {String(error)}
            </div>
          )}

          {/* MESSAGE */}
          <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
            {getMessage(error)}
          </p>

          {/* BUTTON */}
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl text-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Login
          </button>

          {/* secondary hint */}
          <p className="text-xs text-gray-400 mt-6">
            If the problem persists, contact support.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AuthErrorPage;
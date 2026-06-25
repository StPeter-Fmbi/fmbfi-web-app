import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

const ChangePassword = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!newPassword.trim()) {
      setError("Password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSaving(true);

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setIsSaving(false);
      setIsSuccess(true);

      setTimeout(async () => {
        await signOut({
          redirect: true,
          callbackUrl: "/auth/login",
        });
      }, 5000);

      return;
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!isSuccess) {
        setIsSaving(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>FMBFI | Change Password</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/FMBFI.JPG")',
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Optional Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/80 via-black/60 to-black/80" />
        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-lg bg-white/95 rounded-3xl shadow-2xl overflow-hidden border border-white/30">
            {/* Header */}
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
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <span className="text-4xl">🔐</span>
                </div>

                <h1 className="text-3xl font-bold font-title text-white">
                  Change Password
                </h1>

                <p className="text-red-100 text-sm mt-2 leading-relaxed">
                  For security purposes, you must change your password before
                  accessing your account.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              {success && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-600 text-sm">
                  {success}
                </div>
              )}

              {isSaving && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 min-w-[320px]">
                    <FaSpinner className="animate-spin text-red-600 text-5xl" />

                    <h3 className="text-lg font-semibold text-gray-700">
                      Changing Password...
                    </h3>

                    <p className="text-gray-500 text-center">
                      Please wait while we update your password.
                    </p>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 min-w-[320px]">
                    <FaSpinner className="animate-spin text-red-600 text-5xl" />

                    <h3 className="text-lg font-semibold text-green-600">
                      Password Changed Successfully
                    </h3>

                    <p className="text-gray-600 text-center">
                      Please sign in again using your new password.
                    </p>
                  </div>
                </div>
              )}

              {isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 min-w-[320px]">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-3xl text-green-600">✓</span>
                    </div>

                    <h3 className="text-lg font-semibold text-green-600">
                      Password Changed Successfully
                    </h3>

                    <p className="text-gray-600 text-center">
                      Please re-login to continue.
                    </p>

                    <FaSpinner className="animate-spin text-red-600 text-3xl mt-2" />
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5">
                <p className="text-sm text-amber-700">
                  Your temporary password has expired. Please create a new
                  password before proceeding.
                </p>
              </div>

              {error && (
                <div className="bg-red-500 text-white p-4 rounded-md text-sm flex items-center gap-2">  {error}
                </div>
              )}

              <div className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Confirm password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving || isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                >
                  {isSaving
                    ? "Updating Password..."
                    : isLoading
                      ? "Redirecting..."
                      : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;

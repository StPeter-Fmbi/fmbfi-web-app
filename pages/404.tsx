import Footer from "@/components/Footer";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 | Page Not Found</title>
      </Head>

      <div className="flex min-h-screen bg-gray-100">

        {/* MAIN CONTENT */}
        <div className="flex-1 w-full flex items-center justify-center p-6">
          <div className="text-center bg-white border rounded-xl shadow-sm p-8 sm:p-12 max-w-md w-full">

            {/* BIG ERROR CODE */}
            <h1 className="text-6xl font-extrabold text-[#d12f27] mb-4 animate-bounce drop-shadow-md">
              404
            </h1>

            {/* MESSAGE */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Page Not Found
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              The page you are looking for doesn’t exist or has been moved.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100"
              >
                Go Back
              </button>

              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-[#d12f27] text-white rounded-md text-sm hover:bg-red-700"
              >
                Go Home
              </button>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
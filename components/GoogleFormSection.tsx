import Head from "next/head";
import { useRouter } from "next/router";

const GoogleFormSection = () => {
  const router = useRouter();

  const deadline = new Date("2026-04-06T23:59:59");
  const now = new Date();
  const isClosed = now > deadline;

  return (
    <>
      <Head>
        <title>FMBFI | Registration</title>
      </Head>

      <section
        id="google-form"
        className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
      >
        {/* BACKGROUND */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/FMBFI.JPG")' }}
        />
        <div className="absolute inset-0 bg-black opacity-40" />

        {/* CARD */}
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-xl w-[90%] sm:w-[600px] md:w-[800px] relative z-10 mt-12 sm:mt-16 md:mt-20 mb-8">
          {/* LOGO */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img src="/images/logo.png" alt="Logo" className="w-24 h-auto" />
          </div>

          {/* TITLE / CLOSED MESSAGE */}
          <div className="flex flex-col items-center border-b pb-6 pt-8">
            {isClosed ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-heading text-center text-red-600 font-bold">
                  Registration is now closed.
                </h2>

                <p className="text-gray-600 mt-3 text-center">
                  The application period has ended.
                </p>

                <button
                  onClick={() => router.push("/")}
                  className="mt-5 px-5 py-2 bg-[#d12f27] text-white rounded-md hover:bg-red-700"
                >
                  Back to Home
                </button>
              </>
            ) : (
              <h2 className="text-2xl sm:text-3xl font-heading text-center text-[#d12f27] font-bold">
                Welcome to Registration Portal
              </h2>
            )}
          </div>

          {/* FORM */}
          {!isClosed && (
            <>
              <div className="flex justify-center w-full mt-6">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSeOlwXs6cHijlSoDINeLc_Y4Oz0xhOhGmwUxff3tA_BwXgopw/viewform?embedded=true"
                  width="100%"
                  height="600"
                  title="Google Form"
                  className="w-full"
                >
                  Loading…
                </iframe>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => router.push("/")}
                  className="px-5 py-2 bg-[#d12f27] text-white rounded-md hover:bg-red-700 transition"
                >
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default GoogleFormSection;

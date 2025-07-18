import { useRouter } from "next/router"; // Import useRouter
import { useEffect } from "react";

const GoogleFormSection = () => {
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // This effect can be used to navigate or handle any logic when the section is rendered
  }, []);

  // Get the Google Form link from the environment variable
  const googleFormLink = process.env.NEXT_PUBLIC_GOOGLE_FORM_LINK;

  return (
    <section
      id="google-form"
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/FMBFI.JPG")',
          opacity: 1,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-xl w-[90%] sm:w-[600px] md:w-[800px] relative z-10 mt-12 sm:mt-16 md:mt-20 mb-8">
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mb-4 cursor-pointer" // Reduced the bottom margin here
          onClick={() => router.push("/")}
        >
          <img src="/images/logo.png" alt="Logo" className="w-24 h-auto" />
        </div>

        <div className="flex justify-center space-x-6 sm:space-x-8 border-b pb-6 pt-4 sm:pt-6 md:pt-8">
          {/* Reduced the top padding here */}
          <h2 className="text-2xl sm:text-3xl font-heading text-center text-[#d12f27] font-bold">
            Welcome to the 21st Qualifying FMBFI Examination 2025 registration
            portal!
          </h2>
        </div>

        <div className="flex justify-center w-full">
          <iframe
            //src={googleFormLink} // Use the environment variable for the iframe source
            src="https://docs.google.com/forms/d/e/1FAIpQLSemqu5lRS-8kVLNs2idYH9BJ7I_QFTrlMuDIkqaQX_-CHIWYA/viewform?embedded=true" // Use the environment variable for the iframe source
            width="100%" // Ensures the iframe stretches to the container's width
            height="600" // You can adjust the height here
            title="Google Form"
            className="w-full" // This also ensures full width of the iframe
          >
            Loading…
          </iframe>
        </div>
      </div>
    </section>
  );
};

export default GoogleFormSection;

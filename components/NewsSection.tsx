import React from "react";

const NewsSection = () => {
  return (
    <section
      id="news"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center py-12 px-4 sm:px-6 lg:px-12 relative"
    >
      {/* Semicircle Background using CSS */}
      <div className="absolute top-0 left-0 w-full h-[calc(55vh)] bg-[#d12f27] rounded-b-full z-0"></div>

      {/* Header */}
      <h2 className="text-3xl sm:text-5xl font-body font-extrabold text-white mb-6 px-4 sm:px-8 relative z-10">
        LATEST NEWS & UPDATES
      </h2>

      {/* Subheading */}
      <p className="text-lg sm:text-xl font-body text-white mb-6 px-4 sm:px-8 relative z-10 italic">
        Stay updated with the latest news and announcements from FMBFI.
      </p>

      {/* Two-column layout for FMBFI EXAMINATION and Featured Video */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 sm:px-8 relative z-10">
        {/* Left Column: FMBFI EXAMINATION */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <img
              src="/images/fmbfi-exam.png" // Update this with the correct path for the image
              alt="FMBFI Examination"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <h3 className="text-xl sm:text-2xl font-body font-semibold text-[#d12f27] mb-4">
            FMBFI EXAMINATION 2025
          </h3>
        </div>

        {/* Right Column: Featured Video */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl">
            <iframe
              className="w-full"
              src="https://www.youtube.com/embed/Nfm9dajjhY4"
              title="KWENTONG FMBFI ALUMNI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ height: "450px" }}
            ></iframe>
          </div>
          <h3 className="text-xl sm:text-2xl font-body font-semibold text-[#d12f27] mb-4">
            FMBFI GRADUATES FEATURED
          </h3>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

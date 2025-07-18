import React from "react";

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="min-h-screen flex items-center justify-center text-center py-12 px-4 sm:px-6 lg:px-12 relative overflow-hidden"
    >
      {/* SVG Background Shape at the Bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full z-0"
        viewBox="0 0 1020 320"
        xmlns="http://www.w3.org/2000/svg"
        fill="#d12f27"
      >
        <path
          fillOpacity="1"
          d="M0,128L48,160C96,192,192,256,288,277.3C384,299,480,277,576,245.3C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      <div className="flex flex-col lg:flex-row w-full max-w-screen-xl mx-auto z-10">
        {/* Left Side Text with adjusted padding and top alignment */}
        <div className="flex-1 flex flex-col justify-start lg:justify-center text-center lg:text-left px-4 sm:px-6 md:px-8 lg:px-12 mb-6 lg:mb-0">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#d12f27] mb-4 sm:mb-6 font-body">
            FMBFI THROUGH THE YEARS
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 text-justify font-open-sans">
            Ever wonder who FMB is? What is FMBFI? And how did it all come to
            be, 27 years ago? These captured moments show the dedication,
            commitment, and contributions given by those behind the Foundation.
          </p>
        </div>

        {/* Right Side Video with larger width and top alignment */}
        <div className="flex-1 mb-6 lg:mb-0 flex items-start justify-center px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="inline-block w-full lg:w-[85%]">
            {" "}
            {/* Increased width */}
            <iframe
              className="w-full h-[500px]" // Adjusted the height
              src="https://www.youtube.com/embed/57bNcoTMmxk"
              title="FMBFI Through the Years"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

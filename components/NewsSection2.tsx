import React, { useState } from "react";
import { MdClose } from "react-icons/md"; // Importing the MdClose icon from react-icons

const NewsSection2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      id="news"
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-12 relative"
    >
      {/* Semicircle Background using CSS */}
      <div className="absolute top-0 left-0 w-full h-[calc(55vh)] bg-[#d12f27] rounded-b-full z-0"></div>

      {/* Header with Padding */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-extrabold text-white mb-6 px-4 sm:px-8 relative z-10 text-center pt-12">
        LATEST NEWS & UPDATES
      </h2>

      {/* Subheading */}
      <p className="text-lg sm:text-xl md:text-2xl font-body text-white mb-6 px-4 sm:px-8 relative z-10 text-center italic">
        Stay updated with the latest announcements and highlights from FMBFI.
      </p>

      {/* Grid Layout for Square News Items with Padding Added Before Cards */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 px-4 sm:px-8 relative z-10 pt-8">
        {/* News Item 1 - FMBFI EXAMINATION */}
        <div className="flex flex-col items-center bg-[#e4542f] rounded-lg shadow-lg overflow-hidden">
          <div
            className="w-full h-[280px] bg-cover bg-center cursor-pointer"
            style={{
              backgroundImage: 'url("/images/fmbfi-exam.png")', // Update the image URL as necessary
            }}
            onClick={openModal} // Open modal when clicked
          />
          <div className="p-4 text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-body font-semibold text-white mb-2">
              FMBFI EXAMINATION 2025
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-body text-white">
              Stay informed about the FMBFI Examination scheduled for 2025.
            </p>
          </div>
        </div>

        {/* News Item 2 - Featured Video */}
        <div className="flex flex-col items-center bg-[#e4542f] rounded-lg shadow-lg overflow-hidden">
          <div className="w-full h-[280px]"> {/* Match the same height as the image */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/Nfm9dajjhY4"
              title="KWENTONG FMBFI ALUMNI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-body font-semibold text-white mb-2">
              FMBFI GRADUATES FEATURED
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-body text-white">
              Watch the inspiring story of FMBFI Alumni in this video.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Fullscreen Image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeModal} // Close modal if background is clicked
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the image container
          >
            <img
              src="/images/fmbfi-exam.png" // Update with your image source
              alt="FMBFI Examination"
              className="max-w-full max-h-[90vh] object-contain"
            />
            {/* Updated Close Button with React Icon and Increased Size */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-4xl bg-transparent border-0 cursor-pointer"
            >
              <MdClose /> {/* Close icon from react-icons */}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection2;

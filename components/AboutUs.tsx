import { useState } from "react";

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state
  const [modalImage, setModalImage] = useState(""); // Store the image URL for the modal

  // Function to open the modal with the selected image
  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center bg-white text-center py-16 px-6 sm:px-8 lg:px-16 xl:px-24 pt-12"
    >
      {/* About Us Header */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-extrabold text-black mb-8 px-8 sm:px-10 py-6 sm:py-8">
        ABOUT US
      </h2>

      {/* Cards Container */}
      <div className="w-full max-w-full mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 px-6 sm:px-8 py-8 lg:px-12 xl:px-16">
        {/* Core Values Card */}
        <div
          className="bg-[#d12f27] text-white shadow-lg rounded-lg p-10 min-h-[400px] transform transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
          onClick={() => openModal("/images/CORE.JPG")}
        >
          <div className="relative mb-6">
            <img
              src="/images/CORE.JPG" // Replace with actual image path
              alt="Core Values"
              className="w-full h-64 object-cover rounded-lg mb-4" // Increased image height
            />
            <h3 className="text-xl sm:text-2xl font-body font-bold text-white mb-6">
              Core Values
            </h3>
          </div>
          <p className="text-sm sm:text-base text-white font-body text-center mb-2">
            To provide financial assistance to the grantees.
          </p>
          <p className="text-sm sm:text-base text-white font-body text-center mb-2">
            To assist the grantees to finish their studies.
          </p>
          <p className="text-sm sm:text-base text-white font-body text-center mb-2">
            To assist the FMBFI graduates find jobs.
          </p>
        </div>

        {/* Mission Card */}
        <div
          className="bg-[#d12f27] text-white shadow-lg rounded-lg p-10 min-h-[400px] transform transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
          onClick={() => openModal("/images/MISSION.JPG")}
        >
          <div className="relative mb-6">
            <img
              src="/images/MISSION.JPG" // Replace with actual image path
              alt="Mission"
              className="w-full h-64 object-cover rounded-lg mb-4" // Increased image height
            />
            <h3 className="text-xl sm:text-2xl font-body font-bold text-white mb-6">
              Mission
            </h3>
          </div>
          <p className="text-sm sm:text-base text-white font-body text-center">
            To become a partner of the government in educating the Filipino
            people.
          </p>
        </div>

        {/* Vision Card */}
        <div
          className="bg-[#d12f27] text-white shadow-lg rounded-lg p-10 min-h-[400px] transform transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
          onClick={() => openModal("/images/VISION.jpg")}
        >
          <div className="relative mb-6">
            <img
              src="/images/VISION.jpg" // Replace with actual image path
              alt="Vision"
              className="w-full h-64 object-cover rounded-lg mb-4" // Increased image height
            />
            <h3 className="text-xl sm:text-2xl font-body font-bold text-white mb-6">
              Vision
            </h3>
          </div>
          <p className="text-sm sm:text-base text-white font-body text-center">
            Conceived to develop a highly literate generation that can
            contribute to the growth of the Filipino people and that will
            promote Love of God and country.
          </p>
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
              src={modalImage} // Image passed from clicked card
              alt="Fullscreen"
              className="max-w-full max-h-[90vh] object-contain"
            />
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-4xl bg-transparent border-0 cursor-pointer"
            >
              &times; {/* Close icon */}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutUs;

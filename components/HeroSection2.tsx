import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleDown,
} from "react-icons/fa"; // Import icons from react-icons

const images = [
  "/images/FMBFI.JPG",
  "/images/FMBFI2.JPG",
  "/images/FMBFI3.JPG",
];

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // State for tracking hover

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("about-section");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start", // Scrolls to the top of the section
      });
    }
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section className="bg-white">
      <div
        className="relative w-full h-screen bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div
          className={`relative z-10 flex items-center justify-center w-full h-full text-center text-white px-6 transition-opacity duration-500 ease-in-out ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 font-body">
              FRANCISCO M BAUTISTA FOUNDATION INC
            </h1>
            <p className="text-lg sm:text-xl mb-8 italic font-body">
              Someone cried: "Where must the seed be sown to bring the most
              fruit when it is grown?"
              <br />
              The Master heard as He said and smiled, “Go plant it for Me in the
              heart of a child.”
            </p>

            <div className="text-center relative">
              <a
                href="#about-section"
                onClick={handleLearnMoreClick}
                className="font-body inline-block bg-d12f27 text-white text-lg py-3 px-8 rounded-md hover:bg-[#d12f27] transition-all duration-300"
              >
                Learn More
              </a>
              {/* Down Arrow Button Positioned Below the Learn More Button */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-10">
                <FaAngleDoubleDown className="text-white text-4xl animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Next and Previous Chevron Buttons */}
        <button
          onClick={handlePreviousClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-4xl z-20 p-3 bg-black bg-opacity-40 rounded-full hover:bg-[#c56851] transition-all duration-300 hidden sm:block"
          style={{
            border: "none",
            cursor: "pointer",
          }}
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={handleNextClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white text-4xl z-20 p-3 bg-black bg-opacity-40 rounded-full hover:bg-[#c56851] transition-all duration-300 hidden sm:block"
          style={{
            border: "none",
            cursor: "pointer",
          }}
        >
          <FaChevronRight />
        </button>

        {/* Dot Navigation */}
        <div className="absolute bottom-24 sm:bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 sm:hidden">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => handleDotClick(index)}
              // onMouseEnter={handleMouseEnter}
              // onMouseLeave={handleMouseLeave}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                currentImageIndex === index
                  ? "bg-white"
                  : "bg-gray-400 hover:bg-gray-300"
              } transition-all duration-300`}
            ></div>
          ))}
        </div>
      </div>

      <div id="about-section" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <p className="text-base sm:text-xl leading-relaxed text-justify font-body">
          The Francisco M Bautista Foundation Incorporated was conceived to
          serve as the legacy of Francisco Manuel Bautista, who, despite only
          completing fourth grade, achieved great success in life and became the
          founder of the St Peter Group of Companies. Upon his death, his
          daughter, Sis Del Bautista-Vitangcol, endeavored to immortalize his
          name. This endeavor came to fruition through her consultation with Bro
          Ernie M Burdeos, the Presiding Elder of the St Peter Community, whose
          subsequent inspiration prompted the inception of a Scholarship
          Foundation in her father's name. This initiative has since provided
          scholarships to numerous students, empowering them to pursue higher
          education and succeed in their careers. The Foundation continues to
          honor the legacy of Francisco M. Bautista by supporting the education
          of deserving students and making a positive impact on the community.
        </p>
        <p className="text-base sm:text-xl leading-relaxed text-justify font-body">
          <br />
          Up to this day, with the financial support of the St Peter Group of
          Companies, the foundation remains committed to assisting College
          students nationwide.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;

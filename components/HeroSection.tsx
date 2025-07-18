import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HeroSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(0.6);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = [
    "/images/FMBFI.JPG",
    "/images/FMBFI2.JPG",
    "/images/FMBFI3.JPG",
  ];

  const checkScreenSize = useCallback(() => {
    setIsSmallScreen(window.innerWidth < 1024);
  }, []);

  const handleScroll = useCallback(() => {
    if (!isSmallScreen) {
      const offset = window.scrollY;
      const imageHeight = window.innerHeight;
      const opacityValue = Math.max(1 - offset / imageHeight, 0);
      setImageOpacity(opacityValue);
      setIsScrolled(offset > window.innerHeight / 2);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [checkScreenSize, handleScroll]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <section className="bg-gray-100 min-h-screen flex items-center justify-center text-center py-8 sm:py-16">
        <div className="relative w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-screen lg:h-[100vh] transition-all duration-300 ease-in-out">
            <img
              src={images[currentImageIndex]}
              alt="Hero Image"
              className="object-cover w-full h-full absolute inset-0 transition-opacity duration-500"
              style={{
                objectPosition: "center",
                opacity: isHovered ? 1 : imageOpacity,
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl bg-black opacity-50 hover:opacity-100 rounded-full p-2 z-10"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl bg-black opacity-50 hover:opacity-100 rounded-full p-2 z-10"
            >
              <FaChevronRight />
            </button>
            {!isSmallScreen && !isScrolled && (
              <div className="absolute inset-0 flex justify-center items-center text-white text-center">
                <h2 className="text-8xl font-bold">
                  FRANCISCO M BAUTISTA FOUNDATION INC&nbsp;
                  <span className="block">(FMBFI)</span>
                </h2>
              </div>
            )}
          </div>
          <div
            className={`${
              isScrolled && !isSmallScreen ? "lg:block mt-16" : "lg:hidden mt-8"
            }`}
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
              FRANCISCO M BAUTISTA FOUNDATION INC&nbsp;
              <span className="block sm:inline">(FMBFI)</span>
            </h2>
            <p
              className={`text-lg sm:text-xl mb-8 ${
                isSmallScreen && !isExpanded ? "line-clamp-3" : ""
              }`}
            >
              The Francisco M Bautista Foundation Incorporated was conceived to
              serve as the legacy of Francisco Manuel Bautista, who, despite
              only completing fourth grade, achieved great success in life and
              became the founder of the St Peter Group of Companies. Upon his
              death, his daughter, Sis Del Bautista-Vitangcol, endeavored to
              immortalize his name. This endeavor came to fruition through her
              consultation with Bro Ernie M Burdeos, the Presiding Elder of the
              St Peter Community, whose subsequent inspiration prompted the
              inception of a Scholarship Foundation in her father's name. This
              initiative has since provided scholarships to numerous students,
              empowering them to pursue higher education and succeed in their
              careers. The Foundation continues to honor the legacy of Francisco
              M. Bautista by supporting the education of deserving students and
              making a positive impact on the community.
            </p>
            {isSmallScreen && (
              <button
                onClick={toggleDescription}
                className="text-red-500 font-semibold text-lg px-4 py-2 hover:text-red-300 mt-2"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
            <div className="mt-8 flex justify-center">
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="#"
                  className="bg-gray-100 text-red-900 py-2 px-6 sm:py-2 sm:px-8 lg:py-3 lg:px-10 rounded-full text-base sm:text-lg lg:text-xl w-full sm:w-[200px] lg:w-[250px] flex justify-center items-center border-4 border-red-900 hover:bg-red-900 hover:text-white transition-colors duration-300"
                >
                  APPLY NOW
                </a>
                <a
                  href="#login"
                  className="bg-red-900 text-white py-2 px-6 sm:py-2 sm:px-8 lg:py-3 lg:px-10 rounded-full text-base sm:text-lg lg:text-xl w-full sm:w-[200px] lg:w-[250px] flex justify-center items-center border-4 border-transparent hover:bg-white hover:text-red-900 hover:border-red-900 transition-colors duration-300"
                >
                  LOGIN
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;

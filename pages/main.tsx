import { useState, useEffect } from "react";
import Head from "next/head";
import { FaArrowUp } from "react-icons/fa";
import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection2";
import DemographicsSection from "@/components/DemographicsSection2";
import FeaturesSection from "@/components/FeaturesSection";
import NewsSection from "@/components/NewsSection";
import AboutUs from "@/components/AboutUs";
import AnnouncementModal from "@/components/Announcement"; // Import AnnouncementModal
import NewsSection2 from "@/components/NewsSection2";

const Home = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true); // State to control modal visibility

  const handleScroll = () => {
    setShowScroll(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    const footer = document.querySelector("footer");
    setFooterHeight(footer ? footer.offsetHeight : 0);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="bg-gray-100 min-h-screen font-title">
      <div className="w-full">
        <Head>
          <title>Landing Page</title>
          <meta name="description" content="A simple landing page" />
        </Head>

        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* About Us Section */}
        <AboutUs />

        {/* Demographic Section */}
        <DemographicsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* News Section */}
        <NewsSection2 />

        {/* Footer */}
        <Footer />
      </div>

      {/* Announcement Modal */}
      <AnnouncementModal isOpen={isModalOpen} closeModal={closeModal} />

      {/* Back to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 flex flex-col items-center justify-center bg-[#d12f27] text-white p-6 rounded-full shadow-lg hover:bg-[#b3271d] transition duration-300 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-md" />{" "}
          <span className="hidden sm:inline mt-2">Back to Top</span>{" "}
        </button>
      )}
    </main>
  );
};

export default Home;

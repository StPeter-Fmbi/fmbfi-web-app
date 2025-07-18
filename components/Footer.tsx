import React from "react";
import { FaFacebook, FaYoutube, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-red-700 text-white py-6">
      <div className="max-w-5xl mx-auto text-center px-4">
        <p className="text-md sm:text-base lg:text-xl font-body font-bold mb-2">
          FRANCISCO M BAUTISTA FOUNDATION, INC
        </p>
        <p className="text-xs sm:text-sm lg:text-base font-body lg:whitespace-nowrap">
          999 Epifanio de los Santos Ave, Project 7, Quezon City, 1105 Metro
          Manila
        </p>

        <div className="flex justify-center space-x-4 my-3">
          <a
            href="https://www.facebook.com/profile.php?id=100088884865950"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200"
          >
            <FaFacebook size={20} />
          </a>
          <a
            href="https://www.youtube.com/@FranciscoMBautistaFoundation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200"
          >
            <FaYoutube size={20} />
          </a>
          <a
            href="mailto:fmbfi@stpeter.com.ph"
            className="text-white hover:text-gray-200"
          >
            <FaEnvelope size={20} />
          </a>
        </div>

        <p className="text-xs sm:text-sm md:text-base lg:text-lg font-body">
          © {new Date().getFullYear()} FMBFI. All rights reserved.
        </p>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg">
          <a
            // href="/privacy-policy"
            className="text-white hover:text-gray-200 hover:underline px-2 py-1"
          >
            Privacy Policy
          </a>{" "}
          |{" "}
          <a
            // href="/terms-of-service"
            className="text-white hover:text-gray-200 hover:underline px-2 py-1"
          >
            Terms of Service
          </a>{" "}
          |{" "}
          <a
            // href="/contact-us"
            className="text-white hover:text-gray-200 hover:underline px-2 py-1"
          >
            Contact Us
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

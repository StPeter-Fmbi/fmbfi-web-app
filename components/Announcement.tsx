import React from "react";
import { AiOutlineClose } from "react-icons/ai"; // React Icon for close
import Link from "next/link"; // Next.js Link component for routing

interface AnnouncementSectionProps {
  isOpen: boolean;
  closeModal: () => void;
}

const AnnouncementSection = ({
  isOpen,
  closeModal,
}: AnnouncementSectionProps) => {
  if (!isOpen) return null; // Do not render the modal if it's closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#d12f27] text-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white text-2xl sm:text-3xl font-bold"
        >
          <AiOutlineClose />
        </button>

        <div className="mb-4">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-body font-extrabold">
            Registration is Now Open!
          </h3>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl mb-4 font-body">
          The registration for the 21st FMBFI Qualifying Examination 2025 is now
          open! Don't miss your chance to apply for scholarship. The deadline
          for registration is{" "}
          <span className="font-semibold font-heading">April 27, 2025</span>.
        </p>

        <p className="text-lg sm:text-lg md:text-xl mb-6 font-body italic">
          For more information, click{" "}
          <Link href="/apply">
            <span className="inline-block text-white underline hover:text-gray-200 cursor-pointer">
              Apply Now
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AnnouncementSection;

import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const NewsSection2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const announcements = [
    {
      type: "video",
      title: "FMBFI GRADUATES FEATURED",
      description: "Watch the inspiring story of FMBFI Alumni in this video.",
      videoUrl: "https://www.youtube.com/embed/Nfm9dajjhY4",
    },
    {
      type: "facebook-video",
      title: "ONE WITH NATURE",
      description:
        "Watch the tree planting outreach event on our Facebook page.",
    },
  ];

  return (
    <section
      id="news"
      className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-12 relative"
    >
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[calc(55vh)] bg-[#d12f27] rounded-b-full z-0"></div>

      {/* HEADER */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-extrabold text-white mb-6 relative z-10 text-center">
        LATEST NEWS & UPDATES
      </h2>

      <p className="text-lg sm:text-xl md:text-2xl font-body text-white mb-10 relative z-10 text-center italic">
        Stay updated with the latest announcements and highlights from FMBFI.
      </p>

      {/* ALL ANNOUNCEMENTS (NO FEATURED) */}
      <div className="w-full max-w-5xl flex flex-col gap-8 relative z-10">
        {announcements.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-[#e4542f] rounded-lg shadow-lg overflow-hidden w-full"
          >
            {/* MEDIA */}
            <div className="w-full h-[420px] md:h-[500px] lg:h-[550px] overflow-hidden relative">
              {item.type === "video" && (
                <iframe
                  className="w-full h-full"
                  src={item.videoUrl}
                  title={item.title}
                  allowFullScreen
                />
              )}

              {item.type === "facebook-video" && (
                <div
                  className="w-full h-full flex items-center justify-center text-white bg-cover bg-center relative"
                  style={{ backgroundImage: `url(/images/FMBFI3.JPG)` }}
                >
                  {/* Facebook overlay links */}
                  <div className="absolute inset-0"></div>
                  <div className="relative z-10 flex flex-col items-center space-y-4 px-6 py-6 transition transform hover:scale-105">
                    <div
                      className="text-lg sm:text-xl md:text-2xl text-center w-full cursor-pointer px-6 py-2 rounded-full bg-black bg-opacity-70 hover:bg-[#b3271d] transition"
                      onClick={() =>
                        window.open(
                          "https://www.facebook.com/reel/303691128664664/",
                          "_blank",
                        )
                      }
                    >
                      ▶ Watch Video 1 on Facebook
                    </div>
                    <div
                      className="text-lg sm:text-xl md:text-2xl text-center w-full cursor-pointer px-6 py-2 rounded-full bg-black bg-opacity-70 hover:bg-[#b3271d] transition"
                      onClick={() =>
                        window.open(
                          "https://www.facebook.com/watch/?v=846049636852019",
                          "_blank",
                        )
                      }
                    >
                      ▶ Watch Video 2 on Facebook
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TEXT */}
            <div className="p-6 text-center">
              <h3 className="text-xl md:text-2xl text-white font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-base md:text-lg text-white">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL (kept in case you reuse later) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <img
              src="/images/fmbfi-exam-2026.png"
              alt="FMBFI Examination"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-4xl"
            >
              <MdClose color="black" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection2;

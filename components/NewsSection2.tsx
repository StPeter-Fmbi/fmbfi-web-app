import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const NewsSection2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const announcements = [
    // {
    //   type: "image",
    //   title: "FMBFI EXAMINATION 2025",
    //   description:
    //     "Stay informed about the FMBFI Examination scheduled for 2025.",
    //   image: "/images/fmbfi-exam.png",
    //   onClick: openModal,
    // },
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
      embedUrl:
        "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F303691128664664%2F&show_text=false&width=267&t=0",
    },
  ];

  const isSingle = announcements.length === 1;

  return (
    <section
      id="news"
      className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-12 relative"
    >
      {/* Semicircle Background */}
      <div className="absolute top-0 left-0 w-full h-[calc(55vh)] bg-[#d12f27] rounded-b-full z-0"></div>

      {/* Header */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-extrabold text-white mb-6 relative z-10 text-center">
        LATEST NEWS & UPDATES
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl font-body text-white mb-6 relative z-10 text-center italic">
        Stay updated with the latest announcements and highlights from FMBFI.
      </p>

      {/* Grid Layout */}
      <div
        className={`w-full max-w-7xl grid gap-8 relative z-10 ${
          isSingle
            ? "grid-cols-1 place-items-center"
            : "grid-cols-1 lg:grid-cols-2 justify-items-center"
        }`}
      >
        {announcements.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center bg-[#e4542f] rounded-lg shadow-lg overflow-hidden w-full ${
              isSingle ? "max-w-3xl" : "max-w-xl"
            }`}
          >
            {/* MEDIA */}
            <div
              className={`w-full ${
                isSingle ? "h-[360px]" : "h-[280px]"
              } rounded-t-lg overflow-hidden relative`}
            >
              {/* VIDEO */}
              {item.type === "video" && (
                <iframe
                  className="w-full h-full"
                  src={item.videoUrl}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* FACEBOOK */}
              {item.type === "facebook-video" && (
                <div
                  className="w-full h-full flex items-center justify-center text-white cursor-pointer bg-cover bg-center"
                  style={{ backgroundImage: `url(/images/FMBFI3.JPG)` }}
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/reel/303691128664664/",
                      "_blank",
                    )
                  }
                >
                  <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg text-lg sm:text-xl md:text-2xl text-center transition transform hover:scale-105 hover:bg-opacity-70">
                    ▶ Watch on Facebook
                  </div>
                </div>
              )}
            </div>

            {/* TEXT */}
            <div className={`p-4 text-center`}>
              <h3
                className={`font-body font-semibold text-white mb-2 ${
                  isSingle
                    ? "text-xl sm:text-2xl md:text-3xl"
                    : "text-lg sm:text-xl md:text-2xl"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`font-body text-white ${
                  isSingle
                    ? "text-base sm:text-lg md:text-xl"
                    : "text-sm sm:text-base md:text-lg"
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <img
              src="/images/fmbfi-exam.png"
              alt="FMBFI Examination"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-4xl bg-transparent border-0 cursor-pointer"
            >
              <MdClose />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection2;

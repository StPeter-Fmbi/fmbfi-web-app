import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Image from "next/image"; // Assuming you're using Next.js for optimized image loading

const DemographicsSection = () => {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when the component is mounted
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Reusable CountUp Component
  const CountUpCard = ({
    start,
    end,
    label,
    subLabel,
  }: {
    start: number;
    end: number;
    label: string;
    subLabel: string;
  }) => (
    <div className="flex flex-col items-center text-gray-800">
      <h3
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-red-600"
        aria-live="polite" // Accessibility improvement for screen readers
      >
        <CountUp start={start} end={end} duration={5} />
      </h3>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium font-heading">
        {label}
      </p>
      <p className="text-xs sm:text-sm md:text-base text-gray-500 italic font-body">
        {subLabel}
      </p>
    </div>
  );

  return (
    <section
      id="demographics"
      className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-12"
    >
      <div className="flex flex-col lg:flex-row w-full max-w-screen-xl mx-auto">
        {/* Left Side Map (Philippines) */}
        <div className="flex-1 flex justify-center items-center mb-8 lg:mb-0 relative">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <Image
              src="/philippines.svg" // Update to SVG file
              alt="Map of the Philippines with highlighted cities"
              width={600}
              height={400}
              objectFit="contain" // Ensures the image scales proportionally
            />
          </div>
        </div>

        {/* Right Side CountUp Cards */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          {/* Centered Header */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 sm:mb-12 font-body">
            OUR IMPACT
          </h2>

          {/* 2x2 Grid of CountUp Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 font-body">
            {/* Keep the grid 2x2 on large screens and single column on small screens */}
            <CountUpCard
              start={0}
              end={animate ? 57 : 0}
              label="CITIES"
              subLabel="PHILIPPINES"
            />
            <CountUpCard
              start={0}
              end={animate ? 616 : 0}
              label="GRADUATES"
              subLabel="FMBFI ALUMNI"
            />
            <CountUpCard
              start={0}
              end={animate ? 20 : 0}
              label="BATCHES"
              subLabel="SINCE 1996"
            />
            <CountUpCard
              start={0}
              end={animate ? 198 : 0}
              label="CURRENT SCHOLARS"
              subLabel="2020-2024"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemographicsSection;

import { useState, useEffect, useRef } from "react";

// Define type for state values
interface DemographicsState {
  cities: number;
  graduates: number;
  batches: number;
  scholars: number;
}

const DemographicsSection: React.FC = () => {
  const [cities, setCities] = useState<number>(0);
  const [graduates, setGraduates] = useState<number>(0);
  const [batches, setBatches] = useState<number>(0);
  const [scholars, setScholars] = useState<number>(0);

  // Refs to track whether the animation has already run
  const citiesAnimated = useRef(false);
  const graduatesAnimated = useRef(false);
  const batchesAnimated = useRef(false);
  const scholarsAnimated = useRef(false);

  // Function to animate the data
  const animateData = (
    value: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
    animationRef: React.MutableRefObject<boolean>
  ) => {
    if (animationRef.current) return; // If already animated, skip animation

    animationRef.current = true; // Set animation as complete

    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds for animation
    const stepTime = Math.abs(Math.floor(duration / end));

    const interval = setInterval(() => {
      start += 1;
      setter(start);
      if (start === end) clearInterval(interval);
    }, stepTime);
  };

  useEffect(() => {
    animateData(57, setCities, citiesAnimated);
    animateData(616, setGraduates, graduatesAnimated);
    animateData(20, setBatches, batchesAnimated);
    animateData(198, setScholars, scholarsAnimated);
  }, []);

  return (
    <section
      id="demographics"
      className="min-h-screen flex items-center justify-center bg-gray-200 text-center py-12 px-4 sm:px-6 lg:px-12"
    >
      <div className="flex flex-col lg:flex-row w-full max-w-screen-xl mx-auto">
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left px-6 sm:px-8">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            OUR DEMOGRAPHICS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                CITIES
              </h3>
              <p className="text-3xl font-bold text-gray-600">{cities}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                GRADUATES
              </h3>
              <p className="text-3xl font-bold text-gray-600">{graduates}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                BATCHES
              </h3>
              <p className="text-3xl font-bold text-gray-600">{batches}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                CURRENT SCHOLARS
              </h3>
              <p className="text-3xl font-bold text-gray-600">{scholars}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemographicsSection;

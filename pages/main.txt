// pages/index.tsx
import Head from "next/head";
import { useRouter } from "next/router"; // Import useRouter hook
import SubmitForm from "../components/SubmitForm"; // Import the SubmitForm component
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

const Home = () => {
  const router = useRouter();

  const handleViewData = () => {
    router.push("/data"); // Navigate to data.tsx page
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="w-full py-8 px-4 sm:py-16 sm:px-6 lg:px-8">
        <Head>
          <title>Landing Page</title>
          <meta name="description" content="A simple landing page" />
        </Head>

        {/* Hero Section */}
        <section className="bg-gray-100 py-12 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Our Landing Page
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            Start your journey with us and explore the amazing features we offer.
          </p>
          <a
            href="#features"
            className="bg-blue-600 text-white py-2 px-4 sm:py-2 sm:px-6 rounded-full text-base sm:text-lg hover:bg-blue-500"
          >
            Explore Features
          </a>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-20 bg-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12">
            Our Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                Feature 1
              </h3>
              <p className="text-gray-600">Description of feature 1.</p>
            </div>
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                Feature 2
              </h3>
              <p className="text-gray-600">Description of feature 2.</p>
            </div>
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                Feature 3
              </h3>
              <p className="text-gray-600">Description of feature 3.</p>
            </div>
          </div>
        </section>

        {/* Submit Form Section */}
        <section id="submit-form" className="py-12 sm:py-16 bg-gray-50">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
            Submit Your Information
          </h2>
          <div className="max-w-2xl mx-auto">
            <SubmitForm />
          </div>
        </section>

        {/* View Submitted Data Section */}
        {/* <section id="view-data" className="py-12 sm:py-16 bg-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
            View Submitted Data
          </h2>
          <div className="text-center">
            <button
              onClick={handleViewData}
              className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-500"
            >
              Go to Data Page
            </button>
          </div>
        </section> */}

        <section id="login" className="py-12 sm:py-16 bg-gray-50">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
            Login to Continue
          </h2>
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default Home;

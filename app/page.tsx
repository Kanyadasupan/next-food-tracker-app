import Link from 'next/link';
import Image from 'next/image';
import foodtracker from "./images/food-tracker.jpg";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gradient-to-br from-green-300 via-blue-400 to-purple-500">
      {/* Container for the content */}
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl space-y-8 max-w-lg w-full">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Welcome to Food Tracker
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 font-medium">
          Tracker your meal !!!
        </p>

        {/* Food Tracker Image */}
        <div className="flex justify-center ">
          <Image
            src={foodtracker}
            alt="Food Tracker App"
            width={400}
            height={400}
            className="rounded-2xl shadow-lg w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-white"
          />
        </div>

        {/* Call-to-action buttons container */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Register Button */}
          <Link href="/register">
            <div className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">
              Register
            </div>
          </Link>

          {/* Login Button */}
          <Link href="/login">
            <div className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg ring-2 ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:scale-105">
              Login
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

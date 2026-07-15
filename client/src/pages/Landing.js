import React from 'react';
import { Link } from 'react-router-dom';
import { FaHotel, FaShieldAlt, FaBolt, FaCheckCircle } from 'react-icons/fa';

const Landing = () => {
  const heroImages = [
    { src: 'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg', alt: 'Modern hotel interior' },
    { src: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg', alt: 'Hotel pool at night' },
    { src: 'https://images.pexels.com/photos/1520619/pexels-photo-1520619.jpeg', alt: 'Cozy hotel room' },
    { src: 'https://images.pexels.com/photos/7820376/pexels-photo-7820376.jpeg', alt: 'Luxury hotel lobby' }
  ];
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm font-medium mb-4">
                <FaCheckCircle className="mr-2" /> Trusted by travelers
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Welcome to <span className="text-indigo-600">saihotel</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Discover and book top-rated stays worldwide. Fast, secure, and effortless.
              </p>
              <div className="mt-8 flex space-x-4">
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow">
                  Get Started
                </Link>
                <Link to="/hotels" className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Explore Hotels
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6">
                <div className="grid grid-cols-2 gap-4">
                  {heroImages.map((img, idx) => (
                    <div key={idx} className="h-28 md:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-white border border-indigo-100">
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl border border-gray-200 px-4 py-2 shadow">
                <span className="text-sm text-gray-700">Real-time availability</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl border border-gray-200 px-4 py-2 shadow">
                <span className="text-sm text-gray-700">Instant booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <FaBolt className="text-indigo-600 text-2xl" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Fast Booking</h3>
              <p className="mt-2 text-gray-600">Book your stay in seconds with a seamless checkout flow.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <FaShieldAlt className="text-indigo-600 text-2xl" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Secure Payments</h3>
              <p className="mt-2 text-gray-600">Industry-standard security to protect your information.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <FaHotel className="text-indigo-600 text-2xl" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Top-rated Hotels</h3>
              <p className="mt-2 text-gray-600">Curated selection of quality stays for every budget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-50 border-t border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to find your next stay?</h2>
          <p className="mt-2 text-gray-600">Join saihotel and book with confidence.</p>
          <div className="mt-6">
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

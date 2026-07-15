import React from 'react';
import { Link } from 'react-router-dom';
import { FaHotel, FaShieldAlt, FaBolt, FaCheckCircle, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { MdTrendingUp } from 'react-icons/md';

const Landing = () => {
  const heroImages = [
    { src: 'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg', alt: 'Modern hotel interior' },
    { src: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',   alt: 'Hotel pool at night' },
    { src: 'https://images.pexels.com/photos/1520619/pexels-photo-1520619.jpeg', alt: 'Cozy hotel room' },
    { src: 'https://images.pexels.com/photos/7820376/pexels-photo-7820376.jpeg', alt: 'Luxury hotel lobby' },
  ];

  const stats = [
    { value: '2,400+', label: 'Hotels' },
    { value: '180+',   label: 'Destinations' },
    { value: '98%',    label: 'Satisfaction' },
  ];

  const features = [
    {
      icon: FaBolt,
      title: 'Instant Booking',
      desc: 'Reserve in seconds — real-time room availability, no waiting.',
      color: 'bg-highlight/20 text-highlight-dark',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure & Private',
      desc: 'Bank-grade encryption keeps your payments and data safe.',
      color: 'bg-primary-50 text-primary',
    },
    {
      icon: FaHotel,
      title: 'Curated Properties',
      desc: 'Hand-picked hotels rated for quality, comfort, and value.',
      color: 'bg-orange-50 text-accent',
    },
  ];

  return (
    <div className="bg-base">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient blob */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left copy */}
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary border border-primary/20 text-xs font-semibold mb-5 uppercase tracking-wider">
                <FaCheckCircle className="text-[10px]" /> Trusted by 50 000+ travellers
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-charcoal leading-[1.1] tracking-tight">
                Find your<br />
                <span className="gradient-text">perfect stay</span>
              </h1>

              <p className="mt-5 text-lg text-muted leading-relaxed max-w-md">
                Stayfinity makes hotel booking effortless — browse top-rated properties,
                compare prices, and confirm in one tap.
              </p>

              {/* Stats row */}
              <div className="mt-8 flex items-center gap-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-extrabold text-charcoal">{s.value}</div>
                    <div className="text-xs text-muted font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn-accent px-7 py-3 text-base shadow-accent">
                  Get Started Free
                </Link>
                <Link to="/hotels" className="btn-outline px-7 py-3 text-base">
                  Browse Hotels
                </Link>
              </div>
            </div>

            {/* Right — image mosaic */}
            <div className="relative slide-in-up">
              <div className="rounded-3xl bg-white border border-gray-100 shadow-hover p-5">
                <div className="grid grid-cols-2 gap-3">
                  {heroImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl overflow-hidden bg-primary-50 ${idx === 0 ? 'col-span-2 h-44' : 'h-32'}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating chips */}
              <div className="absolute -bottom-4 -left-5 bg-white rounded-2xl border border-gray-100 px-4 py-2.5 shadow-card flex items-center gap-2">
                <FaStar className="text-highlight text-sm" />
                <span className="text-sm font-semibold text-charcoal">4.9 avg rating</span>
              </div>
              <div className="absolute -top-4 -right-5 bg-white rounded-2xl border border-gray-100 px-4 py-2.5 shadow-card flex items-center gap-2">
                <MdTrendingUp className="text-primary text-sm" />
                <span className="text-sm font-semibold text-charcoal">Instant confirm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal">
              Everything you need to book smarter
            </h2>
            <p className="mt-3 text-muted text-lg">Built for travellers who value speed, trust, and simplicity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card p-7 hover-lift">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${f.color}`}>
                    <Icon />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-charcoal">{f.title}</h3>
                  <p className="mt-2 text-muted leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Destinations teaser ──────────────────────────────── */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-charcoal">Popular destinations</h2>
            <Link to="/hotels" className="text-primary font-semibold text-sm hover:text-primary-600 transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Bali', 'Paris', 'Dubai', 'Tokyo', 'New York'].map((city) => (
              <div key={city} className="group cursor-pointer">
                <div className="aspect-square rounded-2xl bg-primary-50 flex flex-col items-center justify-center gap-2 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary-100 transition-all duration-200">
                  <FaMapMarkerAlt className="text-primary text-xl" />
                  <span className="text-sm font-semibold text-charcoal">{city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-primary rounded-3xl px-10 py-14 shadow-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Ready for your next adventure?
              </h2>
              <p className="mt-3 text-primary-100 text-lg">
                Join Stayfinity and book with confidence today.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/register"
                  className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-xl font-bold shadow-accent transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

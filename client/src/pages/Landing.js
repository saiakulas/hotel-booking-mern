import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaBolt, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa';
import { MdHotel } from 'react-icons/md';

const heroImages = [
  { src: 'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg', alt: 'Modern hotel interior' },
  { src: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',   alt: 'Hotel pool at night' },
  { src: 'https://images.pexels.com/photos/1520619/pexels-photo-1520619.jpeg', alt: 'Cozy hotel room' },
  { src: 'https://images.pexels.com/photos/7820376/pexels-photo-7820376.jpeg', alt: 'Luxury hotel lobby' },
];

const features = [
  {
    icon: FaBolt,
    title: 'Instant Booking',
    desc: 'Confirm your room in seconds — no back-and-forth, no waiting.',
    color: 'bg-highlight-light text-highlight-dark',
  },
  {
    icon: FaShieldAlt,
    title: 'Secure & Private',
    desc: 'Industry-standard encryption keeps your data safe at every step.',
    color: 'bg-primary-50 text-primary',
  },
  {
    icon: MdHotel,
    title: 'Curated Properties',
    desc: 'Every listing is quality-checked so you always get what you see.',
    color: 'bg-orange-50 text-accent',
  },
];

const stats = [
  { value: '2,400+', label: 'Hotels worldwide' },
  { value: '98%',    label: 'Guest satisfaction' },
  { value: '1M+',    label: 'Bookings made' },
  { value: '24 / 7', label: 'Support available' },
];

const Landing = () => (
  <div className="bg-base">

    {/* ── Hero ─────────────────────────────────────────────────── */}
    <section className="relative overflow-hidden">
      {/* soft gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-base to-orange-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left copy */}
          <div className="fade-in">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary text-xs font-semibold mb-5">
              <FaCheckCircle size={11} />
              Trusted by over a million travellers
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold text-charcoal leading-[1.1] tracking-tight">
              Find your<br />
              <span className="gradient-text">perfect stay.</span>
            </h1>

            <p className="mt-5 text-lg text-muted leading-relaxed max-w-md">
              Stayfinity puts the world's finest hotels at your fingertips — search, compare and book in a few taps.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register"
                className="btn-accent flex items-center gap-2 shadow-accent">
                Get Started <FaArrowRight size={13} />
              </Link>
              <Link to="/hotels"
                className="btn-outline">
                Explore Hotels
              </Link>
            </div>

            {/* Floating trust pills */}
            <div className="mt-8 flex flex-wrap gap-3">
              {['No hidden fees', 'Free cancellation', 'Best price guarantee'].map(t => (
                <span key={t} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted border border-gray-200 rounded-full px-3 py-1 bg-white shadow-sm">
                  <FaCheckCircle size={10} className="text-primary" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right image grid */}
          <div className="relative slide-in-up">
            <div className="rounded-3xl border border-gray-100 shadow-hover bg-white p-5">
              <div className="grid grid-cols-2 gap-3">
                {heroImages.map((img, i) => (
                  <div key={i} className={`rounded-2xl overflow-hidden bg-primary-50 ${i === 0 ? 'row-span-1' : ''}`}
                    style={{ height: i % 2 === 0 ? '160px' : '130px' }}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge — bottom left */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl border border-gray-100 shadow-hover px-4 py-2.5 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {['#0F6E56','#D85A30','#FAC775'].map(c => (
                  <div key={c} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <span className="text-xs font-semibold text-charcoal">1M+ bookings</span>
            </div>

            {/* Floating badge — top right */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl border border-gray-100 shadow-hover px-4 py-2.5 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={11} className="text-highlight" />
                ))}
              </div>
              <span className="text-xs font-semibold text-charcoal">Top rated</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Stats bar ────────────────────────────────────────────── */}
    <section className="border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features ─────────────────────────────────────────────── */}
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-charcoal">Why travellers choose Stayfinity</h2>
          <p className="mt-3 text-muted">Designed from the ground up for a seamless booking experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card p-7 hover-lift">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── CTA banner ───────────────────────────────────────────── */}
    <section className="py-20 bg-primary">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to book your next stay?
        </h2>
        <p className="text-primary-100 mb-8 text-lg">
          Join Stayfinity — it's free and takes less than a minute.
        </p>
        <Link to="/register"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-accent transition-all duration-200">
          Create free account <FaArrowRight size={16} />
        </Link>
      </div>
    </section>

  </div>
);

export default Landing;

import React, { useState, useEffect } from 'react';
import { useBooking } from '../contexts/BookingContext';
import axios from 'axios';
import {
  FaSearch, FaMapMarkerAlt, FaStar,
  FaWifi, FaParking, FaSwimmingPool, FaUtensils,
  FaDumbbell, FaConciergeBell, FaShuttleVan, FaSpa,
  FaTimes, FaCheckCircle,
} from 'react-icons/fa';
import { MdHotel, MdDateRange } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/* ── Amenity icon map ───────────────────────────────────────── */
const AMENITY_ICONS = {
  wifi:        FaWifi,
  parking:     FaParking,
  pool:        FaSwimmingPool,
  restaurant:  FaUtensils,
  gym:         FaDumbbell,
  concierge:   FaConciergeBell,
  shuttle:     FaShuttleVan,
  spa:         FaSpa,
};

/* ── Star row ───────────────────────────────────────────────── */
const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} size={13}
        className={i < Math.floor(rating) ? 'text-highlight' : 'text-gray-200'} />
    ))}
    <span className="ml-1.5 text-xs font-semibold text-muted">({rating})</span>
  </div>
);

const HotelList = () => {
  const { fetchBookings } = useBooking();

  const [hotels,       setHotels]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [searchTerm,   setSearchTerm]   = useState('');
  const [priceFilter,  setPriceFilter]  = useState('');
  const [sortBy,       setSortBy]       = useState('name');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingData,  setBookingData]  = useState({
    checkInDate: null, checkOutDate: null, roomsBooked: 1,
    guestInfo: { name: '', email: '', phone: '' },
    specialRequests: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => { fetchHotels(); }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/hotels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHotels(data.hotels);
    } catch {
      setError('Unable to load hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (hotel) => {
    setSelectedHotel(hotel);
    setBookingSuccess(false);
    setError('');
    setBookingData({
      checkInDate: null, checkOutDate: null, roomsBooked: 1,
      guestInfo: { name: '', email: '', phone: '' },
      specialRequests: '',
    });
  };

  const closeModal = () => { setSelectedHotel(null); setBookingSuccess(false); };

  const handleBooking = async () => {
    const { checkInDate, checkOutDate, guestInfo, roomsBooked } = bookingData;
    if (!checkInDate || !checkOutDate) { setError('Select check-in and check-out dates.'); return; }
    if (checkInDate >= checkOutDate)   { setError('Check-out must be after check-in.'); return; }
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      setError('Please fill in all guest details.'); return;
    }
    setError('');
    try {
      setBookingLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bookings', {
        hotelId:         selectedHotel._id,
        checkInDate,
        checkOutDate,
        roomsBooked,
        guestInfo,
        specialRequests: bookingData.specialRequests,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setHotels(prev => prev.map(h =>
        h._id === selectedHotel._id
          ? { ...h, availableRooms: h.availableRooms - roomsBooked }
          : h
      ));
      await fetchBookings();
      setBookingSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const nights = (a, b) => {
    if (!a || !b) return 0;
    return Math.max(1, Math.ceil((b - a) / 86400000));
  };

  const filtered = hotels
    .filter(h => {
      const q = searchTerm.toLowerCase();
      const matchSearch = h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q);
      const matchPrice  =
        !priceFilter ||
        (priceFilter === 'low'    && h.pricePerNight <= 100) ||
        (priceFilter === 'medium' && h.pricePerNight > 100 && h.pricePerNight <= 200) ||
        (priceFilter === 'high'   && h.pricePerNight > 200);
      return matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low')  return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-high') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'rating')     return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="text-center">
        <div className="spinner-lg mx-auto" />
        <p className="mt-4 text-muted font-medium">Loading hotels…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-charcoal">Browse Hotels</h1>
          <p className="mt-1 text-muted">
            {filtered.length} propert{filtered.length === 1 ? 'y' : 'ies'} available
          </p>
        </div>

        {/* Search + filters */}
        <div className="card-flat p-5 mb-8 border border-gray-100 shadow-card">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
              <input
                type="text" placeholder="Search by name or city…"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
              className="input-field md:w-44">
              <option value="">All Prices</option>
              <option value="low">Under $100</option>
              <option value="medium">$100 – $200</option>
              <option value="high">Over $200</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="input-field md:w-52">
              <option value="name">Sort: Name</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Error banner */}
        {error && !selectedHotel && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            <FaTimes size={13} /> {error}
          </div>
        )}

        {/* Hotel grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(hotel => (
            <div key={hotel._id} className="card overflow-hidden hover-lift">
              {/* Image */}
              <div className="relative h-48 bg-primary-50">
                {hotel.images?.length > 0 ? (
                  <img src={hotel.images[0]} alt={hotel.name}
                    className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MdHotel size={40} className="text-primary-200" />
                  </div>
                )}
                {/* Price pill */}
                <div className="absolute top-3 right-3 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                  ${hotel.pricePerNight}<span className="font-normal opacity-80">/night</span>
                </div>
                {/* Availability dot */}
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  hotel.availableRooms > 0 ? 'bg-white text-primary' : 'bg-white text-red-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${hotel.availableRooms > 0 ? 'bg-primary' : 'bg-red-500'}`} />
                  {hotel.availableRooms > 0 ? `${hotel.availableRooms} rooms` : 'Full'}
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-charcoal mb-1">{hotel.name}</h3>
                <div className="flex items-center gap-1.5 text-muted text-sm mb-2">
                  <FaMapMarkerAlt size={12} className="text-accent" />
                  {hotel.location}
                </div>
                <Stars rating={hotel.rating} />

                <p className="mt-3 text-sm text-muted line-clamp-2 leading-relaxed">{hotel.description}</p>

                {/* Amenities */}
                {hotel.amenities?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {hotel.amenities.slice(0, 5).map(a => {
                      const Icon = AMENITY_ICONS[a.toLowerCase()];
                      return Icon ? (
                        <span key={a} className="badge-primary text-[11px] flex items-center gap-1">
                          <Icon size={10} /> {a}
                        </span>
                      ) : null;
                    })}
                    {hotel.amenities.length > 5 && (
                      <span className="badge-muted text-[11px]">+{hotel.amenities.length - 5}</span>
                    )}
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => openModal(hotel)}
                  disabled={hotel.availableRooms === 0}
                  className={`mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    hotel.availableRooms > 0
                      ? 'bg-primary text-white hover:bg-primary-600'
                      : 'bg-gray-100 text-muted cursor-not-allowed'
                  }`}>
                  {hotel.availableRooms > 0 ? 'Book Now' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-float">🏨</div>
            <h3 className="text-xl font-bold text-charcoal mb-2">No hotels match your search</h3>
            <p className="text-muted">Try different filters or clear your search.</p>
          </div>
        )}
      </div>

      {/* ── Booking Modal ─────────────────────────────────────── */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="p-6">

              {/* Modal header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold text-charcoal">{selectedHotel.name}</h3>
                  <div className="flex items-center gap-1 text-muted text-sm mt-0.5">
                    <FaMapMarkerAlt size={11} className="text-accent" />
                    {selectedHotel.location}
                  </div>
                </div>
                <button onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-gray-100 text-muted transition-colors">
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Success state */}
              {bookingSuccess ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle size={32} className="text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-charcoal mb-2">Booking Confirmed!</h4>
                  <p className="text-muted mb-6">Your stay at <strong>{selectedHotel.name}</strong> is reserved.</p>
                  <button onClick={closeModal} className="btn-primary px-8">Done</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Dates row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Check-in</label>
                      <div className="relative">
                        <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10" size={16} />
                        <DatePicker
                          selected={bookingData.checkInDate}
                          onChange={d => setBookingData(p => ({ ...p, checkInDate: d }))}
                          minDate={new Date()} placeholderText="Select date"
                          className="input-field pl-9 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Check-out</label>
                      <div className="relative">
                        <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10" size={16} />
                        <DatePicker
                          selected={bookingData.checkOutDate}
                          onChange={d => setBookingData(p => ({ ...p, checkOutDate: d }))}
                          minDate={bookingData.checkInDate || new Date()} placeholderText="Select date"
                          className="input-field pl-9 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Rooms</label>
                    <select value={bookingData.roomsBooked}
                      onChange={e => setBookingData(p => ({ ...p, roomsBooked: +e.target.value }))}
                      className="input-field text-sm">
                      {[...Array(Math.min(selectedHotel.availableRooms, 5))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Room' : 'Rooms'}</option>
                      ))}
                    </select>
                  </div>

                  {/* Guest info */}
                  <div className="divider" />
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide">Guest Details</p>
                  <input type="text" placeholder="Full name"
                    value={bookingData.guestInfo.name}
                    onChange={e => setBookingData(p => ({ ...p, guestInfo: { ...p.guestInfo, name: e.target.value } }))}
                    className="input-field text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="email" placeholder="Email"
                      value={bookingData.guestInfo.email}
                      onChange={e => setBookingData(p => ({ ...p, guestInfo: { ...p.guestInfo, email: e.target.value } }))}
                      className="input-field text-sm" />
                    <input type="tel" placeholder="Phone"
                      value={bookingData.guestInfo.phone}
                      onChange={e => setBookingData(p => ({ ...p, guestInfo: { ...p.guestInfo, phone: e.target.value } }))}
                      className="input-field text-sm" />
                  </div>
                  <textarea rows={2} placeholder="Special requests (optional)"
                    value={bookingData.specialRequests}
                    onChange={e => setBookingData(p => ({ ...p, specialRequests: e.target.value }))}
                    className="input-field text-sm resize-none" />

                  {/* Price summary */}
                  {bookingData.checkInDate && bookingData.checkOutDate && (
                    <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 text-sm space-y-1.5">
                      <div className="flex justify-between text-muted">
                        <span>${selectedHotel.pricePerNight} × {nights(bookingData.checkInDate, bookingData.checkOutDate)} nights × {bookingData.roomsBooked} rooms</span>
                      </div>
                      <div className="flex justify-between font-bold text-charcoal text-base pt-1 border-t border-primary-100">
                        <span>Total</span>
                        <span className="text-primary">
                          ${selectedHotel.pricePerNight * nights(bookingData.checkInDate, bookingData.checkOutDate) * bookingData.roomsBooked}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600 flex items-center gap-2">
                      <FaTimes size={12} /> {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-muted text-sm font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleBooking}
                      disabled={bookingLoading || !bookingData.checkInDate || !bookingData.checkOutDate}
                      className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      {bookingLoading ? <span className="spinner mx-auto" /> : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelList;

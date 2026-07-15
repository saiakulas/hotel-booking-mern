import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import {
  FaMapMarkerAlt, FaCalendarAlt, FaBed, FaDollarSign,
  FaTimes, FaCheck, FaClock, FaExclamationTriangle,
  FaChevronRight,
} from 'react-icons/fa';
import { MdHotel } from 'react-icons/md';

/* ── helpers ────────────────────────────────────────────────── */
const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const nights = (a, b) =>
  Math.max(1, Math.ceil((new Date(b) - new Date(a)) / 86400000));

const isUpcoming = (d) => new Date(d) > new Date();
const isPast     = (d) => new Date(d) < new Date();

const STATUS_MAP = {
  confirmed: { dot: 'bg-primary',   bg: 'bg-primary-50',  text: 'text-primary',     label: 'Confirmed', Icon: FaCheck },
  cancelled: { dot: 'bg-red-500',   bg: 'bg-red-50',      text: 'text-red-600',     label: 'Cancelled', Icon: FaTimes },
  completed: { dot: 'bg-gray-400',  bg: 'bg-gray-100',    text: 'text-muted',       label: 'Completed', Icon: FaCheck },
  pending:   { dot: 'bg-yellow-500',bg: 'bg-yellow-50',   text: 'text-yellow-700',  label: 'Pending',   Icon: FaClock },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status?.toLowerCase()] ?? STATUS_MAP.pending;
  const { bg, text, label, Icon } = s;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>
      <Icon size={10} /> {label}
    </span>
  );
};

/* ── stat card ──────────────────────────────────────────────── */
const StatCard = ({ value, label, color }) => (
  <div className="card-flat border border-gray-100 p-5 text-center shadow-card">
    <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    <p className="text-sm text-muted mt-1">{label}</p>
  </div>
);

/* ════════════════════════════════════════════════════════════ */
const MyBookings = () => {
  const { user }  = useAuth();
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBooking();
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all | upcoming | past

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchBookings(); }, []);

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancellingId(id);
    await cancelBooking(id);
    setCancellingId(null);
  };

  const visible = bookings.filter(b => {
    if (filter === 'upcoming') return isUpcoming(b.checkInDate) && b.status !== 'cancelled';
    if (filter === 'past')     return isPast(b.checkOutDate)    || b.status === 'cancelled';
    return true;
  });

  /* ── stats ── */
  const confirmed  = bookings.filter(b => b.status === 'confirmed').length;
  const upcoming   = bookings.filter(b => isUpcoming(b.checkInDate) && b.status !== 'cancelled').length;
  const completed  = bookings.filter(b => isPast(b.checkOutDate)).length;
  const totalSpend = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="text-center">
        <div className="spinner-lg mx-auto" />
        <p className="mt-4 text-muted font-medium">Loading your bookings…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-charcoal">My Bookings</h1>
          <p className="mt-1 text-muted">All your reservations in one place.</p>
        </div>

        {/* Stats row */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard value={bookings.length} label="Total"     color="text-charcoal" />
            <StatCard value={confirmed}        label="Confirmed" color="text-primary"  />
            <StatCard value={upcoming}         label="Upcoming"  color="text-accent"   />
            <StatCard value={`$${totalSpend.toLocaleString()}`} label="Total Spent" color="text-highlight-dark" />
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'upcoming', 'past'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-150 ${
                filter === f
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-white border border-gray-100 text-muted hover:text-primary hover:border-primary-100'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
            <FaExclamationTriangle size={13} /> {error}
          </div>
        )}

        {/* Empty state */}
        {bookings.length === 0 && (
          <div className="text-center py-20 card p-10">
            <div className="text-6xl mb-4 animate-float">📋</div>
            <h3 className="text-xl font-bold text-charcoal mb-2">No bookings yet</h3>
            <p className="text-muted mb-6">Start exploring hotels and make your first reservation.</p>
            <Link to="/hotels" className="btn-primary inline-flex">
              Browse Hotels <FaChevronRight size={12} />
            </Link>
          </div>
        )}

        {/* Booking cards */}
        <div className="space-y-5">
          {visible.map(booking => {
            const n = nights(booking.checkInDate, booking.checkOutDate);
            const upcoming_ = isUpcoming(booking.checkInDate);
            const past_     = isPast(booking.checkOutDate);
            const canCancel = booking.status === 'confirmed' && upcoming_;

            return (
              <div key={booking._id}
                className={`bg-white rounded-2xl border shadow-card overflow-hidden transition-shadow hover:shadow-hover ${
                  upcoming_ && booking.status !== 'cancelled' ? 'border-l-4 border-l-primary border-r-gray-100 border-t-gray-100 border-b-gray-100'
                  : past_  ? 'border-l-4 border-l-gray-200 border-r-gray-100 border-t-gray-100 border-b-gray-100'
                  : 'border-gray-100'
                }`}>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">

                    {/* Hotel icon / image */}
                    <div className="flex-shrink-0">
                      {booking.hotelId?.images?.[0] ? (
                        <img src={booking.hotelId.images[0]} alt={booking.hotelId.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-gray-100" />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100">
                          <MdHotel size={30} className="text-primary-300" />
                        </div>
                      )}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-charcoal leading-tight">
                            {booking.hotelId?.name || 'Hotel'}
                          </h3>
                          <div className="flex items-center gap-1.5 text-muted text-sm mt-0.5">
                            <FaMapMarkerAlt size={11} className="text-accent" />
                            {booking.hotelId?.location || '—'}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={booking.status} />
                          {upcoming_ && booking.status !== 'cancelled' && (
                            <span className="badge bg-accent text-white text-[11px]">Upcoming</span>
                          )}
                          {!upcoming_ && !past_ && (
                            <span className="badge bg-primary text-white text-[11px]">Active stay</span>
                          )}
                          {past_ && booking.status !== 'cancelled' && (
                            <span className="badge-muted text-[11px]">Completed</span>
                          )}
                        </div>
                      </div>

                      {/* Date + room grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                        <div className="bg-base rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Check-in</p>
                          <div className="flex items-center gap-1.5 text-charcoal font-medium">
                            <FaCalendarAlt size={11} className="text-primary" />
                            {fmt(booking.checkInDate)}
                          </div>
                        </div>
                        <div className="bg-base rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Check-out</p>
                          <div className="flex items-center gap-1.5 text-charcoal font-medium">
                            <FaCalendarAlt size={11} className="text-primary" />
                            {fmt(booking.checkOutDate)}
                          </div>
                        </div>
                        <div className="bg-base rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Rooms</p>
                          <div className="flex items-center gap-1.5 text-charcoal font-medium">
                            <FaBed size={11} className="text-primary" />
                            {booking.roomsBooked} × {n} night{n !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="bg-primary-50 rounded-xl p-3">
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-0.5">Total</p>
                          <div className="flex items-center gap-1 text-primary font-bold">
                            <FaDollarSign size={11} />
                            {booking.totalPrice?.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Guest info */}
                      {booking.guestInfo && (
                        <div className="border-t border-gray-100 pt-3 mt-1">
                          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-1.5">Guest</p>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-charcoal">
                            <span>{booking.guestInfo.name}</span>
                            <span className="text-muted">{booking.guestInfo.email}</span>
                            {booking.guestInfo.phone && (
                              <span className="text-muted">{booking.guestInfo.phone}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Special requests */}
                      {booking.specialRequests && (
                        <div className="mt-3 text-sm text-muted italic border-l-2 border-primary-100 pl-3">
                          {booking.specialRequests}
                        </div>
                      )}

                      {/* Booking ID + cancel */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <p className="text-[11px] text-muted font-mono">ID: {booking._id}</p>
                        {canCancel && (
                          <button onClick={() => handleCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            {cancellingId === booking._id
                              ? <><span className="spinner" style={{ borderTopColor: '#dc2626', width: 14, height: 14 }} /> Cancelling…</>
                              : <><FaTimes size={11} /> Cancel</>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filtered empty state */}
        {bookings.length > 0 && visible.length === 0 && (
          <div className="text-center py-12 text-muted">
            No bookings match the <strong>{filter}</strong> filter.
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;

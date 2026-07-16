import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  FaHotel, FaCalendarCheck, FaDollarSign, FaPlus, FaEdit, FaTrash,
  FaStar, FaTimes, FaCheckCircle, FaExclamationCircle,
  FaWifi, FaSwimmingPool, FaUtensils, FaDumbbell,
  FaConciergeBell, FaShuttleVan, FaSpa,
} from 'react-icons/fa';
import { MdAdd, MdDashboard } from 'react-icons/md';

/* ── constants ──────────────────────────────────────────────── */
const AMENITIES = [
  { id: 'wifi',       label: 'WiFi',            icon: FaWifi },
  { id: 'pool',       label: 'Pool',            icon: FaSwimmingPool },
  { id: 'restaurant', label: 'Restaurant',      icon: FaUtensils },
  { id: 'gym',        label: 'Gym',             icon: FaDumbbell },
  { id: 'concierge',  label: 'Concierge',       icon: FaConciergeBell },
  { id: 'shuttle',    label: 'Airport Shuttle', icon: FaShuttleVan },
  { id: 'spa',        label: 'Spa',             icon: FaSpa },
];

const EMPTY_FORM = {
  name: '', location: '', description: '',
  pricePerNight: '', totalRooms: '', availableRooms: '',
  amenities: [], rating: 4.5, image: '', imageFile: null,
};

/* ── small helpers ──────────────────────────────────────────── */
const fmt   = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const token = ()  => localStorage.getItem('token');
const auth  = ()  => ({ headers: { Authorization: `Bearer ${token()}` } });

const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-muted mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-charcoal">{value}</p>
    </div>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${gradient}`}>
      <Icon size={22} className="text-white" />
    </div>
  </div>
);

const StatusPill = ({ status }) => {
  const map = {
    confirmed: 'bg-primary-50 text-primary',
    cancelled:  'bg-red-50 text-red-600',
    completed:  'bg-gray-100 text-muted',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? 'bg-gray-100 text-muted'}`}>
      {status}
    </span>
  );
};

/* ════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const { user } = useAuth();

  const [hotels,   setHotels]   = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('bookings');

  const [showModal,     setShowModal]     = useState(false);
  const [editingHotel,  setEditingHotel]  = useState(null);
  const [formData,      setFormData]      = useState(EMPTY_FORM);
  const [formError,     setFormError]     = useState('');
  const [formSubmitting,setFormSubmitting]= useState(false);
  const [toast,         setToast]         = useState(null); // { type, msg }

  useEffect(() => { load(); }, []);

  /* ── show a temporary toast ── */
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── data loading ── */
  const load = async () => {
    try {
      setLoading(true);
      const [hRes, bRes] = await Promise.all([
        axios.get('http://localhost:5000/api/hotels',       auth()),
        axios.get('http://localhost:5000/api/bookings/all', auth()),
      ]);
      setHotels(hRes.data.hotels);
      setBookings(bRes.data.bookings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ── stats ── */
  const stats = {
    totalHotels:   hotels.length,
    totalBookings: bookings.length,
    totalRevenue:  bookings.reduce((s, b) => s + (b.totalPrice || 0), 0),
    activeHotels:  hotels.filter(h => h.availableRooms > 0).length,
  };

  /* ── modal helpers ── */
  const openAdd  = ()      => { setFormData(EMPTY_FORM); setEditingHotel(null); setFormError(''); setShowModal(true); };
  const openEdit = (hotel) => {
    setFormData({
      name: hotel.name, location: hotel.location, description: hotel.description,
      pricePerNight: hotel.pricePerNight, totalRooms: hotel.totalRooms,
      availableRooms: hotel.availableRooms, amenities: hotel.amenities,
      rating: hotel.rating,
      image: Array.isArray(hotel.images) && hotel.images.length ? hotel.images[0] : '',
      imageFile: null,
    });
    setEditingHotel(hotel);
    setFormError('');
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingHotel(null); setFormData(EMPTY_FORM); setFormError(''); };

  const toggleAmenity = (id) =>
    setFormData(p => ({
      ...p,
      amenities: p.amenities.includes(id) ? p.amenities.filter(a => a !== id) : [...p.amenities, id],
    }));

  /* ── submit hotel form ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name || !formData.location || !formData.description ||
        !formData.pricePerNight || !formData.totalRooms || !formData.availableRooms) {
      setFormError('Please fill in all required fields.');
      return;
    }
    try {
      setFormSubmitting(true);
      let payload = { ...formData };

      if (formData.imageFile) {
        const fd = new FormData();
        fd.append('image', formData.imageFile);
        const up = await axios.post('http://localhost:5000/api/hotels/upload', fd, {
          headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' },
        });
        payload.image = up.data.url;
      }
      delete payload.imageFile;

      if (editingHotel) {
        await axios.put(`http://localhost:5000/api/hotels/${editingHotel._id}`, payload, auth());
        showToast('success', 'Hotel updated successfully.');
      } else {
        await axios.post('http://localhost:5000/api/hotels', payload, auth());
        showToast('success', 'Hotel added successfully.');
      }

      closeModal();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setFormSubmitting(false);
    }
  };

  /* ── delete hotel ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this hotel?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/hotels/${id}`, auth());
      showToast('success', 'Hotel deleted.');
      load();
    } catch {
      showToast('error', 'Failed to delete hotel.');
    }
  };

  /* ── loading screen ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="text-center">
        <div className="spinner-lg mx-auto" />
        <p className="mt-4 text-muted font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  /* ── render ── */
  return (
    <div className="min-h-screen bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-hover text-sm font-semibold animate-fade-in
            ${toast.type === 'success' ? 'bg-primary text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <FaCheckCircle size={15} /> : <FaExclamationCircle size={15} />}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MdDashboard size={22} className="text-primary" />
              <h1 className="text-3xl font-extrabold text-charcoal">Admin Dashboard</h1>
            </div>
            <p className="text-muted text-sm">Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <button onClick={openAdd}
            className="btn-accent flex items-center gap-2 self-start sm:self-auto">
            <MdAdd size={18} /> Add Hotel
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FaHotel}         label="Total Hotels"   value={stats.totalHotels}   gradient="bg-gradient-to-br from-primary to-primary-400" />
          <StatCard icon={FaCalendarCheck} label="Bookings"       value={stats.totalBookings}  gradient="bg-gradient-to-br from-accent to-accent-light" />
          <StatCard icon={FaHotel}         label="Active Hotels"  value={stats.activeHotels}   gradient="bg-gradient-to-br from-highlight-dark to-highlight" />
          <StatCard icon={FaDollarSign}    label="Revenue"        value={`$${stats.totalRevenue.toLocaleString()}`} gradient="bg-gradient-to-br from-emerald-500 to-teal-400" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-card w-fit">
          {[
            { id: 'bookings', label: 'Bookings', Icon: FaCalendarCheck },
            { id: 'hotels',   label: 'Hotels',   Icon: FaHotel },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                tab === id
                  ? 'bg-primary text-white shadow-card'
                  : 'text-muted hover:text-primary hover:bg-primary-50'
              }`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-charcoal">All Bookings</h2>
              <span className="badge-primary">{bookings.length} total</span>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-16 text-muted">No bookings yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-base border-b border-gray-100 text-[11px] font-semibold text-muted uppercase tracking-wide">
                      <th className="px-6 py-3 text-left">Guest</th>
                      <th className="px-4 py-3 text-left">Hotel</th>
                      <th className="px-4 py-3 text-left">Dates</th>
                      <th className="px-4 py-3 text-center">Rooms</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map(b => (
                      <tr key={b._id} className="hover:bg-base transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-charcoal">{b.userId?.name || '—'}</p>
                          <p className="text-muted text-xs">{b.userId?.email || ''}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-charcoal">{b.hotelId?.name || '—'}</p>
                          <p className="text-muted text-xs">{b.hotelId?.location || ''}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-muted">
                          {fmt(b.checkInDate)} → {fmt(b.checkOutDate)}
                        </td>
                        <td className="px-4 py-4 text-center text-charcoal font-medium">{b.roomsBooked}</td>
                        <td className="px-4 py-4 text-right font-bold text-primary">${b.totalPrice?.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center"><StatusPill status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── HOTELS TAB ── */}
        {tab === 'hotels' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-charcoal">Manage Hotels</h2>
              <button onClick={openAdd}
                className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition-colors">
                <FaPlus size={12} /> Add New
              </button>
            </div>

            {hotels.length === 0 ? (
              <div className="text-center py-16 text-muted">No hotels yet. Add one!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
                {hotels.map(hotel => (
                  <div key={hotel._id} className="rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-hover transition-shadow">
                    {/* Image */}
                    <div className="h-36 bg-primary-50 relative">
                      {hotel.images?.[0] ? (
                        <img src={hotel.images[0]} alt={hotel.name}
                          className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaHotel size={32} className="text-primary-200" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button onClick={() => openEdit(hotel)}
                          className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-white shadow transition-colors">
                          <FaEdit size={13} />
                        </button>
                        <button onClick={() => handleDelete(hotel._id)}
                          className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-white shadow transition-colors">
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-4">
                      <h4 className="font-bold text-charcoal text-sm mb-0.5">{hotel.name}</h4>
                      <p className="text-xs text-muted mb-3">{hotel.location}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-base rounded-xl p-2 text-center">
                          <p className="font-bold text-primary">${hotel.pricePerNight}</p>
                          <p className="text-muted">/ night</p>
                        </div>
                        <div className="bg-base rounded-xl p-2 text-center">
                          <p className="font-bold text-charcoal">{hotel.availableRooms}/{hotel.totalRooms}</p>
                          <p className="text-muted">rooms</p>
                        </div>
                        <div className="bg-base rounded-xl p-2 text-center flex flex-col items-center">
                          <div className="flex items-center gap-0.5">
                            <FaStar size={10} className="text-highlight" />
                            <p className="font-bold text-charcoal">{hotel.rating}</p>
                          </div>
                          <p className="text-muted">rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="p-6">

              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-charcoal">
                  {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
                </h3>
                <button onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-gray-100 text-muted transition-colors">
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Hotel Name *</label>
                    <input type="text" value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="input-field" placeholder="e.g. Grand Lagoon Hotel" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Location *</label>
                    <input type="text" value={formData.location}
                      onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                      className="input-field" placeholder="City, Country" required />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Description *</label>
                  <textarea rows={3} value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    className="input-field resize-none" placeholder="Brief property description…" required />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="file" accept="image/*"
                      onChange={e => setFormData(p => ({ ...p, imageFile: e.target.files?.[0] || null }))}
                      className="input-field text-sm cursor-pointer" />
                    <input type="url" value={formData.image}
                      onChange={e => setFormData(p => ({ ...p, image: e.target.value }))}
                      className="input-field text-sm" placeholder="https://… (or upload above)" />
                  </div>
                </div>

                {/* Price / Rooms / Rating */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Price / Night *</label>
                    <input type="number" min="0" value={formData.pricePerNight}
                      onChange={e => setFormData(p => ({ ...p, pricePerNight: e.target.value }))}
                      className="input-field" placeholder="$" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Total Rooms *</label>
                    <input type="number" min="1" value={formData.totalRooms}
                      onChange={e => setFormData(p => ({ ...p, totalRooms: e.target.value }))}
                      className="input-field" placeholder="e.g. 50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Available *</label>
                    <input type="number" min="0" value={formData.availableRooms}
                      onChange={e => setFormData(p => ({ ...p, availableRooms: e.target.value }))}
                      className="input-field" placeholder="e.g. 20" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Rating</label>
                    <input type="number" min="0" max="5" step="0.1" value={formData.rating}
                      onChange={e => setFormData(p => ({ ...p, rating: e.target.value }))}
                      className="input-field" />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {AMENITIES.map(({ id, label, icon: Icon }) => {
                      const active = formData.amenities.includes(id);
                      return (
                        <button key={id} type="button" onClick={() => toggleAmenity(id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                            active
                              ? 'bg-primary-50 border-primary-200 text-primary'
                              : 'bg-base border-gray-200 text-muted hover:border-primary-200 hover:text-primary'
                          }`}>
                          <Icon size={12} /> {label}
                          {active && <FaCheckCircle size={10} className="ml-auto text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Error */}
                {formError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm">
                    <FaExclamationCircle size={13} /> {formError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-muted text-sm font-semibold hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={formSubmitting}
                    className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                    {formSubmitting
                      ? <><span className="spinner" style={{ borderTopColor: '#fff', width: 18, height: 18 }} /> Saving…</>
                      : editingHotel ? 'Update Hotel' : 'Add Hotel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

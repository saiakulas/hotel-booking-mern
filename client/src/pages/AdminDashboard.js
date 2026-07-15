import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FaHotel, FaUsers, FaCalendarCheck, FaDollarSign, FaPlus, FaEdit, FaTrash, 
  FaChartLine, FaStar, FaMapMarkerAlt, FaBed, FaWifi, FaSwimmingPool, 
  FaUtensils, FaDumbbell, FaConciergeBell, FaShuttleVan, FaSpa 
} from 'react-icons/fa';
import { MdHotel, MdAdd, MdDashboard } from 'react-icons/md';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    bookedHotels: 0
  });
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerNight: '',
    totalRooms: '',
    availableRooms: '',
    amenities: [],
    rating: 4.5,
    image: '',
    imageFile: null
  });

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: FaWifi },
    { id: 'pool', label: 'Swimming Pool', icon: FaSwimmingPool },
    { id: 'restaurant', label: 'Restaurant', icon: FaUtensils },
    { id: 'gym', label: 'Gym', icon: FaDumbbell },
    { id: 'concierge', label: 'Concierge', icon: FaConciergeBell },
    { id: 'shuttle', label: 'Airport Shuttle', icon: FaShuttleVan },
    { id: 'spa', label: 'Spa', icon: FaSpa }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch hotels
      const hotelsResponse = await axios.get('http://localhost:5000/api/hotels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(hotelsResponse.data.hotels);

      // Fetch all bookings (admin can see all)
      const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookingsResponse.data.bookings);

      // Calculate stats based on bookings
      const totalRevenue = bookingsResponse.data.bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
      const bookedHotelIds = new Set(
        bookingsResponse.data.bookings
          .map(b => b.hotelId?._id?.toString?.() || b.hotelId?.toString?.())
          .filter(Boolean)
      );

      setStats({
        totalHotels: hotelsResponse.data?.pagination?.totalHotels ?? hotelsResponse.data.hotels.length,
        totalBookings: bookingsResponse.data.bookings.length,
        totalRevenue,
        bookedHotels: bookedHotelIds.size
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let payload = { ...formData };
      if (formData.imageFile) {
        const data = new FormData();
        data.append('image', formData.imageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/hotels/upload', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        payload.image = uploadRes.data.url;
      }
      delete payload.imageFile;

      await axios.post('http://localhost:5000/api/hotels', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowAddHotel(false);
      setFormData({
        name: '',
        location: '',
        description: '',
        pricePerNight: '',
        totalRooms: '',
        availableRooms: '',
        amenities: [],
        rating: 4.5,
        image: '',
        imageFile: null
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  const handleEditHotel = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let payload = { ...formData };
      if (formData.imageFile) {
        const data = new FormData();
        data.append('image', formData.imageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/hotels/upload', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        payload.image = uploadRes.data.url;
      }
      delete payload.imageFile;

      await axios.put(`http://localhost:5000/api/hotels/${editingHotel._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingHotel(null);
      setFormData({
        name: '',
        location: '',
        description: '',
        pricePerNight: '',
        totalRooms: '',
        availableRooms: '',
        amenities: [],
        rating: 4.5,
        image: '',
        imageFile: null
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating hotel:', error);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const startEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      pricePerNight: hotel.pricePerNight.toString(),
      totalRooms: hotel.totalRooms.toString(),
      availableRooms: hotel.availableRooms.toString(),
      amenities: hotel.amenities,
      rating: hotel.rating,
      image: Array.isArray(hotel.images) && hotel.images.length > 0 ? hotel.images[0] : '',
      imageFile: null
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-blue-100">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddHotel(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <MdAdd className="text-xl" />
                <span>Add Hotel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Hotels</p>
                <p className="text-3xl font-bold text-black">{stats.totalHotels}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <FaHotel className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-black">{stats.totalBookings}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl">
                <FaCalendarCheck className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Booked Hotels</p>
                <p className="text-3xl font-bold text-black">{stats.bookedHotels}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl">
                <FaUsers className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-black">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-red-600 p-3 rounded-xl">
                <FaDollarSign className="text-white text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs (Overview removed) */}
        <div className="bg-white rounded-2xl p-2 mb-8 shadow-lg border border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'hotels'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <FaHotel className="inline mr-2" />
              Hotels
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <FaCalendarCheck className="inline mr-2" />
              Bookings
            </button>
          </div>
        </div>

        {/* Content (Overview removed) */}

        {activeTab === 'hotels' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">Manage Hotels</h3>
              <button
                onClick={() => setShowAddHotel(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                <FaPlus className="inline mr-2" />
                Add Hotel
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div key={hotel._id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-black font-semibold text-lg">{hotel.name}</h4>
                      <p className="text-gray-600 text-sm">{hotel.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditHotel(hotel)}
                        className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteHotel(hotel._id)}
                        className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-black font-semibold">${hotel.pricePerNight}/night</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className="text-black">{hotel.availableRooms}/{hotel.totalRooms} rooms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-black">{hotel.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-black mb-6">All Bookings</h3>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="text-black font-semibold">{booking.hotelId?.name}</h4>
                          <p className="text-gray-600 text-sm">{booking.hotelId?.location}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-black text-sm">Check-in</p>
                          <p className="text-gray-600 text-sm">
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-black text-sm">Check-out</p>
                          <p className="text-gray-600 text-sm">
                            {new Date(booking.checkOutDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-black text-sm">Rooms</p>
                          <p className="text-gray-600 text-sm">{booking.roomsBooked}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-black font-semibold text-lg">${booking.totalPrice}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Hotel Modal */}
      {(showAddHotel || editingHotel) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddHotel(false);
                    setEditingHotel(null);
                    setFormData({
                      name: '',
                      location: '',
                      description: '',
                      pricePerNight: '',
                      totalRooms: '',
                      availableRooms: '',
                      amenities: [],
                      rating: 4.5,
                      image: '',
                      imageFile: null
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editingHotel ? handleEditHotel : handleAddHotel} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        placeholder="https://... (or leave blank if uploading)"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night</label>
                    <input
                      type="number"
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms</label>
                    <input
                      type="number"
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({...formData, totalRooms: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
                    <input
                      type="number"
                      value={formData.availableRooms}
                      onChange={(e) => setFormData({...formData, availableRooms: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenityOptions.map((amenity) => {
                      const Icon = amenity.icon;
                      return (
                        <label key={amenity.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity.id)}
                            onChange={() => toggleAmenity(amenity.id)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <Icon className="text-gray-600" />
                          <span className="text-sm text-gray-700">{amenity.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddHotel(false);
                      setEditingHotel(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                  >
                    {editingHotel ? 'Update Hotel' : 'Add Hotel'}
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
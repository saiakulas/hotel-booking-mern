import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import axios from 'axios';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaDumbbell, FaConciergeBell, FaShuttleVan, FaSpa } from 'react-icons/fa';
import { MdHotel, MdDateRange } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const HotelList = () => {
  const { user } = useAuth();
  const { fetchBookings } = useBooking();
  const navigate = useNavigate();
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    roomsBooked: 1,
    guestInfo: {
      name: '',
      email: '',
      phone: ''
    },
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Amenity icons mapping
  const amenityIcons = {
    wifi: FaWifi,
    parking: FaParking,
    pool: FaSwimmingPool,
    restaurant: FaUtensils,
    gym: FaDumbbell,
    concierge: FaConciergeBell,
    shuttle: FaShuttleVan,
    spa: FaSpa
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/hotels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(response.data.hotels);
    } catch (err) {
      setError('Failed to fetch hotels');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (hotelId) => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (bookingData.checkInDate >= bookingData.checkOutDate) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (!bookingData.guestInfo.name || !bookingData.guestInfo.email || !bookingData.guestInfo.phone) {
      setError('Please provide guest name, email, and phone');
      return;
    }

    try {
      setBookingLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/bookings', {
        hotelId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        roomsBooked: bookingData.roomsBooked,
        guestInfo: bookingData.guestInfo,
        specialRequests: bookingData.specialRequests
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local hotel data to reflect the booking
      setHotels(prevHotels => 
        prevHotels.map(hotel => 
          hotel._id === hotelId 
            ? { ...hotel, availableRooms: hotel.availableRooms - bookingData.roomsBooked }
            : hotel
        )
      );

      // Refresh bookings
      await fetchBookings();
      
      // Reset booking form
      setBookingData({
        checkInDate: null,
        checkOutDate: null,
        roomsBooked: 1,
        guestInfo: { name: '', email: '', phone: '' },
        specialRequests: ''
      });
      setSelectedHotel(null);
      
      // Show success message
      alert('Booking created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredAndSortedHotels = hotels
    .filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = !priceFilter || 
                          (priceFilter === 'low' && hotel.pricePerNight <= 100) ||
                          (priceFilter === 'medium' && hotel.pricePerNight > 100 && hotel.pricePerNight <= 200) ||
                          (priceFilter === 'high' && hotel.pricePerNight > 200);
      const matchesLocation = !locationFilter || hotel.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesPrice && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerNight - b.pricePerNight;
        case 'price-high':
          return b.pricePerNight - a.pricePerNight;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const calculateNumberOfNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (pricePerNight, nights, rooms) => {
    return pricePerNight * nights * rooms;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Available Hotels
          </h1>
          <p className="text-gray-600 text-lg">Find and book your perfect stay</p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hotels by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-auto md:grid-cols-2 md:items-center">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-800"
              >
                <option value="">All Prices</option>
                <option value="low">Under $100</option>
                <option value="medium">$100 - $200</option>
                <option value="high">Over $200</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-56 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-800"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedHotels.map((hotel) => (
            <div key={hotel._id} className="card">
              {/* Hotel Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                {hotel.images && hotel.images.length > 0 ? (
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <MdHotel className="text-4xl text-indigo-600" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                  ${hotel.pricePerNight}/night
                </div>
              </div>

              {/* Hotel Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                      <span className="font-medium">{hotel.location}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-gray-700">({hotel.rating})</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((amenity) => {
                      const Icon = amenityIcons[amenity.toLowerCase()];
                      return Icon ? (
                        <div key={amenity} className="flex items-center text-xs text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full font-medium">
                          <Icon className="mr-1" />
                          <span className="capitalize">{amenity}</span>
                        </div>
                      ) : null;
                    })}
                    {hotel.amenities.length > 4 && (
                      <span className="text-xs text-gray-500">+{hotel.amenities.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* Room Availability */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Available Rooms:</span>
                    <span className={`font-bold text-lg ${hotel.availableRooms > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {hotel.availableRooms}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => setSelectedHotel(hotel)}
                  disabled={hotel.availableRooms === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    hotel.availableRooms > 0
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {hotel.availableRooms > 0 ? 'Book Now' : 'No Rooms Available'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedHotels.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-float">🏨</div>
            <h3 className="text-2xl font-bold text-white mb-2">No hotels found</h3>
            <p className="text-white/80">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Book {selectedHotel.name}</h3>
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <MdDateRange className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <DatePicker
                      selected={bookingData.checkInDate}
                      onChange={(date) => setBookingData({...bookingData, checkInDate: date})}
                      minDate={new Date()}
                      placeholderText="Select check-in date"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <MdDateRange className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <DatePicker
                      selected={bookingData.checkOutDate}
                      onChange={(date) => setBookingData({...bookingData, checkOutDate: date})}
                      minDate={bookingData.checkInDate || new Date()}
                      placeholderText="Select check-out date"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Number of Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rooms
                  </label>
                  <select
                    value={bookingData.roomsBooked}
                    onChange={(e) => setBookingData({...bookingData, roomsBooked: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[...Array(Math.min(selectedHotel.availableRooms, 5))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Room' : 'Rooms'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
                  <input
                    type="text"
                    value={bookingData.guestInfo.name}
                    onChange={(e) => setBookingData({ ...bookingData, guestInfo: { ...bookingData.guestInfo, name: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guest Email</label>
                    <input
                      type="email"
                      value={bookingData.guestInfo.email}
                      onChange={(e) => setBookingData({ ...bookingData, guestInfo: { ...bookingData.guestInfo, email: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guest Phone</label>
                    <input
                      type="tel"
                      value={bookingData.guestInfo.phone}
                      onChange={(e) => setBookingData({ ...bookingData, guestInfo: { ...bookingData.guestInfo, phone: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 555 123 4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (optional)</label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any special requests..."
                  />
                </div>

                {/* Price Calculation */}
                {bookingData.checkInDate && bookingData.checkOutDate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Price per night:</span>
                        <span>${selectedHotel.pricePerNight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of nights:</span>
                        <span>{calculateNumberOfNights(bookingData.checkInDate, bookingData.checkOutDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of rooms:</span>
                        <span>{bookingData.roomsBooked}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Price:</span>
                          <span>${calculateTotalPrice(
                            selectedHotel.pricePerNight,
                            calculateNumberOfNights(bookingData.checkInDate, bookingData.checkOutDate),
                            bookingData.roomsBooked
                          )}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedHotel(null)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBooking(selectedHotel._id)}
                    disabled={bookingLoading || !bookingData.checkInDate || !bookingData.checkOutDate}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelList;

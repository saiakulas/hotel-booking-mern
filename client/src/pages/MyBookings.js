import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaBed, FaDollarSign, FaTimes, FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { MdHotel } from 'react-icons/md';

const MyBookings = () => {
  const { user } = useAuth();
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBooking();
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []); // Only run once on mount

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      // Success message is handled in the context
    } catch (err) {
      console.error('Error cancelling booking:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <FaCheck className="w-4 h-4" />;
      case 'cancelled':
        return <FaTimes className="w-4 h-4" />;
      case 'pending':
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaExclamationTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNumberOfNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isUpcoming = (checkInDate) => {
    return new Date(checkInDate) > new Date();
  };

  const isPast = (checkOutDate) => {
    return new Date(checkOutDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your hotel reservations</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <button
              onClick={() => window.location.href = '/hotels'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${
                  isUpcoming(booking.checkInDate) ? 'border-l-blue-500' :
                  isPast(booking.checkOutDate) ? 'border-l-gray-400' :
                  'border-l-green-500'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    {/* Hotel Info */}
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <MdHotel className="text-2xl text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {booking.hotelId?.name || 'Hotel Name Not Available'}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaMapMarkerAlt className="mr-1" />
                            <span>{booking.hotelId?.location || 'Location not available'}</span>
                          </div>
                          
                          {/* Dates */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <FaCalendarAlt className="mr-2" />
                              <div>
                                <div className="font-medium">Check-in</div>
                                <div>{formatDate(booking.checkInDate)}</div>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaCalendarAlt className="mr-2" />
                              <div>
                                <div className="font-medium">Check-out</div>
                                <div>{formatDate(booking.checkOutDate)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FaBed className="mr-1" />
                              <span>{booking.roomsBooked} {booking.roomsBooked === 1 ? 'Room' : 'Rooms'}</span>
                            </div>
                            <div className="flex items-center">
                              <FaDollarSign className="mr-1" />
                              <span>${booking.totalPrice}</span>
                            </div>
                            <div className="flex items-center">
                              <span>{calculateNumberOfNights(booking.checkInDate, booking.checkOutDate)} nights</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end space-y-4">
                      {/* Status */}
                      <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </div>

                      {/* Booking Status Badge */}
                      {isUpcoming(booking.checkInDate) && (
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Upcoming
                        </div>
                      )}
                      {!isUpcoming(booking.checkInDate) && !isPast(booking.checkOutDate) && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Current Stay
                        </div>
                      )}
                      {isPast(booking.checkOutDate) && (
                        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          Completed
                        </div>
                      )}

                      {/* Cancel Button */}
                      {booking.status.toLowerCase() === 'confirmed' && isUpcoming(booking.checkInDate) && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            cancellingId === booking._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Guest Information */}
                  {booking.guestInfo && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Guest Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Name:</span> {booking.guestInfo.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {booking.guestInfo.email}
                        </div>
                        {booking.guestInfo.phone && (
                          <div>
                            <span className="font-medium">Phone:</span> {booking.guestInfo.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Special Requests</h4>
                      <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                    </div>
                  )}

                  {/* Booking ID */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Booking ID: {booking._id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {bookings.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.length}
                </div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => isUpcoming(b.checkInDate)).length}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {bookings.filter(b => isPast(b.checkOutDate)).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

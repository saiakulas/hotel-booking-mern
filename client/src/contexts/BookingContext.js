import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/bookings/my');
      setBookings(response.data.bookings);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
      setBookings(prev => [response.data.booking, ...prev]);
      return { success: true, booking: response.data.booking };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create booking';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking,
    clearError
  }), [bookings, loading, error, fetchBookings, createBooking, cancelBooking, clearError]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

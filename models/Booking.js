const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Check-in date must be in the future'
    }
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(value) {
        return value > this.checkInDate;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  roomsBooked: {
    type: Number,
    required: [true, 'Number of rooms booked is required'],
    min: [1, 'Must book at least 1 room'],
    max: [10, 'Cannot book more than 10 rooms at once']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  guestInfo: {
    name: {
      type: String,
      required: [true, 'Guest name is required']
    },
    email: {
      type: String,
      required: [true, 'Guest email is required']
    },
    phone: {
      type: String,
      required: [true, 'Guest phone is required']
    }
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Virtual for number of nights
bookingSchema.virtual('numberOfNights').get(function() {
  const checkIn = new Date(this.checkInDate);
  const checkOut = new Date(this.checkOutDate);
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual for price per night
bookingSchema.virtual('pricePerNight').get(function() {
  return this.totalPrice / this.numberOfNights;
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Index for better query performance
bookingSchema.index({ userId: 1, checkInDate: -1 });
bookingSchema.index({ hotelId: 1, checkInDate: 1, checkOutDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

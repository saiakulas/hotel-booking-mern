const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
    maxlength: [100, 'Hotel name cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price cannot be negative']
  },
  totalRooms: {
    type: Number,
    required: [true, 'Total rooms is required'],
    min: [1, 'Hotel must have at least 1 room']
  },
  availableRooms: {
    type: Number,
    required: [true, 'Available rooms is required'],
    min: [0, 'Available rooms cannot be negative'],
    validate: {
      validator: function(value) {
        return value <= this.totalRooms;
      },
      message: 'Available rooms cannot exceed total rooms'
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for occupancy rate
hotelSchema.virtual('occupancyRate').get(function() {
  return ((this.totalRooms - this.availableRooms) / this.totalRooms * 100).toFixed(1);
});

// Ensure virtual fields are serialized
hotelSchema.set('toJSON', { virtuals: true });
hotelSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Hotel', hotelSchema);

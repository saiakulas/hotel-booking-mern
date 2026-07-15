const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings/my
// @desc    Get current user's bookings
// @access  Private
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { userId: req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('hotelId', 'name location images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBookings: total,
        hasNextPage: skip + bookings.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', [
  authMiddleware,
  body('hotelId').isMongoId().withMessage('Valid hotel ID is required'),
  body('checkInDate').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOutDate').isISO8601().withMessage('Valid check-out date is required'),
  body('roomsBooked').isInt({ min: 1, max: 10 }).withMessage('Rooms booked must be between 1 and 10'),
  body('guestInfo.name').trim().isLength({ min: 2 }).withMessage('Guest name is required'),
  body('guestInfo.email').isEmail().withMessage('Valid guest email is required'),
  body('guestInfo.phone').notEmpty().withMessage('Guest phone is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      hotelId,
      checkInDate,
      checkOutDate,
      roomsBooked,
      guestInfo,
      specialRequests
    } = req.body;

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();

    if (checkIn <= now) {
      return res.status(400).json({ message: 'Check-in date must be in the future' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check if hotel exists and has enough rooms
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    if (hotel.availableRooms < roomsBooked) {
      return res.status(400).json({ 
        message: `Only ${hotel.availableRooms} rooms available. Requested: ${roomsBooked}` 
      });
    }

    // Calculate total price
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = hotel.pricePerNight * numberOfNights * roomsBooked;

    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      hotelId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      roomsBooked,
      totalPrice,
      guestInfo,
      specialRequests
    });

    await booking.save();

    // Update hotel's available rooms
    hotel.availableRooms -= roomsBooked;
    await hotel.save();

    // Populate hotel info for response
    await booking.populate('hotelId', 'name location images');

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
      hotel: {
        id: hotel._id,
        name: hotel.name,
        availableRooms: hotel.availableRooms
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', [authMiddleware, param('id').isMongoId().withMessage('Invalid booking id')], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid booking id', errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled (not completed)
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Restore hotel's available rooms
    const hotel = await Hotel.findById(booking.hotelId);
    if (hotel) {
      hotel.availableRooms += booking.roomsBooked;
      await hotel.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking,
      hotel: hotel ? {
        id: hotel._id,
        name: hotel.name,
        availableRooms: hotel.availableRooms
      } : null
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
});

// Get all bookings (admin only) - placed BEFORE ":id" route to avoid path conflicts
router.get('/all', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('hotelId', 'name location')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/id/:id
// @desc    Get booking by ID
// @access  Private (only owner)
router.get('/id/:id', [authMiddleware, param('id').isMongoId().withMessage('Invalid booking id')], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid booking id', errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('hotelId', 'name location images amenities');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

module.exports = router;

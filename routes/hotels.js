const express = require('express');
const Hotel = require('../models/Hotel');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { param } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer setup for image uploads
const uploadsRoot = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsRoot);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `hotel-${uniqueSuffix}${ext}`);
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// @route   POST /api/hotels/upload
// @desc    Upload a hotel image (admin only)
// @access  Private
router.post('/upload', [authMiddleware, adminMiddleware], upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl, path: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Server error while uploading image' });
  }
});

// @route   GET /api/hotels
// @desc    Get all available hotels
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      search, 
      minPrice, 
      maxPrice, 
      location, 
      amenities,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    // For normal users: only show hotels with available rooms
    // For admins: show all hotels regardless of availability
    const filter = {};
    if (!req.user || req.user.role !== 'admin') {
      filter.availableRooms = { $gt: 0 };
    }

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = parseFloat(maxPrice);
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim());
      filter.amenities = { $in: amenitiesArray };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const hotels = await Hotel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews'); // Exclude reviews for performance

    // Get total count for pagination
    const total = await Hotel.countDocuments(filter);

    res.json({
      hotels,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalHotels: total,
        hasNextPage: skip + hotels.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ message: 'Server error while fetching hotels' });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get hotel by ID
// @access  Private
router.get('/:id', [authMiddleware, param('id').isMongoId().withMessage('Invalid hotel id')], async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid hotel id', errors: errors.array() });
    }

    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({ hotel });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ message: 'Server error while fetching hotel' });
  }
});

// Create new hotel (admin only)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name, location, description, pricePerNight, totalRooms, availableRooms, amenities, rating, images, image } = req.body;

    // Normalize images: accept either `image` (single URL) or `images` (array)
    let normalizedImages = [];
    if (Array.isArray(images)) {
      normalizedImages = images.filter(Boolean);
    } else if (typeof image === 'string' && image.trim() !== '') {
      normalizedImages = [image.trim()];
    }

    const hotel = new Hotel({
      name,
      location,
      description,
      pricePerNight,
      totalRooms,
      availableRooms,
      amenities,
      rating,
      images: normalizedImages
    });

    await hotel.save();
    res.status(201).json({ hotel });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update hotel (admin only)
router.put('/:id', [authMiddleware, adminMiddleware, param('id').isMongoId().withMessage('Invalid hotel id')], async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid hotel id', errors: errors.array() });
    }

    const { name, location, description, pricePerNight, totalRooms, availableRooms, amenities, rating, images, image } = req.body;

    // Normalize images: accept either `image` (single URL) or `images` (array)
    let normalizedImages = undefined;
    if (Array.isArray(images)) {
      normalizedImages = images.filter(Boolean);
    } else if (typeof image === 'string') {
      normalizedImages = image.trim() ? [image.trim()] : [];
    }

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        location, 
        description, 
        pricePerNight, 
        totalRooms, 
        availableRooms, 
        amenities, 
        rating,
        ...(normalizedImages !== undefined ? { images: normalizedImages } : {})
      },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({ hotel });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete hotel (admin only)
router.delete('/:id', [authMiddleware, adminMiddleware, param('id').isMongoId().withMessage('Invalid hotel id')], async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid hotel id', errors: errors.array() });
    }

    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fallback for accidental DELETE without id so it doesn't hit global 404
router.delete('/', [authMiddleware, adminMiddleware], (req, res) => {
  return res.status(400).json({ message: 'Hotel id is required in URL path' });
});

// Optional alias route to be extra tolerant if client calls /delete/:id
router.delete('/delete/:id', [authMiddleware, adminMiddleware, param('id').isMongoId().withMessage('Invalid hotel id')], async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid hotel id', errors: errors.array() });
    }

    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel (alias route):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

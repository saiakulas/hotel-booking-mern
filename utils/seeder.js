const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
require('dotenv').config();

const hotels = [
  {
    name: "Grand Plaza Hotel",
    location: "New York, NY",
    description: "Luxury hotel in the heart of Manhattan with stunning city views and world-class amenities.",
    pricePerNight: 299,
    totalRooms: 150,
    availableRooms: 45,
    amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Room Service", "Concierge"],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
    rating: 4.5
  },
  {
    name: "Oceanview Resort",
    location: "Miami Beach, FL",
    description: "Beachfront resort with private beach access, multiple pools, and tropical gardens.",
    pricePerNight: 199,
    totalRooms: 200,
    availableRooms: 78,
    amenities: ["Private Beach", "Multiple Pools", "Spa", "Tennis Courts", "Restaurant", "Bar"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
    rating: 4.3
  },
  {
    name: "Mountain Lodge",
    location: "Aspen, CO",
    description: "Cozy mountain lodge with ski-in/ski-out access and rustic luxury accommodations.",
    pricePerNight: 399,
    totalRooms: 80,
    availableRooms: 25,
    amenities: ["Ski-in/Ski-out", "Hot Tub", "Fireplace", "Restaurant", "Spa", "Gym"],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
    rating: 4.7
  },
  {
    name: "Urban Boutique Hotel",
    location: "San Francisco, CA",
    description: "Modern boutique hotel in the trendy Mission District with rooftop bar and city views.",
    pricePerNight: 179,
    totalRooms: 60,
    availableRooms: 22,
    amenities: ["Rooftop Bar", "Free WiFi", "Coffee Shop", "Bike Rental", "Concierge"],
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"],
    rating: 4.2
  },
  {
    name: "Historic Inn",
    location: "Charleston, SC",
    description: "Charming historic inn with southern hospitality and period architecture.",
    pricePerNight: 159,
    totalRooms: 40,
    availableRooms: 15,
    amenities: ["Historic Building", "Garden", "Breakfast Included", "Free WiFi", "Parking"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
    rating: 4.4
  },
  {
    name: "Desert Oasis Resort",
    location: "Phoenix, AZ",
    description: "Luxury desert resort with golf course, spa, and stunning mountain views.",
    pricePerNight: 249,
    totalRooms: 120,
    availableRooms: 38,
    amenities: ["Golf Course", "Spa", "Pool", "Tennis Courts", "Restaurant", "Bar"],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
    rating: 4.6
  },
  {
    name: "City Center Hotel",
    location: "Chicago, IL",
    description: "Modern hotel in the Loop with easy access to shopping, dining, and attractions.",
    pricePerNight: 189,
    totalRooms: 180,
    availableRooms: 65,
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Business Center", "Concierge"],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
    rating: 4.1
  },
  {
    name: "Seaside Villa",
    location: "Malibu, CA",
    description: "Exclusive beachfront villa with private beach access and ocean views.",
    pricePerNight: 599,
    totalRooms: 25,
    availableRooms: 8,
    amenities: ["Private Beach", "Ocean View", "Pool", "Spa", "Private Chef", "Butler Service"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
    rating: 4.8
  }
];

const adminUser = {
  name: "Admin User",
  email: "admin@hotelbooking.com",
  password: "admin123",
  role: "admin"
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Hotel.deleteMany({});
    await User.deleteMany({ email: adminUser.email });

    console.log('Cleared existing data');

    // Insert hotels
    const createdHotels = await Hotel.insertMany(hotels);
    console.log(`Inserted ${createdHotels.length} hotels`);

    // Create admin user
    const admin = new User(adminUser);
    await admin.save();
    console.log('Created admin user');

    console.log('Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@hotelbooking.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };

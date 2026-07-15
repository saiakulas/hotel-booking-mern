# Hotel Booking System - MERN Stack

A full-stack hotel booking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time room availability updates, user authentication, and modern SaaS-style UI.

## Features

### Backend Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Hotel Management**: CRUD operations for hotels with amenities and room tracking
- **Booking System**: Create, view, and cancel bookings with real-time room updates
- **Database Seeding**: Pre-populated with sample hotels and admin user
- **Input Validation**: Server-side validation using express-validator
- **Security**: Helmet middleware, CORS configuration, and secure headers

### Frontend Features

- **Responsive Design**: Modern SaaS-style UI with Tailwind CSS
- **User Authentication**: Login/Register pages with form validation
- **Hotel Browsing**: Search, filter, and sort hotels with real-time availability
- **Booking Management**: View bookings with cancel functionality
- **Real-time Updates**: Immediate UI updates when bookings are made/cancelled
- **Date Pickers**: Interactive date selection for check-in/check-out
- **Amenity Icons**: Visual representation of hotel amenities

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger

### Frontend

- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **react-datepicker** - Date selection component
- **react-icons** - Icon library
- **React Context** - State management

## Project Structure

```
HOTEL-BOOKING/
├── server.js                 # Backend entry point
├── .env                      # Environment variables
├── package.json              # Backend dependencies
├── seeder.js                 # Database seeder
├── models/                   # Mongoose schemas
│   ├── User.js
│   ├── Hotel.js
│   └── Booking.js
├── routes/                   # API routes
│   ├── auth.js
│   ├── hotels.js
│   └── bookings.js
├── middleware/               # Custom middleware
│   └── auth.js
└── client/                   # React frontend
    ├── package.json
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── contexts/
    │   │   ├── AuthContext.js
    │   │   └── BookingContext.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── PrivateRoute.js
    │   └── pages/
    │       ├── Login.js
    │       ├── Register.js
    │       ├── HotelList.js
    │       └── MyBookings.js
    └── tailwind.config.js
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```
   MONGODB_URI=mongodb://localhost:27017/hotel-booking
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system or update the MONGODB_URI to point to your MongoDB instance.

4. **Seed the database**

   ```bash
   npm run seed
   ```

5. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the React development server**
   ```bash
   npm start
   ```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Hotels

- `GET /api/hotels` - Get all hotels (with search, filter, sort, pagination)
- `GET /api/hotels/:id` - Get single hotel by ID

### Bookings

- `GET /api/bookings/my` - Get current user's bookings
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:id` - Cancel a booking
- `GET /api/bookings/:id` - Get single booking by ID

## Default Admin User

After running the seeder, you can login with:

- **Email**: admin@hotelbooking.com
- **Password**: admin123

## Features in Detail

### Real-time Room Updates

When a booking is made, the available rooms count is immediately reduced in the database and reflected in the UI without page reload.

### Search and Filter

- Search hotels by name or location
- Filter by price range
- Sort by name, price, or rating
- Pagination support

### Booking Management

- View all bookings with status indicators
- Cancel upcoming bookings
- See booking details including guest info and special requests
- Booking summary statistics

### Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet

### Responsive Design

- Mobile-first approach
- Modern SaaS-style UI
- Smooth animations and transitions
- Accessible design patterns

## Development

### Running in Development Mode

```bash
# Backend (with auto-restart)
npm run dev

# Frontend (with hot reload)
cd client && npm start
```

### Database Seeding

The seeder creates:

- 8 sample hotels with various amenities
- 1 admin user for testing
- Realistic pricing and room availability

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port (default: 5000)
- `NODE_ENV`: Environment mode

## Deployment

### Backend Deployment

1. Set up MongoDB (Atlas recommended for production)
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or Vercel

### Frontend Deployment

1. Update API endpoints to production URLs
2. Build the React app: `npm run build`
3. Deploy to platforms like Vercel, Netlify, or AWS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

# SimpleReads - Book Review Community Platform

## Project Overview

SimpleReads is a Node.js and Express-based book review community platform that provides readers with a space to discover, review, and share great books. The platform integrates with Google Books API to provide comprehensive book information and creates a social environment for book enthusiasts.

## Core Features

### User System
- **Three User Roles**: Reader, Writer, Admin
- **Authentication**: Complete signup/signin system with session management
- **Profile Management**: Comprehensive user profiles with statistics
- **Permission Control**: Role-based access control for different features

### Book Review System
- **Google Books Integration**: Search and retrieve book information
- **Review Publishing**: Users can write detailed book reviews with ratings (1-5 stars)
- **Professional Recognition**: Writer users get special badges and can showcase expertise areas
- **Review Management**: Full CRUD operations for reviews

### Social Features
- **Favorites System**: Users can favorite books they love
- **Follow System**: Follow other users to see their reviews
- **Personalized Feed**: Get reviews from followed users
- **Engagement Tracking**: Track popular books by review and favorite counts

### Administrative Features
- **User Management**: Admin can manage all user accounts
- **Content Moderation**: Admins can manage reviews and user content
- **Analytics**: View platform statistics and user engagement

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Primary database with Mongoose ODM
- **ES6+ JavaScript** - Modern JavaScript features

### Authentication & Security
- **Express Session** - Session management
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing
- **bcrypt** - Password hashing (ready for implementation)

### External APIs
- **Google Books API** - Book information and search functionality
- **Axios** - HTTP client for API requests

### Development Tools
- **Nodemon** - Development auto-restart
- **Git** - Version control

## Project Structure

```
simplereads-node-server-app/
├── Books/                  # Book module
│   ├── dao.js             # Database access layer
│   ├── model.js           # MongoDB model
│   ├── routes.js          # API routes
│   ├── schema.js          # Database schema
│   └── service.js         # Business logic & Google Books API integration
├── Users/                  # User module
│   ├── dao.js             # User data access
│   ├── model.js           # User MongoDB model
│   ├── routes.js          # User API routes
│   └── schema.js          # User schema
├── Reviews/                # Review module
│   ├── dao.js             # Review data access
│   ├── model.js           # Review MongoDB model
│   ├── routes.js          # Review API routes
│   └── schema.js          # Review schema
├── Favorites/              # Favorites module
│   ├── dao.js             # Favorites data access
│   ├── model.js           # Favorites MongoDB model
│   ├── routes.js          # Favorites API routes
│   └── schema.js          # Favorites schema
├── Follows/                # Follow system module
│   ├── dao.js             # Follow data access
│   ├── model.js           # Follow MongoDB model
│   ├── routes.js          # Follow API routes
│   └── schema.js          # Follow schema
├── Home/                   # Home page content
│   └── routes.js          # Home API routes
├── Database/               # Static data & utilities (development)
│   ├── users.js           # Sample user data
│   ├── books.js           # Sample book data
│   ├── reviews.js         # Sample review data
│   ├── favorites.js       # Sample favorites data
│   ├── follows.js         # Sample follows data
│   ├── utils.js           # Data utility functions
│   └── index.js           # Data export
├── index.js               # Application entry point
├── seed-database.js       # Database seeding script
├── test-*.js              # Various test scripts
└── package.json           # Project configuration
```

## Data Models

### User Schema
```javascript
{
  _id: String,              // Unique user ID
  username: String,         // Unique username
  email: String,            // Unique email
  password: String,         // Hashed password
  role: String,             // 'reader', 'writer', 'admin'
  avatar: String,           // Avatar image URL
  bio: String,              // User biography
  writerBadge: Boolean,     // Professional writer badge
  expertise: [String],      // Areas of expertise (writers only)
  createdAt: Date,          // Account creation date
  lastLoginAt: Date         // Last login timestamp
}
```

### Book Schema
```javascript
{
  _id: String,              // Google Books ID
  googleId: String,         // Google Books API identifier
  title: String,            // Book title
  authors: [String],        // List of authors
  thumbnail: String,        // Cover image URL
  description: String,      // Book description
  publishedDate: String,    // Publication date
  categories: [String],     // Book categories/genres
  pageCount: Number,        // Number of pages
  language: String,         // Book language
  // ... additional Google Books fields
  viewCount: Number,        // Internal view tracking
  favoriteCount: Number,    // Internal favorite count
  internalRating: Number,   // Average rating from reviews
  createdAt: Date,          // Record creation date
  updatedAt: Date           // Last update timestamp
}
```

### Review Schema
```javascript
{
  _id: String,              // Review ID
  book: String,             // Book Google ID (reference)
  user: String,             // User ID (reference)
  rating: Number,           // Rating (1-5)
  title: String,            // Review title
  content: String,          // Review content
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Last update timestamp
}
```

### Favorite Schema
```javascript
{
  _id: String,              // Favorite record ID
  user: String,             // User ID (reference)
  book: String,             // Book Google ID (reference)
  addedAt: Date             // Favorite timestamp
}
```

### Follow Schema
```javascript
{
  _id: String,              // Follow record ID
  follower: String,         // Follower user ID
  following: String,        // Following user ID
  createdAt: Date           // Follow timestamp
}
```

## API Endpoints

### Authentication Routes
- `POST /api/users/signup` - User registration
- `POST /api/users/signin` - User login
- `POST /api/users/signout` - User logout
- `GET /api/profile` - Get current user profile

### User Management Routes
- `GET /api/profile/:userId` - Get user profile by ID
- `PUT /api/profile` - Update own profile
- `GET /api/users` - Get all users (with filters)
- `GET /api/profile/:userId/reviews` - Get user's reviews
- `GET /api/profile/:userId/favorites` - Get user's favorites
- `GET /api/profile/:userId/following` - Get user's following list
- `GET /api/profile/:userId/followers` - Get user's followers

### Book Routes
- `GET /api/books/search?q={query}` - Search books
- `GET /api/books/:googleId` - Get book details
- `GET /api/books/author/:authorName` - Search books by author
- `GET /api/books/category/:categoryName` - Search books by category
- `GET /api/books/top-engagement` - Get popular books
- `GET /api/books/help` - API documentation

### Review Routes
- `POST /api/reviews` - Create review
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `GET /api/reviews/user/:userId` - Get reviews by user
- `GET /api/reviews/random` - Get random reviews (homepage)
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Social Features
- `POST /api/favorites/:bookId` - Add book to favorites
- `DELETE /api/favorites/:bookId` - Remove from favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/follow/:userId` - Follow user
- `DELETE /api/follow/:userId` - Unfollow user
- `GET /api/following` - Get following list
- `GET /api/followers` - Get followers list

### Home & Content Routes
- `GET /api/home` - Get personalized home content
- `GET /api/home/trending` - Get trending books
- `GET /api/home/credits` - Get project credits
- `GET /api/health` - Server health check

### Admin Routes (Admin Only)
- `GET /api/admin/reviews` - Get all reviews
- `DELETE /api/admin/users/:userId` - Delete user
- `PUT /api/admin/users/:userId` - Update any user

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/SujieZong/simple-reads-node-server-app.git
cd simple-reads-node-server-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env file with your configuration:
# MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/simplereads
# SESSION_SECRET=your-secret-key
# NETLIFY_URL=http://localhost:5173 (for frontend)
```

4. **Database Setup**
```bash
# Seed the database with sample data
npm run seed
```

5. **Start the server**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

6. **Verify installation**
```bash
# Test database connectivity
node test-database.js

# Test API endpoints
node test-api.js

# Test Books API specifically
node test-books-api.js
```

## Development Features

### Database Seeding
The project includes comprehensive sample data:
- 8 users across all roles (readers, writers, admin)
- Sample books from Google Books API
- 10 sample reviews with realistic content
- Follow relationships between users
- Favorite books for each user

### Testing Scripts
- `test-database.js` - Tests database operations and permissions
- `test-api.js` - Basic API endpoint testing
- `test-books-api.js` - Comprehensive Books API testing

### Error Handling
- Comprehensive error handling across all routes
- Graceful API failures with fallback mechanisms
- User-friendly error messages
- Detailed logging for debugging

## Deployment Considerations

### Environment Variables
```bash
MONGO_CONNECTION_STRING=your-mongodb-connection
SESSION_SECRET=strong-session-secret
NETLIFY_URL=your-frontend-url
NODE_ENV=production
PORT=4000
NODE_SERVER_DOMAIN=your-domain
```

### Production Optimizations
- Session configuration for production environment
- CORS configuration for frontend deployment
- MongoDB connection optimization
- Error handling and logging

## Integration with Frontend

This server is designed to work with the SimpleReads React frontend:
- **React Repository**: https://github.com/Nimodipine/simple-reads-react-server-app.git
- **CORS configured** for seamless frontend integration
- **Session-based authentication** maintained across requests
- **RESTful API design** for easy frontend consumption

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## Course Information

**Course**: CS5610 Web Development Summer2 2025  
**Authors**: Wei-Yun Feng, Sujie Zong  
**License**: ISC  

## Links

- **Node Server Repository**: https://github.com/SujieZong/simple-reads-node-server-app.git
- **React Frontend Repository**: https://github.com/Nimodipine/simple-reads-react-server-app.git

---

*SimpleReads - Building a community around the love of reading* 📚
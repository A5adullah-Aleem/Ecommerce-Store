# AWAIS CLOTH HOUSE - Backend Setup Guide

## Overview
This is a full-stack Next.js application with MongoDB integration. The backend uses Next.js API routes and Mongoose for database operations.

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## Environment Setup

### 1. Environment Variables
Create a `.env.local` file in the root directory with:

\`\`\`env
MONGODB_URI=mongodb+srv://saudshahid646_db_user:saud123@cluster0.hajypgv.mongodb.net/?appName=Cluster0
NEXT_PUBLIC_API_URL=/api
JWT_SECRET=your-secret-key-change-in-production
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

## Database Setup

### 1. Seed Initial Data
The project includes sample products and collections. To populate the database:

\`\`\`bash
npm run seed
\`\`\`

This will:
- Connect to MongoDB
- Clear existing data
- Insert 6 sample products
- Insert 5 sample collections

### 2. Verify Connection
Visit `http://localhost:3000/api-test` to run connection tests

## Running the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`

The application will start on `http://localhost:3000`

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/[id]` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Collections
- `GET /api/collections` - Get all collections
- `GET /api/collections/[id]` - Get collection by ID
- `POST /api/collections` - Create collection
- `PUT /api/collections/[id]` - Update collection
- `DELETE /api/collections/[id]` - Delete collection

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order by ID
- `PUT /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Delete order

### Contact
- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Submit contact form

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration

### Health Check
- `GET /api/health` - Check backend and database connection
- `GET /api/test` - Test endpoint

## Database Models

### Product
\`\`\`typescript
{
  name: string
  description: string
  price: number
  image: string
  category: "women" | "men" | "kids"
  collection: string
  type: "stitched" | "unstitched"
  inStock: boolean
  sizes: string[]
  colors: string[]
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Collection
\`\`\`typescript
{
  name: string
  description: string
  image: string
  type: "stitched" | "unstitched" | "seasonal"
  productCount: number
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Order
\`\`\`typescript
{
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  items: Array<{
    productId: ObjectId
    productName: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Contact
\`\`\`typescript
{
  name: string
  email: string
  phone: string
  message: string
  status: "new" | "read" | "replied"
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Admin
\`\`\`typescript
{
  email: string
  password: string (hashed)
  name: string
  role: "admin" | "superadmin"
  createdAt: Date
  updatedAt: Date
}
\`\`\`

## Testing the Backend

### Using the API Test Page
1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/api-test`
3. Click "Run Tests" to verify all connections

### Using cURL
\`\`\`bash
# Health check
curl http://localhost:3000/api/health

# Get products
curl http://localhost:3000/api/products

# Get collections
curl http://localhost:3000/api/collections
\`\`\`

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB URI in `.env.local`
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure network connectivity to MongoDB

### API Routes Not Found
- Verify files are in `/app/api/` directory
- Check file naming follows Next.js conventions
- Restart development server after adding new routes

### Seed Script Fails
- Ensure MongoDB is connected
- Check `.env.local` has correct MongoDB URI
- Clear existing data if conflicts occur

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong secret key for JWT tokens
- `NEXT_PUBLIC_API_URL` - Production API URL

## Support
For issues or questions, check the API test page or review the console logs for detailed error messages.

# AWAIS CLOTH HOUSE - Complete Backend Implementation

## Project Structure

\`\`\`
awais-cloth-house/
├── app/
│   ├── api/
│   │   ├── health/route.ts          # Health check endpoint
│   │   ├── test/route.ts            # Test endpoint
│   │   ├── products/
│   │   │   ├── route.ts             # GET/POST products
│   │   │   └── [id]/route.ts        # GET/PUT/DELETE product
│   │   ├── collections/
│   │   │   ├── route.ts             # GET/POST collections
│   │   │   └── [id]/route.ts        # GET/PUT/DELETE collection
│   │   ├── orders/
│   │   │   ├── route.ts             # GET/POST orders
│   │   │   └── [id]/route.ts        # GET/PUT/DELETE order
│   │   ├── contact/route.ts         # GET/POST contact messages
│   │   └── auth/
│   │       ├── login/route.ts       # Admin login
│   │       └── register/route.ts    # Admin registration
│   ├── api-test/page.tsx            # Frontend test page
│   └── layout.tsx
├── lib/
│   ├── db.ts                        # MongoDB connection
│   ├── api-client.ts                # Frontend API client
│   ├── models/
│   │   ├── Product.ts               # Product schema
│   │   ├── Collection.ts            # Collection schema
│   │   ├── Order.ts                 # Order schema
│   │   ├── Contact.ts               # Contact schema
│   │   └── Admin.ts                 # Admin schema
│   └── dummy-data.ts                # Sample data
├── scripts/
│   └── seed.ts                      # Database seeding script
├── .env.local                       # Environment variables
└── package.json
\`\`\`

## Complete API Routes

### 1. Health Check
**Endpoint:** `GET /api/health`
**Purpose:** Verify backend and MongoDB connection
**Response:**
\`\`\`json
{
  "status": "ok",
  "message": "Backend is running and MongoDB is connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

### 2. Test Endpoint
**Endpoint:** `GET /api/test`
**Purpose:** Test basic endpoint functionality
**Response:**
\`\`\`json
{
  "success": true,
  "message": "Test endpoint working correctly",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "status": "Backend is running",
    "apiUrl": "/api"
  }
}
\`\`\`

### 3. Products API

#### Get All Products
**Endpoint:** `GET /api/products?type=stitched&collection=Traditional`
**Query Parameters:**
- `type` (optional): "stitched" or "unstitched"
- `collection` (optional): Collection name

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Elegant Stitched Saree",
      "description": "Beautiful hand-embroidered stitched saree",
      "price": 4999,
      "image": "/elegant-stitched-saree.jpg",
      "category": "women",
      "collection": "Traditional",
      "type": "stitched",
      "inStock": true,
      "sizes": ["Free Size"],
      "colors": ["Red", "Blue", "Green"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
\`\`\`

#### Get Single Product
**Endpoint:** `GET /api/products/[id]`
**Response:** Single product object

#### Create Product
**Endpoint:** `POST /api/products`
**Body:**
\`\`\`json
{
  "name": "New Product",
  "description": "Product description",
  "price": 2999,
  "image": "/image.jpg",
  "category": "women",
  "collection": "Casual",
  "type": "stitched",
  "inStock": true,
  "sizes": ["S", "M", "L"],
  "colors": ["Red", "Blue"]
}
\`\`\`

#### Update Product
**Endpoint:** `PUT /api/products/[id]`
**Body:** Same as create (partial updates supported)

#### Delete Product
**Endpoint:** `DELETE /api/products/[id]`

### 4. Collections API

#### Get All Collections
**Endpoint:** `GET /api/collections`
**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Traditional Collection",
      "description": "Timeless traditional designs",
      "image": "/traditional-collection.jpg",
      "type": "stitched",
      "productCount": 2,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
\`\`\`

#### Get Single Collection
**Endpoint:** `GET /api/collections/[id]`

#### Create Collection
**Endpoint:** `POST /api/collections`
**Body:**
\`\`\`json
{
  "name": "New Collection",
  "description": "Collection description",
  "image": "/collection.jpg",
  "type": "stitched",
  "productCount": 0
}
\`\`\`

#### Update Collection
**Endpoint:** `PUT /api/collections/[id]`

#### Delete Collection
**Endpoint:** `DELETE /api/collections/[id]`

### 5. Orders API

#### Get All Orders
**Endpoint:** `GET /api/orders`
**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "customerName": "John Doe",
      "email": "john@example.com",
      "phone": "+92300000000",
      "address": "123 Main St",
      "city": "Karachi",
      "postalCode": "75000",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439011",
          "productName": "Elegant Stitched Saree",
          "quantity": 1,
          "price": 4999
        }
      ],
      "totalAmount": 4999,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
\`\`\`

#### Create Order
**Endpoint:** `POST /api/orders`
**Body:**
\`\`\`json
{
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "+92300000000",
  "address": "123 Main St",
  "city": "Karachi",
  "postalCode": "75000",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Elegant Stitched Saree",
      "quantity": 1,
      "price": 4999
    }
  ],
  "totalAmount": 4999
}
\`\`\`

#### Get Single Order
**Endpoint:** `GET /api/orders/[id]`

#### Update Order
**Endpoint:** `PUT /api/orders/[id]`
**Body:**
\`\`\`json
{
  "status": "shipped"
}
\`\`\`

#### Delete Order
**Endpoint:** `DELETE /api/orders/[id]`

### 6. Contact API

#### Get All Messages
**Endpoint:** `GET /api/contact`
**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+92300000001",
      "message": "I would like to inquire about your products",
      "status": "new",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
\`\`\`

#### Submit Contact Form
**Endpoint:** `POST /api/contact`
**Body:**
\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+92300000001",
  "message": "I would like to inquire about your products"
}
\`\`\`

### 7. Authentication API

#### Admin Login
**Endpoint:** `POST /api/auth/login`
**Body:**
\`\`\`json
{
  "email": "admin@example.com",
  "password": "password123"
}
\`\`\`
**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "507f1f77bcf86cd799439015",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    }
  }
}
\`\`\`

#### Admin Register
**Endpoint:** `POST /api/auth/register`
**Body:**
\`\`\`json
{
  "email": "newadmin@example.com",
  "password": "password123",
  "name": "New Admin"
}
\`\`\`
**Response:** Same as login

## Database Models

### Product Schema
\`\`\`typescript
{
  name: String (required),
  description: String (required),
  price: Number (required, min: 0),
  image: String (required),
  category: String (enum: ["women", "men", "kids"], default: "women"),
  collection: String (required),
  type: String (enum: ["stitched", "unstitched"], required),
  inStock: Boolean (default: true),
  sizes: [String] (default: ["XS", "S", "M", "L", "XL", "XXL"]),
  colors: [String] (default: []),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Collection Schema
\`\`\`typescript
{
  name: String (required),
  description: String (required),
  image: String (required),
  type: String (enum: ["stitched", "unstitched", "seasonal"], required),
  productCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Order Schema
\`\`\`typescript
{
  customerName: String (required),
  email: String (required),
  phone: String (required),
  address: String (required),
  city: String,
  postalCode: String,
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number (required),
  status: String (enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending"),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Contact Schema
\`\`\`typescript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  message: String (required),
  status: String (enum: ["new", "read", "replied"], default: "new"),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Admin Schema
\`\`\`typescript
{
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  name: String,
  role: String (enum: ["admin", "superadmin"], default: "admin"),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Frontend Integration

### API Client Usage
\`\`\`typescript
import { apiClient } from "@/lib/api-client"

// Get products
const products = await apiClient.getProducts({ type: "stitched" })

// Create order
const order = await apiClient.createOrder(orderData)

// Admin login
const auth = await apiClient.adminLogin("admin@example.com", "password")

// Submit contact form
const contact = await apiClient.submitContact(contactData)
\`\`\`

## Error Handling

All API endpoints return consistent error responses:
\`\`\`json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
\`\`\`

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Security Features

1. **Password Hashing:** Admin passwords are hashed using bcryptjs
2. **JWT Authentication:** Tokens expire in 7 days
3. **Input Validation:** All inputs validated against schemas
4. **Error Messages:** Generic error messages to prevent information leakage
5. **MongoDB Connection:** Cached to prevent connection leaks

## Performance Optimizations

1. **Connection Caching:** MongoDB connections are cached globally
2. **Query Sorting:** Products and collections sorted by creation date
3. **Filtering:** Query parameters for efficient filtering
4. **Indexing:** MongoDB indexes on frequently queried fields

## Testing

Visit `http://localhost:3000/api-test` to run automated tests for:
- Backend health check
- Test endpoint
- Products API
- Collections API

## Deployment Checklist

- [ ] Update `.env.local` with production MongoDB URI
- [ ] Change JWT_SECRET to a strong random string
- [ ] Update NEXT_PUBLIC_API_URL for production domain
- [ ] Run `npm run build` to verify build succeeds
- [ ] Test all API endpoints in production
- [ ] Set up monitoring and logging
- [ ] Configure CORS if needed for external APIs

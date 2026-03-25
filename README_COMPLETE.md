# 🍕 Foodie Hub - Complete Food Ordering Application

> A modern, full-stack food ordering web application similar to Swiggy/Zomato built with React, Node.js, MongoDB, and JWT authentication.

## 📸 Features

### 👤 User Features
- ✅ **Authentication** - Register, Login, Logout with JWT
- ✅ **Browse Restaurants** - View all products with categories and filters
- ✅ **Search Functionality** - Search by product name or description
- ✅ **Product Details** - View detailed information about products
- ✅ **Shopping Cart** - Add/remove/update items with persistent storage
- ✅ **Checkout** - Order placement with delivery address
- ✅ **Order Tracking** - View order history and status
- ✅ **User Profile** - Manage profile, addresses, preferences
- ✅ **Responsive Design** - Works seamlessly on all devices

### 👨‍💼 Admin Features
- ✅ **Admin Dashboard** - Overview of sales, orders, users
- ✅ **Product Management** - Add, Edit, Delete products
- ✅ **Order Management** - Update order status, track deliveries
- ✅ **User Management** - View users, block/unblock accounts
- ✅ **Analytics** - Revenue, order counts, statistics

---

## 🏗️ Tech Stack

### Frontend
- **React.js** (Vite) - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **Node.js** - Build tool

### Backend
- **Node.js + Express.js** - Server framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

---

## 📋 Architecture

```
Foodie-Hub/
├── Frontend/                 # React Vite app
│   ├── src/
│   │   ├── api/             # API configuration
│   │   ├── context/         # Auth & Cart contexts
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   └── package.json
│
└── Backend/                  # Node/Express API
    ├── models/              # MongoDB schemas
    ├── controllers/         # Request handlers
    ├── routes/             # API routes
    ├── middlewares/        # Auth, error handling
    ├── config/            # Configuration
    ├── services/          # Business logic
    ├── app.js             # Express server
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup Backend

```bash
cd Backend
npm install
```

Create `.env` file:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=FoodieHub
JWT_SECRET=your_secret_key_min_32_chars
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Run backend:
```bash
npm start
# Server runs on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd Frontend
npm install
```

Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Authentication

### JWT Flow
1. User registers → Password hashed with bcrypt → JWT token sent
2. Token stored in localStorage
3. Token sent with each API request (Authorization header)
4. Backend verifies token with JWT secret
5. Unauthorized requests redirected to login

### Protected Routes
- `/cart` - Requires authentication
- `/checkout` - Requires authentication
- `/orders` - Requires authentication
- `/profile` - Requires authentication
- `/admin` - Requires admin role

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/me             - Get current user
```

### Products
```
GET    /api/products            - List all products
GET    /api/products/:id        - Get product details
GET    /api/products/category/:cat - Products by category
GET    /api/products/featured   - Featured products
POST   /api/products            - Create product (Admin)
PUT    /api/products/:id        - Update product (Admin)
DELETE /api/products/:id        - Delete product (Admin)
```

### Cart
```
GET    /api/cart                - Get user cart
POST   /api/cart/add            - Add item to cart
DELETE /api/cart/remove/:id     - Remove item
PUT    /api/cart/update/:id     - Update quantity
DELETE /api/cart/clear          - Clear cart
```

### Orders
```
POST   /api/orders/place-order  - Place new order
GET    /api/orders              - Get user orders
GET    /api/orders/:id          - Get order details
PUT    /api/orders/:id/cancel   - Cancel order
GET    /api/admin/orders        - All orders (Admin)
PUT    /api/admin/orders/:id/status - Update status (Admin)
```

### Users (Admin)
```
GET    /api/admin/users         - All users
PUT    /api/admin/users/:id/block - Block/Unblock user
DELETE /api/admin/users/:id      - Delete user
```

---

## 💾 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: "user" || "admin",
  profilePic: String,
  addresses: Array,
  isActive: Boolean,
  isBlocked: Boolean,
  createdAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: String,
  image: String,
  rating: Number,
  reviews: Array,
  stock: Number,
  isAvailable: Boolean,
  preparationTime: Number,
  isSpicy: Boolean,
  isVegetarian: Boolean,
  createdAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    productName: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  deliveryFee: Number,
  tax: Number,
  finalAmount: Number,
  deliveryAddress: Object,
  status: "Pending|Confirmed|Preparing|Ready|Out for Delivery|Delivered|Cancelled",
  paymentStatus: "Pending|Completed|Failed|Refunded",
  paymentMethod: String,
  createdAt: Date
}
```

### Cart Model
```javascript
{
  user: ObjectId (unique),
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalItems: Number,
  totalPrice: Number,
  updatedAt: Date
}
```

---

## 🎯 Sample Data Creation

Add sample products via API:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato, mozzarella, and basil",
    "price": 299,
    "category": "Non-Veg",
    "image": "https://via.placeholder.com/400",
    "stock": 50,
    "isVegetarian": true,
    "preparationTime": 30
  }'
```

---

## 🔒 Security Features

✅ Password hashing with bcryptjs  
✅ JWT authentication  
✅ CORS protection  
✅ Environment variables for secrets  
✅ Input validation  
✅ Error handling  
✅ Role-based access control  
✅ Protected API routes  

---

## 🧪 Testing

### Backend Testing
```bash
# Test health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Frontend Testing
1. Open http://localhost:5173
2. Sign up with test account
3. Browse products
4. Add to cart
5. Checkout
6. Track orders

---

## 📦 Deployment

### Deploy Backend (Heroku/Railway)

```bash
# .env for production
MONGO_URL=your_mongodb_uri
JWT_SECRET=strong_secret_here
NODE_ENV=production
CLIENT_URL=your_frontend_url
```

### Deploy Frontend (Vercel/Netlify)

```bash
cd Frontend
npm run build
# Deploy build folder
```

### Environment Variables (Production)
- Use strong JWT secrets
- Use MongoDB Atlas for database
- Set secure CORS origins
- Enable HTTPS

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
✅ Check connection string in .env
✅ Ensure MongoDB is running
✅ Check network access in MongoDB Atlas
```

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Frontend Issues

**API requests 404:**
```
✅ Check VITE_API_URL in .env.local
✅ Ensure backend is running
✅ Check CORS settings
```

**Context Provider Error:**
```
✅ Ensure AuthProvider wraps entire app
✅ Check context imports
```

---

## 📝 Code Examples

### Adding Product to Cart (Frontend)
```javascript
const { addToCart } =useCart();

const handleAddToCart = async () => {
  try {
    await addToCart(productId, quantity);
    toast.success("Added to cart!");
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Protected API Endpoint (Backend)
```javascript
router.post("/orders/place-order", protect, placeOrder);

const placeOrder = asyncHandler(async (req, res) => {
  const { deliveryAddress, paymentMethod } = req.body;
  // Only authenticated users can access
  const order = await Order.create({
    user: req.user.id,
    // ...
  });
  res.status(201).json({ success: true, order });
});
```

---

## 🎓 Learning Resources

- [JWT Authentication](https://jwt.io)
- [MongoDB Mongoose](https://mongoosejs.com)
- [React Context API](https://react.dev/reference/react/useContext)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 👨‍💻 Author

**Foodie Hub Team**
- GitHub: [@coder-nik200](https://github.com/coder-nik200)
- Email: info@foodiehub.com

---

## 🙏 Support

If you found this project helpful, please ⭐ star it!

---

**Made with ❤️ for food lovers everywhere** 🍕🍔🍜

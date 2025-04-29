require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Stripe API key

// Import Models
const EmployeeModel = require("./models/Employee");
const ServiceProvider = require("./models/ServiceProvider");
const Product = require("./models/Product");
const Purchase = require("./models/Purchase");
const Cart = require("./models/Cart");
const Admin = require("./models/Admin");
const Payment = require("./models/Payment");
const adminRoutes = require("./routes/AdminRoutes");

// Import Routes
const paymentRoutes = require("./routes/payment");
const serviceProviderRoutes = require("./routes/serviceProviderRoutes");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product"); // ✅ Fix this import
const userRoutes = require("./routes/user"); // ✅ Fix this import


const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve images
app.use("/api/products", productRoutes); // Corrected route
app.use("/api/user", userRoutes); // Corrected route
app.use("/api/admin", adminRoutes);

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/employeeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

/** 🔹 Middleware: Verify JWT Token */
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "⚠ Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "🚨 Invalid Token" });
  }
};

/** 🔹 User Registration */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new EmployeeModel({ name, email, password: hashedPassword });
    await newEmployee.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Error during signup:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 🔹 User Sign-In */
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const employee = await EmployeeModel.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: employee._id, email: employee.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: employee._id, name: employee.name, email: employee.email },
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use("/api", serviceProviderRoutes);
app.post("/api/register-service-provider", async (req, res) => {
  try {
    const { name, email, phone, location, serviceType, experience, description } = req.body;

    if (!name || !email || !phone || !location || !serviceType) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const existingProvider = await ServiceProvider.findOne({ email });
    if (existingProvider) {
      return res.status(409).json({ message: "A provider with this email already exists." });
    }

    const newProvider = new ServiceProvider({ name, email, phone, location, serviceType, experience, description });
    await newProvider.save();

    res.status(201).json({ message: "Service Provider registered successfully!" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/service-providers", async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    res.json(providers);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});
app.post("/api/book-service", async (req, res) => {
  try {
    const { providerId, providerEmail, userEmail } = req.body;
    console.log(`Service booked with ${providerEmail} by ${userEmail}`);
    res.json({ message: "Service booked successfully!" });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Booking failed", error });
  }
});



app.get("/api/profile", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT token
    const user = await EmployeeModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      address: user.address || "No address available",
      cart: user.cart || [],
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});







app.get("/api/products/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


/** 🔹 Get All Products */
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 🔹 Buy Now: Store Purchase & Add to Cart */
app.post("/api/purchase", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "❌ Product ID and quantity are required." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "❌ Product not found" });

    // Find or create cart
    let cart = await Cart.findOne({ user: userId }).populate("items.productId");
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already exists in cart
    const productIndex = cart.items.findIndex((item) => item.productId._id.toString() === productId);
    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        quantity,
      });
    }

    await cart.save();
    console.log("✅ Product Added to Cart:", JSON.stringify(cart, null, 2));

    res.status(201).json({ message: "✅ Product added to cart!", cart });
  } catch (error) {
    console.error("❌ Error processing purchase:", error);
    res.status(500).json({ message: "❌ Internal server error" });
  }
});

/** 🔹 Get Cart Items */
app.get("/api/cart", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.productId",
      select: "name price image", // Fetch only needed fields
    });

    if (!cart) {
      return res.json({ cart: { items: [] } });
    }

    console.log("🛒 Cart Data Sent:", JSON.stringify(cart, null, 2));
    res.json({ cart });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 🔹 Add or Update Product in Cart */
app.post("/api/cart/add", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "❌ Invalid product ID or quantity." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "❌ Product not found" });

    let cart = await Cart.findOne({ user: userId }).populate("items.productId");

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const productIndex = cart.items.findIndex((item) => item.productId._id.toString() === productId);

    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity;
    } else {
      cart.items.push({ productId: product._id, quantity });
    }

    await cart.save();
    console.log("✅ Product Added:", JSON.stringify(cart, null, 2));

    res.status(201).json({ message: "✅ Product added to cart!", cart });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 🔹 Update Cart Item Quantity */
app.put("/api/cart/update", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "❌ Invalid product ID or quantity" });
    }

    let cart = await Cart.findOne({ user: userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "❌ Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId._id.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: "❌ Item not found in cart" });
    }

    await cart.save();
    console.log("✅ Cart Updated:", JSON.stringify(cart, null, 2));

    res.json({ message: "✅ Cart updated successfully", cart });
  } catch (error) {
    console.error("❌ Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 🔹 Remove Item from Cart */
app.delete("/api/cart/remove/:productId", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    let cart = await Cart.findOne({ user: userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "❌ Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId._id.toString() !== productId);

    await cart.save();
    console.log("✅ Product Removed:", JSON.stringify(cart, null, 2));

    res.json({ message: "✅ Product removed from cart", cart });
  } catch (error) {
    console.error("❌ Error removing item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** 🔹 Clear Cart */
app.delete("/api/cart/clear", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndDelete({ user: userId });

    console.log("✅ Cart Cleared for User:", userId);
    res.json({ message: "✅ Cart cleared successfully" });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing from .env file");
  process.exit(1); // Stop the server if Stripe API key is missing
}

app.post("/api/payment", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Stripe Error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});



// ✅ Fetch all products for admin panel
app.get("/api/admin/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching products", error });
  }
});

// ✅ Fetch all users for admin panel
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users", error });
  }
});
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
app.post("/api/admin/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// POST route for adding a product
app.post("/api/admin/products", async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    const newProduct = new Product({ name, price, category, description, image });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error });
  }
});

// GET route for fetching products
app.get("/api/admin/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
});

// PUT route for updating a product
app.put("/api/admin/products/:id", async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, category, description, image });
    res.json({ message: "Product updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
});

// DELETE route for deleting a product
app.delete("/api/admin/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
});



// Create a User
app.post('/api/admin/users', jwt.verify, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add user", error });
  }
});

// Get All Users
app.get('/api/admin/users', jwt.verify, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

// Update a User
app.put('/api/admin/users/:id', jwt.verify, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.json({ message: "User updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
});

// Delete a User
app.delete('/api/admin/users/:id', jwt.verify, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
});






// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚀 Server is Running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

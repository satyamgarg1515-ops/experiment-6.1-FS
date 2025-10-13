// =============================
// Middleware Implementation for Logging and Bearer Token Authentication
// =============================

const express = require('express');
const app = express();
const PORT = 3000;

// ----------------------------
// Middleware 1: Logging Middleware
// ----------------------------
const loggerMiddleware = (req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`[${currentTime}] ${req.method} ${req.url}`);
  next(); // Move to next middleware or route handler
};

// Apply logger globally to all routes
app.use(loggerMiddleware);

// ----------------------------
// Middleware 2: Bearer Token Authentication Middleware
// ----------------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']; // get Authorization header

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // split "Bearer token"
  if (!token) {
    return res.status(401).json({ error: 'Bearer token missing' });
  }

  if (token !== 'mysecrettoken') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  // Token is valid → move to next
  next();
};

// ----------------------------
// Routes
// ----------------------------

// ✅ Public route (no authentication required)
app.get('/public', (req, res) => {
  res.json({ message: 'Welcome! This is a public route accessible by anyone.' });
});

// 🔒 Protected route (requires Bearer token)
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted! You have reached the protected route.' });
});

// ----------------------------
// Start Server
// ----------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

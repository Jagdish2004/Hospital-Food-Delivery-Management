require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Verify environment variables are loaded
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const pantryRoutes = require('./routes/pantry');
const deliveryRoutes = require('./routes/delivery');
const managerRoutes = require('./routes/manager');
const dietChartRoutes = require('./routes/dietCharts');

const app = express();

// Connect to database
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Add this before your routes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/diet-charts', dietChartRoutes);

// Add this after your routes
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

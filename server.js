const express = require('express');
const http = require('http');
const os = require('os');
const cors = require('cors');
const productRoutes = require('./routes/products');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Custom middleware using http module to log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/products', productRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'E-commerce API is running!',
        endpoints: {
            getProducts: 'GET /products',
            addProduct: 'POST /products'
        }
    });
});

// System info using os module
function printSystemInfo() {
    console.log('=== System Information ===');
    console.log(`Platform: ${os.platform()}`);
    console.log(`Architecture: ${os.arch()}`);
    console.log(`CPU Cores: ${os.cpus().length}`);
    console.log(`Total Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log(`Free Memory: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log(`Uptime: ${(os.uptime() / 60 / 60).toFixed(2)} hours`);
    console.log('==========================');
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    printSystemInfo();
});

module.exports = app;
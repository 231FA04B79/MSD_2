const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Path to products data file
const dataPath = path.join(__dirname, '../data/products.json');

// Helper function to read products from file
const readProducts = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
};

// Helper function to write products to file
const writeProducts = (products) => {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
};

// Initialize products file with sample data if empty
const initializeProducts = () => {
    const products = readProducts();
    if (products.length === 0) {
        const sampleProducts = [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                price: 79.99,
                category: "Electronics",
                description: "High-quality wireless headphones with noise cancellation"
            },
            {
                id: 2,
                name: "Smart Fitness Watch",
                price: 199.99,
                category: "Electronics",
                description: "Track your fitness goals with this smart watch"
            },
            {
                id: 3,
                name: "Organic Cotton T-Shirt",
                price: 24.99,
                category: "Clothing",
                description: "Comfortable and eco-friendly cotton t-shirt"
            }
        ];
        writeProducts(sampleProducts);
    }
};

// Initialize products on server start
initializeProducts();

// GET /products - Get all products
router.get('/', (req, res) => {
    try {
        const products = readProducts();
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading products data',
            error: error.message
        });
    }
});

// POST /products - Add a new product
router.post('/', (req, res) => {
    try {
        const { name, price, category, description } = req.body;

        // Validation
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, price, and category are required fields'
            });
        }

        const products = readProducts();
        
        // Create new product
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name,
            price: parseFloat(price),
            category,
            description: description || '',
            createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        writeProducts(products);

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: newProduct
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding product',
            error: error.message
        });
    }
});

module.exports = router;
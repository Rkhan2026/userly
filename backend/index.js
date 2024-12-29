const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client to interact with the database
const prisma = new PrismaClient();

// Create an Express app instance
const app = express();

// Middleware Setup

// Middleware to parse incoming JSON requests
app.use(express.json());

// CORS (Cross-Origin Resource Sharing) configuration
@Crossorigin
app.use((req, res, next) => {
    // IMPORTANT: In production, NEVER use '*' for Access-Control-Allow-Origin.
    // Replace '*' with the specific origin(s) of your frontend application(s).
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows requests from any origin (for development)
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
    next(); // Pass control to the next middleware or route handler
});

// API Endpoints

// Test endpoint to check if the API is working
app.get('/test', async (req, res) => {
    try {
        res.status(200).json({ message: 'API is working' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors and send a 500 status
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id); // Extract and convert the ID to a number
        const user = await prisma.user.findUnique({ where: { id: userId } }); // Find user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Handle case where user is not found
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const userData = req.body; // Get user data from the request body
        const newUser = await prisma.user.create({ data: userData }); // Create the user in the database
        res.status(201).json(newUser); // Send 201 Created status
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an existing user
app.put('/users/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const updateData = req.body; // Get updated user data
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' }); // Handle if user doesn't exist
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const deletedUser = await prisma.user.delete({ where: { id: userId } });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' }); // Handle if user doesn't exist
        }
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 4000; // Use the environment port or 4000 as a default
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Basic Express Server Setup
const express = require('express');
const cors = require('cors'); // Required for allowing the React frontend to talk to the backend
const app = express();
const port = 3001; // Backend API port

// Configure CORS to allow requests from the React development server (default is 3000)
// If your React app runs on a different port (like 5173 for Vite), update this origin.
app.use(cors({
    origin: 'http://localhost:5173' // Assuming your React app runs on port 5173 (Vite default)
}));

// Middleware to parse incoming JSON bodies
app.use(express.json());

// --- API Endpoints ---

// Simple root endpoint
app.get('/', (req, res) => {
  res.send('Node.js API Server is operational on port 3001.');
});

// Example API endpoint for the React client to fetch data
app.get('/api/message', (req, res) => {
  console.log('API call received on /api/message');
  res.json({
    timestamp: new Date().toISOString(),
    message: 'Hello from the Node.js backend!' 
  });
});

// Start the server
app.listen(port, () => {
  console.log(`\n\n[SERVER] 🚀 Server listening at http://localhost:${port}\n`);
});
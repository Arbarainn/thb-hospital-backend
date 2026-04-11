require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 5050; // Langsung dipaksa ke 5050

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/hospital', apiRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Hospital Backend API is running...',
    endpoints: '/api/hospital',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const userRoutes = require('./routes/user.routes');


const PORT = process.env.PORT || 5000;

// MongoDB connection

mongoose.connect('mongodb+srv://shubhamKhangar_easyhire:shubhamKhangar_easyhire@clustereasyhire.vn68toe.mongodb.net/easyHire?retryWrites=true&w=majority&appName=ClusterEasyHire').then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}/health`);
    console.log("follow link `localhost:${PORT}/health` to check server status");
});
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// health check endpoint
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define routes here
 app.use('/api/users', userRoutes);
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./confiq/database');
const dishRoutes = require('./routes/dishesRoute');
const mongoose = require('mongoose');
const Dish = require('./models/dishesModel');
const cors = require('cors');
const logger = require('morgan');




dotenv.config();
const app = express();
const PORT = process.env.PORT;


// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use('/api/', dishRoutes);

connectDB(process.env.CONNECTION_URL);
// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


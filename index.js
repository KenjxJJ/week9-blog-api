require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./database/connectDB');

const RequestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const ArticleRoutes = require('./routes/article.route');
const UserRoutes = require('./routes/user.route');
const UploadRoutes = require('./routes/upload.route');

const app = express();
const PORT = process.env.PORT || 5000;

app.enable('trust proxy');

connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(RequestLogger);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Application Routes
app.use('/api', ArticleRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/upload', UploadRoutes);

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

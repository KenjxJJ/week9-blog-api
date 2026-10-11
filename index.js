require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connectDB');

const RequestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const ArticleRoutes = require('./routes/article.route');
const UserRoutes = require('./routes/user.route');
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors('*'));

app.use(RequestLogger);
app.use('/api',ArticleRoutes);
app.use('/api/users',UserRoutes);

app.use(errorHandler);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});


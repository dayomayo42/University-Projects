// server.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const path = require('path');

require('dotenv').config();

const app = express();
connectDB();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Маршруты
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cron = require('node-cron');

// Запланировать выполнение задачи каждый день в полночь
cron.schedule('0 0 * * *', async () => {
   const books = await Book.find({ rentalStatus: 'rented' });
   const reminders = books.filter(book => book.rentalEndDate <= new Date());
   
   reminders.forEach(book => {
       // Здесь можно добавить логику отправки уведомления пользователю
       console.log(`Напоминание: Книга "${book.title}" скоро истечет.`);
   });
});
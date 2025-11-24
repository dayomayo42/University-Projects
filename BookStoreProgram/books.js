// routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Получить все книги с возможностью фильтрации
router.get('/', async (req, res) => {
    const { category, author, year } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (author) filter.author = author;
    if (year) filter.year = year;

    const books = await Book.find(filter);
    res.json(books);
});

// Добавить книгу (только для администратора)
router.post('/', async (req, res) => {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
});

// Изменить книгу (только для администратора)
router.put('/:id', async (req, res) => {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
});

// Удалить книгу (только для администратора)
router.delete('/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Арендовать книгу
router.post('/:id/rent', async (req, res) => {
    const book = await Book.findById(req.params.id);
    
    if (book.rentalStatus === 'rented') {
        return res.status(400).json({ message: 'Книга уже арендована' });
    }

    const rentalDuration = req.body.duration; // '2 weeks', '1 month', '3 months'
    let rentalEndDate;

    switch (rentalDuration) {
        case '2 weeks':
            rentalEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 недели
            break;
        case '1 month':
            rentalEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 месяц
            break;
        case '3 months':
            rentalEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 3 месяца
            break;
        default:
            return res.status(400).json({ message: 'Неверная продолжительность аренды' });
    }

    book.rentalEndDate = rentalEndDate;
    book.rentalStatus = 'rented';
    await book.save();

    res.json(book);
});

// Напоминание об окончании аренды (можно вызывать через cron job или по запросу)
router.get('/reminders', async (req, res) => {
    const books = await Book.find({ rentalStatus: 'rented' });
    const reminders = books.filter(book => book.rentalEndDate < new Date());
    
    res.json(reminders);
});

module.exports = router;
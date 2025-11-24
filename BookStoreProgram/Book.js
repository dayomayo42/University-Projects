// models/Book.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    status: { type: String, default: 'available' },
    rentalEndDate: { type: Date },
    rentalStatus: { type: String, default: 'not rented' }, // 'not rented', 'rented'
});

module.exports = mongoose.model('Book', BookSchema);
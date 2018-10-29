const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PibSchema = new Schema({
    text: String,
    date: Date,
    authorId: String,
    chatId: String,
    checked: Boolean
});

module.exports = mongoose.model('pib', PibSchema)
const mongoose = require('mongoose')

const CharacterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    alias: String,
    publisher: String
});

module.exports = mongoose.model('Character', CharacterSchema);
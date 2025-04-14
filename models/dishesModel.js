const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String},
    ingredients: [String],
    preparationSteps: String,
    cookingTime: String,
    origin: String,
    spiceLevel: String,
    difficulty: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Dish', dishSchema);
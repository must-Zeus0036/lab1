const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    id: Number,
    name: { type: String,},
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

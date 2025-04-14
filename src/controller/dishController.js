const Dish = require('../../models/dishesModel');
// Get all dishes
const getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.status(200).json(dishes);
        
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get a dish by name
// This is a more efficient way to get a dish by name
const getDishByName = async (req, res) => {
    try {
        const dish = await Dish.findOne({ name: req.params.name });
        if (!dish) return res.status(404).json({ error: 'Dish not found' });
        res.status(200).json(dish);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Create a new dish
const createDish = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const exists = await Dish.findOne({ name: req.body.name });
        if (exists) {
            return res.status(409).json({ error: 'Dish already exists' });
        }

        // Generate a unique ID (example using a simple counter - needs proper handling)
        const lastDish = await Dish.findOne().sort({ id: -1 }).limit(1);
        const newId = lastDish ? lastDish.id + 1 : 1;
        const newDishData = { ...req.body, id: newId };

        const newDish = new Dish(newDishData);
        const savedDish = await newDish.save();
        console.log('Dish created successfully:', savedDish);
        res.status(201).json(savedDish);
    } catch (err) {
        console.error('Error creating dish:', err);
        res.status(400).json({ error: 'Invalid input', details: err.message });
    }
};

// Update a dish by ID
const updateDish = async (req, res) => {
    try {
        const updated = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Dish not found' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID or data' });
    }
};
// Delete a dish by ID
const deleteDish = async (req, res) => {
    try {
        const deleted = await Dish.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Dish not found' });
        res.status(200).json({ message: 'Dish deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID' });
    }
};

module.exports = {
    getAllDishes,
    getDishByName,
    createDish,
    updateDish,
    deleteDish
};
const Dish = require('../../models/dishesModel');

const getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.status(200).json(dishes);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

const getDishByName = async (req, res) => {
    try {
        const dish = await Dish.findOne({ name: req.params.name });
        if (!dish) return res.status(404).json({ error: 'Dish not found' });
        res.status(200).json(dish);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

const createDish = async (req, res) => {
    try {
        const exists = await Dish.findOne({ name: req.body.name });
        if (exists) return res.status(409).json({ error: 'Dish already exists' });

        const newDish = new Dish(req.body);
        await newDish.save();
        res.status(201).json(newDish);
    } catch (err) {
        res.status(400).json({ error: 'Invalid input' });
    }
};

const updateDish = async (req, res) => {
    try {
        const updated = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Dish not found' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID or data' });
    }
};

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
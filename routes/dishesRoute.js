const express = require('express');
const {
    getAllDishes,
    getDishByName,
    createDish,
    updateDish,
    deleteDish
} = require('../src/controller/dishController');

const router = express.Router();

router.get('/dishes', getAllDishes);
router.get('/dishes/:name', getDishByName);
router.post('/dishes', createDish);
router.put('/dishes/:id', updateDish);
router.delete('/dishes/:id', deleteDish);

module.exports = router;

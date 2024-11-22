const express = require('express');
const Distance = require('../models/Distance');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const { cep, address, distance, current_location } = req.body;
  
      const newDistance = new Distance({
        cep,
        address,
        distance,
        current_location,
      });
  
      const savedDistance = await newDistance.save();
      res.status(201).json(savedDistance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/', async (req, res) => {
  try {
    const distances = await Distance.find();
    res.status(200).json(distances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const distance = await Distance.findById(req.params.id);
    if (!distance) {
      return res.status(404).json({ error: 'Cálculo não encontrado' });
    }
    res.status(200).json(distance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedDistance = await Distance.findByIdAndDelete(req.params.id);
    if (!deletedDistance) {
      return res.status(404).json({ error: 'Cálculo não encontrado' });
    }
    res.status(200).json({ message: 'Cálculo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

router.post('/', async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json(room);
});

router.get('/', async (req, res) => {
  const rooms = await Room.findAll();
  res.json(rooms);
});

module.exports = router;
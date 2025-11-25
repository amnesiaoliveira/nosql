const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: 'Usuário criado!', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user || !(await User.validatePassword(user, password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  res.json({ user_id: user.user_id, username: user.username });
});

module.exports = router;
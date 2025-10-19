const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/database');

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'datos requeridos' });
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'hash error' });
    db.run('INSERT INTO users (username, password_hash) VALUES (?,?)', [username, hash], function(err){
      if (err) return res.status(400).json({ error: 'usuario ya existe' });
      res.status(201).json({ message: 'Usuario creado', userId: this.lastID });
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(!username||!password) return res.status(400).json({ error: 'datos requeridos' });
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'credenciales inválidas' });
    bcrypt.compare(password, user.password_hash, (err, same) => {
      if (!same) return res.status(401).json({ error: 'credenciales inválidas' });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
      res.json({ message: 'login ok' });
    });
  });
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'logout ok' });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  const sql = `SELECT p.id,p.name,p.description,u.username as owner FROM products p JOIN users u ON p.owner_id = u.id`;
  db.all(sql, [], (err, rows) => err ? res.status(500).json({err}) : res.json({ products: rows }));
});

router.get('/my', verifyToken, (req, res) => {
  db.all('SELECT * FROM products WHERE owner_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ myProducts: rows });
  });
});

router.post('/', verifyToken, (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  db.run('INSERT INTO products (name,description,owner_id) VALUES (?,?,?)', [name, description, req.user.id], function(err){
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, description });
  });
});

router.put('/:id', verifyToken, (req, res) => {
  const { name, description } = req.body;
  const productId = req.params.id;
  db.get('SELECT owner_id FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) return res.status(404).json({ error: 'not found' });
    if (product.owner_id !== req.user.id) return res.status(403).json({ error: 'unauthorized' });
    db.run('UPDATE products SET name = ?, description = ? WHERE id = ?', [name, description, productId], function(err){
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'updated', changes: this.changes });
    });
  });
});

router.delete('/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  db.get('SELECT owner_id FROM products WHERE id = ?', [id], (err, product) => {
    if (err || !product) return res.status(404).json({ error: 'not found' });
    if (product.owner_id !== req.user.id) return res.status(403).json({ error: 'unauthorized' });
    db.run('DELETE FROM products WHERE id = ?', [id], function(err){
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'deleted', changes: this.changes });
    });
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({error:'missing_fields'});
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({error:'email_exists'});
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [name,email,hashed, role || 'patient']);
    const userId = result.insertId;
    const token = jwt.sign({id:userId, role: role || 'patient'}, JWT_SECRET, {expiresIn: '7d'});
    res.json({token, user:{id:userId, name, email, role: role || 'patient'}});
  } catch(err){
    console.error(err);
    res.status(500).json({error:'server_error'});
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({error:'missing_fields'});
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({error:'invalid_credentials'});
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({error:'invalid_credentials'});
    const token = jwt.sign({id:user.id, role:user.role}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:{id:user.id, name:user.name, email:user.email, role:user.role}});
  } catch(err){
    console.error(err);
    res.status(500).json({error:'server_error'});
  }
});

module.exports = router;

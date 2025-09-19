const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const axios = require('axios');

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_KEY';

// Helper: check if time slot free
async function isFree(date, time){
  const [rows] = await pool.query('SELECT id FROM appointments WHERE date = ? AND time = ? AND status = "scheduled"', [date, time]);
  return rows.length === 0;
}

// Create appointment (authenticated users)
router.post('/', auth, async (req, res) => {
  const { date, time, cep } = req.body;
  if (!date || !time || !cep) return res.status(400).json({error:'missing_fields'});
  try {
    const free = await isFree(date, time);
    if (!free) return res.status(400).json({error:'slot_taken'});

    // ViaCEP lookup
    let address = '', city = '', state = '';
    try {
      const v = await axios.get(`https://viacep.com.br/ws/${cep.replace(/[^0-9]/g,'')}/json/`);
      if (!v.data.erro) {
        address = `${v.data.logradouro} ${v.data.bairro}`;
        city = v.data.localidade;
        state = v.data.uf;
      }
    } catch(e){}

    // Weather lookup for date (uses OpenWeather One Call — here simplified: current weather for city if available)
    let weather_info = '';
    try {
      let q = city || '';
      if (q) {
        const w = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${OPENWEATHER_KEY}`);
        weather_info = w.data.weather && w.data.weather[0] ? w.data.weather[0].description : '';
      } else {
        weather_info = '';
      }
    } catch(e){
      weather_info = '';
    }

    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, date, time, cep, address, city, state, weather_info) VALUES (?,?,?,?,?,?,?,?)',
      [req.user.id, date, time, cep, address, city, state, weather_info]
    );
    res.json({ok:true, appointmentId: result.insertId});
  } catch(err){
    console.error(err);
    res.status(500).json({error:'server_error'});
  }
});

// List appointments (admin or own)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'secretary') {
      const [rows] = await pool.query('SELECT a.*, u.name as patient_name FROM appointments a LEFT JOIN users u ON a.patient_id = u.id ORDER BY a.date, a.time');
      return res.json(rows);
    } else {
      const [rows] = await pool.query('SELECT a.* FROM appointments a WHERE a.patient_id = ? ORDER BY a.date, a.time', [req.user.id]);
      return res.json(rows);
    }
  } catch(err){
    console.error(err);
    res.status(500).json({error:'server_error'});
  }
});

module.exports = router;

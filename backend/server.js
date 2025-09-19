require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./src/routes/auth');
const appointmentRoutes = require('./src/routes/appointments');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.json({ok:true, message:'Clinic Attendance Backend running'}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port', PORT));

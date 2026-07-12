require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

const app = express();

// --- Middleware ---
app.use(express.json());

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : '*'
}));

// --- Routes ---
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
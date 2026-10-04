require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const documentRoutes = require('./routes/documentRoutes');
const ragRoutes = require('./routes/ragRoutes');
const scamRoutes = require('./routes/scamRoutes');
const quizRoutes = require('./routes/quizRoutes');
const rightsRoutes = require('./routes/rightsRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const ragController = require('./controllers/ragController');
const quizController = require('./controllers/quizController');
const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Security & Hygiene Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts/styles for modern dynamic UI
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiter for API routes: 300 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});

app.use(apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// 2. Health & Status
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'NiveshRakshak-Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/scam-check', scamRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/rights', rightsRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Direct top-level route aliases matching exact user prompt specs:
// POST /api/ask
app.post('/api/ask', authenticate, ragController.ask);
// GET /api/safety-score
app.get('/api/safety-score', authenticate, quizController.getSafetyScore);

// 4. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 5. Global Error Handler
app.use(errorHandler);

// 6. Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[NiveshRakshak] Backend API server running on port ${PORT}`);
    console.log(`[NiveshRakshak] Ready for Investor Protection workflows.`);
  });
});

module.exports = app;

const express = require('express');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const { Pool } = require('pg');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret', // Set in .env
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5001/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
    if (result.rows.length > 0) {
      return done(null, result.rows[0]);
    }
    const insertResult = await pool.query(
      'INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *',
      [profile.id, profile.emails[0].value, profile.displayName]
    );
    return done(null, insertResult.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Google Cloud Vision and Gemini Clients
const visionClient = new vision.ImageAnnotatorClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Please log in to access this resource' });
};

// OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
  (req, res) => {
    res.redirect('http://localhost:3000');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:3000');
  });
});

app.get('/auth/user', (req, res) => {
  if (req.user) {
    res.json({ user: { name: req.user.name, email: req.user.email } });
  } else {
    res.json({ user: null });
  }
});

// Caption Generation Route
app.post('/upload', ensureAuthenticated, upload.single('image'), async (req, res) => {
  const { platform, length, tone, description } = req.body;
  const userGoogleId = req.user.google_id;

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const imageBuffer = req.file.buffer;
    console.log("Image uploaded:", req.file.originalname);

    const [visionResult] = await visionClient.labelDetection({
      image: { content: imageBuffer },
    }).catch(error => {
      if (error.code === 7 && error.message.includes('PERMISSION_DENIED')) {
        throw new Error('API_CREDITS_EXHAUSTED');
      }
      throw error;
    });

    if (!visionResult.labelAnnotations || visionResult.labelAnnotations.length === 0) {
      return res.status(500).json({ error: 'Failed to analyze image' });
    }

    const labels = visionResult.labelAnnotations.map(label => label.description).join(', ');

    const captionPrompt = `Generate a ${tone} caption based on the following image description: '${labels}', for the ${platform} platform. The caption should be ${length} in length.`;
    const captionResult = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const captionResponse = await captionResult.generateContent([captionPrompt]).catch(error => {
      if (error.message.includes('PERMISSION_DENIED')) {
        throw new Error('API_CREDITS_EXHAUSTED');
      }
      throw error;
    });

    if (!captionResponse || !captionResponse.response) {
      return res.status(500).json({ error: 'Failed to generate caption' });
    }

    const captionText = captionResponse.response.text();

    const hashtagPrompt = `Generate a list of relevant hashtags for the following caption. Only provide the hashtags: '${captionText}'.`;
    const hashtagResult = await captionResult.generateContent([hashtagPrompt]);
    const hashtagsText = hashtagResult.response.text();

    const tipsPrompt = `Provide just a list of tips only on how to improve this caption for ${platform}: '${captionText}'. Only provide the tips.`;
    const tipsResult = await captionResult.generateContent([tipsPrompt]);
    const tipsText = tipsResult.response.text();

    const userQuery = await pool.query('SELECT id FROM users WHERE google_id = $1', [userGoogleId]);
    const userId = userQuery.rows[0].id;

    await pool.query(
      'INSERT INTO captions (user_id, platform, caption, hashtags, tips) VALUES ($1, $2, $3, $4, $5)',
      [userId, platform, captionText, hashtagsText, tipsText]
    );

    res.json({
      caption: captionText,
      hashtags: hashtagsText.split(" "),
      tips: tipsText.split(". "),
    });

  } catch (error) {
    console.error('Error generating caption:', error);
    if (error.message === 'API_CREDITS_EXHAUSTED') {
      return res.status(503).json({ error: 'API credits are exhausted. Please check back later.' });
    }
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
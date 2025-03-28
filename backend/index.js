const express = require('express');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for your frontend URL
app.use(cors({ origin: 'http://localhost:3000' }));

// Configure Multer to store uploaded images in memory as buffers
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

// Initialize Google Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient();

// Initialize Google Generative AI client (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route to handle image upload, image analysis, and caption generation
app.post('/upload', upload.single('image'), async (req, res) => {
  const { platform, length, tone, description } = req.body;

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const imageBuffer = req.file.buffer;
    console.log("Image uploaded:", req.file.originalname);

    // Step 1: Analyze the image using Google Cloud Vision API
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
    console.log('Labels extracted from image:', labels);

    // Step 2: Generate a caption using Gemini API based on the image labels
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

    console.log("Caption generated:", captionResponse.response.text());

    // Generate hashtags based on the caption
    const hashtagPrompt = `Generate a list of relevant hashtags for the following caption. Only provide the hashtags: '${captionResponse.response.text()}'.`;
    const hashtagResult = await captionResult.generateContent([hashtagPrompt]);

    if (!hashtagResult || !hashtagResult.response) {
      return res.status(500).json({ error: 'Failed to generate hashtags' });
    }

    console.log("Hashtags generated:", hashtagResult.response.text());

    // Step 3: Generate tips for improving social media captions
    const tipsPrompt = `Provide just a list of tips only on how to improve this caption for ${platform}: '${captionResponse.response.text()}'. Only provide the tips.`;
    const tipsResult = await captionResult.generateContent([tipsPrompt]);

    if (!tipsResult || !tipsResult.response) {
      return res.status(500).json({ error: 'Failed to generate tips' });
    }

    console.log("Tips generated:", tipsResult.response.text());

    res.json({
      caption: captionResponse.response.text(),
      hashtags: hashtagResult.response.text().split(" "),
      tips: tipsResult.response.text().split(". "),
    });

  } catch (error) {
    console.error('Error generating caption:', error);
    if (error.message === 'API_CREDITS_EXHAUSTED') {
      return res.status(503).json({ 
        error: 'API credits are exhausted. Please check back later.' 
      });
    }
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
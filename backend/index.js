const express = require('express');
const multer = require('multer');
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route to handle image upload and caption generation
app.post('/upload', upload.single('image'), async (req, res) => {
  const { platform, length, tone, description } = req.body;

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const imageBuffer = req.file.buffer;  // Access uploaded image buffer
    // Log to check that the image is uploaded
    console.log("Image uploaded:", req.file.originalname);

    // Simulate an image description task using the Gemini API
    const imageAnalysis = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageDescription = await imageAnalysis.generateContent([
      `Describe this image in detail: ${description || "No description provided"}`
    ]);

    const captionPrompt = `Generate a ${tone} caption for this image described as '${imageDescription.response.text()}', for the ${platform} platform. Make it ${length}.`;

    const captionResult = await imageAnalysis.generateContent([captionPrompt]);

    // Generate hashtags based on the caption
    const hashtagPrompt = `Generate relevant hashtags for this image caption: '${captionResult.response.text()}'`;
    const hashtagResult = await imageAnalysis.generateContent([hashtagPrompt]);

    res.json({
      caption: captionResult.response.text(),
      hashtags: hashtagResult.response.text().split(" "),  // Simulate hashtags generation
    });

  } catch (error) {
    console.error('Error generating caption:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

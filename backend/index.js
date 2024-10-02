const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for your frontend URL
app.use(cors({ origin: 'http://localhost:3000' }));

const upload = multer({ dest: 'uploads/' });
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/upload', upload.single('image'), async (req, res) => {
  const { platform, length, tone, description } = req.body;

  try {
    const imageBuffer = req.file.buffer;  // Access uploaded image

    // Simulate an image description task using the Gemini API
    const imageAnalysis = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageDescription = await imageAnalysis.generateContent([
      `Describe this image in detail: ${description || "No description provided"}`
    ]);

    const captionPrompt = `Generate a ${tone} caption for this image described as '${imageDescription.response.text()}', for the ${platform} platform. Make it ${length}.`;

    const captionResult = await imageAnalysis.generateContent([captionPrompt]);

    // Generate hashtags (you can customize this further)
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

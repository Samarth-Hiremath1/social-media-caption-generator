# Social Media Caption Generator

## Overview

The **Social Media Caption Generator** is a full-stack web application designed to assist users in generating AI-powered captions, relevant hashtags, and tips for social media platforms based on an uploaded image. It leverages Google Cloud Vision API for image analysis and Google Gemini API for generating creative text content. Users can customize their caption by selecting the platform, tone, and length to suit their preferences.

## Features

- **Image Upload**: Upload an image to generate context-aware captions.
- **Platform Selection**: Choose from Instagram, LinkedIn, or Twitter to generate captions tailored to each platform’s requirements.
- **Caption Customization**: Select the tone (e.g., casual, professional) and length (e.g., short, medium, long) of the caption.
- **AI-Powered Hashtag Generation**: Based on the image and caption, the system generates relevant and popular hashtags.
- **Pro Tips**: Provides tips for improving the generated caption based on the context of the image.

## Tech Stack

### Frontend
- **React.js** with **Next.js**: Used for building the frontend user interface.
- **Tailwind CSS**: For styling the components.
- **TypeScript**: To ensure type safety throughout the frontend application.

### Backend
- **Node.js** with **Express.js**: For building the backend API.
- **Google Cloud Vision API**: Used to analyze the uploaded image and extract meaningful labels.
- **Google Gemini API**: Used to generate captions, hashtags, and tips based on the image analysis.

## Future Plans

- **User Authentication**: Implement user accounts to allow saving and managing generated captions, hashtags, and tips.
- **Multi-language Support**: Enable the system to generate captions in various languages to cater to a broader audience.
- **Additional Social Platforms**: Extend the platform to generate captions for other platforms like Facebook, Pinterest, and TikTok.
- **Advanced Customization**: Allow more detailed customization options, such as adjusting tone by percentage or incorporating brand-specific keywords.
- **Improved Image Analysis**: Incorporate more advanced image analysis techniques to generate even more context-aware and creative captions.
- **Add a Database**: Add a database to track history of previous uploads and captions. 

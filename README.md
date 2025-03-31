# Social Media Caption Generator

## Overview

**PostPal** is a full-stack web application that empowers users to generate AI-powered captions, hashtags, and tips for social media platforms from uploaded images. Leveraging **Google Cloud Vision API** for image analysis and **Google Gemini API** for creative text generation, PostPal offers a seamless experience with secure user authentication via **Google OAuth** and persistent data storage in **PostgreSQL**. Users can customize captions by platform, tone, and length, all within a sleek, modern interface styled with **React**, **Radix UI**, and **Tailwind CSS**.

### I'm currently trying to host the project on Vercel! Check back soon for updates!

## Features

- **Image Upload**: Upload an image to generate context-aware captions.
- **Platform Selection**: Choose Instagram, LinkedIn, or Twitter for tailored captions.
- **Caption Customization**: Select tone (e.g., casual, professional) and length (e.g., short, medium, long).
- **AI-Powered Hashtag Generation**: Automatically generates relevant hashtags based on image and caption.
- **Pro Tips**: Offers tips to enhance captions for the chosen platform.
- **User Authentication**: Secure login with Google OAuth to access the platform.
- **Database Storage**: Saves user data and generated captions in PostgreSQL.
- **Enhanced UI**: Features a Google-styled login button and dialog using Radix UI for a polished look.

## Tech Stack

### Frontend
- **React.js** with **Next.js**
- **Tailwind CSS**
- **TypeScript**
- **Radix UI**

### Backend
- **Node.js** with **Express.js**: Handles API requests and server logic.
- **Google Cloud Vision API**: Analyzes images to extract descriptive labels.
- **Google Gemini API**: Generates captions, hashtags, and tips.
- **PostgreSQL**: Stores user profiles and caption history.
- **Passport.js**: Implements Google OAuth for authentication.
- **Express-Session**: Manages user sessions.

## Setup and Running the Code

### Prerequisites
- Node.js (v20.x recommended)
- PostgreSQL 14 (installed via Homebrew: `brew install postgresql@14`)
- Google Cloud credentials (Vision API) and Gemini API key
- Google OAuth Client ID and Secret

### Running the Project Locally:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/social-media-caption-generator.git
   cd social-media-caption-generator
2. **Run Backend**:
   ```bash
   cd backend
   node index.js
3. **Run Frontend**:
   ```bash
   cd frontend
   npm run dev

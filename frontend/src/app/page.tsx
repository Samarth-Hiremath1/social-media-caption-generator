'use client'

import { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload/ImageUpload';
import PlatformSelector from '../components/PlatformSelector/PlatformSelector';
import CaptionLengthSelector from '../components/CaptionLengthSelector/CaptionLengthSelector';
import CaptionToneSelector from '../components/CaptionToneSelector/CaptionToneSelector';
import ImageDescription from '../components/ImageDescription/ImageDescription';
import GeneratedContent from '../components/GeneratedContent/GeneratedContent';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>('instagram');
  const [length, setLength] = useState<string>('');
  const [tone, setTone] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    setIsFormValid(!!image && !!platform && !!length && !!tone);
  }, [image, platform, length, tone]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const generateCaption = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('platform', platform);
    formData.append('length', length);
    formData.append('tone', tone);
    formData.append('description', description);

    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content.');
      }

      const data = await response.json();
      setCaption(data.caption);
      setHashtags(data.hashtags);
      setTips(data.tips);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error generating content:', error.message);
      } else {
        console.error('Error generating content:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
          Social Media Caption Generator
        </h1>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 space-y-6">
            <ImageUpload image={image} handleImageUpload={handleImageUpload} />
            <PlatformSelector setPlatform={setPlatform} />
            <CaptionLengthSelector setLength={setLength} />
            <CaptionToneSelector setTone={setTone} />
            <ImageDescription setDescription={setDescription} />

            <Button
              onClick={generateCaption}
              disabled={!isFormValid || loading}
              className={`w-full ${isFormValid
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                : 'bg-gray-600 cursor-not-allowed'
                }`}
            >
              {loading ? 'Generating...' : 'Generate Caption'}
            </Button>

            {caption && (
              <GeneratedContent
                caption={caption}
                hashtags={hashtags}
                tips={tips}
                generateCaption={generateCaption}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
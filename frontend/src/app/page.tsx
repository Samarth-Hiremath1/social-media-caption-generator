'use client'

import { useState, useEffect } from 'react'
import { Upload, RefreshCw, Image as ImageIcon, Hash, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [image, setImage] = useState<File | null>(null); // Use File object instead of base64
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
      setImage(file);  // Store the actual File object, not base64
    }
  };

  const generateCaption = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);  // Upload the actual file object
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
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Label>
                {image && <span className="text-green-500">Image uploaded!</span>}
              </div>
            </div>

            {image && (
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                <img src={URL.createObjectURL(image)} alt="Uploaded" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            {!image && (
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-500" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Select Platform</Label>
              <RadioGroup defaultValue="instagram" className="flex space-x-4" onValueChange={setPlatform}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="instagram" id="instagram" />
                  <Label htmlFor="instagram">Instagram</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="linkedin" id="linkedin" />
                  <Label htmlFor="linkedin">LinkedIn</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="twitter" id="twitter" />
                  <Label htmlFor="twitter">Twitter</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Caption Length</Label>
              <Select onValueChange={setLength}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Caption Tone</Label>
              <Select onValueChange={setTone}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Optional Image Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your image here..."
                className="bg-gray-700 border-gray-600 text-white"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

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
              <div className="space-y-4">
                <Tabs defaultValue="caption" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="caption">Caption</TabsTrigger>
                    <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                    <TabsTrigger value="tips">Tips</TabsTrigger>
                  </TabsList>
                  <TabsContent value="caption">
                    <Card>
                      <CardContent className="p-4 bg-gray-700 rounded-lg">
                        <p>{caption}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="hashtags">
                    <Card>
                      <CardContent className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {hashtags.length > 0 ? (
                            hashtags.map((tag, index) => (
                              <span key={index} className="bg-gray-600 px-2 py-1 rounded-full text-sm flex items-center">
                                <Hash className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <p>No hashtags available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tips">
                    <Card>
                      <CardContent className="p-4 bg-gray-700 rounded-lg">
                        <ul className="list-disc list-inside space-y-2">
                          {tips && tips.length > 0 ? (
                            tips.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <Lightbulb className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))
                          ) : (
                            <p>No tips available</p>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                <Button onClick={generateCaption} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Caption
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
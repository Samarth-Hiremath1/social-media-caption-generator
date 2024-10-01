'use client'

import { useState } from 'react'
import { Upload, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [image, setImage] = useState<string | null>(null)
  const [caption, setCaption] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateCaption = () => {
    setLoading(true)
    // Simulating API call for caption generation
    setTimeout(() => {
      setCaption("Your amazing caption goes here! #awesome #socialmedia")
      setLoading(false)
    }, 2000)
  }

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
                <img src={image} alt="Uploaded" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            {!image && (
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-500" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Select Platform</Label>
              <RadioGroup defaultValue="instagram" className="flex space-x-4">
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
              <Select>
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
              <Select>
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
              />
            </div>

            <Button 
              onClick={generateCaption} 
              disabled={!image || loading} 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {loading ? 'Generating...' : 'Generate Caption'}
            </Button>

            {caption && (
              <div className="space-y-2">
                <Label>Generated Caption</Label>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p>{caption}</p>
                </div>
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  image: File | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({ image, handleImageUpload }: ImageUploadProps) {
  return (
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
      {image ? (
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
          <img src={URL.createObjectURL(image)} alt="Uploaded" className="max-w-full max-h-full object-contain" />
        </div>
      ) : (
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-gray-500" />
        </div>
      )}
    </div>
  );
}
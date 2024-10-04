import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ImageDescriptionProps {
  setDescription: (value: string) => void;
}

export default function ImageDescription({ setDescription }: ImageDescriptionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Optional Image Description</Label>
      <Textarea
        id="description"
        placeholder="Describe your image here..."
        className="bg-gray-700 border-gray-600 text-white"
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
}
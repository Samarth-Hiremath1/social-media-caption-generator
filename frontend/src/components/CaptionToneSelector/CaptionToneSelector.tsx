import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CaptionToneSelectorProps {
  setTone: (value: string) => void;
}

export default function CaptionToneSelector({ setTone }: CaptionToneSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tone">Caption Tone</Label>
      <Select onValueChange={setTone}>
        <SelectTrigger className="bg-gray-700 border-gray-600">
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-navy-900">
          <SelectItem value="casual">Casual</SelectItem>
          <SelectItem value="professional">Professional</SelectItem>
          <SelectItem value="humorous">Humorous</SelectItem>
          <SelectItem value="inspirational">Inspirational</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
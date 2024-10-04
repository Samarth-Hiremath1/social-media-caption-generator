import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PlatformSelectorProps {
  setPlatform: (value: string) => void;
}

export default function PlatformSelector({ setPlatform }: PlatformSelectorProps) {
  return (
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
  );
}
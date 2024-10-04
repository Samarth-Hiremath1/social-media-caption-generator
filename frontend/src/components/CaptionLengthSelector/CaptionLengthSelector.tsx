import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CaptionLengthSelectorProps {
  setLength: (value: string) => void;
}

export default function CaptionLengthSelector({ setLength }: CaptionLengthSelectorProps) {
  return (
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
  );
}
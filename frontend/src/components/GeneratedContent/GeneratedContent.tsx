import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Hash, Lightbulb } from 'lucide-react';

interface GeneratedContentProps {
  caption: string;
  hashtags: string[];
  tips: string[];
  generateCaption: () => void;
}

export default function GeneratedContent({ caption, hashtags, tips, generateCaption }: GeneratedContentProps) {
  return (
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
  );
}
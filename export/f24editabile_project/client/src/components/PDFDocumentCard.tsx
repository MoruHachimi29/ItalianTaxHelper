import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PDFDocumentCardProps {
  title: string;
  description: string;
  pdfPath: string;
  thumbnailImage?: string;
}

export default function PDFDocumentCard({ title, description, pdfPath, thumbnailImage }: PDFDocumentCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {thumbnailImage && (
          <div className="w-full h-48 overflow-hidden mb-4 border border-gray-200 rounded">
            <img 
              src={thumbnailImage} 
              alt={title} 
              className="w-full h-full object-contain object-center"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => window.open(pdfPath, '_blank')}
          className="w-full"
        >
          Visualizza PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
import { FileQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NoDataMessageProps {
  title?: string;
  message?: string;
}

export function NoDataMessage({
  title = 'No Data Available',
  message = 'There is no data available for this location or time period.',
}: NoDataMessageProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <FileQuestion className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </CardContent>
    </Card>
  );
}

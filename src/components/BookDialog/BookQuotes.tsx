import { Share2, ThumbsUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BookDetails } from './types';

interface BookQuotesProps {
  quotes: BookDetails['quotes'];
}

export function BookQuotes({ quotes = [] }: BookQuotesProps) {
  if (quotes.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-900">인상적인 구절</p>
      <div className="space-y-3">
        {quotes.map(quote => (
          <div key={quote.id} className="rounded-2xl bg-gray-50 p-4">
            <p className="text-sm text-gray-800 italic">{quote.content}</p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <p className="text-gray-500">p. {quote.page}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-full px-2.5 text-gray-600 hover:bg-gray-100"
                >
                  <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                  <span>{quote.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-full px-2.5 text-gray-600 hover:bg-gray-100"
                >
                  <Share2 className="mr-1 h-3.5 w-3.5" />
                  <span>공유</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

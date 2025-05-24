'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { FeedbackDialog } from './FeedbackDialog';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 cursor-pointer rounded-full hover:bg-gray-100"
              onClick={() => setIsOpen(true)}
              aria-label="피드백 남기기"
            >
              <Send className="h-5 w-5 text-gray-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">피드백 남기기</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <FeedbackDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

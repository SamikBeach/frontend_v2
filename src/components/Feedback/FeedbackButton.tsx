'use client';

import { HelpCircle } from 'lucide-react';
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
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => setIsOpen(true)}
              aria-label="피드백 남기기"
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
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

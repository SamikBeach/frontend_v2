import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

export interface ComboboxOption {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  showEmpty?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  onSelect,
  placeholder = '선택...',
  emptyMessage = '항목이 없습니다',
  showEmpty = false,
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue: string) => {
    onSelect(currentValue);
    setOpen(false);
  };

  // 검색 결과가 없을 때의 동작 처리
  const handleEmptySelect = () => {
    if (value.trim()) {
      onSelect(value.trim());
      setOpen(false);
    }
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <div
          className={cn(
            'border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="placeholder:text-muted-foreground w-full border-0 bg-transparent text-base outline-none placeholder:text-sm md:text-sm md:placeholder:text-sm"
            placeholder={placeholder}
            disabled={disabled}
          />
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="bg-popover text-popover-foreground animate-in zoom-in-95 z-50 min-w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-md border shadow-md"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <Command className="bg-transparent">
            <CommandInput placeholder={placeholder} />
            <CommandList>
              {showEmpty && (
                <CommandEmpty className="py-2">
                  {emptyMessage}
                  {value.trim() && (
                    <Button
                      variant="ghost"
                      className="mt-2 w-full justify-start px-2 text-sm"
                      onClick={handleEmptySelect}
                    >
                      &quot;{value.trim()}&quot; 추가
                    </Button>
                  )}
                </CommandEmpty>
              )}
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={handleSelect}
                    className="flex items-center gap-2"
                  >
                    {option.icon}
                    <div className="flex-1">
                      <div className="text-sm">{option.label}</div>
                      {option.description && (
                        <div className="text-muted-foreground text-xs">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {value === option.value && (
                      <CheckIcon className="text-primary h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

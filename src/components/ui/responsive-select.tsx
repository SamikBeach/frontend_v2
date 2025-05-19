'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';

// Context to share mobile status and selection state
const ResponsiveSelectContext = React.createContext<{
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value: string | undefined;
  setValue: (value: string) => void;
}>({
  isMobile: false,
  isOpen: false,
  setIsOpen: () => undefined,
  value: undefined,
  setValue: () => undefined,
});

// Root component
function ResponsiveSelectRoot({
  children,
  open,
  onOpenChange,
  value,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Root>, 'defaultValue'> & {
  shouldScaleBackground?: boolean;
  snapPoints?: Array<number>;
}) {
  const isMobile = useIsMobile();

  // 내부 상태 관리
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    value
  );

  // Props가 전달됐는지 여부 확인
  const isOpenControlled = open !== undefined;
  const isValueControlled = value !== undefined && onValueChange !== undefined;

  const isOpen = isOpenControlled ? open : internalOpen;
  // 제어 모드에서는 항상 외부 값을 사용, 비제어 모드에서는 내부 상태 사용
  const currentValue = isValueControlled ? value : internalValue;

  // 상태 변경 핸들러
  const handleOpenChange = (newOpen: boolean) => {
    if (!isOpenControlled) {
      setInternalOpen(newOpen);
    }

    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  // 값 변경 핸들러
  const handleValueChange = (newValue: string) => {
    if (!isValueControlled) {
      setInternalValue(newValue);
    }

    if (onValueChange) {
      onValueChange(newValue);
    }

    // 모바일에서 값을 선택하면 드로어를 닫음
    if (isMobile) {
      handleOpenChange(false);
    }
  };

  return (
    <ResponsiveSelectContext.Provider
      value={{
        isMobile,
        isOpen: isOpen || false,
        setIsOpen: handleOpenChange,
        value: currentValue,
        setValue: handleValueChange,
      }}
    >
      {isMobile ? (
        // 모바일에서는 Drawer 사용
        <DrawerPrimitive.Root
          data-slot="drawer"
          shouldScaleBackground={props.shouldScaleBackground}
          snapPoints={props.snapPoints}
          open={isOpen}
          onOpenChange={handleOpenChange}
        >
          {children}
        </DrawerPrimitive.Root>
      ) : (
        // 데스크톱에서는 일반 Select 사용
        <SelectPrimitive.Root
          data-slot="select"
          open={isOpen}
          onOpenChange={handleOpenChange}
          value={currentValue}
          onValueChange={handleValueChange}
          {...props}
        >
          {children}
        </SelectPrimitive.Root>
      )}
    </ResponsiveSelectContext.Provider>
  );
}

// Context hook
function useResponsiveSelect() {
  const context = React.useContext(ResponsiveSelectContext);
  if (!context) {
    throw new Error(
      'ResponsiveSelect components must be used within ResponsiveSelect'
    );
  }
  return context;
}

// Trigger component
function ResponsiveSelectTrigger({
  className,
  children,
  size = 'default',
  placeholder,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
  placeholder?: string;
}) {
  const { isMobile, setIsOpen, value } = useResponsiveSelect();

  const triggerClasses = cn(
    "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className
  );

  if (isMobile) {
    return (
      <DrawerPrimitive.Trigger
        data-slot="drawer-trigger"
        data-size={size}
        className={triggerClasses}
        onClick={() => setIsOpen(true)}
        {...props}
      >
        {value ? (
          children
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDownIcon className="size-4 opacity-50" />
      </DrawerPrimitive.Trigger>
    );
  }

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={triggerClasses}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// Content component
function ResponsiveSelectContent({
  className,
  drawerClassName,
  drawerOverlayClassName,
  children,
  position = 'popper',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  drawerClassName?: string;
  drawerOverlayClassName?: string;
}) {
  const { isMobile } = useResponsiveSelect();

  if (isMobile) {
    return (
      <DrawerPrimitive.Portal data-slot="drawer-portal">
        <DrawerPrimitive.Overlay
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-51 bg-black/15',
            drawerOverlayClassName
          )}
        />
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            'bg-popover text-popover-foreground fixed z-52 flex flex-col items-start',
            'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-[10px] data-[vaul-drawer-direction=bottom]:border-t-0',
            'space-y-3 p-4',
            drawerClassName
          )}
          {...props}
        >
          <DrawerPrimitive.Title className="sr-only">
            선택 메뉴
          </DrawerPrimitive.Title>
          <div className="mx-auto h-1 w-[36px] flex-none shrink-0 rounded-full bg-gray-300" />
          <div className="w-full overflow-y-auto">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        sideOffset={sideOffset}
        position={position}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// Item component
function ResponsiveSelectItem({
  className,
  drawerClassName,
  children,
  value,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Item>, 'value'> & {
  drawerClassName?: string;
  value: string;
}) {
  const { isMobile, setValue, value: selectedValue } = useResponsiveSelect();
  const isSelected = selectedValue === value;

  const handleClick = () => {
    if (isMobile) {
      setValue(value);
    }
  };

  if (isMobile) {
    return (
      <div
        role="option"
        aria-selected={isSelected}
        data-state={isSelected ? 'checked' : 'unchecked'}
        className={cn(
          'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-3 text-sm select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          isSelected ? 'bg-accent/50' : '',
          drawerClassName || className
        )}
        onClick={handleClick}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {isSelected && (
          <span className="flex h-4 w-4 items-center justify-center">
            <CheckIcon className="h-4 w-4" />
          </span>
        )}
      </div>
    );
  }

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      value={value}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

// Group component
function ResponsiveSelectGroup({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveSelect();

  return (
    <div
      className={cn(isMobile ? drawerClassName : className)}
      role="group"
      {...props}
    />
  );
}

// Label component
function ResponsiveSelectLabel({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveSelect();

  if (isMobile) {
    return (
      <div
        className={cn(
          'text-muted-foreground px-2 py-1.5 text-xs font-medium',
          drawerClassName || className
        )}
        {...props}
      />
    );
  }

  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    />
  );
}

// Value component
function ResponsiveSelectValue({
  placeholder,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  const { isMobile, value } = useResponsiveSelect();

  if (isMobile) {
    return value || placeholder || null;
  }

  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      placeholder={placeholder}
      {...props}
    />
  );
}

// Separator component
function ResponsiveSelectSeparator({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveSelect();

  return (
    <div
      className={cn(
        'bg-border pointer-events-none -mx-1 my-1 h-px',
        isMobile ? drawerClassName : className
      )}
      {...props}
    />
  );
}

// ScrollUpButton component (only for desktop)
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

// ScrollDownButton component (only for desktop)
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

// Close button (mobile only)
function ResponsiveSelectClose({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  const { isMobile } = useResponsiveSelect();

  if (isMobile) {
    return (
      <DrawerPrimitive.Close
        className={cn(
          'ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none',
          className
        )}
        {...props}
      >
        <XIcon className="h-4 w-4" />
        <span className="sr-only">닫기</span>
      </DrawerPrimitive.Close>
    );
  }

  // For desktop, return null since we don't need a close button
  return null;
}

// Compound component
const ResponsiveSelect = Object.assign(ResponsiveSelectRoot, {
  Trigger: ResponsiveSelectTrigger,
  Content: ResponsiveSelectContent,
  Item: ResponsiveSelectItem,
  Group: ResponsiveSelectGroup,
  Label: ResponsiveSelectLabel,
  Value: ResponsiveSelectValue,
  Separator: ResponsiveSelectSeparator,
  Close: ResponsiveSelectClose,
});

export {
  ResponsiveSelect,
  ResponsiveSelectClose,
  ResponsiveSelectContent,
  ResponsiveSelectGroup,
  ResponsiveSelectItem,
  ResponsiveSelectLabel,
  ResponsiveSelectSeparator,
  ResponsiveSelectTrigger,
  ResponsiveSelectValue,
};

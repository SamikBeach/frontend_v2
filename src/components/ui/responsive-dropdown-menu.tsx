'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { cn } from '@/lib/utils';

// Context to share mobile status
const ResponsiveDropdownContext = React.createContext<{
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isMobile: false,
  isOpen: false,
  setIsOpen: () => undefined,
});

// Root component
function ResponsiveDropdownMenuRoot({
  children,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root> & {
  shouldScaleBackground?: boolean;
  snapPoints?: Array<number>;
}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  React.useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <ResponsiveDropdownContext.Provider value={{ isMobile, isOpen, setIsOpen }}>
      {isMobile ? (
        <Drawer
          open={isOpen}
          onOpenChange={setIsOpen}
          shouldScaleBackground={false}
          snapPoints={[1]}
          {...props}
        >
          {children}
        </Drawer>
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen} {...props}>
          {children}
        </DropdownMenu>
      )}
    </ResponsiveDropdownContext.Provider>
  );
}

// Context hook
function useResponsiveDropdown() {
  const context = React.useContext(ResponsiveDropdownContext);
  if (!context) {
    throw new Error(
      'ResponsiveDropdownMenu components must be used within ResponsiveDropdownMenu'
    );
  }
  return context;
}

// Trigger component
function ResponsiveDropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  const { isMobile, setIsOpen } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <DrawerTrigger
        className={className}
        onClick={() => setIsOpen(true)}
        {...props}
      />
    );
  }

  return <DropdownMenuTrigger className={className} {...props} />;
}

// Content component
function ResponsiveDropdownMenuContent({
  className,
  drawerClassName,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <DrawerContent className={cn('px-4', drawerClassName)} {...props}>
        <DrawerHeader>
          <DrawerTitle>메뉴</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col space-y-2 p-2">{children}</div>
      </DrawerContent>
    );
  }

  return (
    <DropdownMenuContent className={className} {...props}>
      {children}
    </DropdownMenuContent>
  );
}

// Item component that adapts between dropdown item and drawer item
function ResponsiveDropdownMenuItem({
  className,
  drawerClassName,
  onSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  drawerClassName?: string;
}) {
  const { isMobile, setIsOpen } = useResponsiveDropdown();

  const handleClick = React.useCallback(() => {
    if (isMobile) {
      onSelect?.(
        new Event('mousedown') as unknown as React.MouseEvent<
          HTMLDivElement,
          MouseEvent
        >
      );
      setIsOpen(false);
    }
  }, [isMobile, onSelect, setIsOpen]);

  if (isMobile) {
    return (
      <div
        className={cn(
          'hover:bg-accent flex cursor-pointer items-center rounded-md px-2 py-2 text-sm outline-none',
          drawerClassName
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuItem className={className} onSelect={onSelect} {...props} />
  );
}

// Separator component that adapts between dropdown separator and drawer separator
function ResponsiveDropdownMenuSeparator({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <div
        className={cn('bg-border -mx-1 my-1 h-px', drawerClassName)}
        {...props}
      />
    );
  }

  return <DropdownMenuSeparator className={className} {...props} />;
}

// Label component that adapts between dropdown label and drawer text
function ResponsiveDropdownMenuLabel({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <div
        className={cn(
          'text-foreground px-2 py-1.5 text-sm font-semibold',
          drawerClassName
        )}
        {...props}
      />
    );
  }

  return <DropdownMenuLabel className={className} {...props} />;
}

// Group component
function ResponsiveDropdownMenuGroup({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <div className={cn('flex flex-col gap-1', drawerClassName)} {...props} />
    );
  }

  return <DropdownMenuGroup className={className} {...props} />;
}

// Close component for mobile drawer
function ResponsiveDropdownMenuClose({
  className,
  ...props
}: React.ComponentProps<typeof DrawerClose>) {
  const { isMobile, setIsOpen } = useResponsiveDropdown();

  if (!isMobile) {
    return null;
  }

  return (
    <DrawerClose
      className={cn('absolute top-4 right-4', className)}
      onClick={() => setIsOpen(false)}
      {...props}
    />
  );
}

// Compound component
const ResponsiveDropdownMenu = Object.assign(ResponsiveDropdownMenuRoot, {
  Trigger: ResponsiveDropdownMenuTrigger,
  Content: ResponsiveDropdownMenuContent,
  Item: ResponsiveDropdownMenuItem,
  Separator: ResponsiveDropdownMenuSeparator,
  Label: ResponsiveDropdownMenuLabel,
  Group: ResponsiveDropdownMenuGroup,
  Close: ResponsiveDropdownMenuClose,
});

export {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuClose,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuGroup,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuLabel,
  ResponsiveDropdownMenuSeparator,
  ResponsiveDropdownMenuTrigger,
};

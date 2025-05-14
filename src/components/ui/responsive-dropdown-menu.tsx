'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronRightIcon, XIcon } from 'lucide-react';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';

// Context to share mobile status
const ResponsiveDropdownMenuContext = React.createContext<{
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

  // Sync isOpen state with open prop
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  // Notify parent component about state changes
  React.useEffect(() => {
    if (onOpenChange && open !== isOpen) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange, open]);

  return (
    <ResponsiveDropdownMenuContext.Provider
      value={{ isMobile, isOpen, setIsOpen }}
    >
      {isMobile ? (
        <DrawerPrimitive.Root
          data-slot="drawer"
          shouldScaleBackground={props.shouldScaleBackground}
          snapPoints={props.snapPoints}
          open={isOpen}
          onOpenChange={setIsOpen}
          modal={props.modal}
        >
          {children}
        </DrawerPrimitive.Root>
      ) : (
        <DropdownMenuPrimitive.Root
          data-slot="dropdown-menu"
          open={isOpen}
          onOpenChange={setIsOpen}
          modal={props.modal}
        >
          {children}
        </DropdownMenuPrimitive.Root>
      )}
    </ResponsiveDropdownMenuContext.Provider>
  );
}

// Context hook
function useResponsiveDropdown() {
  const context = React.useContext(ResponsiveDropdownMenuContext);
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
  const { isMobile } = useResponsiveDropdown();
  return isMobile ? (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      className={className}
      {...props}
    />
  ) : (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={className}
      {...props}
    />
  );
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
      <DrawerPrimitive.Portal data-slot="drawer-portal">
        <DrawerPrimitive.Overlay
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/15'
          )}
        />
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            'group/drawer-content bg-background fixed z-50 flex flex-col',
            'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-[20px] data-[vaul-drawer-direction=bottom]:border-t-0',
            'max-h-[100dvh]',
            'space-y-4 p-4',
            drawerClassName
          )}
          {...props}
        >
          <DrawerPrimitive.Title className="sr-only">
            Menu
          </DrawerPrimitive.Title>
          <div className="mx-auto mt-2.5 h-1 w-[36px] flex-none shrink-0 rounded-full bg-gray-300" />
          <div className="flex-1 space-y-3 overflow-auto">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

// Item component
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
      if (onSelect) {
        const syntheticEvent = {
          preventDefault: () => {},
          stopPropagation: () => {},
          currentTarget: document.createElement('div'),
          target: document.createElement('div'),
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
        };
        onSelect(syntheticEvent as any);
      }
      setIsOpen(false);
    }
  }, [isMobile, onSelect, setIsOpen]);

  if (isMobile) {
    return (
      <div
        role="menuitem"
        className={cn(
          'focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center rounded-md px-4 py-3 text-sm font-medium transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          drawerClassName || className
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onSelect={onSelect}
      {...props}
    />
  );
}

// Separator component
function ResponsiveDropdownMenuSeparator({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdown();

  return (
    <div
      className={cn(
        'bg-border -mx-1 my-1 h-px',
        isMobile ? drawerClassName : className
      )}
      {...props}
    />
  );
}

// Label component
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
          'px-2 py-1.5 text-sm font-semibold',
          drawerClassName || className
        )}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuPrimitive.Label
      className={cn('px-2 py-1.5 text-sm font-semibold', className)}
      {...props}
    />
  );
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

  return (
    <div
      className={cn(isMobile ? drawerClassName : className)}
      role="group"
      {...props}
    />
  );
}

// Close button (mobile only)
function ResponsiveDropdownMenuClose({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return (
    <DrawerPrimitive.Close
      className={cn(
        'ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      <XIcon className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </DrawerPrimitive.Close>
  );
}

// Sub menu components
function ResponsiveDropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return <DrawerPrimitive.NestedRoot {...props} />;
  }

  return <DropdownMenuPrimitive.Sub {...props} />;
}

function ResponsiveDropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <DrawerPrimitive.Trigger
        className={cn(
          'flex w-full cursor-pointer items-center rounded-md px-4 py-3 text-sm font-medium outline-none',
          className
        )}
      >
        {children}
        <ChevronRightIcon className="ml-auto h-4 w-4" />
      </DrawerPrimitive.Trigger>
    );
  }

  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        'focus:bg-accent data-[state=open]:bg-accent flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function ResponsiveDropdownMenuSubContent({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DrawerPrimitive.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[94%] flex-col rounded-t-[10px] bg-white',
            drawerClassName || className
          )}
          {...props}
        >
          <DrawerPrimitive.Title className="sr-only">
            Submenu
          </DrawerPrimitive.Title>
          <div className="mx-auto mt-2.5 h-1 w-[36px] flex-none shrink-0 rounded-full bg-gray-300" />
          <div className="flex-1 space-y-3 overflow-auto p-4">
            {props.children}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
        className
      )}
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
  Sub: ResponsiveDropdownMenuSub,
  SubTrigger: ResponsiveDropdownMenuSubTrigger,
  SubContent: ResponsiveDropdownMenuSubContent,
});

export {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuClose,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuGroup,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuLabel,
  ResponsiveDropdownMenuSeparator,
  ResponsiveDropdownMenuSub,
  ResponsiveDropdownMenuSubContent,
  ResponsiveDropdownMenuSubTrigger,
  ResponsiveDropdownMenuTrigger,
};

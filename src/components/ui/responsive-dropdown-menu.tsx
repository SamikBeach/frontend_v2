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
  setIsOpen: (open: boolean) => void;
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

  // Create a handler for open state changes
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <ResponsiveDropdownMenuContext.Provider
      value={{ isMobile, isOpen: open || false, setIsOpen: handleOpenChange }}
    >
      {isMobile ? (
        <DrawerPrimitive.Root
          data-slot="drawer"
          shouldScaleBackground={props.shouldScaleBackground}
          snapPoints={props.snapPoints}
          open={open}
          onOpenChange={handleOpenChange}
          modal={props.modal}
        >
          {children}
        </DrawerPrimitive.Root>
      ) : (
        <DropdownMenuPrimitive.Root
          data-slot="dropdown-menu"
          open={open}
          onOpenChange={handleOpenChange}
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
  sideOffset = 4,
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
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-51 bg-black/15'
          )}
        />
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            'bg-popover text-popover-foreground fixed z-52 flex flex-col',
            'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-[10px] data-[vaul-drawer-direction=bottom]:border-t-0',
            'space-y-3 p-4',
            'max-h-[94%]', // Limit height to adapt to content
            drawerClassName
          )}
          {...props}
        >
          <DrawerPrimitive.Title className="sr-only">
            Menu
          </DrawerPrimitive.Title>
          <div className="mx-auto h-1 w-[36px] flex-none shrink-0 rounded-full bg-gray-300" />
          <div className="space-y-2">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
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
  inset,
  variant = 'default',
  onSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  drawerClassName?: string;
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  const { isMobile, setIsOpen } = useResponsiveDropdown();

  const handleClick = () => {
    if (isMobile) {
      if (onSelect) {
        onSelect({} as any);
      }
      setIsOpen(false);
    }
  };

  if (isMobile) {
    return (
      <div
        role="menuitem"
        data-inset={inset}
        data-variant={variant}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative my-1 flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-3 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          drawerClassName || className
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  drawerClassName?: string;
  inset?: boolean;
}) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <div
        data-inset={inset}
        className={cn(
          'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
          drawerClassName || className
        )}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
        className
      )}
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
  const { isMobile } = useResponsiveDropdown();

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
        <span className="sr-only">Close</span>
      </DrawerPrimitive.Close>
    );
  }

  // For desktop, return null since we don't need a close button
  return null;
}

// Sub menu components
function ResponsiveDropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return <DrawerPrimitive.NestedRoot {...props} />;
  }

  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function ResponsiveDropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  const { isMobile } = useResponsiveDropdown();

  if (isMobile) {
    return (
      <DrawerPrimitive.Trigger
        data-inset={inset}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative my-1 flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-3 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
      >
        <div className="flex flex-1 items-center gap-2">{children}</div>
        <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
      </DrawerPrimitive.Trigger>
    );
  }

  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">{children}</div>
      <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
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
            'bg-popover text-popover-foreground fixed inset-x-0 bottom-0 z-50 mt-24 flex flex-col space-y-3 rounded-t-[10px] border p-4 shadow-lg',
            'max-h-[94%]', // Limit height to adapt to content
            'w-full', // Ensure full width
            drawerClassName || className
          )}
          {...props}
        >
          <DrawerPrimitive.Title className="sr-only">
            Submenu
          </DrawerPrimitive.Title>
          <div className="mx-auto h-1 w-[36px] flex-none shrink-0 rounded-full bg-gray-300" />
          <div className="w-full space-y-1">{props.children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
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

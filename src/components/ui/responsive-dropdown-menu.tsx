'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Drawer,
  DrawerContent,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

// Context to share mobile status
const ResponsiveDropdownMenuContext = React.createContext<{
  isMobile: boolean;
}>({
  isMobile: false,
});

// Root component
function ResponsiveDropdownMenuRoot({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root> & {
  shouldScaleBackground?: boolean;
  snapPoints?: Array<number | string>;
}) {
  const isMobile = useIsMobile();

  return (
    <ResponsiveDropdownMenuContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer {...props}>{children}</Drawer>
      ) : (
        <DropdownMenu {...props}>{children}</DropdownMenu>
      )}
    </ResponsiveDropdownMenuContext.Provider>
  );
}

// Context hook
function useResponsiveDropdownMenu() {
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
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  const { isMobile } = useResponsiveDropdownMenu();
  return isMobile ? (
    <DrawerTrigger {...props} />
  ) : (
    <DropdownMenuTrigger {...props} />
  );
}

// Portal component
function ResponsiveDropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  const { isMobile } = useResponsiveDropdownMenu();
  return isMobile ? (
    <DrawerPortal {...props} />
  ) : (
    <DropdownMenuPortal {...props} />
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
  const { isMobile } = useResponsiveDropdownMenu();

  if (isMobile) {
    return (
      <DrawerContent
        className={cn('mt-auto h-[80vh] max-h-[80vh]', drawerClassName)}
        {...props}
      >
        {children}
      </DrawerContent>
    );
  }

  return (
    <DropdownMenuContent className={className} {...props}>
      {children}
    </DropdownMenuContent>
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
  const { isMobile } = useResponsiveDropdownMenu();

  return isMobile ? (
    <div className={cn('p-4', drawerClassName)} {...props} />
  ) : (
    <DropdownMenuGroup className={className} {...props} />
  );
}

// Item component
function ResponsiveDropdownMenuItem({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdownMenu();

  return isMobile ? (
    <button
      type="button"
      className={cn(
        'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100',
        drawerClassName
      )}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  ) : (
    <DropdownMenuItem className={className} {...props} />
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
  const { isMobile } = useResponsiveDropdownMenu();

  return isMobile ? (
    <div
      className={cn('px-3 py-2 text-sm font-medium', drawerClassName)}
      {...props}
    />
  ) : (
    <DropdownMenuLabel className={className} {...props} />
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
  const { isMobile } = useResponsiveDropdownMenu();

  return isMobile ? (
    <div className={cn('my-1 h-px bg-gray-200', drawerClassName)} {...props} />
  ) : (
    <DropdownMenuSeparator className={className} {...props} />
  );
}

// CheckboxItem component
function ResponsiveDropdownMenuCheckboxItem({
  className,
  drawerClassName,
  checked,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdownMenu();

  return isMobile ? (
    <button
      type="button"
      className={cn(
        'flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100',
        drawerClassName
      )}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span
        className={cn('mr-2', checked ? 'text-blue-600' : 'text-transparent')}
      >
        ✓
      </span>
      {children}
    </button>
  ) : (
    <DropdownMenuCheckboxItem
      checked={checked}
      className={className}
      {...props}
    >
      {children}
    </DropdownMenuCheckboxItem>
  );
}

// Title component for accessibility
function ResponsiveDropdownMenuTitle({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDropdownMenu();

  return isMobile ? (
    <DrawerTitle className={cn(className, drawerClassName)} {...props} />
  ) : (
    <DropdownMenuLabel className={className} {...props} />
  );
}

// Compound component
const ResponsiveDropdownMenu = Object.assign(ResponsiveDropdownMenuRoot, {
  Trigger: ResponsiveDropdownMenuTrigger,
  Portal: ResponsiveDropdownMenuPortal,
  Content: ResponsiveDropdownMenuContent,
  Group: ResponsiveDropdownMenuGroup,
  Item: ResponsiveDropdownMenuItem,
  Label: ResponsiveDropdownMenuLabel,
  Separator: ResponsiveDropdownMenuSeparator,
  CheckboxItem: ResponsiveDropdownMenuCheckboxItem,
  Title: ResponsiveDropdownMenuTitle,
});

export {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuCheckboxItem,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuGroup,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuLabel,
  ResponsiveDropdownMenuPortal,
  ResponsiveDropdownMenuSeparator,
  ResponsiveDropdownMenuTitle,
  ResponsiveDropdownMenuTrigger,
};

'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

// Context to share mobile status
const ResponsiveDialogContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

// Root component
function ResponsiveDialogRoot({
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const isMobile = useIsMobile();

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer {...props}>{children}</Drawer>
      ) : (
        <Dialog {...props}>{children}</Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  );
}

// Context hook
function useResponsiveDialog() {
  const context = React.useContext(ResponsiveDialogContext);
  if (!context) {
    throw new Error(
      'ResponsiveDialog components must be used within ResponsiveDialog'
    );
  }
  return context;
}

// Portal component
function ResponsiveDialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? <DrawerPortal {...props} /> : <DialogPortal {...props} />;
}

// Overlay component
function ResponsiveDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? (
    // Drawer already handles its own overlay
    <React.Fragment />
  ) : (
    <DialogOverlay className={className} {...props} />
  );
}

// Trigger component
function ResponsiveDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? <DrawerTrigger {...props} /> : <DialogTrigger {...props} />;
}

// Content component
function ResponsiveDialogContent({
  className,
  drawerClassName,
  children,
  overlayClassName,
  hideCloseButton = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  overlayClassName?: string;
  hideCloseButton?: boolean;
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <DrawerContent className={cn(drawerClassName)} {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent
      className={className}
      overlayClassName={overlayClassName}
      hideCloseButton={hideCloseButton}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

// Header component
function ResponsiveDialogHeader({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<'div'> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? (
    <DrawerHeader className={drawerClassName} {...props} />
  ) : (
    <DialogHeader className={className} {...props} />
  );
}

// Footer component
function ResponsiveDialogFooter({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<'div'> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? (
    <DrawerFooter className={drawerClassName} {...props} />
  ) : (
    <DialogFooter className={className} {...props} />
  );
}

// Title component
function ResponsiveDialogTitle({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? (
    <DrawerTitle className={drawerClassName} {...props} />
  ) : (
    <DialogTitle className={className} {...props} />
  );
}

// Description component
function ResponsiveDialogDescription({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? (
    <DrawerDescription className={drawerClassName} {...props} />
  ) : (
    <DialogDescription className={className} {...props} />
  );
}

// Close component
function ResponsiveDialogClose({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? (
    <DrawerClose className={drawerClassName} {...props} />
  ) : (
    <DialogClose className={className} {...props} />
  );
}

// Compound component
const ResponsiveDialog = Object.assign(ResponsiveDialogRoot, {
  Trigger: ResponsiveDialogTrigger,
  Content: ResponsiveDialogContent,
  Header: ResponsiveDialogHeader,
  Footer: ResponsiveDialogFooter,
  Title: ResponsiveDialogTitle,
  Description: ResponsiveDialogDescription,
  Close: ResponsiveDialogClose,
  Portal: ResponsiveDialogPortal,
  Overlay: ResponsiveDialogOverlay,
});

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogOverlay,
  ResponsiveDialogPortal,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};

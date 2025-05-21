'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';

// Context to share mobile status
const ResponsiveDialogContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

// Root component
function ResponsiveDialogRoot({
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
  shouldScaleBackground?: boolean;
  snapPoints?: Array<number>;
}) {
  const isMobile = useIsMobile();

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <DrawerPrimitive.Root
          data-slot="drawer"
          shouldScaleBackground={props.shouldScaleBackground}
          snapPoints={props.snapPoints}
          open={props.open}
          onOpenChange={props.onOpenChange}
          modal={props.modal}
        >
          {children}
        </DrawerPrimitive.Root>
      ) : (
        <DialogPrimitive.Root
          data-slot="dialog"
          open={props.open}
          onOpenChange={props.onOpenChange}
          modal={props.modal}
        >
          {children}
        </DialogPrimitive.Root>
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
  return isMobile ? (
    <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
  ) : (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
  );
}

// Overlay component
function ResponsiveDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <DrawerPrimitive.Overlay
        data-slot="drawer-overlay"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/15',
          className
        )}
        {...props}
      />
    );
  }

  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  );
}

// Trigger component
function ResponsiveDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const { isMobile } = useResponsiveDialog();
  return isMobile ? (
    <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
  ) : (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
  );
}

// Content component
function ResponsiveDialogContent({
  className,
  drawerClassName,
  children,
  drawerOverlayClassName,
  dialogOverlayClassName,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  drawerClassName?: string;
  drawerOverlayClassName?: string;
  dialogOverlayClassName?: string;
}) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <DrawerPrimitive.Portal data-slot="drawer-portal">
        <DrawerPrimitive.Overlay
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/15',
            drawerOverlayClassName
          )}
        />
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            'group/drawer-content bg-background fixed z-50 flex flex-col',
            'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-[20px] data-[vaul-drawer-direction=bottom]:border-t-0',
            // Height adapts to content
            'max-h-[100dvh]',
            drawerClassName
          )}
          {...props}
        >
          <div className="mx-auto mt-2.5 h-1 w-[36px] flex-none shrink-0 rounded-full bg-gray-300" />
          <div className="flex-1 overflow-auto">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <DialogPrimitive.Portal data-slot="dialog-portal">
      <DialogPrimitive.Overlay
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
          dialogOverlayClassName
        )}
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// Header component
function ResponsiveDialogHeader({
  className,
  drawerClassName,
  onClose,
  hideCloseButton = false,
  ...props
}: React.ComponentProps<'div'> & {
  drawerClassName?: string;
  onClose?: () => void;
  hideCloseButton?: boolean;
}) {
  const { isMobile } = useResponsiveDialog();
  return (
    <div
      data-slot={isMobile ? 'drawer-header' : 'dialog-header'}
      className={cn(
        'sticky top-0 z-10 flex flex-row items-center justify-between',
        isMobile
          ? cn('gap-1.5 p-4', drawerClassName)
          : cn('gap-2 text-center sm:text-left', className)
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">{props.children}</div>
      {!hideCloseButton &&
        (isMobile ? (
          <DrawerPrimitive.Close
            data-slot="drawer-close"
            aria-label="닫기"
            onClick={onClose}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          >
            <XIcon className="h-4 w-4" />
          </DrawerPrimitive.Close>
        ) : (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label="닫기"
            onClick={onClose}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          >
            <XIcon className="h-4 w-4" />
          </DialogPrimitive.Close>
        ))}
    </div>
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
  return (
    <div
      data-slot={isMobile ? 'drawer-footer' : 'dialog-footer'}
      className={cn(
        isMobile
          ? cn('mt-auto flex flex-col-reverse gap-2 p-4', drawerClassName)
          : cn(
              'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
              className
            )
      )}
      {...props}
    />
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

  if (isMobile) {
    return (
      <DrawerPrimitive.Title
        data-slot="drawer-title"
        className={cn('text-foreground font-semibold', drawerClassName)}
        {...props}
      />
    );
  }

  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
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

  if (isMobile) {
    return (
      <DrawerPrimitive.Description
        data-slot="drawer-description"
        className={cn('text-muted-foreground text-sm', drawerClassName)}
        {...props}
      />
    );
  }

  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
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
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      className={cn(drawerClassName)}
      {...props}
    />
  ) : (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn(className)}
      {...props}
    />
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

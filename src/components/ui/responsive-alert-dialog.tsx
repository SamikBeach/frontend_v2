'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Context to share mobile status
const ResponsiveAlertDialogContext = React.createContext<{
  isMobile: boolean;
}>({
  isMobile: false,
});

// Root component
function ResponsiveAlertDialogRoot({
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root> & {
  shouldScaleBackground?: boolean;
  snapPoints?: Array<number>;
  modal?: boolean;
}) {
  const isMobile = useIsMobile();

  return (
    <ResponsiveAlertDialogContext.Provider value={{ isMobile }}>
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
        <AlertDialogPrimitive.Root
          data-slot="alert-dialog"
          open={props.open}
          onOpenChange={props.onOpenChange}
        >
          {children}
        </AlertDialogPrimitive.Root>
      )}
    </ResponsiveAlertDialogContext.Provider>
  );
}

// Context hook
function useResponsiveAlertDialog() {
  const context = React.useContext(ResponsiveAlertDialogContext);
  if (!context) {
    throw new Error(
      'ResponsiveAlertDialog components must be used within ResponsiveAlertDialog'
    );
  }
  return context;
}

// Trigger component
function ResponsiveAlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  const { isMobile } = useResponsiveAlertDialog();
  return isMobile ? (
    <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
  ) : (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

// Portal component
function ResponsiveAlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  const { isMobile } = useResponsiveAlertDialog();
  return isMobile ? (
    <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
  ) : (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

// Content component
function ResponsiveAlertDialogContent({
  className,
  drawerClassName,
  children,
  drawerOverlayClassName,
  dialogOverlayClassName,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  drawerClassName?: string;
  drawerOverlayClassName?: string;
  dialogOverlayClassName?: string;
}) {
  const { isMobile } = useResponsiveAlertDialog();

  if (isMobile) {
    return (
      <DrawerPrimitive.Portal data-slot="drawer-portal">
        <DrawerPrimitive.Overlay
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/15',
            drawerOverlayClassName
          )}
        />
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            'group/drawer-content bg-background fixed z-50 flex flex-col',
            'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:rounded-t-[20px] data-[vaul-drawer-direction=bottom]:border-t-0',
            // Height adapts to content
            'max-h-[80dvh]',
            drawerClassName
          )}
          {...props}
        >
          <div className="mx-auto mt-2.5 h-1 w-[36px] flex-none shrink-0 rounded-full bg-gray-300" />
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal">
      <AlertDialogPrimitive.Overlay
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
          dialogOverlayClassName
        )}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}

// Header component
function ResponsiveAlertDialogHeader({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<'div'> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveAlertDialog();
  return (
    <div
      data-slot={isMobile ? 'drawer-header' : 'alert-dialog-header'}
      className={cn(
        isMobile
          ? cn('flex flex-col gap-1.5', drawerClassName)
          : cn('flex flex-col gap-2 text-center sm:text-left', className)
      )}
      {...props}
    />
  );
}

// Footer component
function ResponsiveAlertDialogFooter({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<'div'> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveAlertDialog();
  return (
    <div
      data-slot={isMobile ? 'drawer-footer' : 'alert-dialog-footer'}
      className={cn(
        isMobile
          ? cn('mt-6 flex flex-col gap-2', drawerClassName)
          : cn(
              'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
              className
            )
      )}
      {...props}
    />
  );
}

// Title component
function ResponsiveAlertDialogTitle({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveAlertDialog();

  if (isMobile) {
    return (
      <DrawerPrimitive.Title
        data-slot="drawer-title"
        className={cn('text-lg font-semibold', drawerClassName)}
        {...props}
      />
    );
  }

  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
}

// Description component
function ResponsiveAlertDialogDescription({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveAlertDialog();

  if (isMobile) {
    return (
      <div
        data-slot="drawer-description"
        className={cn('text-muted-foreground mb-2 text-sm', drawerClassName)}
        {...props}
      />
    );
  }

  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-muted-foreground mb-2 text-sm', className)}
      {...props}
    />
  );
}

// Action button component
function ResponsiveAlertDialogAction({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveAlertDialog();
  return isMobile ? (
    <Button
      data-slot="drawer-action"
      className={cn(drawerClassName)}
      {...props}
    />
  ) : (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

// Cancel button component
function ResponsiveAlertDialogCancel({
  className,
  drawerClassName,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
  drawerClassName?: string;
}) {
  const { isMobile } = useResponsiveAlertDialog();
  return isMobile ? (
    <Button
      variant="outline"
      data-slot="drawer-cancel"
      className={cn(drawerClassName)}
      {...props}
    />
  ) : (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  );
}

// Compound component
const ResponsiveAlertDialog = Object.assign(ResponsiveAlertDialogRoot, {
  Trigger: ResponsiveAlertDialogTrigger,
  Content: ResponsiveAlertDialogContent,
  Header: ResponsiveAlertDialogHeader,
  Footer: ResponsiveAlertDialogFooter,
  Title: ResponsiveAlertDialogTitle,
  Description: ResponsiveAlertDialogDescription,
  Action: ResponsiveAlertDialogAction,
  Cancel: ResponsiveAlertDialogCancel,
});

export {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
  ResponsiveAlertDialogTrigger,
};

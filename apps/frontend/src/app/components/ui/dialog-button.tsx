import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { Button, ButtonProps } from './button';

interface DialogButtonProps extends ButtonProps {
  label: string;
}

export function DialogButton({ className, variant, size, label, children }: DialogButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={className} size={size} variant={variant} onClick={() => setIsDialogOpen(true)}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

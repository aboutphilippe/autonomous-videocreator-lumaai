"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

export function LabelColor({ name, color }: { name: string; color?: string }) {
  return (
    <div className="flex p-1 border border-gray-700 rounded-lg text-xs items-center">
      <div
        className={`inline-block h-2 w-2 rounded-full mr-1`}
        style={{ backgroundColor: `#${color ? color.toLowerCase() : "000"}` }}
      ></div>
      <span>{name}</span>
    </div>
  );
}

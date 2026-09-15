import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors", { variants: { variant: { default: "border-transparent bg-primary text-primary-foreground", secondary: "border-transparent bg-secondary text-secondary-foreground", outline: "border-border text-foreground", success: "border-transparent bg-emerald-500/15 text-emerald-300", warning: "border-transparent bg-amber-500/15 text-amber-200" } }, defaultVariants: { variant: "default" } });
function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) { return <span data-slot="badge" className={cn("badge", badgeVariants({ variant }), className)} {...props} />; }
export { Badge, badgeVariants };

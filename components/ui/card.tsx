import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="card" className={cn("rounded-xl border border-border bg-card text-card-foreground", className)} {...props} />; }
function CardHeader({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="card-header" className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />; }
function CardTitle({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="card-title" className={cn("font-semibold leading-none", className)} {...props} />; }
function CardDescription({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />; }
function CardContent({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="card-content" className={cn("px-5 pb-5", className)} {...props} />; }

export { Card, CardHeader, CardTitle, CardDescription, CardContent };

import type { ComponentProps, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type FrameProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "footer";
};

export function SiteFrame({ as: Tag = "div", className, ...props }: FrameProps) {
  return <Tag className={cn("mx-auto w-[min(1200px,calc(100%-96px))] max-tablet:w-[calc(100%-64px)] max-mobile:w-[calc(100%-40px)] max-small:w-[calc(100%-28px)]", className)} {...props} />;
}

const siteLinkVariants = cva("inline-flex items-center justify-center gap-5 rounded-[7px] border border-transparent font-[550] transition-[background,border-color,box-shadow] duration-250 ease-[ease] rtl:[&_svg]:-scale-x-100", {
  variants: {
    variant: {
      primary: "bg-[#f2f2f4] text-[#141416] hover:bg-white hover:shadow-[0_0_25px_#a18fff20]",
      secondary: "border-[#36363b] bg-[#111113] hover:border-[#686870] hover:bg-[#1d1d22]",
    },
    size: {
      default: "min-h-11.5 px-[21px] py-[11px] text-[13px]",
      header: "min-h-9 px-[13px] py-[7px] text-[12px] [&_svg]:size-[15px]",
      pricing: "mt-5 min-h-10 w-full justify-between px-3.5 py-[11px] text-[11px] max-mobile:mt-6 max-mobile:text-[12px] [&_svg]:w-[15px]",
    },
  },
  defaultVariants: { variant: "secondary", size: "default" },
});

export function SiteLink({ className, variant, size, ...props }: ComponentProps<"a"> & VariantProps<typeof siteLinkVariants>) {
  return <a className={cn(siteLinkVariants({ variant, size }), className)} {...props} />;
}

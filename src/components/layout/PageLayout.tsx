import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
}

export function PageLayout({
  children,
  className,
  maxWidth = "2xl",
}: PageLayoutProps) {
  return (
    <div className="min-h-screen p-8">
      <div
        className={cn(
          "mx-auto",
          {
            "max-w-sm": maxWidth === "sm",
            "max-w-md": maxWidth === "md",
            "max-w-lg": maxWidth === "lg",
            "max-w-xl": maxWidth === "xl",
            "max-w-2xl": maxWidth === "2xl",
            "max-w-7xl": maxWidth === "7xl",
          },
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
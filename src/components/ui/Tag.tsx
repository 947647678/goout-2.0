import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  color?: string;
  variant?: "soft" | "solid";
  className?: string;
}

export function Tag({
  children,
  color = "#7B6B5D",
  variant = "soft",
  className,
}: TagProps) {
  const isSolid = variant === "solid";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-transform duration-150 hover:scale-[1.08]",
        className
      )}
      style={
        isSolid
          ? { backgroundColor: color, color: "#fff" }
          : { backgroundColor: `${color}22`, color }
      }
    >
      {children}
    </span>
  );
}

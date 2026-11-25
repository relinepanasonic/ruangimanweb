import clsx from "clsx";
import { APP_URL } from "@/lib/site";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * The one and only outbound CTA. Everything on this site that looks like a
 * button goes through here so there is exactly one place that knows the app's
 * URL — swap NEXT_PUBLIC_APP_URL and the whole site follows.
 */
export default function AppButton({
  children,
  variant = "primary",
  size = "md",
  className,
}: Props) {
  return (
    <a
      href={APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight",
        "transition-all duration-300 will-change-transform hover:-translate-y-0.5 active:translate-y-0",
        size === "sm" && "px-5 py-2.5 text-sm",
        size === "md" && "px-7 py-3.5 text-[0.95rem]",
        size === "lg" && "px-9 py-4.5 text-base sm:text-lg",
        variant === "primary" && [
          "bg-linear-to-b from-brand-gold-hover to-brand-gold text-brand-dark",
          "shadow-[0_10px_30px_-8px_rgba(214,176,114,0.55),inset_0_1px_1px_rgba(255,255,255,0.45)]",
          "hover:shadow-[0_16px_44px_-8px_rgba(255,215,112,0.65),inset_0_1px_1px_rgba(255,255,255,0.6)]",
        ],
        variant === "ghost" && [
          "border border-brand-light/20 bg-white/5 text-brand-light backdrop-blur-sm",
          "hover:border-brand-gold/50 hover:bg-white/10 hover:text-white",
        ],
        className,
      )}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 8h11M9 4l4 4-4 4" />
      </svg>
    </a>
  );
}

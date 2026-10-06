import { cn } from "cn";
import { Ticket, type LucideProps } from "lucide-react";

// Lucide's Ticket reads small and thin next to the filled brand icons.
export function TicketIcon({ className, ...props }: LucideProps) {
  return (
    <Ticket strokeWidth={2.5} className={cn("scale-115", className)} {...props} />
  );
}

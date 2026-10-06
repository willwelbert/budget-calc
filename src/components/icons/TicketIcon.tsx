import { cn } from "cn";
import { Ticket, type LucideProps } from "lucide-react";

export function TicketIcon({ className, ...props }: LucideProps) {
  return (
    <Ticket
      strokeWidth={2.5}
      className={cn("scale-115", className)}
      {...props}
    />
  );
}

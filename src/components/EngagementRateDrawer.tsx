import { useRef, type ReactElement } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { EditDrawerContent } from "./EditDrawerContent";
import { EngagementCalculator } from "./EngagementCalculator";
import { PLATFORM_FIELDS, parseFollowers } from "./platforms";
import { useDraftDrawer } from "../hooks/useDraftDrawer";
import type { QuotationFormData } from "../utils/types";

type EngagementRateDrawerProps = {
  /** The element that opens the drawer (rendered as its trigger). */
  children: ReactElement;
};

export function EngagementRateDrawer({ children }: EngagementRateDrawerProps) {
  const { control } = useFormContext<QuotationFormData>();
  const { open, onOpenChange, save } = useDraftDrawer(["engagementRate"]);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const followers = useWatch({ control, name: PLATFORM_FIELDS });

  // The profile's total audience is a realistic default; the calculator
  // still lets it be changed to try out projected rates
  const totalFollowers = followers.reduce(
    (sum, value) => sum + parseFollowers(value),
    0,
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <EditDrawerContent
        title="Taxa de Engajamento"
        description={
          <>
            Preencha ou calcule sua taxa de engajamento. <br /> Média por post
            (últimos posts)
          </>
        }
        onSave={save}
        saveRef={saveButtonRef}
      >
        <EngagementCalculator
          defaultFollowers={totalFollowers > 0 ? String(totalFollowers) : ""}
          onComplete={() => saveButtonRef.current?.focus()}
        />
      </EditDrawerContent>
    </Drawer>
  );
}

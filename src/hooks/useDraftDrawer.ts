import { useRef, useState } from "react";
import { useFormContext, type FieldPath } from "react-hook-form";
import type { QuotationFormData } from "../utils/types";

// Edits made in a drawer are a draft: closing it any way other than Save
// (X, swipe down, overlay, Esc) puts its fields back to how they were on open.
export function useDraftDrawer(fields: FieldPath<QuotationFormData>[]) {
  const { getValues, setValue, trigger, clearErrors } =
    useFormContext<QuotationFormData>();
  const [open, setOpen] = useState(false);
  // Values on open; cleared by save() so a late close can't undo the save
  const snapshot = useRef<QuotationFormData | null>(null);

  function onOpenChange(next: boolean) {
    if (next) {
      snapshot.current = getValues();
    } else {
      discardDraft();
    }
    setOpen(next);
  }

  function discardDraft() {
    const previous = snapshot.current;
    snapshot.current = null;
    if (!previous) return;
    for (const field of fields) {
      setValue(field, previous[field]);
    }
    clearErrors(fields);
  }

  async function save() {
    if (await trigger(fields)) {
      snapshot.current = null;
      setOpen(false);
    }
  }

  return { open, onOpenChange, save };
}

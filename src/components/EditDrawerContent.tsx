import type { ReactNode, Ref } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

type EditDrawerContentProps = {
  title: string;
  description: ReactNode;
  onSave: () => void;
  saveRef?: Ref<HTMLButtonElement>;
  children: ReactNode;
};

// Shell shared by the header's edit drawers. The X stands in for "Cancelar"
// so both footer actions fit on one row, wide enough to hit on mobile.
export function EditDrawerContent({
  title,
  description,
  onSave,
  saveRef,
  children,
}: EditDrawerContentProps) {
  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader className="relative px-12">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Cancelar"
              className="absolute top-1 right-1 size-11"
            >
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        {children}
        <DrawerFooter className="grid grid-cols-2">
          <Button type="button" variant="secondary" className="h-11">
            Atualizar perfil
          </Button>
          <Button type="button" ref={saveRef} className="h-11" onClick={onSave}>
            Salvar
          </Button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}

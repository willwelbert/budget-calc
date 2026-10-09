import { useRef, type ReactElement } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditDrawerContent } from "./EditDrawerContent";
import { BARE_GROUP_CLASS, BARE_INPUT_CLASS } from "./bareInput";
import { PLATFORMS, PLATFORM_FIELDS } from "./platforms";
import { NICHE_ICONS, NICHE_OPTIONS } from "../lib/niches";
import { useDraftDrawer } from "../hooks/useDraftDrawer";
import { formatCount } from "../utils/format";
import type { QuotationFormData } from "../utils/types";

type ProfileDrawerProps = {
  /** The element that opens the drawer (rendered as its trigger). */
  children: ReactElement;
};

export function ProfileDrawer({ children }: ProfileDrawerProps) {
  const { control } = useFormContext<QuotationFormData>();
  const { open, onOpenChange, save } = useDraftDrawer([
    "niche",
    ...PLATFORM_FIELDS,
  ]);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Enter walks Instagram → TikTok → YouTube, then lands on Salvar
  function advance(index: number) {
    const next = inputRefs.current[index + 1];
    if (next) {
      next.focus();
    } else {
      saveButtonRef.current?.focus();
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <EditDrawerContent
        title="Perfil"
        description="Nicho e seguidores usados nesta cotação."
        onSave={save}
        saveRef={saveButtonRef}
      >
        <div className="flex flex-col gap-6 px-4">
          <Controller
            control={control}
            name="niche"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="niche">Nicho</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="niche"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Selecione um nicho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {NICHE_OPTIONS.map((niche) => {
                        const Icon = NICHE_ICONS[niche.value];
                        return (
                          <SelectItem key={niche.value} value={niche.value}>
                            <Icon aria-hidden="true" />
                            {niche.label}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* One row per platform: three columns are too narrow for
              audiences in the millions ("1.250.000") on a 360px screen */}
          <FieldSet className="gap-1">
            <FieldLegend variant="label">Seguidores</FieldLegend>
            {PLATFORMS.map((platform, index) => (
              <Controller
                key={platform.field}
                control={control}
                name={platform.field}
                render={({ field }) => (
                  <div className="grid grid-cols-[7rem_1fr] items-center gap-2">
                    <FieldLabel htmlFor={platform.field}>
                      <platform.icon className="size-5" />
                      <span className="sr-only">Seguidores no </span>
                      {platform.label}
                    </FieldLabel>
                    <InputGroup className={BARE_GROUP_CLASS}>
                      <InputGroupInput
                        id={platform.field}
                        className={cn(BARE_INPUT_CLASS, "text-right text-2xl")}
                        type="text"
                        inputMode="numeric"
                        enterKeyHint={
                          index === PLATFORMS.length - 1 ? "done" : "next"
                        }
                        placeholder="0"
                        ref={(el) => {
                          field.ref(el);
                          inputRefs.current[index] = el;
                        }}
                        name={field.name}
                        value={formatCount(field.value)}
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ""))
                        }
                        onBlur={field.onBlur}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          e.preventDefault();
                          advance(index);
                        }}
                      />
                    </InputGroup>
                  </div>
                )}
              />
            ))}
          </FieldSet>
        </div>
      </EditDrawerContent>
    </Drawer>
  );
}

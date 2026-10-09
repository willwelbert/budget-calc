import { Separator } from "./ui/separator";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRef, useState, type MouseEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

import { getEngagementRate } from "../utils/functions";
import type { Engagement, QuotationFormData } from "../utils/types";
import {
  ArrowRight,
  Check,
  Forward,
  Heart,
  MessageSquare,
  UserRoundGroup,
} from "lucide-react";

// iOS number pads have no return key, so buttons stand in for Enter.
// Preventing mousedown keeps focus (and the keyboard) on the input.
function keepInputFocus(evt: MouseEvent) {
  evt.preventDefault();
}

// Borderless inputs: the number is the hero, focus shows as a soft tint
const BARE_GROUP_CLASS =
  "h-auto rounded-lg border-0 bg-transparent has-[[data-slot=input-group-control]:focus-visible]:bg-muted/60 has-[[data-slot=input-group-control]:focus-visible]:ring-0";
const BARE_INPUT_CLASS =
  "h-auto text-center font-black tabular-nums placeholder:text-muted-foreground/40";
// Floats over the input so showing it doesn't shift the centered number
const FLOATING_ADDON_CLASS = "absolute right-0";

const countFormatter = new Intl.NumberFormat("pt-BR");
// No grouping: the stored rate must stay parseable by parseNumericInput
const rateFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
  useGrouping: false,
});

// State keeps raw digits ("12500"); only the display gets separators ("12.500")
function formatCount(digits: string) {
  return digits ? countFormatter.format(Number(digits)) : "";
}

function RateEditor({ onManualInput }: { onManualInput: () => void }) {
  const [active, setActive] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
  } = useFormContext<QuotationFormData>();
  const rate = useWatch<QuotationFormData, "engagementRate">({
    name: "engagementRate",
  });

  return (
    <div className="flex flex-col items-center">
      {active ? (
        <InputGroup className={BARE_GROUP_CLASS}>
          <InputGroupInput
            id="rate"
            className={cn(BARE_INPUT_CLASS, "text-4xl tracking-widest")}
            type="text"
            inputMode="decimal"
            aria-label="Taxa de engajamento"
            placeholder="0"
            enterKeyHint="done"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setActive(false);
              }
            }}
            {...register("engagementRate", {
              onChange: onManualInput,
              onBlur: () => setActive(false),
            })}
          />
          <InputGroupAddon align="inline-end" className={FLOATING_ADDON_CLASS}>
            <InputGroupButton
              size="icon-xs"
              aria-label="Confirmar"
              onMouseDown={keepInputFocus}
              onClick={() => setActive(false)}
            >
              <Check />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <h3
          className="text-4xl font-black tracking-widest"
          onClick={() => setActive(true)}
        >
          {rate || "0"}%
        </h3>
      )}
      <FieldError errors={[errors.engagementRate]} />
    </div>
  );
}

const EMPTY_ENGAGEMENT: Engagement = {
  likes: "",
  comments: "",
  shares: "",
  followers: "",
};

// Order in which Enter / the → button moves focus through the inputs
const ENGAGEMENT_FIELDS: (keyof Engagement)[] = [
  "likes",
  "comments",
  "shares",
  "followers",
];

type EngagementCalculatorProps = {
  onComplete?: () => void;
};

export function EngagementCalculator({
  onComplete,
}: EngagementCalculatorProps) {
  const { setValue } = useFormContext<QuotationFormData>();
  const [engagement, setEngagement] = useState<Engagement>(EMPTY_ENGAGEMENT);
  const [focusedField, setFocusedField] = useState<keyof Engagement | null>(
    null,
  );
  const inputRefs = useRef<
    Partial<Record<keyof Engagement, HTMLInputElement | null>>
  >({});

  function updateEngagement(field: keyof Engagement, value: string) {
    const next = { ...engagement, [field]: value };
    setEngagement(next);

    const newRate = getEngagementRate(next);
    if (newRate !== null) {
      setValue("engagementRate", rateFormatter.format(newRate), {
        shouldValidate: true,
      });
    }
  }

  function advance(field: keyof Engagement) {
    const next = ENGAGEMENT_FIELDS[ENGAGEMENT_FIELDS.indexOf(field) + 1];
    if (next) {
      inputRefs.current[next]?.focus();
    } else if (getEngagementRate(engagement) !== null) {
      onComplete?.();
    }
  }

  function renderInput(field: keyof Engagement, className?: string) {
    const isLast = field === ENGAGEMENT_FIELDS[ENGAGEMENT_FIELDS.length - 1];
    return (
      <InputGroup className={BARE_GROUP_CLASS}>
        <InputGroupInput
          id={field}
          className={cn(BARE_INPUT_CLASS, "text-2xl", className)}
          type="text"
          inputMode="numeric"
          enterKeyHint={isLast ? "done" : "next"}
          placeholder="0"
          ref={(el) => {
            inputRefs.current[field] = el;
          }}
          value={formatCount(engagement[field])}
          onChange={(e) =>
            updateEngagement(field, e.target.value.replace(/\D/g, ""))
          }
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            advance(field);
          }}
        />
      </InputGroup>
    );
  }

  const isLastFocused =
    focusedField === ENGAGEMENT_FIELDS[ENGAGEMENT_FIELDS.length - 1];

  return (
    <div className="p-0">
      <div className="flex items-center justify-center space-x-2">
        <RateEditor onManualInput={() => setEngagement(EMPTY_ENGAGEMENT)} />
      </div>
      <div className="pt-6">
        <div className="grid grid-cols-3 gap-2 h-full">
          <Field>
            <FieldLabel className="flex justify-center" htmlFor="likes">
              <Heart size={22} />
              <span className="sr-only">Curtidas</span>
            </FieldLabel>
            {renderInput("likes")}
          </Field>
          <Field>
            <FieldLabel className="flex justify-center" htmlFor="comments">
              <MessageSquare />
              <span className="sr-only">Comentários</span>
            </FieldLabel>
            {renderInput("comments")}
          </Field>
          <div className="flex justify-center items-center gap-2">
            <Field>
              <FieldLabel className="flex justify-center" htmlFor="shares">
                <Forward />
                <span className="sr-only">Compartilhamentos</span>
              </FieldLabel>
              {renderInput("shares")}
            </Field>
          </div>
          <div className="col-span-3">
            <p className="text-center">
              Likes<span className="text-red-900 align-super">*</span> +
              Comentários<span className="text-red-900 align-super">*</span> +
              Shares
            </p>
          </div>
          <Separator className="col-span-3" />
          <div className="col-span-3">
            <p className="text-center">
              Seguidores<span className="text-red-900 align-super">*</span>
            </p>
          </div>
          <Field className="col-span-3">
            {renderInput("followers", "text-3xl")}
            <FieldLabel className="flex justify-center" htmlFor="followers">
              <UserRoundGroup />
              <span className="sr-only">Seguidores</span>
            </FieldLabel>
          </Field>
          {/* Always rendered (invisible when idle) so the footer doesn't jump */}
          <Button
            type="button"
            variant="secondary"
            className={cn("col-span-3", !focusedField && "invisible")}
            disabled={isLastFocused && getEngagementRate(engagement) === null}
            onMouseDown={keepInputFocus}
            onClick={() => focusedField && advance(focusedField)}
          >
            {isLastFocused ? "Concluir" : "Próximo"}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

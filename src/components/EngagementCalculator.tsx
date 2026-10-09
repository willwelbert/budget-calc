import { Separator } from "./ui/separator";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

import { getEngagementRate } from "../utils/functions";
import { formatCount, rateFormatter } from "../utils/format";
import type { Engagement, QuotationFormData } from "../utils/types";
import { BARE_GROUP_CLASS, BARE_INPUT_CLASS, keepInputFocus } from "./bareInput";
import {
  ArrowRight,
  Check,
  Forward,
  Heart,
  MessageSquare,
  UserRoundGroup,
} from "lucide-react";

// Floats over the input so showing it doesn't shift the centered number
const FLOATING_ADDON_CLASS = "absolute right-0";

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
  /** Raw digits to start "Seguidores" with, e.g. the profile's total audience. */
  defaultFollowers?: string;
};

export function EngagementCalculator({
  onComplete,
  defaultFollowers = "",
}: EngagementCalculatorProps) {
  const { setValue } = useFormContext<QuotationFormData>();
  const [engagement, setEngagement] = useState<Engagement>({
    ...EMPTY_ENGAGEMENT,
    followers: defaultFollowers,
  });
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
        {/* A typed rate no longer matches the post numbers, but followers
            still describe the profile, so they stay for the next calculation */}
        <RateEditor
          onManualInput={() =>
            setEngagement((prev) => ({
              ...EMPTY_ENGAGEMENT,
              followers: prev.followers,
            }))
          }
        />
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

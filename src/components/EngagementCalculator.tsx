import { Separator } from "./ui/separator";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRef, useState, type MouseEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";

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

// iOS number pads have no return key, so inline buttons stand in for Enter.
// Preventing mousedown keeps focus (and the keyboard) on the input.
function keepInputFocus(evt: MouseEvent) {
  evt.preventDefault();
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
        <InputGroup>
          <InputGroupInput
            id="rate"
            type="text"
            inputMode="decimal"
            placeholder="taxa de engajamento"
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
          <InputGroupAddon align="inline-end">
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

export function EngagementCalculator({ onComplete }: EngagementCalculatorProps) {
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
      setValue("engagementRate", newRate.toFixed(2), { shouldValidate: true });
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

  function renderInput(
    field: keyof Engagement,
    placeholder: string,
    className?: string,
  ) {
    const isLast = field === ENGAGEMENT_FIELDS[ENGAGEMENT_FIELDS.length - 1];
    return (
      <InputGroup>
        <InputGroupInput
          id={field}
          className={className}
          type="text"
          inputMode="numeric"
          enterKeyHint={isLast ? "done" : "next"}
          placeholder={placeholder}
          ref={(el) => {
            inputRefs.current[field] = el;
          }}
          value={engagement[field]}
          onChange={(e) => updateEngagement(field, e.target.value)}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            advance(field);
          }}
        />
        {focusedField === field && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Próximo"
              onMouseDown={keepInputFocus}
              onClick={() => advance(field)}
            >
              <ArrowRight />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    );
  }

  return (
    <div className="p-4 py-0">
      <div className="flex items-center justify-center space-x-2">
        <RateEditor onManualInput={() => setEngagement(EMPTY_ENGAGEMENT)} />
      </div>
      <div className="pt-6">
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="flex justify-center items-center gap-2">
            <Field>
              <FieldLabel className="flex justify-center" htmlFor="likes">
                <Heart size={22} />
              </FieldLabel>
              {renderInput("likes", "Curtidas")}
            </Field>
            +
          </div>
          <div className="flex justify-center items-center gap-2">
            <Field>
              <FieldLabel className="flex justify-center" htmlFor="comments">
                <MessageSquare />
              </FieldLabel>
              {renderInput("comments", "Comentários")}
            </Field>
            +
          </div>
          <div className="flex justify-center items-center gap-2">
            <Field>
              <FieldLabel className="flex justify-center" htmlFor="shares">
                <Forward />
              </FieldLabel>
              {renderInput("shares", "Compartilhamentos")}
            </Field>
          </div>
          <Separator className="col-span-3" />
          <Field className="col-span-3">
            {renderInput("followers", "Seguidores", "text-center")}
            <FieldLabel className="flex justify-center" htmlFor="followers">
              <UserRoundGroup />
            </FieldLabel>
          </Field>
        </div>
      </div>
    </div>
  );
}

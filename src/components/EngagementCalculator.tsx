import { Separator } from "./ui/separator";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { getEngagementRate } from "../utils/functions";
import type { Engagement, QuotationFormData } from "../utils/types";
import { Forward, Heart, MessageSquare, UserRoundGroup } from "lucide-react";

function RateEditor() {
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
        <Input
          id="rate"
          type="text"
          inputMode="decimal"
          placeholder="taxa de engajamento"
          autoFocus
          {...register("engagementRate", { onBlur: () => setActive(false) })}
        />
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

export function EngagementCalculator() {
  const { setValue } = useFormContext<QuotationFormData>();
  const [engagement, setEngagement] = useState<Engagement>(EMPTY_ENGAGEMENT);

  function updateEngagement(field: keyof Engagement, value: string) {
    const next = { ...engagement, [field]: value };
    setEngagement(next);

    const newRate = getEngagementRate(next);
    if (newRate !== null) {
      setValue("engagementRate", newRate.toFixed(2), { shouldValidate: true });
    }
  }

  return (
    <div className="p-4 py-0">
      <div className="flex items-center justify-center space-x-2">
        <RateEditor />
      </div>
      <div className="pt-6">
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="flex justify-center items-center gap-2">
            <Field>
              <FieldLabel className="flex justify-center" htmlFor="likes">
                <Heart size={22} />
              </FieldLabel>
              <Input
                id="likes"
                type="text"
                inputMode="numeric"
                placeholder="Curtidas"
                value={engagement.likes}
                onChange={(e) => updateEngagement("likes", e.target.value)}
              />
            </Field>
            +
          </div>
          <div className="flex justify-center items-center gap-2">
            <Field>
              <FieldLabel className="flex justify-center" htmlFor="comments">
                <MessageSquare />
              </FieldLabel>
              <Input
                id="comments"
                type="text"
                inputMode="numeric"
                placeholder="Comentários"
                value={engagement.comments}
                onChange={(e) => updateEngagement("comments", e.target.value)}
              />
            </Field>
            +
          </div>
          <div className="flex justify-center items-center gap-2">
            <Field>
              <FieldLabel className="flex justify-center" htmlFor="shares">
                <Forward />
              </FieldLabel>
              <Input
                id="shares"
                type="text"
                inputMode="numeric"
                placeholder="Compartilhamentos"
                value={engagement.shares}
                onChange={(e) => updateEngagement("shares", e.target.value)}
              />
            </Field>
          </div>
          <Separator className="col-span-3" />
          <Field className="col-span-3">
            <Input
              className="text-center"
              id="followers"
              type="text"
              inputMode="numeric"
              placeholder="Seguidores"
              value={engagement.followers}
              onChange={(e) => updateEngagement("followers", e.target.value)}
            />
            <FieldLabel className="flex justify-center" htmlFor="followers">
              <UserRoundGroup />
            </FieldLabel>
          </Field>
        </div>
      </div>
    </div>
  );
}

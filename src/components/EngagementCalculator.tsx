import { Separator } from "./ui/separator";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

type StringStateSetter = Dispatch<SetStateAction<string>>;

type EngagementCalculatorProps = {
  rate: number;
  setRate: Dispatch<SetStateAction<number>>;
};

import { getEngagementRate } from "../utils/functions";
import { Forward, Heart, MessageSquare, UserRoundGroup } from "lucide-react";

function RateEditor({
  rate,
  setRate,
}: {
  rate: number;
  setRate: Dispatch<SetStateAction<number>>;
}) {
  const [active, setActive] = useState<boolean>(false);

  return active ? (
    <Input
      id="rate"
      type="number"
      placeholder="taxa de engajamento"
      value={rate}
      onChange={(evt) => setRate(Number(evt.target.value))}
      onBlur={() => setActive(false)}
    />
  ) : (
    <h3
      className="text-4xl font-black tracking-widest"
      onClick={() => setActive(true)}
    >
      {rate.toFixed(2)}%
    </h3>
  );
}

export function EngagementCalculator({
  rate,
  setRate,
}: EngagementCalculatorProps) {
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  const [followers, setFollowers] = useState("");

  function calculateRate(
    evt: ChangeEvent<HTMLInputElement>,
    localSetter: StringStateSetter,
  ) {
    const newValue = evt.target.value;

    localSetter(newValue);
    const newRate = getEngagementRate({ likes, comments, shares, followers });
    setRate(newRate);
  }

  return (
    <div className="p-4 py-0">
      <div className="flex items-center justify-center space-x-2">
        <RateEditor rate={rate} setRate={setRate} />
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
                type="number"
                placeholder="Curtidas"
                value={likes}
                onChange={(e) => calculateRate(e, setLikes)}
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
                type="number"
                placeholder="Comentários"
                value={comments}
                onChange={(e) => calculateRate(e, setComments)}
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
                type="number"
                placeholder="Compartilhamentos"
                value={shares}
                onChange={(e) => calculateRate(e, setShares)}
              />
            </Field>
          </div>
          <Separator className="col-span-3" />
          <Field className="col-span-3">
            <Input
              className="text-center"
              id="followers"
              type="number"
              placeholder="Seguidores"
              value={followers}
              onChange={(e) => calculateRate(e, setFollowers)}
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

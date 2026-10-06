import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { EngagementCalculator } from "@/components/EngagementCalculator";
import { DEFAULT_QUOTATION_FORM_VALUES } from "@/utils/formSchemas";
import type { QuotationFormData } from "@/utils/types";

function FormHarness({ children }: { children: ReactNode }) {
  const form = useForm<QuotationFormData>({
    defaultValues: DEFAULT_QUOTATION_FORM_VALUES,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function renderCalculator() {
  return render(
    <FormHarness>
      <EngagementCalculator />
    </FormHarness>,
  );
}

describe("EngagementCalculator", () => {
  it("lets likes be typed before followers without crashing", async () => {
    const user = userEvent.setup();
    renderCalculator();

    await user.type(screen.getByPlaceholderText("Curtidas"), "70");

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("updates the rate with the latest keystroke", async () => {
    const user = userEvent.setup();
    renderCalculator();

    await user.type(screen.getByPlaceholderText("Curtidas"), "70");
    await user.type(screen.getByPlaceholderText("Seguidores"), "1000");

    expect(screen.getByText("7.00%")).toBeInTheDocument();
  });

  it("accepts a rate with a decimal comma when edited directly", async () => {
    const user = userEvent.setup();
    renderCalculator();

    await user.click(screen.getByText("0%"));
    await user.type(screen.getByPlaceholderText("taxa de engajamento"), "4,5");
    await user.tab();

    expect(screen.getByText("4,5%")).toBeInTheDocument();
  });
});

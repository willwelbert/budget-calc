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

function renderCalculator(onComplete?: () => void) {
  return render(
    <FormHarness>
      <EngagementCalculator onComplete={onComplete} />
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

  it("closes the rate editor on Enter", async () => {
    const user = userEvent.setup();
    renderCalculator();

    await user.click(screen.getByText("0%"));
    await user.type(
      screen.getByPlaceholderText("taxa de engajamento"),
      "4,5{Enter}",
    );

    expect(
      screen.queryByPlaceholderText("taxa de engajamento"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("4,5%")).toBeInTheDocument();
  });

  it("clears the calculator inputs when the rate is typed manually", async () => {
    const user = userEvent.setup();
    renderCalculator();

    await user.type(screen.getByPlaceholderText("Curtidas"), "70");
    await user.type(screen.getByPlaceholderText("Seguidores"), "1000");
    await user.click(screen.getByText("7.00%"));
    await user.clear(screen.getByPlaceholderText("taxa de engajamento"));
    await user.type(screen.getByPlaceholderText("taxa de engajamento"), "3");

    expect(screen.getByPlaceholderText("Curtidas")).toHaveValue("");
    expect(screen.getByPlaceholderText("Seguidores")).toHaveValue("");
    expect(screen.getByPlaceholderText("taxa de engajamento")).toHaveValue("3");
  });

  it("moves focus Likes -> Comments -> Shares -> Followers on Enter", async () => {
    const user = userEvent.setup();
    renderCalculator();

    await user.type(screen.getByPlaceholderText("Curtidas"), "70{Enter}");
    expect(screen.getByPlaceholderText("Comentários")).toHaveFocus();

    await user.keyboard("5{Enter}");
    expect(screen.getByPlaceholderText("Compartilhamentos")).toHaveFocus();

    await user.keyboard("2{Enter}");
    expect(screen.getByPlaceholderText("Seguidores")).toHaveFocus();
  });

  it("calls onComplete on Enter in Followers once the rate is calculated", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    renderCalculator(onComplete);

    await user.type(screen.getByPlaceholderText("Curtidas"), "70");
    await user.type(screen.getByPlaceholderText("Seguidores"), "1000{Enter}");

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("does not call onComplete on Enter while Followers is empty", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    renderCalculator(onComplete);

    await user.type(screen.getByPlaceholderText("Curtidas"), "70");
    await user.type(screen.getByPlaceholderText("Seguidores"), "{Enter}");

    expect(onComplete).not.toHaveBeenCalled();
  });

  it("closes the rate editor with the confirm button", async () => {
    const user = userEvent.setup();
    renderCalculator();

    await user.click(screen.getByText("0%"));
    await user.type(screen.getByPlaceholderText("taxa de engajamento"), "4,5");
    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(
      screen.queryByPlaceholderText("taxa de engajamento"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("4,5%")).toBeInTheDocument();
  });

  it("moves through the fields with the next button and then calls onComplete", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    renderCalculator(onComplete);

    await user.type(screen.getByPlaceholderText("Curtidas"), "70");
    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(screen.getByPlaceholderText("Comentários")).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(screen.getByPlaceholderText("Compartilhamentos")).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(screen.getByPlaceholderText("Seguidores")).toHaveFocus();

    await user.keyboard("1000");
    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(onComplete).toHaveBeenCalledOnce();
  });
});

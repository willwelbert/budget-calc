import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Ticket } from "lucide-react";
import { Sticker } from "@/components/Sticker";

function ControlledSticker({
  onCheckedChange,
}: {
  onCheckedChange?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <Sticker
      id="includesEvent"
      label="Evento presencial"
      icon={Ticket}
      checked={checked}
      onCheckedChange={(value) => {
        setChecked(value);
        onCheckedChange?.(value);
      }}
    />
  );
}

describe("Sticker", () => {
  it("renders an unchecked switch named by its label", () => {
    render(<ControlledSticker />);

    const sticker = screen.getByRole("switch", { name: "Evento presencial" });
    expect(sticker).toHaveAttribute("aria-checked", "false");
  });

  it("toggles on and off when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(<ControlledSticker onCheckedChange={onCheckedChange} />);
    const sticker = screen.getByRole("switch", { name: "Evento presencial" });

    await userEvent.click(sticker);
    expect(sticker).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    await userEvent.click(sticker);
    expect(sticker).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("toggles when the label is clicked", async () => {
    render(<ControlledSticker />);

    await userEvent.click(screen.getByText("Evento presencial"));

    expect(
      screen.getByRole("switch", { name: "Evento presencial" }),
    ).toHaveAttribute("aria-checked", "true");
  });
});

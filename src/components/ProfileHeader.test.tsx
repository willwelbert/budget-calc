import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileHeader } from "@/components/ProfileHeader";
import {
  DEFAULT_QUOTATION_FORM_VALUES,
  quotationFormSchema,
} from "@/utils/formSchemas";
import type { QuotationFormData } from "@/utils/types";

function FormHarness({
  values,
  children,
}: {
  values: Partial<QuotationFormData>;
  children: ReactNode;
}) {
  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: { ...DEFAULT_QUOTATION_FORM_VALUES, ...values },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function renderHeader(values: Partial<QuotationFormData> = {}) {
  return render(
    <FormHarness values={values}>
      <ProfileHeader />
    </FormHarness>,
  );
}

const profileButton = () =>
  screen.getByRole("button", { name: /preencha seu perfil|editar perfil/i });
const rateButton = () =>
  screen.getByRole("button", { name: /taxa de engajamento/i });

describe("ProfileHeader", () => {
  it("invites filling the profile while it is empty", () => {
    renderHeader();

    expect(profileButton()).toHaveTextContent("Preencha seu perfil");
    expect(rateButton()).toHaveTextContent("–%");
  });

  it("shows the niche, the rate and only the platforms with followers", () => {
    renderHeader({
      niche: "Fitness",
      engagementRate: "4,5",
      instagramFollowers: "12500",
      tiktokFollowers: "0",
      youtubeSubscribers: "",
    });

    expect(profileButton()).toHaveAccessibleName(
      // Intl puts a no-break space before "mil"
      /^Editar perfil\. Nicho: Fitness\. Instagram: 12,5\smil seguidores$/,
    );
    expect(rateButton()).toHaveTextContent("4,5%");
  });

  it("discards the profile draft when the drawer is closed with X", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(profileButton());
    await user.type(
      await screen.findByLabelText("Seguidores no Instagram"),
      "500",
    );
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(profileButton()).toHaveTextContent("Preencha seu perfil");
  });

  it("keeps the drawer open with an error when saving without a niche", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(profileButton());
    await user.click(await screen.findByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Selecione um nicho",
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("applies the profile draft on save", async () => {
    const user = userEvent.setup();
    renderHeader({ niche: "Fitness" });

    await user.click(profileButton());
    await user.type(
      await screen.findByLabelText("Seguidores no Instagram"),
      "12500{Enter}",
    );
    expect(screen.getByLabelText("Seguidores no TikTok")).toHaveFocus();
    await user.keyboard("{Enter}{Enter}");
    expect(screen.getByRole("button", { name: "Salvar" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(profileButton()).toHaveAccessibleName(
      // Intl puts a no-break space before "mil"
      /^Editar perfil\. Nicho: Fitness\. Instagram: 12,5\smil seguidores$/,
    );
  });

  it("opens the rate drawer with the total audience as followers", async () => {
    const user = userEvent.setup();
    renderHeader({ instagramFollowers: "1000", tiktokFollowers: "500" });

    await user.click(rateButton());

    expect(await screen.findByLabelText("Seguidores")).toHaveValue("1.500");
  });

  it("discards a rate typed in the drawer when it is closed with X", async () => {
    const user = userEvent.setup();
    renderHeader({ engagementRate: "4,5" });

    await user.click(rateButton());
    await user.type(await screen.findByLabelText("Curtidas"), "70");
    await user.type(screen.getByLabelText("Seguidores"), "1000");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(rateButton()).toHaveTextContent("4,5%");
  });
});

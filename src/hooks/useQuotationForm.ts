import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DEFAULT_QUOTATION_FORM_VALUES,
  quotationFormSchema,
} from "../utils/formSchemas";
import { adaptFormToQuotationPayload } from "../utils/adapters/quotationAdapter";
import type { QuotationFormData, QuotationPayload } from "../utils/types";

type UseQuotationFormProps = {
  onSubmit?: (payload: QuotationPayload) => void;
};

export function useQuotationForm({ onSubmit }: UseQuotationFormProps = {}) {
  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: DEFAULT_QUOTATION_FORM_VALUES,
  });

  const handleSubmit = form.handleSubmit((data) =>
    onSubmit?.(adaptFormToQuotationPayload(data)),
  );

  return { form, handleSubmit };
}

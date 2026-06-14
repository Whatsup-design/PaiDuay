export type FieldErrors<TField extends string> = Partial<Record<TField, string>>;

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getStringFormValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

export function getTrimmedFormValue(formData: FormData, name: string) {
  return getStringFormValue(formData, name).trim();
}

export const COUNTRIES = [
  { value: "it", label: "Italy" },
  { value: "nl", label: "Netherlands" },
  { value: "se", label: "Sweden" },
  { value: "lb", label: "Lebanon" },
  { value: "tn", label: "Tunisia" },
  { value: "ma", label: "Morocco" },
];

export const getCountryName = (value: string) => {
    const country = COUNTRIES.find(c => c.value === value);
    return country ? country.label : 'Global';
}

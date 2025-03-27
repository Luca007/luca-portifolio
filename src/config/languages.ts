export type Language = {
  code: string;
  name: string;
  flag: string;
  countryCode: string;
};

export const LANGUAGES: Language[] = [
  {
    code: "pt",
    name: "Português",
    flag: "🇧🇷",
    countryCode: "PTbr"
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    countryCode: "USA"
  },
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    countryCode: "ESP"
  }
];

export const DEFAULT_LANGUAGE = LANGUAGES[0]; // Português como padrão

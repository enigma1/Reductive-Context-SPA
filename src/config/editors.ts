type ExtensionLanguage = Record<string, { monaco: string; markdown: string }>;
let extToLanguage: ExtensionLanguage = {};

export const setExtensionLanguages = (languages: ExtensionLanguage) => {
  extToLanguage = languages;
};

export const getExtensionLanguages = () => extToLanguage;

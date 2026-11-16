const baseConfig = {
  BaseURL:
    `http://${window.location.hostname}:3000` ||
    import.meta.env.VITE_APP_BASE_URL,
  LocalStorageTokenKeyName: "authToken",
  LocalStorageUserKeyName: "userInfo",
  LocalStorageThemeKeyName: "theme",
  LocalStorageLanguageKeyName: "language",
  DefaultLanguage: "en",
  DefaultTheme: "light",
  SupportedLanguages: ["en", "fr", "es", "de"],
  SupportedThemes: ["light", "dark"],
  apiCallTimeout: 300000, // 10 seconds
};

export default baseConfig;
export type Config = typeof baseConfig;

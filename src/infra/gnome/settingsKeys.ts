export const SettingsKey = {
  TOGGLE_LAUNCHER: "toggle-launcher",
  WEB_SEARCH_URL: "web-search-url",
  MAX_RESULTS: "max-results",
  KEYWORD_SEARCHES: "keyword-searches",
  BORDER_WIDTH: "border-width",
  BORDER_RADIUS: "border-radius",
  BORDER_COLOR: "border-color",
} as const;
export type SettingsKey = (typeof SettingsKey)[keyof typeof SettingsKey];

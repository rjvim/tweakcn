import { ThemeStyles, ThemeStyleProps } from "@/types/theme";

/**
 * Represents a theme preset option that can be selected by users
 */
export interface ThemePresetOption {
  /** Unique identifier for the preset */
  id: string;
  /** Display label for the preset */
  label: string;
  /** The theme styles for this preset */
  styles: ThemeStyles;
  /** Optional metadata */
  createdAt?: string;
  /** Whether this is a custom/saved theme or built-in */
  source?: "SAVED" | "BUILT_IN";
}

/**
 * Available tabs in the theme configurator
 */
export type ThemeConfiguratorTab = "colors" | "typography" | "other";

/**
 * Current theme state
 */
export interface ThemeState {
  /** Current theme styles (light and dark mode) */
  styles: ThemeStyles;
  /** Currently active mode (light or dark) */
  currentMode: "light" | "dark";
  /** ID of currently selected preset (if any) */
  selectedPresetId?: string;
  /** HSL adjustments applied to the theme */
  hslAdjustments?: {
    hueShift: number;
    saturationScale: number;
    lightnessScale: number;
  };
}

/**
 * Props for the main ThemeConfigurator component
 */
export interface ThemeConfiguratorProps {
  /** Available theme presets for selection */
  presets: ThemePresetOption[];

  /** Current theme state */
  theme: ThemeState;

  /** Callback when theme changes (user modifies colors, fonts, etc.) */
  onThemeChange: (theme: ThemeState) => void;

  /** Callback when a preset is selected */
  onPresetSelect?: (presetId: string) => void;

  /** Callback when theme mode (light/dark) is toggled */
  onModeToggle?: (mode: "light" | "dark") => void;

  /** Default tab to show */
  defaultTab?: ThemeConfiguratorTab;

  /** Whether to show the theme selector header */
  showHeader?: boolean;

  /** Whether to allow cycling through presets */
  enablePresetCycling?: boolean;

  /** Whether the component is disabled */
  disabled?: boolean;

  /** Optional className for styling */
  className?: string;

  /** Optional callback when tab changes */
  onTabChange?: (tab: ThemeConfiguratorTab) => void;
}

/**
 * Props for internal control components
 */
export interface ThemeControlProps {
  /** Current theme styles for the active mode */
  currentStyles: ThemeStyleProps;

  /** Current theme mode */
  currentMode: "light" | "dark";

  /** Full theme styles (both light and dark) */
  fullStyles: ThemeStyles;

  /** Callback to update a specific style property */
  onStyleUpdate: <K extends keyof ThemeStyleProps>(
    key: K,
    value: ThemeStyleProps[K]
  ) => void;

  /** Whether the controls are disabled */
  disabled?: boolean;
}

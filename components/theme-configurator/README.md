# ThemeConfigurator

A standalone, reusable theme configuration component for customizing shadcn/ui themes. This component is fully abstracted and framework-agnostic, with no dependencies on Next.js routes, stores, or server actions.

## Features

- 🎨 **Complete Theme Control**: Customize all shadcn/ui theme variables including colors, typography, spacing, and more
- 🔄 **Preset Management**: Browse, select, and cycle through predefined theme presets
- 🎯 **Callback-Based**: Pure prop-driven API with callbacks for maximum flexibility
- 📦 **Zero Coupling**: No dependencies on routes, stores, or framework-specific features
- 🎨 **HSL Adjustments**: Apply HSL transformations to entire themes with preset options
- 🌓 **Light/Dark Mode**: Full support for both light and dark theme modes
- ⚡ **TypeScript**: Fully typed with comprehensive interfaces

## Installation

The component is already part of your project at `/components/theme-configurator`.

## Basic Usage

```tsx
import { ThemeConfigurator, ThemeState, ThemePresetOption } from "@/components/theme-configurator";
import { useState } from "react";

function MyApp() {
  const [theme, setTheme] = useState<ThemeState>({
    styles: {
      light: { /* your light mode styles */ },
      dark: { /* your dark mode styles */ }
    },
    currentMode: "light",
  });

  const presets: ThemePresetOption[] = [
    {
      id: "default",
      label: "Default",
      styles: { /* default theme styles */ },
      source: "BUILT_IN",
    },
    // ... more presets
  ];

  return (
    <div className="flex h-screen">
      {/* Left: Theme Controls */}
      <div className="w-96 border-r">
        <ThemeConfigurator
          presets={presets}
          theme={theme}
          onThemeChange={setTheme}
          onPresetSelect={(id) => console.log("Selected preset:", id)}
        />
      </div>

      {/* Right: Your Custom Preview */}
      <div className="flex-1 p-8">
        <YourCustomPreview theme={theme} />
      </div>
    </div>
  );
}
```

## API Reference

### ThemeConfigurator Props

```typescript
interface ThemeConfiguratorProps {
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
  defaultTab?: "colors" | "typography" | "other";

  /** Whether to show the theme selector header */
  showHeader?: boolean;

  /** Whether to allow cycling through presets */
  enablePresetCycling?: boolean;

  /** Whether the component is disabled */
  disabled?: boolean;

  /** Optional className for styling */
  className?: string;

  /** Optional callback when tab changes */
  onTabChange?: (tab: "colors" | "typography" | "other") => void;
}
```

### Types

#### ThemeState

```typescript
interface ThemeState {
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
```

#### ThemePresetOption

```typescript
interface ThemePresetOption {
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
```

## Advanced Examples

### With Custom Preview Panel

```tsx
import { ThemeConfigurator } from "@/components/theme-configurator";

function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeState>(/* ... */);

  return (
    <div className="flex h-screen">
      {/* Theme Controls */}
      <aside className="w-96">
        <ThemeConfigurator
          presets={myPresets}
          theme={theme}
          onThemeChange={setTheme}
          onPresetSelect={(id) => {
            // Load preset from your backend
            const preset = await loadPreset(id);
            setTheme({
              ...theme,
              styles: preset.styles,
              selectedPresetId: id,
            });
          }}
          onModeToggle={(mode) => {
            console.log("Mode changed to:", mode);
          }}
        />
      </aside>

      {/* Your Custom Components */}
      <main className="flex-1 p-8">
        {/* Apply theme styles */}
        <style>{generateCSSFromTheme(theme)}</style>

        {/* Your app components will now use the theme */}
        <YourDashboard />
        <YourMailClient />
        <YourCustomComponents />
      </main>
    </div>
  );
}
```

### Persisting Theme Changes

```tsx
function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeState>(/* ... */);

  const handleThemeChange = async (newTheme: ThemeState) => {
    // Update local state
    setTheme(newTheme);

    // Persist to your backend
    await saveTheme(newTheme);

    // Or save to localStorage
    localStorage.setItem("my-theme", JSON.stringify(newTheme));
  };

  return (
    <ThemeConfigurator
      presets={presets}
      theme={theme}
      onThemeChange={handleThemeChange}
    />
  );
}
```

### With Tab State Management

```tsx
function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeState>(/* ... */);
  const [currentTab, setCurrentTab] = useState<"colors" | "typography" | "other">("colors");

  return (
    <ThemeConfigurator
      presets={presets}
      theme={theme}
      onThemeChange={setTheme}
      defaultTab={currentTab}
      onTabChange={(tab) => {
        setCurrentTab(tab);
        // Track analytics, update URL, etc.
      }}
    />
  );
}
```

### Without Header (Custom Header)

```tsx
function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeState>(/* ... */);

  return (
    <div>
      {/* Your custom header */}
      <header className="border-b p-4">
        <h1>My Custom Theme Editor</h1>
        <CustomPresetSelector theme={theme} />
      </header>

      {/* Theme controls without built-in header */}
      <ThemeConfigurator
        presets={presets}
        theme={theme}
        onThemeChange={setTheme}
        showHeader={false}
      />
    </div>
  );
}
```

## Component Structure

```
theme-configurator/
├── index.tsx                  # Main ThemeConfigurator component
├── types.ts                   # TypeScript interfaces and types
├── README.md                  # This file
└── components/
    ├── preset-selector.tsx    # Preset selection and navigation
    ├── colors-panel.tsx       # Color customization controls
    ├── typography-panel.tsx   # Font and typography controls
    └── other-panel.tsx        # Radius, spacing, shadow, HSL controls
```

## Features by Tab

### Colors Tab
- Primary, Secondary, Accent colors
- Base colors (Background, Foreground)
- Card and Popover colors
- Muted and Destructive colors
- Border, Input, and Ring colors
- Chart colors (5 variants)
- Sidebar colors (8 variants)

### Typography Tab
- Font Family selection (Sans, Serif, Mono)
- Letter spacing control
- Google Fonts integration

### Other Tab
- HSL Adjustments with 15 presets
  - Hue shift
  - Saturation scale
  - Lightness scale
- Border radius control
- Spacing control
- Shadow controls (color, opacity, blur, spread, offset)

## Dependencies

The ThemeConfigurator reuses existing components from the project:

- `@/components/ui/*` - shadcn/ui components
- `@/components/editor/color-picker` - Color selection
- `@/components/editor/font-picker` - Font selection
- `@/components/editor/control-section` - Collapsible sections
- `@/components/editor/slider-with-input` - Slider controls
- `@/components/editor/shadow-control` - Shadow customization

## Migration from Original Editor

If you're migrating from the original `ThemeControlPanel`:

```tsx
// Before (coupled to editor store)
import ThemeControlPanel from "@/components/editor/theme-control-panel";

<ThemeControlPanel
  styles={styles}
  onChange={handleStyleChange}
  currentMode={themeState.currentMode}
  themePromise={themePromise}
/>

// After (standalone with callbacks)
import { ThemeConfigurator } from "@/components/theme-configurator";

<ThemeConfigurator
  presets={convertPresetsToArray(presets)}
  theme={{
    styles: styles,
    currentMode: currentMode,
    selectedPresetId: selectedPreset,
  }}
  onThemeChange={(newTheme) => {
    // Handle theme changes
  }}
/>
```

## License

Part of the tweakcn project.

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import TabsTriggerPill from "@/components/editor/theme-preview/tabs-trigger-pill";
import { COMMON_STYLES } from "@/config/theme";
import { ThemeConfiguratorProps, ThemeConfiguratorTab, ThemeState } from "./types";
import { ThemePresetSelector } from "./components/preset-selector";
import { ColorsPanel } from "./components/colors-panel";
import { TypographyPanel } from "./components/typography-panel";
import { OtherPanel } from "./components/other-panel";
import { cn } from "@/lib/utils";

/**
 * ThemeConfigurator - A standalone, reusable theme configuration component
 *
 * This component provides a complete UI for customizing themes including:
 * - Theme preset selection with navigation
 * - Color customization for all theme variables
 * - Typography controls (fonts, letter spacing)
 * - Other controls (radius, spacing, shadows, HSL adjustments)
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useState<ThemeState>({
 *   styles: defaultThemeStyles,
 *   currentMode: "light",
 * });
 *
 * <ThemeConfigurator
 *   presets={presetOptions}
 *   theme={theme}
 *   onThemeChange={setTheme}
 *   onPresetSelect={(id) => loadPreset(id)}
 * />
 * ```
 */
export const ThemeConfigurator: React.FC<ThemeConfiguratorProps> = ({
  presets,
  theme,
  onThemeChange,
  onPresetSelect,
  onModeToggle,
  defaultTab = "colors",
  showHeader = true,
  enablePresetCycling = true,
  disabled = false,
  className,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<ThemeConfiguratorTab>(defaultTab);

  const handleTabChange = useCallback(
    (tab: string) => {
      const newTab = tab as ThemeConfiguratorTab;
      setActiveTab(newTab);
      onTabChange?.(newTab);
    },
    [onTabChange]
  );

  const currentStyles = useMemo(
    () => theme.styles[theme.currentMode],
    [theme.styles, theme.currentMode]
  );

  const updateStyle = useCallback(
    <K extends keyof typeof currentStyles>(key: K, value: (typeof currentStyles)[K]) => {
      // Apply common styles to both light and dark modes
      if (COMMON_STYLES.includes(key)) {
        onThemeChange({
          ...theme,
          styles: {
            ...theme.styles,
            light: { ...theme.styles.light, [key]: value },
            dark: { ...theme.styles.dark, [key]: value },
          },
        });
        return;
      }

      // Apply to current mode only
      onThemeChange({
        ...theme,
        styles: {
          ...theme.styles,
          [theme.currentMode]: {
            ...currentStyles,
            [key]: value,
          },
        },
      });
    },
    [onThemeChange, theme, currentStyles]
  );

  const handlePresetSelect = useCallback(
    (presetId: string) => {
      const preset = presets.find((p) => p.id === presetId);
      if (!preset) return;

      // Update theme with preset styles
      onThemeChange({
        ...theme,
        styles: preset.styles,
        selectedPresetId: presetId,
        hslAdjustments: {
          hueShift: 0,
          saturationScale: 1,
          lightnessScale: 1,
        },
      });

      // Notify parent
      onPresetSelect?.(presetId);
    },
    [presets, theme, onThemeChange, onPresetSelect]
  );

  const handleModeToggle = useCallback(() => {
    const newMode = theme.currentMode === "light" ? "dark" : "light";
    onThemeChange({
      ...theme,
      currentMode: newMode,
    });
    onModeToggle?.(newMode);
  }, [theme, onThemeChange, onModeToggle]);

  const handleRandomPreset = useCallback(() => {
    if (presets.length === 0) return;
    const randomIndex = Math.floor(Math.random() * presets.length);
    handlePresetSelect(presets[randomIndex].id);
  }, [presets, handlePresetSelect]);

  const handleCyclePreset = useCallback(
    (direction: "prev" | "next") => {
      if (presets.length === 0) return;

      const currentIndex = presets.findIndex((p) => p.id === theme.selectedPresetId);
      const startIndex = currentIndex === -1 ? 0 : currentIndex;

      const newIndex =
        direction === "next"
          ? (startIndex + 1) % presets.length
          : (startIndex - 1 + presets.length) % presets.length;

      handlePresetSelect(presets[newIndex].id);
    },
    [presets, theme.selectedPresetId, handlePresetSelect]
  );

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {showHeader && (
        <div className="border-b">
          <ThemePresetSelector
            presets={presets}
            selectedPresetId={theme.selectedPresetId}
            currentStyles={currentStyles}
            currentMode={theme.currentMode}
            onPresetSelect={handlePresetSelect}
            onModeToggle={handleModeToggle}
            onRandomPreset={handleRandomPreset}
            onCyclePreset={enablePresetCycling ? handleCyclePreset : undefined}
            disabled={disabled}
            className="h-14 rounded-none"
          />
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <HorizontalScrollArea className="mt-2 mb-1 px-4">
            <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
              <TabsTriggerPill value="colors">Colors</TabsTriggerPill>
              <TabsTriggerPill value="typography">Typography</TabsTriggerPill>
              <TabsTriggerPill value="other">Other</TabsTriggerPill>
            </TabsList>
          </HorizontalScrollArea>

          <TabsContent value="colors" className="mt-1 size-full overflow-hidden">
            <ScrollArea className="h-full px-4">
              <ColorsPanel
                currentStyles={currentStyles}
                currentMode={theme.currentMode}
                fullStyles={theme.styles}
                onStyleUpdate={updateStyle}
                disabled={disabled}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="typography" className="mt-1 size-full overflow-hidden">
            <ScrollArea className="h-full px-4">
              <TypographyPanel
                currentStyles={currentStyles}
                currentMode={theme.currentMode}
                fullStyles={theme.styles}
                onStyleUpdate={updateStyle}
                disabled={disabled}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="other" className="mt-1 size-full overflow-hidden">
            <ScrollArea className="h-full px-4">
              <OtherPanel
                currentStyles={currentStyles}
                currentMode={theme.currentMode}
                fullStyles={theme.styles}
                onStyleUpdate={updateStyle}
                theme={theme}
                onThemeChange={onThemeChange}
                disabled={disabled}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export * from "./types";

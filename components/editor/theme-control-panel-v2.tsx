"use client";

import React, { useMemo } from "react";
import { ThemeConfigurator } from "@/components/theme-configurator";
import { ThemePresetOption, ThemeState } from "@/components/theme-configurator/types";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { ThemeEditorControlsProps } from "@/types/theme";
import { defaultThemeState } from "@/config/theme";

/**
 * Wrapper component that bridges the new ThemeConfigurator with the existing editor store
 * This maintains backward compatibility while using the abstracted component underneath
 */
const ThemeControlPanelV2: React.FC<Omit<ThemeEditorControlsProps, "onChange">> = ({
  styles,
  currentMode,
  themePromise,
}) => {
  const { themeState, setThemeState, applyThemePreset } = useEditorStore();
  const presetsRecord = useThemePresetStore((store) => store.getAllPresets());

  // Convert presets from Record to Array format
  const presets = useMemo((): ThemePresetOption[] => {
    const defaultPreset: ThemePresetOption = {
      id: "default",
      label: "Default",
      styles: defaultThemeState.styles,
      source: "BUILT_IN",
    };

    const otherPresets = Object.entries(presetsRecord).map(([id, preset]) => ({
      id,
      label: preset.label || id,
      styles: preset.styles as ThemeState["styles"],
      source: preset.source || "BUILT_IN",
      createdAt: preset.createdAt,
    }));

    return [defaultPreset, ...otherPresets];
  }, [presetsRecord]);

  // Convert editor store state to ThemeConfigurator format
  const theme = useMemo((): ThemeState => {
    return {
      styles: themeState.styles,
      currentMode: themeState.currentMode,
      selectedPresetId: themeState.preset,
      hslAdjustments: themeState.hslAdjustments,
    };
  }, [themeState]);

  const handleThemeChange = (newTheme: ThemeState) => {
    setThemeState({
      ...themeState,
      styles: newTheme.styles,
      currentMode: newTheme.currentMode,
      preset: newTheme.selectedPresetId,
      hslAdjustments: newTheme.hslAdjustments,
    });
  };

  const handlePresetSelect = (presetId: string) => {
    applyThemePreset(presetId);
  };

  return (
    <ThemeConfigurator
      presets={presets}
      theme={theme}
      onThemeChange={handleThemeChange}
      onPresetSelect={handlePresetSelect}
      showHeader={true}
      enablePresetCycling={true}
    />
  );
};

export default ThemeControlPanelV2;

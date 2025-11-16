"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ControlSection from "@/components/editor/control-section";
import { SliderWithInput } from "@/components/editor/slider-with-input";
import ShadowControl from "@/components/editor/shadow-control";
import { HslPresetButton } from "@/components/editor/hsl-preset-button";
import { Button } from "@/components/ui/button";
import { ThemeStyleProps } from "@/types/theme";
import { ThemeState } from "../types";
import { converter, formatHex, Hsl } from "culori";
import { debounce } from "@/utils/debounce";
import { COMMON_STYLES, defaultThemeState } from "@/config/theme";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Adjusts a color by modifying HSL values
function adjustColorByHsl(
  color: string,
  hueShift: number,
  saturationScale: number,
  lightnessScale: number
): string {
  const hsl = converter("hsl")(color);
  const h = hsl?.h;
  const s = hsl?.s;
  const l = hsl?.l;

  if (h === undefined || s === undefined || l === undefined) {
    return color;
  }

  const adjustedHsl = {
    h: (((h + hueShift) % 360) + 360) % 360,
    s: Math.min(1, Math.max(0, s * saturationScale)),
    l: Math.min(1, Math.max(0.1, l * lightnessScale)),
  };

  const out = converter("hsl")(adjustedHsl as Hsl);
  return formatHex(out);
}

// Preset HSL adjustment values
const HSL_PRESETS = [
  // Hue Adjustments
  { label: "Hue (-120°)", hueShift: -120, saturationScale: 1, lightnessScale: 1 },
  { label: "Hue (-60°)", hueShift: -60, saturationScale: 1, lightnessScale: 1 },
  { label: "Hue (+60°)", hueShift: 60, saturationScale: 1, lightnessScale: 1 },
  { label: "Hue (+120°)", hueShift: 120, saturationScale: 1, lightnessScale: 1 },
  { label: "Hue Invert", hueShift: 180, saturationScale: 1, lightnessScale: 1 },

  // Saturation Adjustments
  { label: "Grayscale", hueShift: 0, saturationScale: 0, lightnessScale: 1 },
  { label: "Muted", hueShift: 0, saturationScale: 0.6, lightnessScale: 1 },
  { label: "Vibrant", hueShift: 0, saturationScale: 1.4, lightnessScale: 1 },

  // Lightness Adjustments
  { label: "Dimmer", hueShift: 0, saturationScale: 1, lightnessScale: 0.8 },
  { label: "Brighter", hueShift: 0, saturationScale: 1, lightnessScale: 1.2 },

  // Combined Adjustments
  { label: "H(+30) S(-50) L(-5%)", hueShift: 30, saturationScale: 0.5, lightnessScale: 0.95 },
  { label: "H(-20) S(+20) L(+5%)", hueShift: -20, saturationScale: 1.2, lightnessScale: 1.05 },
  { label: "H(+20) S(-30) L(-5%)", hueShift: 20, saturationScale: 0.7, lightnessScale: 0.95 },
  { label: "H(-10) S(-25) L(+10%)", hueShift: -10, saturationScale: 0.75, lightnessScale: 1.1 },
  { label: "H(+60) S(+50) L(+10%)", hueShift: 60, saturationScale: 1.5, lightnessScale: 1.1 },
];

interface HslAdjustmentsProps {
  theme: ThemeState;
  onThemeChange: (theme: ThemeState) => void;
  currentStyles: ThemeStyleProps;
  baseStyles: ThemeStyleProps;
}

const HslAdjustments: React.FC<HslAdjustmentsProps> = ({
  theme,
  onThemeChange,
  currentStyles,
  baseStyles,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce> | null>(null);

  const currentHslAdjustments = useMemo(
    () => theme.hslAdjustments ?? defaultThemeState.hslAdjustments!,
    [theme.hslAdjustments]
  );

  // Setup debounced update function
  useEffect(() => {
    debouncedUpdateRef.current = debounce(
      (hslAdjustments: NonNullable<ThemeState["hslAdjustments"]>) => {
        const {
          hueShift = defaultThemeState.hslAdjustments!.hueShift,
          saturationScale = defaultThemeState.hslAdjustments!.saturationScale,
          lightnessScale = defaultThemeState.hslAdjustments!.lightnessScale,
        } = hslAdjustments ?? {};

        const adjustments = { hueShift, saturationScale, lightnessScale };

        // Use base styles from the original theme or current theme
        const { light: lightStyles, dark: darkStyles } = theme.styles;

        const updatedLightStyles = Object.keys(lightStyles)
          .filter((key) => !COMMON_STYLES.includes(key))
          .reduce<Record<string, string>>((acc, key) => {
            const colorKey = key as keyof typeof lightStyles;
            return {
              ...acc,
              [key]: adjustColorByHsl(
                baseStyles[colorKey] || lightStyles[colorKey] || "",
                adjustments.hueShift,
                adjustments.saturationScale,
                adjustments.lightnessScale
              ),
            };
          }, {});

        const updatedDarkStyles = Object.keys(darkStyles)
          .filter((key) => !COMMON_STYLES.includes(key))
          .reduce<Record<string, string>>((acc, key) => {
            const colorKey = key as keyof typeof darkStyles;
            return {
              ...acc,
              [key]: adjustColorByHsl(
                baseStyles[colorKey] || darkStyles[colorKey] || "",
                adjustments.hueShift,
                adjustments.saturationScale,
                adjustments.lightnessScale
              ),
            };
          }, {});

        // Update theme state with all changes
        onThemeChange({
          ...theme,
          hslAdjustments,
          styles: {
            light: { ...lightStyles, ...updatedLightStyles },
            dark: { ...darkStyles, ...updatedDarkStyles },
          },
        });
      },
      10
    );

    return () => debouncedUpdateRef.current?.cancel();
  }, [theme, onThemeChange, baseStyles]);

  const handleHslChange = useCallback(
    (property: keyof typeof currentHslAdjustments, value: number) => {
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current({
          ...currentHslAdjustments,
          [property]: value,
        });
      }
    },
    [currentHslAdjustments]
  );

  const handleBatchHslChange = useCallback(
    (value: typeof currentHslAdjustments) => {
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current(value);
      }
    },
    []
  );

  return (
    <div className="@container">
      <div
        className={cn(
          "-m-1 mb-2 grid grid-cols-5 gap-2 overflow-hidden p-1 transition-all duration-300 ease-in-out @sm:grid-cols-7 @md:grid-cols-9 @lg:grid-cols-11 @xl:grid-cols-13",
          !isExpanded ? "h-10" : "h-auto"
        )}
      >
        {HSL_PRESETS.map((preset) => (
          <HslPresetButton
            key={preset.label}
            label={preset.label}
            hueShift={preset.hueShift}
            saturationScale={preset.saturationScale}
            lightnessScale={preset.lightnessScale}
            baseBg={currentStyles.background}
            basePrimary={currentStyles.primary}
            baseSecondary={currentStyles.secondary}
            selected={
              currentHslAdjustments.hueShift === preset.hueShift &&
              currentHslAdjustments.saturationScale === preset.saturationScale &&
              currentHslAdjustments.lightnessScale === preset.lightnessScale
            }
            adjustColorByHsl={adjustColorByHsl}
            onClick={() => {
              handleBatchHslChange(preset);
            }}
          />
        ))}
      </div>

      {HSL_PRESETS.length > 5 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground mb-4 flex w-full items-center justify-center text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide" : "Show more"} presets
          <ChevronDown
            className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </Button>
      )}

      <SliderWithInput
        value={currentHslAdjustments.hueShift}
        onChange={(value) => handleHslChange("hueShift", value)}
        unit="deg"
        min={-180}
        max={180}
        step={1}
        label="Hue Shift"
      />
      <SliderWithInput
        value={currentHslAdjustments.saturationScale}
        onChange={(value) => handleHslChange("saturationScale", value)}
        unit="x"
        min={0}
        max={2}
        step={0.01}
        label="Saturation Multiplier"
      />
      <SliderWithInput
        value={currentHslAdjustments.lightnessScale}
        onChange={(value) => handleHslChange("lightnessScale", value)}
        unit="x"
        min={0.2}
        max={2}
        step={0.01}
        label="Lightness Multiplier"
      />
    </div>
  );
};

interface OtherPanelProps {
  currentStyles: ThemeStyleProps;
  currentMode: "light" | "dark";
  fullStyles: ThemeState["styles"];
  onStyleUpdate: <K extends keyof ThemeStyleProps>(
    key: K,
    value: ThemeStyleProps[K]
  ) => void;
  theme: ThemeState;
  onThemeChange: (theme: ThemeState) => void;
  disabled?: boolean;
}

export const OtherPanel: React.FC<OtherPanelProps> = ({
  currentStyles,
  onStyleUpdate,
  theme,
  onThemeChange,
  disabled = false,
}) => {
  const radius = parseFloat(currentStyles.radius.replace("rem", ""));

  // Get base styles (styles before HSL adjustments)
  const baseStyles = useMemo(() => {
    // If we have a selected preset, we could fetch its original styles
    // For now, we'll use the current mode's styles
    return theme.styles[theme.currentMode];
  }, [theme.styles, theme.currentMode]);

  return (
    <>
      <ControlSection title="HSL Adjustments" expanded>
        <HslAdjustments
          theme={theme}
          onThemeChange={onThemeChange}
          currentStyles={currentStyles}
          baseStyles={baseStyles}
        />
      </ControlSection>

      <ControlSection title="Radius" expanded>
        <SliderWithInput
          value={radius}
          onChange={(value) => onStyleUpdate("radius", `${value}rem`)}
          min={0}
          max={5}
          step={0.025}
          unit="rem"
          label="Radius"
        />
      </ControlSection>

      <ControlSection title="Spacing">
        <SliderWithInput
          value={parseFloat(currentStyles?.spacing?.replace("rem", "") || "0")}
          onChange={(value) => onStyleUpdate("spacing", `${value}rem`)}
          min={0.15}
          max={0.35}
          step={0.01}
          unit="rem"
          label="Spacing"
        />
      </ControlSection>

      <ControlSection title="Shadow">
        <ShadowControl
          shadowColor={currentStyles["shadow-color"]}
          shadowOpacity={parseFloat(currentStyles["shadow-opacity"])}
          shadowBlur={parseFloat(currentStyles["shadow-blur"]?.replace("px", ""))}
          shadowSpread={parseFloat(currentStyles["shadow-spread"]?.replace("px", ""))}
          shadowOffsetX={parseFloat(currentStyles["shadow-offset-x"]?.replace("px", ""))}
          shadowOffsetY={parseFloat(currentStyles["shadow-offset-y"]?.replace("px", ""))}
          onChange={(key, value) => {
            if (key === "shadow-color") {
              onStyleUpdate(key, value as string);
            } else if (key === "shadow-opacity") {
              onStyleUpdate(key, value.toString());
            } else {
              onStyleUpdate(key as keyof ThemeStyleProps, `${value}px`);
            }
          }}
        />
      </ControlSection>
    </>
  );
};

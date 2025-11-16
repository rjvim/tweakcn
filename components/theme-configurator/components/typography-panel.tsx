"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { FontPicker } from "@/components/editor/font-picker";
import ControlSection from "@/components/editor/control-section";
import { SliderWithInput } from "@/components/editor/slider-with-input";
import { Label } from "@/components/ui/label";
import { ThemeControlProps } from "../types";
import { FontInfo } from "@/types/fonts";
import { buildFontFamily } from "@/utils/fonts";

// Helper to get the first font family from a font string
const getFirstFontFamily = (fontString: string): string => {
  const match = fontString.match(/^"([^"]+)"|^([^,]+)/);
  return match ? (match[1] || match[2]).trim() : "";
};

export const TypographyPanel: React.FC<ThemeControlProps> = ({
  currentStyles,
  onStyleUpdate,
  disabled = false,
}) => {
  return (
    <>
      <div className="bg-muted/50 mb-4 flex items-start gap-2.5 rounded-md border p-3">
        <AlertCircle className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
        <div className="text-muted-foreground text-sm">
          <p>
            To use custom fonts, embed them in your project. <br />
            See{" "}
            <a
              href="https://tailwindcss.com/docs/font-family"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground/90 underline underline-offset-2"
            >
              Tailwind docs
            </a>{" "}
            for details.
          </p>
        </div>
      </div>

      <ControlSection title="Font Family" expanded className="p-3">
        <div className="mb-4">
          <Label htmlFor="font-sans" className="mb-1.5 block text-xs">
            Sans-Serif Font
          </Label>
          <FontPicker
            value={getFirstFontFamily(currentStyles["font-sans"])}
            category="sans-serif"
            placeholder="Choose a sans-serif font..."
            onSelect={(font: FontInfo) => {
              const fontFamily = buildFontFamily(font.family, font.category);
              onStyleUpdate("font-sans", fontFamily);
            }}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="font-serif" className="mb-1.5 block text-xs">
            Serif Font
          </Label>
          <FontPicker
            value={getFirstFontFamily(currentStyles["font-serif"])}
            category="serif"
            placeholder="Choose a serif font..."
            onSelect={(font: FontInfo) => {
              const fontFamily = buildFontFamily(font.family, font.category);
              onStyleUpdate("font-serif", fontFamily);
            }}
          />
        </div>

        <div>
          <Label htmlFor="font-mono" className="mb-1.5 block text-xs">
            Monospace Font
          </Label>
          <FontPicker
            value={getFirstFontFamily(currentStyles["font-mono"])}
            category="monospace"
            placeholder="Choose a monospace font..."
            onSelect={(font: FontInfo) => {
              const fontFamily = buildFontFamily(font.family, font.category);
              onStyleUpdate("font-mono", fontFamily);
            }}
          />
        </div>
      </ControlSection>

      <ControlSection title="Letter Spacing" expanded>
        <SliderWithInput
          value={parseFloat(currentStyles["letter-spacing"]?.replace("em", "") || "0")}
          onChange={(value) => onStyleUpdate("letter-spacing", `${value}em`)}
          min={-0.5}
          max={0.5}
          step={0.025}
          unit="em"
          label="Letter Spacing"
        />
      </ControlSection>
    </>
  );
};

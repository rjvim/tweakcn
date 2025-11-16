"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Moon,
  Search,
  Shuffle,
  Sun,
} from "lucide-react";
import { ThemePresetOption } from "../types";
import { ThemeStyleProps } from "@/types/theme";

interface ColorBoxProps {
  color: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  <div className="border-muted h-3 w-3 rounded-sm border" style={{ backgroundColor: color }} />
);

interface ThemeColorsProps {
  styles: ThemeStyleProps;
}

const ThemeColors: React.FC<ThemeColorsProps> = ({ styles }) => {
  return (
    <div className="flex gap-0.5">
      <ColorBox color={styles.primary} />
      <ColorBox color={styles.accent} />
      <ColorBox color={styles.secondary} />
      <ColorBox color={styles.border} />
    </div>
  );
};

const isThemeNew = (preset: ThemePresetOption) => {
  if (!preset.createdAt) return false;
  const createdAt = new Date(preset.createdAt);
  const timePeriod = new Date();
  timePeriod.setDate(timePeriod.getDate() - 5);
  return createdAt > timePeriod;
};

interface ThemePresetSelectorProps {
  presets: ThemePresetOption[];
  selectedPresetId?: string;
  currentStyles: ThemeStyleProps;
  currentMode: "light" | "dark";
  onPresetSelect: (presetId: string) => void;
  onModeToggle?: () => void;
  onRandomPreset?: () => void;
  onCyclePreset?: (direction: "prev" | "next") => void;
  disabled?: boolean;
  className?: string;
}

export const ThemePresetSelector: React.FC<ThemePresetSelectorProps> = ({
  presets,
  selectedPresetId,
  currentStyles,
  currentMode,
  onPresetSelect,
  onModeToggle,
  onRandomPreset,
  onCyclePreset,
  disabled = false,
  className,
}) => {
  const [search, setSearch] = useState("");

  const selectedPreset = useMemo(
    () => presets.find((p) => p.id === selectedPresetId),
    [presets, selectedPresetId]
  );

  const filteredPresets = useMemo(() => {
    if (search.trim() === "") return presets;

    return presets.filter((preset) =>
      preset.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [presets, search]);

  const savedThemes = useMemo(
    () => filteredPresets.filter((p) => p.source === "SAVED"),
    [filteredPresets]
  );

  const builtInThemes = useMemo(
    () => filteredPresets.filter((p) => p.source === "BUILT_IN" || !p.source),
    [filteredPresets]
  );

  return (
    <div className="flex w-full items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn("group relative w-full justify-between md:min-w-56", className)}
            disabled={disabled}
          >
            <div className="flex w-full items-center gap-3 overflow-hidden">
              <ThemeColors styles={currentStyles} />
              <span className="truncate text-left font-medium capitalize">
                {selectedPreset?.label || "Custom"}
              </span>
            </div>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="center">
          <Command className="h-100 w-full">
            <div className="flex w-full items-center">
              <div className="flex w-full items-center border-b px-3 py-1">
                <Search className="size-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Search themes..."
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-muted-foreground text-sm">
                {filteredPresets.length} theme{filteredPresets.length !== 1 ? "s" : ""}
              </div>
              <div className="flex gap-1">
                {onModeToggle && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 p-1"
                        onClick={onModeToggle}
                      >
                        {currentMode === "light" ? (
                          <Sun className="h-3.5 w-3.5" />
                        ) : (
                          <Moon className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle {currentMode === "light" ? "dark" : "light"} mode</TooltipContent>
                  </Tooltip>
                )}

                {onRandomPreset && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-6 p-1"
                        onClick={onRandomPreset}
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Random theme</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            <Separator />
            <ScrollArea className="h-[500px] max-h-[70vh]">
              <CommandEmpty>No themes found.</CommandEmpty>

              {savedThemes.length > 0 && (
                <>
                  <CommandGroup heading="Saved Themes">
                    {savedThemes.map((preset) => (
                      <CommandItem
                        key={preset.id}
                        value={preset.id}
                        onSelect={() => {
                          onPresetSelect(preset.id);
                          setSearch("");
                        }}
                        className="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                      >
                        <ThemeColors styles={preset.styles[currentMode]} />
                        <div className="flex flex-1 items-center gap-2">
                          <span className="line-clamp-1 text-sm font-medium capitalize">
                            {preset.label}
                          </span>
                          {isThemeNew(preset) && (
                            <Badge variant="secondary" className="rounded-full text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        {preset.id === selectedPresetId && (
                          <Check className="h-4 w-4 shrink-0 opacity-70" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <Separator className="my-2" />
                </>
              )}

              {builtInThemes.length > 0 && (
                <CommandGroup heading="Built-in Themes">
                  {builtInThemes.map((preset) => (
                    <CommandItem
                      key={preset.id}
                      value={preset.id}
                      onSelect={() => {
                        onPresetSelect(preset.id);
                        setSearch("");
                      }}
                      className="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                    >
                      <ThemeColors styles={preset.styles[currentMode]} />
                      <div className="flex flex-1 items-center gap-2">
                        <span className="text-sm font-medium capitalize">{preset.label}</span>
                        {isThemeNew(preset) && (
                          <Badge variant="secondary" className="rounded-full text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      {preset.id === selectedPresetId && (
                        <Check className="h-4 w-4 shrink-0 opacity-70" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>

      {onCyclePreset && (
        <>
          <Separator orientation="vertical" className="min-h-8" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="aspect-square min-h-8 w-auto shrink-0"
                onClick={() => onCyclePreset("prev")}
                disabled={disabled}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous theme</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="min-h-8" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="aspect-square min-h-8 w-auto shrink-0"
                onClick={() => onCyclePreset("next")}
                disabled={disabled}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next theme</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};

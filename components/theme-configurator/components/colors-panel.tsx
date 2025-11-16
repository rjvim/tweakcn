"use client";

import React from "react";
import ColorPicker from "@/components/editor/color-picker";
import ControlSection from "@/components/editor/control-section";
import { ThemeControlProps } from "../types";

export const ColorsPanel: React.FC<ThemeControlProps> = ({
  currentStyles,
  onStyleUpdate,
  disabled = false,
}) => {
  return (
    <>
      <ControlSection title="Primary Colors" expanded>
        <ColorPicker
          name="primary"
          color={currentStyles.primary}
          onChange={(color) => onStyleUpdate("primary", color)}
          label="Primary"
        />
        <ColorPicker
          name="primary-foreground"
          color={currentStyles["primary-foreground"]}
          onChange={(color) => onStyleUpdate("primary-foreground", color)}
          label="Primary Foreground"
        />
      </ControlSection>

      <ControlSection title="Secondary Colors" expanded>
        <ColorPicker
          name="secondary"
          color={currentStyles.secondary}
          onChange={(color) => onStyleUpdate("secondary", color)}
          label="Secondary"
        />
        <ColorPicker
          name="secondary-foreground"
          color={currentStyles["secondary-foreground"]}
          onChange={(color) => onStyleUpdate("secondary-foreground", color)}
          label="Secondary Foreground"
        />
      </ControlSection>

      <ControlSection title="Accent Colors">
        <ColorPicker
          name="accent"
          color={currentStyles.accent}
          onChange={(color) => onStyleUpdate("accent", color)}
          label="Accent"
        />
        <ColorPicker
          name="accent-foreground"
          color={currentStyles["accent-foreground"]}
          onChange={(color) => onStyleUpdate("accent-foreground", color)}
          label="Accent Foreground"
        />
      </ControlSection>

      <ControlSection title="Base Colors">
        <ColorPicker
          name="background"
          color={currentStyles.background}
          onChange={(color) => onStyleUpdate("background", color)}
          label="Background"
        />
        <ColorPicker
          name="foreground"
          color={currentStyles.foreground}
          onChange={(color) => onStyleUpdate("foreground", color)}
          label="Foreground"
        />
      </ControlSection>

      <ControlSection title="Card Colors">
        <ColorPicker
          name="card"
          color={currentStyles.card}
          onChange={(color) => onStyleUpdate("card", color)}
          label="Card Background"
        />
        <ColorPicker
          name="card-foreground"
          color={currentStyles["card-foreground"]}
          onChange={(color) => onStyleUpdate("card-foreground", color)}
          label="Card Foreground"
        />
      </ControlSection>

      <ControlSection title="Popover Colors">
        <ColorPicker
          name="popover"
          color={currentStyles.popover}
          onChange={(color) => onStyleUpdate("popover", color)}
          label="Popover Background"
        />
        <ColorPicker
          name="popover-foreground"
          color={currentStyles["popover-foreground"]}
          onChange={(color) => onStyleUpdate("popover-foreground", color)}
          label="Popover Foreground"
        />
      </ControlSection>

      <ControlSection title="Muted Colors">
        <ColorPicker
          name="muted"
          color={currentStyles.muted}
          onChange={(color) => onStyleUpdate("muted", color)}
          label="Muted"
        />
        <ColorPicker
          name="muted-foreground"
          color={currentStyles["muted-foreground"]}
          onChange={(color) => onStyleUpdate("muted-foreground", color)}
          label="Muted Foreground"
        />
      </ControlSection>

      <ControlSection title="Destructive Colors">
        <ColorPicker
          name="destructive"
          color={currentStyles.destructive}
          onChange={(color) => onStyleUpdate("destructive", color)}
          label="Destructive"
        />
        <ColorPicker
          name="destructive-foreground"
          color={currentStyles["destructive-foreground"]}
          onChange={(color) => onStyleUpdate("destructive-foreground", color)}
          label="Destructive Foreground"
        />
      </ControlSection>

      <ControlSection title="Border & Input Colors">
        <ColorPicker
          name="border"
          color={currentStyles.border}
          onChange={(color) => onStyleUpdate("border", color)}
          label="Border"
        />
        <ColorPicker
          name="input"
          color={currentStyles.input}
          onChange={(color) => onStyleUpdate("input", color)}
          label="Input"
        />
        <ColorPicker
          name="ring"
          color={currentStyles.ring}
          onChange={(color) => onStyleUpdate("ring", color)}
          label="Ring"
        />
      </ControlSection>

      <ControlSection title="Chart Colors">
        <ColorPicker
          name="chart-1"
          color={currentStyles["chart-1"]}
          onChange={(color) => onStyleUpdate("chart-1", color)}
          label="Chart 1"
        />
        <ColorPicker
          name="chart-2"
          color={currentStyles["chart-2"]}
          onChange={(color) => onStyleUpdate("chart-2", color)}
          label="Chart 2"
        />
        <ColorPicker
          name="chart-3"
          color={currentStyles["chart-3"]}
          onChange={(color) => onStyleUpdate("chart-3", color)}
          label="Chart 3"
        />
        <ColorPicker
          name="chart-4"
          color={currentStyles["chart-4"]}
          onChange={(color) => onStyleUpdate("chart-4", color)}
          label="Chart 4"
        />
        <ColorPicker
          name="chart-5"
          color={currentStyles["chart-5"]}
          onChange={(color) => onStyleUpdate("chart-5", color)}
          label="Chart 5"
        />
      </ControlSection>

      <ControlSection title="Sidebar Colors">
        <ColorPicker
          name="sidebar"
          color={currentStyles.sidebar}
          onChange={(color) => onStyleUpdate("sidebar", color)}
          label="Sidebar Background"
        />
        <ColorPicker
          name="sidebar-foreground"
          color={currentStyles["sidebar-foreground"]}
          onChange={(color) => onStyleUpdate("sidebar-foreground", color)}
          label="Sidebar Foreground"
        />
        <ColorPicker
          name="sidebar-primary"
          color={currentStyles["sidebar-primary"]}
          onChange={(color) => onStyleUpdate("sidebar-primary", color)}
          label="Sidebar Primary"
        />
        <ColorPicker
          name="sidebar-primary-foreground"
          color={currentStyles["sidebar-primary-foreground"]}
          onChange={(color) => onStyleUpdate("sidebar-primary-foreground", color)}
          label="Sidebar Primary Foreground"
        />
        <ColorPicker
          name="sidebar-accent"
          color={currentStyles["sidebar-accent"]}
          onChange={(color) => onStyleUpdate("sidebar-accent", color)}
          label="Sidebar Accent"
        />
        <ColorPicker
          name="sidebar-accent-foreground"
          color={currentStyles["sidebar-accent-foreground"]}
          onChange={(color) => onStyleUpdate("sidebar-accent-foreground", color)}
          label="Sidebar Accent Foreground"
        />
        <ColorPicker
          name="sidebar-border"
          color={currentStyles["sidebar-border"]}
          onChange={(color) => onStyleUpdate("sidebar-border", color)}
          label="Sidebar Border"
        />
        <ColorPicker
          name="sidebar-ring"
          color={currentStyles["sidebar-ring"]}
          onChange={(color) => onStyleUpdate("sidebar-ring", color)}
          label="Sidebar Ring"
        />
      </ControlSection>
    </>
  );
};

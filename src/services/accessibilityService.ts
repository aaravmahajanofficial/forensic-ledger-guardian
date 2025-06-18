/**
 * Accessibility Service
 * Provides comprehensive accessibility features and WCAG 2.2 compliance utilities
 */

import { logger } from "@/utils/logger";
import { config } from "@/config";

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: "small" | "medium" | "large" | "extra-large";
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  announcements: boolean;
}

export interface AccessibilityMetrics {
  colorContrast: number;
  focusableElements: number;
  headingStructure: boolean;
  altTextCoverage: number;
  keyboardAccessibility: number;
  ariaLabelCoverage: number;
}

class AccessibilityService {
  private settings: AccessibilitySettings;
  private announcer: HTMLElement | null = null;
  private focusTrap: HTMLElement[] = [];
  private observers: Map<string, MutationObserver> = new Map();

  constructor() {
    this.settings = this.getDefaultSettings();
    this.initialize();
  }

  private getDefaultSettings(): AccessibilitySettings {
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      try {
        return { ...this.getDefaultSettings(), ...JSON.parse(saved) };
      } catch (error) {
        logger.warn(
          "Failed to parse saved accessibility settings",
          {},
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    return {
      highContrast: window.matchMedia("(prefers-contrast: high)").matches,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
      fontSize: "medium",
      screenReader: this.detectScreenReader(),
      keyboardNavigation: true,
      focusIndicators: true,
      announcements: true,
    };
  }

  private detectScreenReader(): boolean {
    // Detect common screen reader user agents or specific APIs
    const userAgent = navigator.userAgent.toLowerCase();
    const screenReaders = ["nvda", "jaws", "dragon", "voiceover"];

    return (
      screenReaders.some((sr) => userAgent.includes(sr)) ||
      !!navigator.userAgent.match(/\b(VoiceOver|JAWS|NVDA|Dragon)\b/i) ||
      !!window.speechSynthesis
    );
  }

  private initialize(): void {
    this.createAnnouncer();
    this.setupMediaQueryListeners();
    this.setupKeyboardListeners();
    this.applySettings();
    this.monitorAccessibility();

    logger.info("Accessibility service initialized", {
      settings: this.settings,
    });
  }

  private createAnnouncer(): void {
    this.announcer = document.createElement("div");
    this.announcer.setAttribute("aria-live", "polite");
    this.announcer.setAttribute("aria-atomic", "true");
    this.announcer.setAttribute("role", "status");
    this.announcer.style.cssText = `
      position: absolute !important;
      left: -10000px !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
      clip: rect(1px, 1px, 1px, 1px) !important;
      white-space: nowrap !important;
    `;
    document.body.appendChild(this.announcer);
  }

  private setupMediaQueryListeners(): void {
    // Listen for system preference changes
    const contrastMedia = window.matchMedia("(prefers-contrast: high)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    contrastMedia.addEventListener("change", (e) => {
      this.updateSetting("highContrast", e.matches);
    });

    motionMedia.addEventListener("change", (e) => {
      this.updateSetting("reducedMotion", e.matches);
    });
  }

  private setupKeyboardListeners(): void {
    document.addEventListener("keydown", this.handleKeydown.bind(this));
    document.addEventListener("focusin", this.handleFocusin.bind(this));
    document.addEventListener("focusout", this.handleFocusout.bind(this));
  }

  private handleKeydown(event: KeyboardEvent): void {
    // Skip to content link (typically triggered by Tab on first focus)
    if (
      event.key === "Tab" &&
      !event.shiftKey &&
      document.activeElement === document.body
    ) {
      const skipLink = document.querySelector(
        "[data-skip-link]"
      ) as HTMLElement;
      if (skipLink) {
        skipLink.focus();
        event.preventDefault();
      }
    }

    // Escape key handling for modal dialogs
    if (event.key === "Escape") {
      const modal = document.querySelector(
        '[role="dialog"][aria-modal="true"]'
      ) as HTMLElement;
      if (modal) {
        const closeButton = modal.querySelector(
          "[data-close-modal]"
        ) as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    }

    // F6 key for cycling through regions
    if (event.key === "F6") {
      event.preventDefault();
      this.cycleThroughRegions(event.shiftKey);
    }
  }

  private handleFocusin(event: FocusEvent): void {
    const target = event.target as HTMLElement;

    // Ensure focus is visible
    if (this.settings.focusIndicators) {
      target.setAttribute("data-user-focus", "true");
    }

    // Announce focus changes for screen readers
    if (this.settings.announcements && this.settings.screenReader) {
      const label = this.getAccessibleLabel(target);
      if (label) {
        this.announce(label, "polite");
      }
    }
  }

  private handleFocusout(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    target.removeAttribute("data-user-focus");
  }

  private cycleThroughRegions(reverse: boolean = false): void {
    const regions = Array.from(
      document.querySelectorAll(
        '[role="region"], [role="main"], [role="navigation"], [role="complementary"], [role="banner"], [role="contentinfo"]'
      )
    ) as HTMLElement[];

    if (regions.length === 0) return;

    const currentIndex = regions.findIndex((region) =>
      region.contains(document.activeElement)
    );
    let nextIndex: number;

    if (reverse) {
      nextIndex = currentIndex <= 0 ? regions.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex >= regions.length - 1 ? 0 : currentIndex + 1;
    }

    const nextRegion = regions[nextIndex];
    const firstFocusable = this.getFirstFocusableElement(nextRegion);

    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      nextRegion.focus();
    }
  }

  private getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
    const focusableElements = this.getFocusableElements(container);
    return focusableElements[0] || null;
  }

  private getFocusableElements(
    container: HTMLElement = document.body
  ): HTMLElement[] {
    const selector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      "details summary",
      "audio[controls]",
      "video[controls]",
    ].join(", ");

    return Array.from(container.querySelectorAll(selector)).filter((el) => {
      const element = el as HTMLElement;
      return this.isVisible(element) && !this.isInert(element);
    }) as HTMLElement[];
  }

  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }

  private isInert(element: HTMLElement): boolean {
    return (
      element.hasAttribute("inert") ||
      element.closest("[inert]") !== null ||
      element.getAttribute("aria-hidden") === "true"
    );
  }

  private getAccessibleLabel(element: HTMLElement): string {
    // Priority order for accessible names
    const ariaLabel = element.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel;

    const ariaLabelledBy = element.getAttribute("aria-labelledby");
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy);
      if (labelElement) return labelElement.textContent || "";
    }

    const ariaDescribedBy = element.getAttribute("aria-describedby");
    if (ariaDescribedBy) {
      const descElement = document.getElementById(ariaDescribedBy);
      if (descElement) return descElement.textContent || "";
    }

    // For form controls, check associated label
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.textContent || "";
    }

    // For buttons, use text content
    if (element.tagName === "BUTTON") {
      return element.textContent || "";
    }

    // For links, use text content or title
    if (element.tagName === "A") {
      return element.textContent || element.getAttribute("title") || "";
    }

    // For images, use alt text
    if (element.tagName === "IMG") {
      return (element as HTMLImageElement).alt || "";
    }

    return element.textContent || "";
  }

  private applySettings(): void {
    const root = document.documentElement;

    // High contrast
    root.setAttribute("data-high-contrast", String(this.settings.highContrast));

    // Reduced motion
    root.setAttribute(
      "data-reduced-motion",
      String(this.settings.reducedMotion)
    );

    // Font size
    root.setAttribute("data-font-size", this.settings.fontSize);

    // Focus indicators
    root.setAttribute(
      "data-focus-indicators",
      String(this.settings.focusIndicators)
    );

    // Update CSS custom properties
    root.style.setProperty(
      "--a11y-high-contrast",
      this.settings.highContrast ? "1" : "0"
    );
    root.style.setProperty(
      "--a11y-reduced-motion",
      this.settings.reducedMotion ? "1" : "0"
    );
    root.style.setProperty("--a11y-font-scale", this.getFontScale());
  }

  private getFontScale(): string {
    const scales = {
      small: "0.875",
      medium: "1",
      large: "1.125",
      "extra-large": "1.25",
    };
    return scales[this.settings.fontSize];
  }

  private monitorAccessibility(): void {
    // Monitor DOM changes for accessibility violations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.auditElement(node as HTMLElement);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.observers.set("dom-monitor", observer);
  }

  private auditElement(element: HTMLElement): void {
    // Check for images without alt text
    const images = element.querySelectorAll("img:not([alt])");
    if (images.length > 0) {
      logger.warn("Images found without alt text", { count: images.length });
    }

    // Check for buttons without accessible names
    const buttons = element.querySelectorAll(
      "button:not([aria-label]):not([aria-labelledby])"
    );
    buttons.forEach((button) => {
      if (!button.textContent?.trim()) {
        logger.warn("Button found without accessible name", {
          element: button,
        });
      }
    });

    // Check for form inputs without labels
    const inputs = element.querySelectorAll(
      "input:not([aria-label]):not([aria-labelledby])"
    );
    inputs.forEach((input) => {
      const inputElement = input as HTMLInputElement;
      if (inputElement.type !== "hidden" && !inputElement.id) {
        logger.warn("Form input found without label association", {
          element: input,
        });
      }
    });
  }

  // Public API methods

  updateSetting<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ): void {
    this.settings[key] = value;
    this.applySettings();
    this.saveSettings();

    logger.info("Accessibility setting updated", { key, value });
  }

  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  resetSettings(): void {
    this.settings = this.getDefaultSettings();
    this.applySettings();
    this.saveSettings();
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(
        "accessibility-settings",
        JSON.stringify(this.settings)
      );
    } catch (error) {
      logger.error(
        "Failed to save accessibility settings",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  announce(message: string, priority: "polite" | "assertive" = "polite"): void {
    if (!this.settings.announcements || !this.announcer) return;

    this.announcer.setAttribute("aria-live", priority);
    this.announcer.textContent = message;

    // Clear after a delay to allow for repeated announcements
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = "";
      }
    }, 1000);
  }

  createFocusTrap(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);

    if (focusableElements.length === 0) {
      logger.warn("No focusable elements found in focus trap container");
      return () => {};
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeydown);

    // Focus the first element
    firstElement.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener("keydown", handleKeydown);
    };
  }

  measureColorContrast(foreground: string, background: string): number {
    // Convert colors to RGB
    const fgRgb = this.hexToRgb(foreground);
    const bgRgb = this.hexToRgb(background);

    if (!fgRgb || !bgRgb) return 0;

    // Calculate relative luminance
    const fgLuminance = this.getRelativeLuminance(fgRgb);
    const bgLuminance = this.getRelativeLuminance(bgRgb);

    // Calculate contrast ratio
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  private getRelativeLuminance({
    r,
    g,
    b,
  }: {
    r: number;
    g: number;
    b: number;
  }): number {
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;

    const rLinear =
      rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gLinear =
      gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bLinear =
      bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  auditPage(): AccessibilityMetrics {
    const images = document.querySelectorAll("img");
    const imagesWithAlt = document.querySelectorAll("img[alt]");
    const focusableElements = this.getFocusableElements();
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const elementsWithAriaLabel = document.querySelectorAll(
      "[aria-label], [aria-labelledby]"
    );

    // Check heading structure
    const headingLevels = Array.from(headings).map((h) =>
      parseInt(h.tagName.slice(1))
    );
    const headingStructure = this.validateHeadingStructure(headingLevels);

    // Calculate contrast for text elements
    const textElements = document.querySelectorAll(
      "p, span, div, a, button, input, label"
    );
    let contrastSum = 0;
    let contrastCount = 0;

    textElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;

      if (color && backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)") {
        const contrast = this.measureColorContrast(color, backgroundColor);
        if (contrast > 0) {
          contrastSum += contrast;
          contrastCount++;
        }
      }
    });

    return {
      colorContrast: contrastCount > 0 ? contrastSum / contrastCount : 0,
      focusableElements: focusableElements.length,
      headingStructure,
      altTextCoverage:
        images.length > 0 ? (imagesWithAlt.length / images.length) * 100 : 100,
      keyboardAccessibility: this.testKeyboardAccessibility(),
      ariaLabelCoverage:
        focusableElements.length > 0
          ? (elementsWithAriaLabel.length / focusableElements.length) * 100
          : 0,
    };
  }

  private validateHeadingStructure(levels: number[]): boolean {
    if (levels.length === 0) return true;

    // Should start with h1
    if (levels[0] !== 1) return false;

    // No level should jump more than 1
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) return false;
    }

    return true;
  }

  private testKeyboardAccessibility(): number {
    const focusableElements = this.getFocusableElements();
    let accessibleCount = 0;

    focusableElements.forEach((element) => {
      // Check if element is keyboard accessible
      const tabIndex = element.getAttribute("tabindex");
      if (tabIndex !== "-1" && this.isVisible(element)) {
        accessibleCount++;
      }
    });

    return focusableElements.length > 0
      ? (accessibleCount / focusableElements.length) * 100
      : 100;
  }

  cleanup(): void {
    // Clean up observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();

    // Remove announcer
    if (this.announcer && this.announcer.parentNode) {
      this.announcer.parentNode.removeChild(this.announcer);
    }

    logger.info("Accessibility service cleaned up");
  }
}

// Export singleton instance
export const accessibility = new AccessibilityService();

// React hook for accessibility features
import React from "react";

export function useAccessibility() {
  const [settings, setSettings] = React.useState(accessibility.getSettings());

  React.useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(accessibility.getSettings());
    };

    // Listen for settings changes (we can emit custom events when settings change)
    window.addEventListener(
      "accessibilitySettingsChanged",
      handleSettingsChange
    );

    return () => {
      window.removeEventListener(
        "accessibilitySettingsChanged",
        handleSettingsChange
      );
    };
  }, []);

  return {
    settings,
    updateSetting: accessibility.updateSetting.bind(accessibility),
    resetSettings: accessibility.resetSettings.bind(accessibility),
    announce: accessibility.announce.bind(accessibility),
    createFocusTrap: accessibility.createFocusTrap.bind(accessibility),
    measureColorContrast:
      accessibility.measureColorContrast.bind(accessibility),
    auditPage: accessibility.auditPage.bind(accessibility),
  };
}

export default accessibility;

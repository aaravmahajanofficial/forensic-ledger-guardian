/**
 * Localization Service
 * Provides comprehensive internationalization (i18n) support for the application
 */

import { logger } from "@/utils/logger";
import { config } from "@/config";

export type SupportedLocale =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "zh"
  | "ja"
  | "ar"
  | "hi";

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  rtl: boolean;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  numberFormat: Intl.NumberFormatOptions;
}

export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    search: string;
    filter: string;
    clear: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
  };

  // Navigation
  nav: {
    dashboard: string;
    cases: string;
    evidence: string;
    upload: string;
    verify: string;
    settings: string;
    help: string;
    logout: string;
  };

  // Authentication
  auth: {
    login: string;
    logout: string;
    username: string;
    password: string;
    forgotPassword: string;
    resetPassword: string;
    loginFailed: string;
    sessionExpired: string;
    unauthorized: string;
  };

  // Evidence
  evidence: {
    title: string;
    upload: string;
    verify: string;
    download: string;
    delete: string;
    filename: string;
    filesize: string;
    uploadDate: string;
    status: string;
    verified: string;
    pending: string;
    rejected: string;
    chainOfCustody: string;
  };

  // Cases
  cases: {
    title: string;
    create: string;
    caseNumber: string;
    description: string;
    status: string;
    createdDate: string;
    assignedTo: string;
    priority: string;
    high: string;
    medium: string;
    low: string;
  };

  // Errors
  errors: {
    generic: string;
    networkError: string;
    fileUploadFailed: string;
    invalidFileType: string;
    fileTooLarge: string;
    validationError: string;
    permissionDenied: string;
    notFound: string;
  };

  // Accessibility
  a11y: {
    skipToContent: string;
    mainNavigation: string;
    mainContent: string;
    sidebar: string;
    footer: string;
    openMenu: string;
    closeMenu: string;
    loading: string;
    error: string;
    required: string;
    optional: string;
    sortAscending: string;
    sortDescending: string;
  };
}

const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    rtl: false,
    dateFormat: "MM/dd/yyyy",
    timeFormat: "h:mm a",
    currency: "USD",
    numberFormat: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    rtl: false,
    dateFormat: "dd/MM/yyyy",
    timeFormat: "HH:mm",
    currency: "EUR",
    numberFormat: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    rtl: false,
    dateFormat: "dd/MM/yyyy",
    timeFormat: "HH:mm",
    currency: "EUR",
    numberFormat: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    rtl: false,
    dateFormat: "dd.MM.yyyy",
    timeFormat: "HH:mm",
    currency: "EUR",
    numberFormat: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  zh: {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    rtl: false,
    dateFormat: "yyyy/MM/dd",
    timeFormat: "HH:mm",
    currency: "CNY",
    numberFormat: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  ja: {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    rtl: false,
    dateFormat: "yyyy/MM/dd",
    timeFormat: "HH:mm",
    currency: "JPY",
    numberFormat: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    rtl: true,
    dateFormat: "dd/MM/yyyy",
    timeFormat: "HH:mm",
    currency: "SAR",
    numberFormat: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    rtl: false,
    dateFormat: "dd/MM/yyyy",
    timeFormat: "HH:mm",
    currency: "INR",
    numberFormat: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
};

// English translations as the base/fallback
const EN_TRANSLATIONS: TranslationKeys = {
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    close: "Close",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
  },
  nav: {
    dashboard: "Dashboard",
    cases: "Cases",
    evidence: "Evidence",
    upload: "Upload",
    verify: "Verify",
    settings: "Settings",
    help: "Help",
    logout: "Logout",
  },
  auth: {
    login: "Login",
    logout: "Logout",
    username: "Username",
    password: "Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    loginFailed: "Login failed. Please check your credentials.",
    sessionExpired: "Your session has expired. Please login again.",
    unauthorized: "You don't have permission to access this resource.",
  },
  evidence: {
    title: "Evidence",
    upload: "Upload Evidence",
    verify: "Verify Evidence",
    download: "Download",
    delete: "Delete Evidence",
    filename: "File Name",
    filesize: "File Size",
    uploadDate: "Upload Date",
    status: "Status",
    verified: "Verified",
    pending: "Pending",
    rejected: "Rejected",
    chainOfCustody: "Chain of Custody",
  },
  cases: {
    title: "Cases",
    create: "Create Case",
    caseNumber: "Case Number",
    description: "Description",
    status: "Status",
    createdDate: "Created Date",
    assignedTo: "Assigned To",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
  },
  errors: {
    generic: "An unexpected error occurred. Please try again.",
    networkError: "Network error. Please check your connection.",
    fileUploadFailed: "File upload failed. Please try again.",
    invalidFileType: "Invalid file type. Please select a supported file.",
    fileTooLarge: "File is too large. Please select a smaller file.",
    validationError: "Please correct the validation errors.",
    permissionDenied:
      "Permission denied. You don't have access to this resource.",
    notFound: "The requested resource was not found.",
  },
  a11y: {
    skipToContent: "Skip to main content",
    mainNavigation: "Main navigation",
    mainContent: "Main content",
    sidebar: "Sidebar",
    footer: "Footer",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    loading: "Loading content, please wait",
    error: "Error occurred",
    required: "Required field",
    optional: "Optional field",
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
  },
};

class LocalizationService {
  private currentLocale: SupportedLocale;
  private translations: Map<SupportedLocale, Partial<TranslationKeys>> =
    new Map();
  private dateFormatter: Intl.DateTimeFormat;
  private timeFormatter: Intl.DateTimeFormat;
  private numberFormatter: Intl.NumberFormat;
  private relativeTimeFormatter: Intl.RelativeTimeFormat;

  constructor() {
    this.currentLocale = this.detectLocale();
    this.translations.set("en", EN_TRANSLATIONS);
    this.updateFormatters();
    this.loadTranslations();
    this.applyRTL();

    logger.info("Localization service initialized", {
      locale: this.currentLocale,
    });
  }

  private detectLocale(): SupportedLocale {
    // Check stored preference
    const stored = localStorage.getItem("preferred-locale") as SupportedLocale;
    if (stored && Object.keys(SUPPORTED_LOCALES).includes(stored)) {
      return stored;
    }

    // Check browser language
    const browserLang = navigator.language.slice(0, 2) as SupportedLocale;
    if (Object.keys(SUPPORTED_LOCALES).includes(browserLang)) {
      return browserLang;
    }

    // Default to English
    return "en";
  }

  private updateFormatters(): void {
    const localeConfig = SUPPORTED_LOCALES[this.currentLocale];
    const localeCode =
      this.currentLocale === "zh" ? "zh-CN" : this.currentLocale;

    this.dateFormatter = new Intl.DateTimeFormat(localeCode, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    this.timeFormatter = new Intl.DateTimeFormat(localeCode, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: localeConfig.timeFormat.includes("a"),
    });

    this.numberFormatter = new Intl.NumberFormat(
      localeCode,
      localeConfig.numberFormat
    );

    this.relativeTimeFormatter = new Intl.RelativeTimeFormat(localeCode, {
      numeric: "auto",
      style: "long",
    });
  }

  private async loadTranslations(): Promise<void> {
    if (this.currentLocale === "en") return; // English is already loaded

    try {
      // In a real application, these would be loaded from external files or API
      // For now, we'll use a mock implementation
      const translationModule = await this.fetchTranslations(
        this.currentLocale
      );
      this.translations.set(this.currentLocale, translationModule);
    } catch (error) {
      logger.warn(
        "Failed to load translations",
        { locale: this.currentLocale },
        error instanceof Error ? error : new Error(String(error))
      );
      // Fallback to English
      this.currentLocale = "en";
    }
  }

  private async fetchTranslations(
    locale: SupportedLocale
  ): Promise<Partial<TranslationKeys>> {
    // Mock implementation - in real app, this would fetch from server or import dynamic modules
    // For demonstration, returning partial translations for Spanish
    if (locale === "es") {
      return {
        common: {
          loading: "Cargando...",
          error: "Error",
          success: "Éxito",
          warning: "Advertencia",
          save: "Guardar",
          cancel: "Cancelar",
          delete: "Eliminar",
          edit: "Editar",
          view: "Ver",
          search: "Buscar",
          filter: "Filtrar",
          clear: "Limpiar",
          back: "Volver",
          next: "Siguiente",
          previous: "Anterior",
          submit: "Enviar",
          close: "Cerrar",
          confirm: "Confirmar",
          yes: "Sí",
          no: "No",
        },
        nav: {
          dashboard: "Panel de Control",
          cases: "Casos",
          evidence: "Evidencia",
          upload: "Subir",
          verify: "Verificar",
          settings: "Configuración",
          help: "Ayuda",
          logout: "Cerrar Sesión",
        },
        auth: {
          login: "Iniciar Sesión",
          logout: "Cerrar Sesión",
          username: "Nombre de Usuario",
          password: "Contraseña",
          forgotPassword: "¿Olvidaste tu contraseña?",
          resetPassword: "Restablecer Contraseña",
          loginFailed: "Error de inicio de sesión. Verifica tus credenciales.",
          sessionExpired:
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          unauthorized: "No tienes permisos para acceder a este recurso.",
        },
      };
    }

    // Return empty object for other locales (would be implemented)
    return {};
  }

  private applyRTL(): void {
    const localeConfig = SUPPORTED_LOCALES[this.currentLocale];
    document.documentElement.dir = localeConfig.rtl ? "rtl" : "ltr";
    document.documentElement.lang = this.currentLocale;
  }

  // Public API methods

  setLocale(locale: SupportedLocale): void {
    if (!Object.keys(SUPPORTED_LOCALES).includes(locale)) {
      logger.warn("Unsupported locale", { locale });
      return;
    }

    this.currentLocale = locale;
    localStorage.setItem("preferred-locale", locale);
    this.updateFormatters();
    this.loadTranslations();
    this.applyRTL();

    // Dispatch event for components to update
    window.dispatchEvent(
      new CustomEvent("localeChanged", { detail: { locale } })
    );

    logger.info("Locale changed", { locale });
  }

  getCurrentLocale(): SupportedLocale {
    return this.currentLocale;
  }

  getLocaleConfig(): LocaleConfig {
    return SUPPORTED_LOCALES[this.currentLocale];
  }

  getSupportedLocales(): LocaleConfig[] {
    return Object.values(SUPPORTED_LOCALES);
  }

  t(key: string): string {
    const keys = key.split(".");
    const currentTranslations = this.translations.get(this.currentLocale) || {};
    const fallbackTranslations = this.translations.get("en") || {};

    // Try to get from current locale
    let value = this.getNestedValue(currentTranslations, keys);

    // Fallback to English if not found
    if (value === undefined) {
      value = this.getNestedValue(fallbackTranslations, keys);
    }

    // Return key if translation not found
    if (value === undefined) {
      logger.warn("Translation key not found", {
        key,
        locale: this.currentLocale,
      });
      return key;
    }

    return String(value);
  }

  private getNestedValue(obj: any, keys: string[]): any {
    return keys.reduce((current, key) => current?.[key], obj);
  }

  // Formatting methods

  formatDate(date: Date | string | number): string {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return String(date);
    return this.dateFormatter.format(dateObj);
  }

  formatTime(date: Date | string | number): string {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return String(date);
    return this.timeFormatter.format(dateObj);
  }

  formatDateTime(date: Date | string | number): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  formatNumber(value: number): string {
    return this.numberFormatter.format(value);
  }

  formatCurrency(amount: number, currency?: string): string {
    const localeConfig = SUPPORTED_LOCALES[this.currentLocale];
    const currencyCode = currency || localeConfig.currency;

    return new Intl.NumberFormat(this.currentLocale, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  }

  formatRelativeTime(date: Date | string | number): string {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return String(date);

    const now = new Date();
    const diffInSeconds = (dateObj.getTime() - now.getTime()) / 1000;

    // Determine the appropriate unit
    const absDiff = Math.abs(diffInSeconds);

    if (absDiff < 60) {
      return this.relativeTimeFormatter.format(
        Math.round(diffInSeconds),
        "second"
      );
    } else if (absDiff < 3600) {
      return this.relativeTimeFormatter.format(
        Math.round(diffInSeconds / 60),
        "minute"
      );
    } else if (absDiff < 86400) {
      return this.relativeTimeFormatter.format(
        Math.round(diffInSeconds / 3600),
        "hour"
      );
    } else if (absDiff < 2592000) {
      return this.relativeTimeFormatter.format(
        Math.round(diffInSeconds / 86400),
        "day"
      );
    } else if (absDiff < 31536000) {
      return this.relativeTimeFormatter.format(
        Math.round(diffInSeconds / 2592000),
        "month"
      );
    } else {
      return this.relativeTimeFormatter.format(
        Math.round(diffInSeconds / 31536000),
        "year"
      );
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const value = bytes / Math.pow(k, i);
    const formattedValue = this.numberFormatter.format(
      parseFloat(value.toFixed(2))
    );

    return `${formattedValue} ${sizes[i]}`;
  }

  // Pluralization helper
  plural(count: number, singular: string, plural?: string): string {
    const pluralForm = plural || `${singular}s`;

    // For languages with more complex pluralization rules, we'd use Intl.PluralRules
    const pr = new Intl.PluralRules(this.currentLocale);
    const rule = pr.select(count);

    // Simplified pluralization - in a real app, you'd have more sophisticated rules per language
    return count === 1 ? singular : pluralForm;
  }

  // List formatting
  formatList(
    items: string[],
    type: "conjunction" | "disjunction" = "conjunction"
  ): string {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];

    const listFormatter = new Intl.ListFormat(this.currentLocale, {
      style: "long",
      type,
    });

    return listFormatter.format(items);
  }
}

// Export singleton instance
export const localization = new LocalizationService();

// React hook for localization
import React from "react";

export function useLocalization() {
  const [locale, setLocale] = React.useState(localization.getCurrentLocale());

  React.useEffect(() => {
    const handleLocaleChange = (event: CustomEvent) => {
      setLocale(event.detail.locale);
    };

    window.addEventListener(
      "localeChanged",
      handleLocaleChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "localeChanged",
        handleLocaleChange as EventListener
      );
    };
  }, []);

  return {
    locale,
    localeConfig: localization.getLocaleConfig(),
    supportedLocales: localization.getSupportedLocales(),
    setLocale: localization.setLocale.bind(localization),
    t: localization.t.bind(localization),
    formatDate: localization.formatDate.bind(localization),
    formatTime: localization.formatTime.bind(localization),
    formatDateTime: localization.formatDateTime.bind(localization),
    formatNumber: localization.formatNumber.bind(localization),
    formatCurrency: localization.formatCurrency.bind(localization),
    formatRelativeTime: localization.formatRelativeTime.bind(localization),
    formatFileSize: localization.formatFileSize.bind(localization),
    plural: localization.plural.bind(localization),
    formatList: localization.formatList.bind(localization),
  };
}

export default localization;

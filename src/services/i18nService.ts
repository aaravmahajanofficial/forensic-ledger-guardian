/**
 * Internationalization (i18n) Service
 * Provides multi-language support for the Forensic Ledger Guardian application
 */

import { config } from "@/config";
import { logger } from "@/utils/logger";

export type Language = "en" | "es" | "fr" | "de" | "ja" | "zh";

export interface TranslationKeys {
  // Common UI elements
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    search: string;
    filter: string;
    sort: string;
    refresh: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    open: string;
    upload: string;
    download: string;
    settings: string;
    help: string;
    logout: string;
    login: string;
    email: string;
    password: string;
    username: string;
    required: string;
    optional: string;
    yes: string;
    no: string;
  };

  // Navigation
  navigation: {
    dashboard: string;
    evidence: string;
    cases: string;
    verification: string;
    reports: string;
    settings: string;
    help: string;
    profile: string;
  };

  // Authentication
  auth: {
    signIn: string;
    signOut: string;
    forgotPassword: string;
    resetPassword: string;
    rememberMe: string;
    invalidCredentials: string;
    sessionExpired: string;
    accessDenied: string;
    accountLocked: string;
    passwordStrength: string;
    twoFactorAuth: string;
  };

  // Evidence management
  evidence: {
    title: string;
    upload: string;
    verify: string;
    chainOfCustody: string;
    metadata: string;
    hash: string;
    timestamp: string;
    submittedBy: string;
    caseNumber: string;
    status: string;
    verified: string;
    pending: string;
    rejected: string;
    type: string;
    size: string;
    uploadSuccess: string;
    uploadError: string;
    verificationSuccess: string;
    verificationError: string;
    invalidFile: string;
    fileTooLarge: string;
    unsupportedFileType: string;
  };

  // Case management
  cases: {
    title: string;
    create: string;
    number: string;
    description: string;
    status: string;
    created: string;
    updated: string;
    assignedTo: string;
    priority: string;
    category: string;
    tags: string;
    active: string;
    closed: string;
    archived: string;
  };

  // Roles and permissions
  roles: {
    officer: string;
    forensicAnalyst: string;
    lawyer: string;
    judge: string;
    admin: string;
    viewer: string;
    permissions: string;
    accessControl: string;
    unauthorized: string;
  };

  // Errors and notifications
  errors: {
    generic: string;
    network: string;
    validation: string;
    authentication: string;
    authorization: string;
    fileUpload: string;
    blockchain: string;
    ipfs: string;
    database: string;
    timeout: string;
    serverError: string;
    clientError: string;
    notFound: string;
    forbidden: string;
    conflict: string;
    tooManyRequests: string;
  };

  // Accessibility
  accessibility: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    required: string;
    optional: string;
    sortAscending: string;
    sortDescending: string;
    expandRow: string;
    collapseRow: string;
    selectAll: string;
    deselectAll: string;
    pageOf: string;
    rowsPerPage: string;
    goToPage: string;
    searchResults: string;
    noResults: string;
    fileSelected: string;
    fileRemoved: string;
    dropFilesHere: string;
    dragToReorder: string;
  };
}

// English translations (default)
const translations: Record<Language, TranslationKeys> = {
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      refresh: "Refresh",
      back: "Back",
      next: "Next",
      previous: "Previous",
      close: "Close",
      open: "Open",
      upload: "Upload",
      download: "Download",
      settings: "Settings",
      help: "Help",
      logout: "Logout",
      login: "Login",
      email: "Email",
      password: "Password",
      username: "Username",
      required: "Required",
      optional: "Optional",
      yes: "Yes",
      no: "No",
    },
    navigation: {
      dashboard: "Dashboard",
      evidence: "Evidence",
      cases: "Cases",
      verification: "Verification",
      reports: "Reports",
      settings: "Settings",
      help: "Help",
      profile: "Profile",
    },
    auth: {
      signIn: "Sign In",
      signOut: "Sign Out",
      forgotPassword: "Forgot Password",
      resetPassword: "Reset Password",
      rememberMe: "Remember Me",
      invalidCredentials: "Invalid email or password",
      sessionExpired: "Your session has expired",
      accessDenied: "Access denied",
      accountLocked: "Account locked due to multiple failed attempts",
      passwordStrength: "Password must be at least 8 characters",
      twoFactorAuth: "Two-Factor Authentication",
    },
    evidence: {
      title: "Evidence Management",
      upload: "Upload Evidence",
      verify: "Verify Evidence",
      chainOfCustody: "Chain of Custody",
      metadata: "Metadata",
      hash: "Hash",
      timestamp: "Timestamp",
      submittedBy: "Submitted By",
      caseNumber: "Case Number",
      status: "Status",
      verified: "Verified",
      pending: "Pending",
      rejected: "Rejected",
      type: "Type",
      size: "Size",
      uploadSuccess: "Evidence uploaded successfully",
      uploadError: "Failed to upload evidence",
      verificationSuccess: "Evidence verified successfully",
      verificationError: "Failed to verify evidence",
      invalidFile: "Invalid file selected",
      fileTooLarge: "File size exceeds limit",
      unsupportedFileType: "Unsupported file type",
    },
    cases: {
      title: "Case Management",
      create: "Create Case",
      number: "Case Number",
      description: "Description",
      status: "Status",
      created: "Created",
      updated: "Updated",
      assignedTo: "Assigned To",
      priority: "Priority",
      category: "Category",
      tags: "Tags",
      active: "Active",
      closed: "Closed",
      archived: "Archived",
    },
    roles: {
      officer: "Police Officer",
      forensicAnalyst: "Forensic Analyst",
      lawyer: "Lawyer",
      judge: "Judge",
      admin: "Administrator",
      viewer: "Viewer",
      permissions: "Permissions",
      accessControl: "Access Control",
      unauthorized: "Unauthorized access",
    },
    errors: {
      generic: "An unexpected error occurred",
      network: "Network connection error",
      validation: "Validation error",
      authentication: "Authentication failed",
      authorization: "Authorization failed",
      fileUpload: "File upload failed",
      blockchain: "Blockchain transaction failed",
      ipfs: "IPFS storage failed",
      database: "Database error",
      timeout: "Request timeout",
      serverError: "Server error (500)",
      clientError: "Client error (400)",
      notFound: "Resource not found (404)",
      forbidden: "Forbidden (403)",
      conflict: "Conflict (409)",
      tooManyRequests: "Too many requests (429)",
    },
    accessibility: {
      skipToContent: "Skip to main content",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      loading: "Loading content",
      error: "Error message",
      success: "Success message",
      warning: "Warning message",
      info: "Information message",
      required: "Required field",
      optional: "Optional field",
      sortAscending: "Sort ascending",
      sortDescending: "Sort descending",
      expandRow: "Expand row",
      collapseRow: "Collapse row",
      selectAll: "Select all",
      deselectAll: "Deselect all",
      pageOf: "Page {current} of {total}",
      rowsPerPage: "Rows per page",
      goToPage: "Go to page",
      searchResults: "{count} results found",
      noResults: "No results found",
      fileSelected: "File selected: {filename}",
      fileRemoved: "File removed: {filename}",
      dropFilesHere: "Drop files here to upload",
      dragToReorder: "Drag to reorder",
    },
  },

  // Spanish translations
  es: {
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      confirm: "Confirmar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      view: "Ver",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      refresh: "Actualizar",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      close: "Cerrar",
      open: "Abrir",
      upload: "Subir",
      download: "Descargar",
      settings: "Configuración",
      help: "Ayuda",
      logout: "Cerrar Sesión",
      login: "Iniciar Sesión",
      email: "Correo Electrónico",
      password: "Contraseña",
      username: "Nombre de Usuario",
      required: "Requerido",
      optional: "Opcional",
      yes: "Sí",
      no: "No",
    },
    navigation: {
      dashboard: "Panel de Control",
      evidence: "Evidencia",
      cases: "Casos",
      verification: "Verificación",
      reports: "Informes",
      settings: "Configuración",
      help: "Ayuda",
      profile: "Perfil",
    },
    auth: {
      signIn: "Iniciar Sesión",
      signOut: "Cerrar Sesión",
      forgotPassword: "Olvidé la Contraseña",
      resetPassword: "Restablecer Contraseña",
      rememberMe: "Recordarme",
      invalidCredentials: "Correo o contraseña inválidos",
      sessionExpired: "Su sesión ha expirado",
      accessDenied: "Acceso denegado",
      accountLocked: "Cuenta bloqueada por múltiples intentos fallidos",
      passwordStrength: "La contraseña debe tener al menos 8 caracteres",
      twoFactorAuth: "Autenticación de Dos Factores",
    },
    evidence: {
      title: "Gestión de Evidencia",
      upload: "Subir Evidencia",
      verify: "Verificar Evidencia",
      chainOfCustody: "Cadena de Custodia",
      metadata: "Metadatos",
      hash: "Hash",
      timestamp: "Marca de Tiempo",
      submittedBy: "Enviado Por",
      caseNumber: "Número de Caso",
      status: "Estado",
      verified: "Verificado",
      pending: "Pendiente",
      rejected: "Rechazado",
      type: "Tipo",
      size: "Tamaño",
      uploadSuccess: "Evidencia subida exitosamente",
      uploadError: "Error al subir evidencia",
      verificationSuccess: "Evidencia verificada exitosamente",
      verificationError: "Error al verificar evidencia",
      invalidFile: "Archivo inválido seleccionado",
      fileTooLarge: "El tamaño del archivo excede el límite",
      unsupportedFileType: "Tipo de archivo no soportado",
    },
    cases: {
      title: "Gestión de Casos",
      create: "Crear Caso",
      number: "Número de Caso",
      description: "Descripción",
      status: "Estado",
      created: "Creado",
      updated: "Actualizado",
      assignedTo: "Asignado a",
      priority: "Prioridad",
      category: "Categoría",
      tags: "Etiquetas",
      active: "Activo",
      closed: "Cerrado",
      archived: "Archivado",
    },
    roles: {
      officer: "Oficial de Policía",
      forensicAnalyst: "Analista Forense",
      lawyer: "Abogado",
      judge: "Juez",
      admin: "Administrador",
      viewer: "Visualizador",
      permissions: "Permisos",
      accessControl: "Control de Acceso",
      unauthorized: "Acceso no autorizado",
    },
    errors: {
      generic: "Ocurrió un error inesperado",
      network: "Error de conexión de red",
      validation: "Error de validación",
      authentication: "Autenticación fallida",
      authorization: "Autorización fallida",
      fileUpload: "Error al subir archivo",
      blockchain: "Transacción blockchain fallida",
      ipfs: "Error de almacenamiento IPFS",
      database: "Error de base de datos",
      timeout: "Tiempo de espera agotado",
      serverError: "Error del servidor (500)",
      clientError: "Error del cliente (400)",
      notFound: "Recurso no encontrado (404)",
      forbidden: "Prohibido (403)",
      conflict: "Conflicto (409)",
      tooManyRequests: "Demasiadas solicitudes (429)",
    },
    accessibility: {
      skipToContent: "Saltar al contenido principal",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      loading: "Cargando contenido",
      error: "Mensaje de error",
      success: "Mensaje de éxito",
      warning: "Mensaje de advertencia",
      info: "Mensaje de información",
      required: "Campo requerido",
      optional: "Campo opcional",
      sortAscending: "Ordenar ascendente",
      sortDescending: "Ordenar descendente",
      expandRow: "Expandir fila",
      collapseRow: "Contraer fila",
      selectAll: "Seleccionar todo",
      deselectAll: "Deseleccionar todo",
      pageOf: "Página {current} de {total}",
      rowsPerPage: "Filas por página",
      goToPage: "Ir a página",
      searchResults: "{count} resultados encontrados",
      noResults: "No se encontraron resultados",
      fileSelected: "Archivo seleccionado: {filename}",
      fileRemoved: "Archivo eliminado: {filename}",
      dropFilesHere: "Arrastra archivos aquí para subir",
      dragToReorder: "Arrastra para reordenar",
    },
  },

  // Additional languages would be added here
  fr: {} as TranslationKeys, // French
  de: {} as TranslationKeys, // German
  ja: {} as TranslationKeys, // Japanese
  zh: {} as TranslationKeys, // Chinese
};

class I18nService {
  private currentLanguage: Language = "en";
  private fallbackLanguage: Language = "en";
  private translations = translations;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Get language from localStorage or browser
    const savedLanguage = localStorage.getItem("app-language") as Language;
    const browserLanguage = this.getBrowserLanguage();

    // Set initial language
    this.currentLanguage =
      savedLanguage || browserLanguage || this.fallbackLanguage;

    // Update HTML lang attribute
    this.updateDocumentLanguage();

    logger.info("I18n service initialized", {
      language: this.currentLanguage,
      fallback: this.fallbackLanguage,
    });
  }

  private getBrowserLanguage(): Language | null {
    const lang = navigator.language.split("-")[0] as Language;
    return this.translations[lang] ? lang : null;
  }

  private updateDocumentLanguage(): void {
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = this.isRTL() ? "rtl" : "ltr";
  }

  private isRTL(): boolean {
    const rtlLanguages: Language[] = []; // Add RTL languages as needed
    return rtlLanguages.includes(this.currentLanguage);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  getAvailableLanguages(): Language[] {
    return Object.keys(this.translations) as Language[];
  }

  setLanguage(language: Language): void {
    if (!this.translations[language]) {
      logger.warn("Language not supported", { language });
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem("app-language", language);
    this.updateDocumentLanguage();

    logger.info("Language changed", { language });

    // Dispatch custom event for components to react to language changes
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language },
      })
    );
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let value: any = this.translations[this.currentLanguage];

    // Navigate through nested keys
    for (const k of keys) {
      value = value?.[k];
    }

    // Fallback to default language if translation not found
    if (value === undefined && this.currentLanguage !== this.fallbackLanguage) {
      value = this.translations[this.fallbackLanguage];
      for (const k of keys) {
        value = value?.[k];
      }
    }

    // If still not found, return the key
    if (value === undefined) {
      logger.warn("Translation not found", {
        key,
        language: this.currentLanguage,
      });
      return key;
    }

    // Replace parameters in the translation
    if (params && typeof value === "string") {
      Object.entries(params).forEach(([param, replacement]) => {
        value = value.replace(
          new RegExp(`{${param}}`, "g"),
          String(replacement)
        );
      });
    }

    return value;
  }

  // Shorthand method
  t = this.translate.bind(this);

  // Format numbers according to locale
  formatNumber(num: number): string {
    return new Intl.NumberFormat(
      this.currentLanguage === "en" ? "en-US" : this.currentLanguage
    ).format(num);
  }

  // Format dates according to locale
  formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(
      this.currentLanguage === "en" ? "en-US" : this.currentLanguage,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options,
      }
    ).format(dateObj);
  }

  // Format time according to locale
  formatTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(
      this.currentLanguage === "en" ? "en-US" : this.currentLanguage,
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    ).format(dateObj);
  }

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000
    );

    const rtf = new Intl.RelativeTimeFormat(
      this.currentLanguage === "en" ? "en-US" : this.currentLanguage,
      { numeric: "auto" }
    );

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, "second");
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
    }
  }

  // Format file sizes
  formatFileSize(bytes: number): string {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return `${this.formatNumber(Math.round(size * 100) / 100)} ${sizes[i]}`;
  }
}

// Export singleton instance
export const i18n = new I18nService();

// React hook for using translations
export function useTranslation() {
  const [language, setLanguage] = React.useState(i18n.getCurrentLanguage());

  React.useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange as EventListener
      );
    };
  }, []);

  return {
    language,
    setLanguage: i18n.setLanguage.bind(i18n),
    availableLanguages: i18n.getAvailableLanguages(),
    t: i18n.translate.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatTime: i18n.formatTime.bind(i18n),
    formatRelativeTime: i18n.formatRelativeTime.bind(i18n),
    formatFileSize: i18n.formatFileSize.bind(i18n),
  };
}

// React imports for the hook
import React from "react";

export default i18n;

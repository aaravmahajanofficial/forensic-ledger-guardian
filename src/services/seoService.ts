/**
 * SEO Service
 * Provides comprehensive Search Engine Optimization utilities and meta tag management
 */

import { config } from "@/config";
import { logger } from "@/utils/logger";

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article" | "profile";
    siteName?: string;
    locale?: string;
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  jsonLD?: Record<string, any>;
}

export interface SEOAuditResult {
  score: number;
  issues: Array<{
    type: "error" | "warning" | "info";
    message: string;
    element?: string;
    fix?: string;
  }>;
  recommendations: string[];
}

class SEOService {
  private defaultMetadata: SEOMetadata;
  private structuredData: Map<string, any> = new Map();

  constructor() {
    this.defaultMetadata = {
      title: config.app.name,
      description:
        "Forensic Ledger Guardian - Secure blockchain-based evidence management system for law enforcement and legal professionals",
      keywords: [
        "forensic",
        "evidence",
        "blockchain",
        "law enforcement",
        "digital forensics",
        "chain of custody",
      ],
      robots: "index, follow",
      openGraph: {
        type: "website",
        siteName: config.app.name,
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
      },
    };

    this.initialize();
  }

  private initialize(): void {
    this.setupBaseMetadata();
    this.setupStructuredData();
    this.monitorPageChanges();

    logger.info("SEO service initialized");
  }

  private setupBaseMetadata(): void {
    // Set viewport for mobile optimization
    this.setMetaTag(
      "viewport",
      "width=device-width, initial-scale=1.0, shrink-to-fit=no"
    );

    // Set charset
    const charset = document.querySelector("meta[charset]");
    if (!charset) {
      const meta = document.createElement("meta");
      meta.setAttribute("charset", "UTF-8");
      document.head.insertBefore(meta, document.head.firstChild);
    }

    // Set theme color for mobile browsers
    this.setMetaTag("theme-color", "#1e40af"); // forensic-accent color

    // Set manifest for PWA
    const manifest = document.querySelector('link[rel="manifest"]');
    if (!manifest) {
      const link = document.createElement("link");
      link.setAttribute("rel", "manifest");
      link.setAttribute("href", "/manifest.json");
      document.head.appendChild(link);
    }

    // Set default metadata
    this.updateMetadata(this.defaultMetadata);
  }

  private setupStructuredData(): void {
    // Application structured data
    const applicationData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: config.app.name,
      description: this.defaultMetadata.description,
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web Browser",
      url: window.location.origin,
      author: {
        "@type": "Organization",
        name: "Forensic Solutions Team",
      },
      features: [
        "Evidence Management",
        "Blockchain Verification",
        "Chain of Custody Tracking",
        "Secure File Storage",
        "Audit Trail",
      ],
      securityConsiderations:
        "End-to-end encryption, blockchain verification, secure authentication",
    };

    this.addStructuredData("application", applicationData);

    // Organization structured data
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: config.app.name,
      description: "Secure evidence management for law enforcement",
      url: window.location.origin,
      logo: `${window.location.origin}/logo.png`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "technical support",
        availableLanguage: ["English", "Spanish"],
      },
    };

    this.addStructuredData("organization", organizationData);
  }

  private monitorPageChanges(): void {
    // Monitor route changes in SPA
    let currentPath = window.location.pathname;

    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.handleRouteChange();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also listen for popstate events
    window.addEventListener("popstate", this.handleRouteChange.bind(this));
  }

  private handleRouteChange(): void {
    // Update metadata based on current route
    const metadata = this.getRouteMetadata(window.location.pathname);
    this.updateMetadata(metadata);

    logger.info("SEO metadata updated for route", {
      path: window.location.pathname,
    });
  }

  private getRouteMetadata(path: string): Partial<SEOMetadata> {
    const routeMetadata: Record<string, Partial<SEOMetadata>> = {
      "/": {
        title: `${config.app.name} - Secure Evidence Management`,
        description:
          "Blockchain-based evidence management system for law enforcement and legal professionals. Secure, transparent, and tamper-proof.",
        keywords: [
          "forensic evidence",
          "blockchain security",
          "law enforcement tools",
          "digital chain of custody",
        ],
      },
      "/dashboard": {
        title: `Dashboard - ${config.app.name}`,
        description:
          "Evidence management dashboard with real-time analytics and case overview",
        robots: "noindex, nofollow", // Private area
      },
      "/evidence": {
        title: `Evidence Management - ${config.app.name}`,
        description:
          "Upload, verify, and manage digital evidence with blockchain-secured chain of custody",
        keywords: [
          "evidence upload",
          "digital forensics",
          "evidence verification",
        ],
      },
      "/cases": {
        title: `Case Management - ${config.app.name}`,
        description:
          "Organize and track forensic cases with comprehensive evidence management",
        keywords: [
          "case management",
          "forensic cases",
          "evidence organization",
        ],
      },
      "/verify": {
        title: `Evidence Verification - ${config.app.name}`,
        description:
          "Verify evidence integrity using blockchain technology and cryptographic hashing",
        keywords: [
          "evidence verification",
          "blockchain verification",
          "digital forensics",
        ],
      },
      "/help": {
        title: `Help & Documentation - ${config.app.name}`,
        description:
          "User guides, tutorials, and documentation for forensic evidence management",
        keywords: ["user guide", "documentation", "help", "forensic training"],
      },
    };

    return routeMetadata[path] || {};
  }

  updateMetadata(metadata: Partial<SEOMetadata>): void {
    const merged = { ...this.defaultMetadata, ...metadata };

    // Update title
    if (merged.title) {
      document.title = merged.title;
      this.setMetaProperty("og:title", merged.title);
      this.setMetaTag("twitter:title", merged.title);
    }

    // Update description
    if (merged.description) {
      this.setMetaTag("description", merged.description);
      this.setMetaProperty("og:description", merged.description);
      this.setMetaTag("twitter:description", merged.description);
    }

    // Update keywords
    if (merged.keywords) {
      this.setMetaTag("keywords", merged.keywords.join(", "));
    }

    // Update canonical URL
    if (merged.canonical) {
      this.setLinkTag("canonical", merged.canonical);
    } else {
      this.setLinkTag("canonical", window.location.href);
    }

    // Update robots
    if (merged.robots) {
      this.setMetaTag("robots", merged.robots);
    }

    // Update Open Graph tags
    if (merged.openGraph) {
      const og = merged.openGraph;
      this.setMetaProperty("og:type", og.type || "website");
      this.setMetaProperty("og:url", og.url || window.location.href);
      this.setMetaProperty("og:site_name", og.siteName || config.app.name);
      this.setMetaProperty("og:locale", og.locale || "en_US");

      if (og.image) {
        this.setMetaProperty("og:image", og.image);
        this.setMetaProperty("og:image:alt", merged.title || "");
      }
    }

    // Update Twitter Card tags
    if (merged.twitter) {
      const twitter = merged.twitter;
      this.setMetaTag("twitter:card", twitter.card || "summary");

      if (twitter.site) this.setMetaTag("twitter:site", twitter.site);
      if (twitter.creator) this.setMetaTag("twitter:creator", twitter.creator);
      if (twitter.image) this.setMetaTag("twitter:image", twitter.image);
    }

    // Update JSON-LD structured data
    if (merged.jsonLD) {
      this.addStructuredData("page", merged.jsonLD);
    }
  }

  private setMetaTag(name: string, content: string): void {
    let meta = document.querySelector(
      `meta[name="${name}"]`
    ) as HTMLMetaElement;

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  }

  private setMetaProperty(property: string, content: string): void {
    let meta = document.querySelector(
      `meta[property="${property}"]`
    ) as HTMLMetaElement;

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  }

  private setLinkTag(rel: string, href: string): void {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }

    link.setAttribute("href", href);
  }

  addStructuredData(id: string, data: Record<string, any>): void {
    this.structuredData.set(id, data);
    this.updateStructuredDataScript();
  }

  removeStructuredData(id: string): void {
    this.structuredData.delete(id);
    this.updateStructuredDataScript();
  }

  private updateStructuredDataScript(): void {
    // Remove existing structured data script
    const existingScript = document.querySelector(
      'script[type="application/ld+json"][data-seo]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Create new structured data script
    if (this.structuredData.size > 0) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "true");

      const allData = Array.from(this.structuredData.values());
      script.textContent = JSON.stringify(
        allData.length === 1 ? allData[0] : allData
      );

      document.head.appendChild(script);
    }
  }

  generateSitemap(): string {
    const baseUrl = window.location.origin;
    const routes = [
      { path: "/", priority: "1.0", changefreq: "monthly" },
      { path: "/evidence", priority: "0.8", changefreq: "weekly" },
      { path: "/verify", priority: "0.8", changefreq: "monthly" },
      { path: "/help", priority: "0.6", changefreq: "monthly" },
    ];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    routes.forEach((route) => {
      sitemap += "  <url>\n";
      sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
      sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${route.priority}</priority>\n`;
      sitemap += `    <lastmod>${
        new Date().toISOString().split("T")[0]
      }</lastmod>\n`;
      sitemap += "  </url>\n";
    });

    sitemap += "</urlset>";
    return sitemap;
  }

  generateRobotsTxt(): string {
    const baseUrl = window.location.origin;

    let robots = "User-agent: *\n";
    robots += "Allow: /\n";
    robots += "Disallow: /dashboard\n";
    robots += "Disallow: /settings\n";
    robots += "Disallow: /api/\n";
    robots += "Disallow: /admin/\n";
    robots += "\n";
    robots += `Sitemap: ${baseUrl}/sitemap.xml\n`;

    return robots;
  }

  auditSEO(): SEOAuditResult {
    const issues: SEOAuditResult["issues"] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check title
    const title = document.title;
    if (!title) {
      issues.push({
        type: "error",
        message: "Missing page title",
        fix: "Add a descriptive title tag",
      });
      score -= 15;
    } else if (title.length < 30 || title.length > 60) {
      issues.push({
        type: "warning",
        message: `Title length is ${title.length} characters (optimal: 30-60)`,
        fix: "Adjust title length to 30-60 characters",
      });
      score -= 5;
    }

    // Check meta description
    const description = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement;
    if (!description || !description.content) {
      issues.push({
        type: "error",
        message: "Missing meta description",
        fix: "Add a descriptive meta description",
      });
      score -= 15;
    } else if (
      description.content.length < 120 ||
      description.content.length > 160
    ) {
      issues.push({
        type: "warning",
        message: `Meta description length is ${description.content.length} characters (optimal: 120-160)`,
        fix: "Adjust meta description length to 120-160 characters",
      });
      score -= 5;
    }

    // Check headings structure
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const h1Count = document.querySelectorAll("h1").length;

    if (h1Count === 0) {
      issues.push({
        type: "error",
        message: "Missing H1 heading",
        fix: "Add exactly one H1 heading per page",
      });
      score -= 10;
    } else if (h1Count > 1) {
      issues.push({
        type: "warning",
        message: `Multiple H1 headings found (${h1Count})`,
        fix: "Use only one H1 heading per page",
      });
      score -= 5;
    }

    // Check images alt text
    const images = document.querySelectorAll("img");
    const imagesWithoutAlt = document.querySelectorAll("img:not([alt])");

    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: "warning",
        message: `${imagesWithoutAlt.length} images without alt text`,
        fix: "Add descriptive alt text to all images",
      });
      score -= Math.min(10, imagesWithoutAlt.length * 2);
    }

    // Check internal links
    const internalLinks = document.querySelectorAll(
      'a[href^="/"], a[href^="./"], a[href^="../"]'
    );
    const externalLinks = document.querySelectorAll(
      'a[href^="http"]:not([href*="' + window.location.hostname + '"])'
    );

    externalLinks.forEach((link) => {
      if (!link.getAttribute("rel")?.includes("nofollow")) {
        recommendations.push(
          "Consider adding rel='nofollow' to external links for SEO"
        );
      }
    });

    // Check canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      issues.push({
        type: "warning",
        message: "Missing canonical URL",
        fix: "Add canonical link tag",
      });
      score -= 5;
    }

    // Check Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    const ogImage = document.querySelector('meta[property="og:image"]');

    if (!ogTitle || !ogDescription) {
      issues.push({
        type: "info",
        message: "Missing Open Graph tags",
        fix: "Add Open Graph meta tags for better social sharing",
      });
      score -= 2;
    }

    // Check structured data
    const structuredDataScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (!structuredDataScript) {
      issues.push({
        type: "info",
        message: "No structured data found",
        fix: "Add JSON-LD structured data for better search results",
      });
      score -= 3;
    }

    // Check page load speed (basic check)
    if (document.readyState === "complete") {
      const loadTime =
        performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime > 3000) {
        issues.push({
          type: "warning",
          message: `Page load time is ${loadTime}ms (should be < 3000ms)`,
          fix: "Optimize images, minify CSS/JS, use compression",
        });
        score -= 10;
      }
    }

    // Check mobile viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      issues.push({
        type: "error",
        message: "Missing viewport meta tag",
        fix: "Add viewport meta tag for mobile optimization",
      });
      score -= 15;
    }

    // Generate recommendations
    if (score >= 90) {
      recommendations.push("Excellent SEO optimization!");
    } else if (score >= 80) {
      recommendations.push("Good SEO with room for minor improvements");
    } else if (score >= 70) {
      recommendations.push("Average SEO - address the issues above");
    } else {
      recommendations.push(
        "Poor SEO - critical issues need immediate attention"
      );
    }

    recommendations.push(
      "Consider adding FAQ structured data for better search features"
    );
    recommendations.push(
      "Implement breadcrumb navigation with structured data"
    );
    recommendations.push("Add social media meta tags for better sharing");
    recommendations.push("Optimize images with WebP format and lazy loading");

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
    };
  }

  // Performance and Core Web Vitals monitoring
  measureCoreWebVitals(): Promise<{
    FCP: number; // First Contentful Paint
    LCP: number; // Largest Contentful Paint
    FID: number; // First Input Delay
    CLS: number; // Cumulative Layout Shift
  }> {
    return new Promise((resolve) => {
      const vitals = { FCP: 0, LCP: 0, FID: 0, CLS: 0 };

      // Measure FCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === "first-contentful-paint"
        );
        if (fcpEntry) {
          vitals.FCP = fcpEntry.startTime;
        }
      }).observe({ entryTypes: ["paint"] });

      // Measure LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          vitals.LCP = entries[entries.length - 1].startTime;
        }
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // Measure FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          vitals.FID = entries[0].processingStart - entries[0].startTime;
        }
      }).observe({ entryTypes: ["first-input"] });

      // Measure CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        vitals.CLS = clsValue;
      }).observe({ entryTypes: ["layout-shift"] });

      // Resolve after a reasonable time
      setTimeout(() => resolve(vitals), 3000);
    });
  }
}

// Export singleton instance
export const seo = new SEOService();

// React hook for SEO
export function useSEO() {
  const updateMetadata = React.useCallback((metadata: Partial<SEOMetadata>) => {
    seo.updateMetadata(metadata);
  }, []);

  const addStructuredData = React.useCallback(
    (id: string, data: Record<string, any>) => {
      seo.addStructuredData(id, data);
    },
    []
  );

  const removeStructuredData = React.useCallback((id: string) => {
    seo.removeStructuredData(id);
  }, []);

  const auditSEO = React.useCallback(() => {
    return seo.auditSEO();
  }, []);

  return {
    updateMetadata,
    addStructuredData,
    removeStructuredData,
    auditSEO,
    measureCoreWebVitals: seo.measureCoreWebVitals.bind(seo),
  };
}

// React imports for the hook
import React from "react";

export default seo;

export interface SiteSettings {
  siteName: string;
  subtitle: string;
  aboutContent: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  socialLinks: Array<{ name: string; url: string }>;
}

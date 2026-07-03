/**
 * SEO Optimization Center Database
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface SeoAuditReport {
  overallScore: number;
  indicators: {
    name: string;
    description: string;
    status: 'pass' | 'warning' | 'fail';
    impact: 'high' | 'medium' | 'low';
  }[];
}

export interface SeoConfig {
  homepageTitle: string;
  homepageMetaDescription: string;
  enableSitemap: boolean;
  enableRobotsTxt: boolean;
  robotsCustomContent: string;
  enableStructuredSchema: boolean;
  lastGeneratedAt: string;
}

export const INITIAL_SEO_DATA: SeoConfig = {
  homepageTitle: 'Atelier Noir | High-End Editorial Bespoke Fashion Lookbooks Brussels',
  homepageMetaDescription: 'Discover the Atelier Noir collections. Sustainable silhouettes crafted with master precision from local organic materials in Brussels. Order worldwide shipping.',
  enableSitemap: true,
  enableRobotsTxt: true,
  robotsCustomContent: `User-agent: *
Disallow: /checkout/
Disallow: /carts/
Disallow: /admin/
Sitemap: https://ateliernoir.co/sitemap.xml`,
  enableStructuredSchema: true,
  lastGeneratedAt: '2026-06-17T00:00:00Z'
};

export const INITIAL_SEO_AUDIT: SeoAuditReport = {
  overallScore: 88,
  indicators: [
    {
      name: 'Structured JSON-LD Product Schema',
      description: 'Schema elements properly injected for product availability, rating, and monetary exchange valuation.',
      status: 'pass',
      impact: 'high'
    },
    {
      name: 'Title Length Integrity',
      description: 'Homepage meta title is 66 characters. Optimized between 50-70 characters for premium search indexes.',
      status: 'pass',
      impact: 'high'
    },
    {
      name: 'Missing Alt Tags in Lifestyle Slider Banners',
      description: '1 banner image is lacking description alt tags, dropping visual search visibility.',
      status: 'warning',
      impact: 'medium'
    },
    {
      name: 'Canonical Indexation Missing',
      description: 'Duplicate path variations detected without canonical fallback. Ensure https binding defaults.',
      status: 'fail',
      impact: 'high'
    }
  ]
};

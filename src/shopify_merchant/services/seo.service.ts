import { SeoConfig, SeoAuditReport, INITIAL_SEO_DATA, INITIAL_SEO_AUDIT } from '../database/seo';

export class SeoService {
  private static STORAGE_KEY = 'noir_admin_seo';
  private static AUDIT_STORAGE_KEY = 'noir_admin_seo_audit';

  static getSeoConfig(): SeoConfig {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_SEO_DATA));
      return INITIAL_SEO_DATA;
    }
    return JSON.parse(stored);
  }

  static getSeoAudit(): SeoAuditReport {
    const stored = localStorage.getItem(this.AUDIT_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_SEO_AUDIT));
      return INITIAL_SEO_AUDIT;
    }
    return JSON.parse(stored);
  }

  static saveSeoConfig(config: SeoConfig): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }

  static saveSeoAudit(audit: SeoAuditReport): void {
    localStorage.setItem(this.AUDIT_STORAGE_KEY, JSON.stringify(audit));
  }

  // Generates Structured Data snippet matching schema.org specifications
  static generateJsonLdSnippet(currentCatalog: any[] = []): string {
    const sampleProduct = currentCatalog[0] || { title: 'Bespoke Essential Trench', price: 350, description: 'Exclusive designer layout.' };
    return JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": sampleProduct.title || sampleProduct.name,
      "image": sampleProduct.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=120&q=80",
      "description": sampleProduct.description || "Designer tailoring, high-fidelity premium textures.",
      "brand": {
        "@type": "Brand",
        "name": "Atelier Noir"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://ateliernoir.co/products/" + (sampleProduct.id || 'bespoke'),
        "priceCurrency": "EUR",
        "price": sampleProduct.price || 350,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    }, null, 2);
  }

  // Generates dynamic XML sitemap mock file listing home, catalog, and collections paths
  static generateDynamicSitemapXml(currentCatalog: any[] = []): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const productNodes = currentCatalog.map(p => `  <url>
    <loc>https://ateliernoir.co/products/${p.id || 'p'}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ateliernoir.co/</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ateliernoir.co/collections</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${productNodes}
</urlset>`;
  }
}

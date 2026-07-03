import { z } from 'zod';

export const seoZodSchema = z.object({
  homepageTitle: z.string().min(5, '主页SEO标题过短').max(80, '主页SEO标题过长(限80c)'),
  homepageMetaDescription: z.string().min(10, '主页描述过短').max(200, '主页描述过长(限200c)'),
  enableSitemap: z.boolean().default(true),
  enableRobotsTxt: z.boolean().default(true),
  robotsCustomContent: z.string(),
  enableStructuredSchema: z.boolean().default(true),
});

import { z } from 'zod';

export const checkoutZodSchema = z.object({
  themeStyle: z.enum(['one_page', 'three_step']).default('one_page'),
  enableExpressCheckout: z.boolean().default(true),
  guestCheckout: z.enum(['allowed', 'required', 'disabled']).default('allowed'),
  requirePhoneNumber: z.boolean().default(true),
  addressAutocomplete: z.boolean().default(true),
  companyNameField: z.enum(['hidden', 'optional', 'required']).default('optional'),
  orderNotesField: z.enum(['hidden', 'optional', 'required']).default('optional'),
  brandingAccentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, '必须是合法的 HEX 颜色代码'),
  brandingDensity: z.enum(['tight', 'spacious']).default('spacious'),
});

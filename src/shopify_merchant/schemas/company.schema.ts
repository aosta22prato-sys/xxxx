import { z } from 'zod';
import { SchemaFieldMeta, SchemaColumnMeta } from './types';

export const companyZodSchema = z.object({
  name: z.string().min(1, '对公企业名称不能为空'),
  businessId: z.string().min(1, '工商信托代码税号不能为空'),
  location: z.string().min(1, '企业所在地不能为空'),
  primaryContactName: z.string().min(1, '主要往来代表姓名不能为空'),
  primaryContactEmail: z.string().email('往来邮箱格式不合规'),
  paymentTerm: z.enum(['Net 30', 'Net 60', 'Due on receipt']).default('Net 30'),
  creditLimit: z.number().default(5000),
});

export const companySchemaMeta: { fields: SchemaFieldMeta[]; columns: SchemaColumnMeta[] } = {
  fields: [
    { key: 'name', label: '对公企业全称 (Company Legal Name)', type: 'text', placeholder: 'Milano Leather Co.', required: true },
    { key: 'businessId', label: '工商统一证号/税号 (Business ID / Reg)', type: 'text', placeholder: 'IT-1234567M', required: true },
    { key: 'location', label: '公司法定地址 (Location Address)', type: 'text', placeholder: 'Milan, Italy', required: true },
    { key: 'primaryContactName', label: '往来代表代表 (Primary Contact Name)', type: 'text', placeholder: 'Mario Rossi', required: true },
    { key: 'primaryContactEmail', label: '往来代表邮箱 (Contact Email)', type: 'email', placeholder: 'mario@rossi.it', required: true },
    { key: 'paymentTerm', label: '对公结算账期条约 (Payment Terms)', type: 'select', options: [
      { label: '周转30天结账 (Net 30 Terms)', value: 'Net 30' },
      { label: '周转60天结账 (Net 60 Terms)', value: 'Net 60' },
      { label: '款到发货结账 (Due on Receipt)', value: 'Due on receipt' },
    ] },
    { key: 'creditLimit', label: '商户授信信用额度 (Credit Limit)', type: 'number', placeholder: '10000' }
  ],
  columns: [
    { key: 'name', label: '公司企业名称', type: 'text', sortable: true },
    { key: 'location', label: '经营驻地', type: 'text' },
    { key: 'primaryContactName', label: '核心代表负责人', type: 'text' },
    { key: 'primaryContactEmail', label: '商务往来电子邮箱', type: 'text' },
    { key: 'paymentTerm', label: '授信结算条约', type: 'badge' },
    { key: 'creditLimit', label: '对公授信额(€)', type: 'currency', sortable: true }
  ]
};
export default companyZodSchema;

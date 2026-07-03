import { B2BCompany } from '../types';
import { INITIAL_COMPANIES } from '../database/companies';

export class CompanyService {
  static async getCompanies(): Promise<B2BCompany[]> {
    const stored = localStorage.getItem('shopify_mock_companies');
    if (stored) return JSON.parse(stored);
    
    // Seed
    localStorage.setItem('shopify_mock_companies', JSON.stringify(INITIAL_COMPANIES));
    return INITIAL_COMPANIES;
  }

  static async saveCompanies(companies: B2BCompany[]): Promise<boolean> {
    localStorage.setItem('shopify_mock_companies', JSON.stringify(companies));
    return true;
  }
}

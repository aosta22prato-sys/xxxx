/**
 * Content and Theme Service Layer
 * Compliant with AI Permanent Constitution: Service Layer
 */

import { AssetFile, INITIAL_FILES_DATA } from '../database/files';
import { StaticPage, INITIAL_PAGES_DATA } from '../database/pages';
import { BlogPost, INITIAL_BLOGS_DATA } from '../database/blogs';
import { NavigationMenu, INITIAL_NAVIGATION_DATA } from '../database/navigation';
import { Metaobject, INITIAL_METAOBJECTS_DATA } from '../database/metaobjects';
import { ThemeConfig, INITIAL_THEME_DATA } from '../database/themes';
import { ApiService } from './api.service';

export class ContentService {
  // Service configuration
  private static provider: 'mock' | 'api' = 'mock';

  // FILES REST APIS
  static async getFiles(): Promise<AssetFile[]> {
    const stored = localStorage.getItem('shopify_mock_files');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('shopify_mock_files', JSON.stringify(INITIAL_FILES_DATA));
    return INITIAL_FILES_DATA;
  }

  static async saveFiles(files: AssetFile[]): Promise<boolean> {
    localStorage.setItem('shopify_mock_files', JSON.stringify(files));
    await ApiService.syncDatabaseSlices('files' as any, files);
    return true;
  }

  // PAGES REST APIS
  static async getPages(): Promise<StaticPage[]> {
    const stored = localStorage.getItem('shopify_mock_pages');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('shopify_mock_pages', JSON.stringify(INITIAL_PAGES_DATA));
    return INITIAL_PAGES_DATA;
  }

  static async savePages(pages: StaticPage[]): Promise<boolean> {
    localStorage.setItem('shopify_mock_pages', JSON.stringify(pages));
    await ApiService.syncDatabaseSlices('pages' as any, pages);
    return true;
  }

  // BLOG POSTS REST APIS
  static async getBlogs(): Promise<BlogPost[]> {
    const stored = localStorage.getItem('shopify_mock_blogs');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('shopify_mock_blogs', JSON.stringify(INITIAL_BLOGS_DATA));
    return INITIAL_BLOGS_DATA;
  }

  static async saveBlogs(blogs: BlogPost[]): Promise<boolean> {
    localStorage.setItem('shopify_mock_blogs', JSON.stringify(blogs));
    await ApiService.syncDatabaseSlices('blogs' as any, blogs);
    return true;
  }

  // NAVIGATION MENUS REST APIS
  static async getNavigation(): Promise<NavigationMenu[]> {
    const stored = localStorage.getItem('shopify_mock_navigation');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('shopify_mock_navigation', JSON.stringify(INITIAL_NAVIGATION_DATA));
    return INITIAL_NAVIGATION_DATA;
  }

  static async saveNavigation(menus: NavigationMenu[]): Promise<boolean> {
    localStorage.setItem('shopify_mock_navigation', JSON.stringify(menus));
    await ApiService.syncDatabaseSlices('navigation' as any, menus);
    return true;
  }

  // METAOBJECT DETAILS REST APIS
  static async getMetaobjects(): Promise<Metaobject[]> {
    const stored = localStorage.getItem('shopify_mock_metaobjects');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('shopify_mock_metaobjects', JSON.stringify(INITIAL_METAOBJECTS_DATA));
    return INITIAL_METAOBJECTS_DATA;
  }

  static async saveMetaobjects(metaobjects: Metaobject[]): Promise<boolean> {
    localStorage.setItem('shopify_mock_metaobjects', JSON.stringify(metaobjects));
    await ApiService.syncDatabaseSlices('metaobjects' as any, metaobjects);
    return true;
  }

  // THEMES CONFIGURATION REST APIS
  static async getThemes(): Promise<ThemeConfig[]> {
    const stored = localStorage.getItem('shopify_mock_themes');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('shopify_mock_themes', JSON.stringify(INITIAL_THEME_DATA));
    return INITIAL_THEME_DATA;
  }

  static async saveThemes(themes: ThemeConfig[]): Promise<boolean> {
    localStorage.setItem('shopify_mock_themes', JSON.stringify(themes));
    await ApiService.syncDatabaseSlices('themes' as any, themes);
    return true;
  }
}

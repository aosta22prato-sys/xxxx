/**
 * Schemas validation layers for Content and Themes
 * Compliant with AI Permanent Constitution: Schema Layer
 */

import { AssetFile } from '../database/files';
import { StaticPage } from '../database/pages';
import { BlogPost } from '../database/blogs';
import { NavigationMenu } from '../database/navigation';
import { Metaobject } from '../database/metaobjects';
import { ThemeConfig } from '../database/themes';

export const contentSchemas = {
  file: {
    validate: (data: Partial<AssetFile>): { success: boolean; errors?: string[] } => {
      const errors: string[] = [];
      if (!data.name || data.name.trim().length === 0) {
        errors.push('文件名不能为空 (File name is required)');
      }
      if (!data.url || data.url.trim().length === 0) {
        errors.push('文件媒体 URL 不能为空 (File URL is required)');
      }
      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  },
  page: {
    validate: (data: Partial<StaticPage>): { success: boolean; errors?: string[] } => {
      const errors: string[] = [];
      if (!data.title || data.title.trim().length === 0) {
        errors.push('页面标题不能为空 (Page title is required)');
      }
      if (!data.slug || !/^[a-z0-9-_]+$/.test(data.slug)) {
        errors.push('页面路径 Slug 格式必须是字母数字连字符 (Slug must be simple alphanumeric, dashes)');
      }
      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  },
  blog: {
    validate: (data: Partial<BlogPost>): { success: boolean; errors?: string[] } => {
      const errors: string[] = [];
      if (!data.title || data.title.trim().length === 0) {
        errors.push('博客文章标题不能为空 (Blog title is required)');
      }
      if (!data.content || data.content.trim().length === 0) {
        errors.push('博客内容不能为空 (Blog content is required)');
      }
      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  },
  navigation: {
    validate: (data: Partial<NavigationMenu>): { success: boolean; errors?: string[] } => {
      const errors: string[] = [];
      if (!data.title || data.title.trim().length === 0) {
        errors.push('导航标题不能为空 (Navigation title is required)');
      }
      if (!data.handle || data.handle.trim().length === 0) {
        errors.push('导航标识 Handle 不能为空 (Navigation handle is required)');
      }
      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  },
  metaobject: {
    validate: (data: Partial<Metaobject>): { success: boolean; errors?: string[] } => {
      const errors: string[] = [];
      if (!data.name || data.name.trim().length === 0) {
        errors.push('元对象名不能为空 (Metaobject name is required)');
      }
      if (!data.handle || !/^[a-z0-9_]+$/.test(data.handle)) {
        errors.push('元对象标识 Handle 必须是下划线分隔小写字母 (Handle must be lowercase and snake_case)');
      }
      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  },
  theme: {
    validate: (data: Partial<ThemeConfig>): { success: boolean; errors?: string[] } => {
      const errors: string[] = [];
      if (!data.name || data.name.trim().length === 0) {
        errors.push('主题模版名称不能留空 (Theme name is required)');
      }
      if (!data.primaryColor || !data.primaryColor.startsWith('#')) {
        errors.push('核心主颜色必须为十六进制 Hex 格式 (Primary color must be hex format)');
      }
      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    }
  }
};

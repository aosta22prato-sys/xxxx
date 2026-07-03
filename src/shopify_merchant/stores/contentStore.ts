/**
 * State store for all Content and Theme settings and edits
 * Compliant with AI Permanent Constitution: Store Layer
 */

import { create } from 'zustand';
import { AssetFile } from '../database/files';
import { StaticPage } from '../database/pages';
import { BlogPost } from '../database/blogs';
import { NavigationMenu } from '../database/navigation';
import { Metaobject } from '../database/metaobjects';
import { ThemeConfig } from '../database/themes';
import { ContentService } from '../services/content.service';

interface ContentState {
  // Asset state
  files: AssetFile[];
  setFiles: (files: AssetFile[]) => void;
  addFile: (file: AssetFile) => void;
  updateFile: (id: string, updated: Partial<AssetFile>) => void;
  deleteFile: (id: string) => void;

  // Pages state
  pages: StaticPage[];
  setPages: (pages: StaticPage[]) => void;
  addPage: (page: StaticPage) => void;
  updatePage: (id: string, updated: Partial<StaticPage>) => void;
  deletePage: (id: string) => void;

  // Blogs state
  blogs: BlogPost[];
  setBlogs: (blogs: BlogPost[]) => void;
  addBlog: (blog: BlogPost) => void;
  updateBlog: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;

  // Navigation state
  navigation: NavigationMenu[];
  setNavigation: (menus: NavigationMenu[]) => void;
  addNavigation: (menu: NavigationMenu) => void;
  updateNavigation: (id: string, updated: Partial<NavigationMenu>) => void;
  deleteNavigation: (id: string) => void;

  // Metaobjects state
  metaobjects: Metaobject[];
  setMetaobjects: (models: Metaobject[]) => void;
  addMetaobject: (model: Metaobject) => void;
  updateMetaobject: (id: string, updated: Partial<Metaobject>) => void;
  deleteMetaobject: (id: string) => void;

  // Themes state
  themes: ThemeConfig[];
  setThemes: (themes: ThemeConfig[]) => void;
  addTheme: (theme: ThemeConfig) => void;
  updateTheme: (id: string, updated: Partial<ThemeConfig>) => void;
  deleteTheme: (id: string) => void;

  // Hydration helper
  hydrateAll: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  files: [],
  pages: [],
  blogs: [],
  navigation: [],
  metaobjects: [],
  themes: [],

  // Hydration engine
  hydrateAll: async () => {
    const files = await ContentService.getFiles();
    const pages = await ContentService.getPages();
    const blogs = await ContentService.getBlogs();
    const navigation = await ContentService.getNavigation();
    const metaobjects = await ContentService.getMetaobjects();
    const themes = await ContentService.getThemes();

    set({ files, pages, blogs, navigation, metaobjects, themes });
  },

  // FILES MUTATORS
  setFiles: (files) => {
    set({ files });
    ContentService.saveFiles(files);
  },
  addFile: (file) => {
    const updated = [file, ...get().files];
    set({ files: updated });
    ContentService.saveFiles(updated);
  },
  updateFile: (id, updated) => {
    const updatedList = get().files.map((f) => (f.id === id ? { ...f, ...updated, updatedAt: new Date().toISOString() } : f));
    set({ files: updatedList });
    ContentService.saveFiles(updatedList);
  },
  deleteFile: (id) => {
    const updatedList = get().files.filter((f) => f.id !== id);
    set({ files: updatedList });
    ContentService.saveFiles(updatedList);
  },

  // PAGES MUTATORS
  setPages: (pages) => {
    set({ pages });
    ContentService.savePages(pages);
  },
  addPage: (page) => {
    const updated = [page, ...get().pages];
    set({ pages: updated });
    ContentService.savePages(updated);
  },
  updatePage: (id, updated) => {
    const updatedList = get().pages.map((p) => (p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p));
    set({ pages: updatedList });
    ContentService.savePages(updatedList);
  },
  deletePage: (id) => {
    const updatedList = get().pages.filter((p) => p.id !== id);
    set({ pages: updatedList });
    ContentService.savePages(updatedList);
  },

  // BLOGS MUTATORS
  setBlogs: (blogs) => {
    set({ blogs });
    ContentService.saveBlogs(blogs);
  },
  addBlog: (blog) => {
    const updated = [blog, ...get().blogs];
    set({ blogs: updated });
    ContentService.saveBlogs(updated);
  },
  updateBlog: (id, updated) => {
    const updatedList = get().blogs.map((b) => (b.id === id ? { ...b, ...updated, updatedAt: new Date().toISOString() } : b));
    set({ blogs: updatedList });
    ContentService.saveBlogs(updatedList);
  },
  deleteBlog: (id) => {
    const updatedList = get().blogs.filter((b) => b.id !== id);
    set({ blogs: updatedList });
    ContentService.saveBlogs(updatedList);
  },

  // NAVIGATION MUTATORS
  setNavigation: (navigation) => {
    set({ navigation });
    ContentService.saveNavigation(navigation);
  },
  addNavigation: (menu) => {
    const updated = [menu, ...get().navigation];
    set({ navigation: updated });
    ContentService.saveNavigation(updated);
  },
  updateNavigation: (id, updated) => {
    const updatedList = get().navigation.map((n) => (n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n));
    set({ navigation: updatedList });
    ContentService.saveNavigation(updatedList);
  },
  deleteNavigation: (id) => {
    const updatedList = get().navigation.filter((n) => n.id !== id);
    set({ navigation: updatedList });
    ContentService.saveNavigation(updatedList);
  },

  // METAOBJECTS MUTATORS
  setMetaobjects: (metaobjects) => {
    set({ metaobjects });
    ContentService.saveMetaobjects(metaobjects);
  },
  addMetaobject: (model) => {
    const updated = [model, ...get().metaobjects];
    set({ metaobjects: updated });
    ContentService.saveMetaobjects(updated);
  },
  updateMetaobject: (id, updated) => {
    const updatedList = get().metaobjects.map((m) => (m.id === id ? { ...m, ...updated, updatedAt: new Date().toISOString() } : m));
    set({ metaobjects: updatedList });
    ContentService.saveMetaobjects(updatedList);
  },
  deleteMetaobject: (id) => {
    const updatedList = get().metaobjects.filter((m) => m.id !== id);
    set({ metaobjects: updatedList });
    ContentService.saveMetaobjects(updatedList);
  },

  // THEMES MUTATORS
  setThemes: (themes) => {
    set({ themes });
    ContentService.saveThemes(themes);
  },
  addTheme: (theme) => {
    const updated = [theme, ...get().themes];
    set({ themes: updated });
    ContentService.saveThemes(updated);
  },
  updateTheme: (id, updated) => {
    const updatedList = get().themes.map((t) => (t.id === id ? { ...t, ...updated, updatedAt: new Date().toISOString() } : t));
    set({ themes: updatedList });
    ContentService.saveThemes(updatedList);
  },
  deleteTheme: (id) => {
    const updatedList = get().themes.filter((t) => t.id !== id);
    set({ themes: updatedList });
    ContentService.saveThemes(updatedList);
  }
}));

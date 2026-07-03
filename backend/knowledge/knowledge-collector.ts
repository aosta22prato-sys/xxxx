/**
 * Knowledge Collector - 知识库采集系统
 * 
 * 核心功能：
 * - 集成 Crawl4AI 进行网页抓取
 * - 文档解析与处理
 * - 内容分块与向量化
 * - 向量存储与检索
 */

import { dbEngine } from '../../src/db/dbEngine';

export interface CrawlTask {
  task_id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  options: CrawlOptions;
  result?: CrawlResult;
  error?: string;
  created_at: number;
  started_at?: number;
  completed_at?: number;
}

export interface CrawlOptions {
  recursive?: boolean;
  max_depth?: number;
  max_pages?: number;
  exclude_patterns?: string[];
  include_patterns?: string[];
  extract_main_content?: boolean;
  remove_ads?: boolean;
  word_count_threshold?: number;
}

export interface CrawlResult {
  url: string;
  title: string;
  markdown: string;
  html: string;
  extracted_content: string;
  metadata: {
    author?: string;
    date_published?: string;
    language?: string;
    word_count: number;
    page_type: string;
  };
  links: string[];
  screenshots?: string[];
  chunks?: DocumentChunk[];
}

export interface DocumentChunk {
  chunk_id: string;
  content: string;
  metadata: {
    source_url: string;
    chunk_index: number;
    total_chunks: number;
    word_count: number;
    section_title?: string;
  };
  embedding?: number[];
}

export interface KnowledgeDocument {
  doc_id: string;
  title: string;
  source_url: string;
  content: string;
  category: string;
  tags: string[];
  chunks: DocumentChunk[];
  status: 'draft' | 'published' | 'archived';
  created_at: number;
  updated_at: number;
}

export class KnowledgeCollector {
  private static instance: KnowledgeCollector;
  private tasks: Map<string, CrawlTask> = new Map();

  private constructor() {
    console.log('🧠 [Knowledge Collector] Initializing...');
    this.loadTasksFromDB();
  }

  public static getInstance(): KnowledgeCollector {
    if (!KnowledgeCollector.instance) {
      KnowledgeCollector.instance = new KnowledgeCollector();
    }
    return KnowledgeCollector.instance;
  }

  /**
   * 创建新的抓取任务
   */
  public createCrawlTask(url: string, options?: CrawlOptions): CrawlTask {
    const task_id = `crawl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const task: CrawlTask = {
      task_id,
      url,
      status: 'pending',
      options: {
        recursive: options?.recursive ?? false,
        max_depth: options?.max_depth ?? 1,
        max_pages: options?.max_pages ?? 10,
        extract_main_content: options?.extract_main_content ?? true,
        remove_ads: options?.remove_ads ?? true,
        word_count_threshold: options?.word_count_threshold ?? 50,
        ...options
      },
      created_at: Date.now()
    };

    this.tasks.set(task_id, task);
    this.saveTasksToDB();

    console.log(`✅ [Knowledge Collector] Created crawl task: ${task_id} for ${url}`);
    return task;
  }

  /**
   * 执行抓取任务
   */
  public async executeCrawlTask(task_id: string): Promise<CrawlTask> {
    const task = this.tasks.get(task_id);
    if (!task) {
      throw new Error(`Task not found: ${task_id}`);
    }

    if (task.status === 'running') {
      return task;
    }

    task.status = 'running';
    task.started_at = Date.now();
    this.saveTasksToDB();

    try {
      console.log(`🕸️ [Knowledge Collector] Starting crawl for ${task.url}`);
      
      // 模拟 Crawl4AI 的抓取过程
      const result = await this.simulateCrawl(task.url, task.options);
      
      // 内容分块
      result.chunks = this.chunkDocument(result);
      
      // 向量化（模拟）
      result.chunks = await this.vectorizeChunks(result.chunks);

      task.result = result;
      task.status = 'completed';
      task.completed_at = Date.now();

      // 保存到知识库
      this.saveToKnowledgeBase(task);

      console.log(`✅ [Knowledge Collector] Crawl completed: ${task_id}`);
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.completed_at = Date.now();
      console.error(`❌ [Knowledge Collector] Crawl failed: ${error}`);
    }

    this.saveTasksToDB();
    return task;
  }

  /**
   * 模拟 Crawl4AI 的抓取功能
   * 在实际环境中，这将调用真实的 Crawl4AI Python 服务
   */
  private async simulateCrawl(url: string, options: CrawlOptions): Promise<CrawlResult> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    // 生成模拟的抓取结果
    const urlDomain = new URL(url).hostname;
    
    const sampleContent = this.generateSampleContent(urlDomain);
    
    return {
      url,
      title: sampleContent.title,
      markdown: sampleContent.markdown,
      html: `<html><body>${sampleContent.markdown}</body></html>`,
      extracted_content: sampleContent.markdown,
      metadata: {
        author: 'Knowledge Bot',
        date_published: new Date().toISOString(),
        language: 'en',
        word_count: sampleContent.markdown.split(/\s+/).length,
        page_type: 'article'
      },
      links: [
        `${url}/about`,
        `${url}/products`,
        `${url}/contact`
      ]
    };
  }

  private generateSampleContent(domain: string): { title: string; markdown: string } {
    const samples = [
      {
        title: `E-commerce Best Practices Guide`,
        markdown: `# E-commerce Best Practices Guide

## Introduction

In today's competitive landscape, optimizing your e-commerce operations is crucial for success. This guide covers key areas for improvement.

## 1. Inventory Management

Effective inventory management ensures you never run out of stock while minimizing holding costs.

### Key Strategies:
- Implement ABC analysis for inventory prioritization
- Use safety stock calculations for critical items
- Set up automated reorder points

## 2. Customer Retention

Acquiring a new customer costs 5x more than retaining an existing one.

### Retention Tactics:
- Personalized email marketing
- Loyalty programs with tiered rewards
- Proactive customer support
- Post-purchase follow-ups

## 3. Pricing Optimization

Dynamic pricing can significantly impact revenue and margins.

### Pricing Strategies:
- Competitor price monitoring
- Seasonal pricing adjustments
- Promotional pricing calendars
- Customer segmentation pricing

## 4. Order Fulfillment

Fast and reliable shipping improves customer satisfaction and repeat business.

### Fulfillment Optimization:
- Multiple shipping options
- Real-time tracking
- Warehouse automation
- Returns management process

---

*This document provides actionable strategies for e-commerce business owners.*`
      },
      {
        title: `Digital Marketing Strategy Handbook`,
        markdown: `# Digital Marketing Strategy Handbook

## Overview

A comprehensive digital marketing strategy is essential for business growth in the digital age.

## 1. SEO Fundamentals

Search Engine Optimization drives organic traffic to your website.

### Key Components:
- Keyword research and targeting
- On-page optimization
- Technical SEO audits
- Quality backlink building

## 2. Content Marketing

Valuable content attracts and engages your target audience.

### Content Types:
- Blog articles and guides
- Video tutorials and demos
- Infographics and visuals
- Case studies and whitepapers

## 3. Social Media Marketing

Build your brand and connect with customers on social platforms.

### Platform Strategies:
- LinkedIn for B2B and professional audiences
- Instagram for visual products
- Facebook for community building
- Twitter/X for real-time engagement

## 4. Email Marketing

Email delivers one of the highest ROIs of any marketing channel.

### Email Campaigns:
- Welcome sequences for new subscribers
- Nurture campaigns for leads
- Promotional offers and sales
- Re-engagement campaigns for inactive users

---

*Use this handbook to build and refine your digital marketing strategy.*`
      },
      {
        title: `Business Operations Manual`,
        markdown: `# Business Operations Manual

## Standard Operating Procedures

This manual documents standard operating procedures for efficient business operations.

## 1. Customer Service Standards

Consistent customer service builds trust and loyalty.

### Service Guidelines:
- Respond to inquiries within 24 hours
- Personalize communication with customer names
- Document all customer interactions
- Follow up on unresolved issues

## 2. Financial Management

Sound financial practices ensure business sustainability.

### Financial Processes:
- Daily reconciliation of accounts
- Monthly financial reporting
- Budget tracking and variance analysis
- Cash flow management

## 3. Employee Onboarding

Effective onboarding sets up new team members for success.

### Onboarding Checklist:
- Welcome and orientation
- System access and tools setup
- Role-specific training
- 30/60/90-day goal setting
- Mentor assignment

## 4. Quality Control

Maintaining quality standards protects your brand reputation.

### Quality Processes:
- Product inspection at receiving
- Order verification before shipping
- Customer feedback collection
- Continuous improvement cycles

---

*Keep this manual updated as processes evolve and improve.*`
      }
    ];

    return samples[Math.floor(Math.random() * samples.length)];
  }

  /**
   * 将文档内容分块
   */
  private chunkDocument(result: CrawlResult): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const content = result.markdown;
    
    // 按标题分块
    const sections = content.split(/^##\s+/m);
    
    sections.forEach((section, index) => {
      if (section.trim().length < 50) return;

      const lines = section.split('\n');
      const sectionTitle = lines[0].trim();
      const sectionContent = lines.slice(1).join('\n').trim();

      if (sectionContent.length > 100) {
        chunks.push({
          chunk_id: `chunk_${Date.now()}_${index}`,
          content: `## ${sectionTitle}\n\n${sectionContent}`,
          metadata: {
            source_url: result.url,
            chunk_index: index,
            total_chunks: sections.length,
            word_count: sectionContent.split(/\s+/).length,
            section_title: sectionTitle
          }
        });
      }
    });

    // 如果没有分块（没有##标题），按段落分
    if (chunks.length === 0) {
      const paragraphs = content.split(/\n\n+/);
      let currentChunk = '';
      
      paragraphs.forEach((para, index) => {
        if (currentChunk.length + para.length < 2000) {
          currentChunk += (currentChunk ? '\n\n' : '') + para;
        } else {
          if (currentChunk) {
            chunks.push({
              chunk_id: `chunk_${Date.now()}_${chunks.length}`,
              content: currentChunk,
              metadata: {
                source_url: result.url,
                chunk_index: chunks.length,
                total_chunks: Math.ceil(content.length / 2000),
                word_count: currentChunk.split(/\s+/).length
              }
            });
          }
          currentChunk = para;
        }
      });
      
      if (currentChunk) {
        chunks.push({
          chunk_id: `chunk_${Date.now()}_${chunks.length}`,
          content: currentChunk,
          metadata: {
            source_url: result.url,
            chunk_index: chunks.length,
            total_chunks: chunks.length + 1,
            word_count: currentChunk.split(/\s+/).length
          }
        });
      }
    }

    console.log(`📝 [Knowledge Collector] Document split into ${chunks.length} chunks`);
    return chunks;
  }

  /**
   * 向量化分块
   */
  private async vectorizeChunks(chunks: DocumentChunk[]): Promise<DocumentChunk[]> {
    // 模拟向量化过程
    return chunks.map(chunk => ({
      ...chunk,
      embedding: this.generateMockEmbedding(chunk.content)
    }));
  }

  private generateMockEmbedding(text: string): number[] {
    // 生成模拟的 1536 维向量
    const embedding: number[] = [];
    const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < 1536; i++) {
      const value = Math.sin(seed + i * 0.1) * 0.5 + 0.5;
      embedding.push(value);
    }
    
    return embedding;
  }

  /**
   * 保存到知识库
   */
  private saveToKnowledgeBase(task: CrawlTask): void {
    if (!task.result) return;

    const doc: KnowledgeDocument = {
      doc_id: `doc_${Date.now()}`,
      title: task.result.title,
      source_url: task.url,
      content: task.result.markdown,
      category: this.inferCategory(task.result.title),
      tags: this.extractTags(task.result),
      chunks: task.result.chunks || [],
      status: 'published',
      created_at: Date.now(),
      updated_at: Date.now()
    };

    // 保存到数据库
    if (!dbEngine.knowledge_documents) {
      dbEngine.knowledge_documents = {
        getAll: () => [],
        create: (item: any) => item,
        update: () => {},
        delete: () => false,
        getById: () => null
      };
    }

    dbEngine.knowledge_documents.create(doc);
    dbEngine.triggerSaveAndNotify();

    console.log(`📚 [Knowledge Collector] Document saved to knowledge base: ${doc.title}`);
  }

  private inferCategory(title: string): string {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('e-commerce') || titleLower.includes('shop') || titleLower.includes('store')) return 'E-commerce';
    if (titleLower.includes('market') || titleLower.includes('seo') || titleLower.includes('social')) return 'Marketing';
    if (titleLower.includes('operation') || titleLower.includes('procedure') || titleLower.includes('manual')) return 'Operations';
    if (titleLower.includes('finance') || titleLower.includes('money') || titleLower.includes('account')) return 'Finance';
    return 'General';
  }

  private extractTags(result: CrawlResult): string[] {
    const tags: string[] = [];
    const contentLower = result.markdown.toLowerCase();
    
    if (contentLower.includes('inventory')) tags.push('inventory');
    if (contentLower.includes('customer')) tags.push('customer');
    if (contentLower.includes('price') || contentLower.includes('pricing')) tags.push('pricing');
    if (contentLower.includes('marketing')) tags.push('marketing');
    if (contentLower.includes('seo')) tags.push('SEO');
    if (contentLower.includes('email')) tags.push('email');
    if (contentLower.includes('social')) tags.push('social media');
    
    return tags;
  }

  /**
   * 获取所有任务
   */
  public getAllTasks(): CrawlTask[] {
    return Array.from(this.tasks.values()).sort((a, b) => b.created_at - a.created_at);
  }

  /**
   * 获取任务详情
   */
  public getTask(task_id: string): CrawlTask | undefined {
    return this.tasks.get(task_id);
  }

  /**
   * 搜索知识库
   */
  public searchKnowledge(query: string, limit: number = 10): { doc: KnowledgeDocument; chunks: DocumentChunk[]; relevance: number }[] {
    const docs = dbEngine.knowledge_documents?.getAll() as KnowledgeDocument[] || [];
    const queryLower = query.toLowerCase();
    
    const results = docs.map(doc => {
      const relevantChunks = doc.chunks.filter(chunk => 
        chunk.content.toLowerCase().includes(queryLower)
      );
      
      const relevance = relevantChunks.length > 0 ? 
        (relevantChunks.length / doc.chunks.length) * (doc.tags.some(tag => queryLower.includes(tag)) ? 1.5 : 1) :
        0;
      
      return { doc, chunks: relevantChunks, relevance };
    }).filter(r => r.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
    
    return results;
  }

  /**
   * 获取所有文档
   */
  public getAllDocuments(): KnowledgeDocument[] {
    return dbEngine.knowledge_documents?.getAll() as KnowledgeDocument[] || [];
  }

  /**
   * 删除文档
   */
  public deleteDocument(doc_id: string): boolean {
    const docs = dbEngine.knowledge_documents?.getAll() as KnowledgeDocument[] || [];
    const docIndex = docs.findIndex(d => d.doc_id === doc_id);
    if (docIndex >= 0) {
      // 这里应该实现真正的删除
      console.log(`🗑️ [Knowledge Collector] Deleting document: ${doc_id}`);
      return true;
    }
    return false;
  }

  private loadTasksFromDB(): void {
    // 在实际环境中，从数据库加载任务
    // 这里初始化为空
  }

  private saveTasksToDB(): void {
    // 在实际环境中，保存任务到数据库
  }
}

export const knowledgeCollector = KnowledgeCollector.getInstance();

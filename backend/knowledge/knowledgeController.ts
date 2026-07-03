/**
 * Knowledge Controller - 知识库 API 控制器
 */

import express from 'express';
import { knowledgeCollector, CrawlOptions } from './knowledge-collector';

const router = express.Router();

/**
 * 创建抓取任务
 */
router.post('/crawl', async (req, res) => {
  try {
    const { url, options } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const task = knowledgeCollector.createCrawlTask(url, options as CrawlOptions);
    
    // 异步执行抓取
    knowledgeCollector.executeCrawlTask(task.task_id).catch(err => {
      console.error('[Knowledge API] Crawl execution failed:', err);
    });

    res.json({
      success: true,
      task
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
});

/**
 * 获取所有抓取任务
 */
router.get('/tasks', async (req, res) => {
  try {
    const tasks = knowledgeCollector.getAllTasks();
    res.json({
      success: true,
      tasks
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
});

/**
 * 获取单个任务详情
 */
router.get('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = knowledgeCollector.getTask(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
});

/**
 * 获取所有知识文档
 */
router.get('/documents', async (req, res) => {
  try {
    const documents = knowledgeCollector.getAllDocuments();
    res.json({
      success: true,
      documents
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
});

/**
 * 搜索知识库
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit } = req.query;
    const results = knowledgeCollector.searchKnowledge(
      q as string,
      limit ? parseInt(limit as string) : 10
    );
    
    res.json({
      success: true,
      results
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
});

/**
 * 删除文档
 */
router.delete('/documents/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    const success = knowledgeCollector.deleteDocument(docId);
    
    res.json({
      success,
      message: success ? 'Document deleted successfully' : 'Document not found'
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
});

export default router;

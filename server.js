import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Set json limit to 15MB for heavy code exchanges
  app.use(express.json({ limit: '15mb' }));

  // Expose intelligent agent collaborative brain API
  app.post('/api/collaborate', async (req, res) => {
    try {
      const { prompt, currentPromptType } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'GEMINI_API_KEY is not configured in Secrets. Please add it via Settings > Secrets to unlock the multi-agent generation power!' 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Craft an incredibly detailed professional prompt to direct Gemini 3.5 Flash 
      // to act as a 5-member elite software squad in Laravel 12 + Vue 3 + Botble CMS.
      const systemInstruction = `You are an elite enterprise software development squad specializing in Laravel 12.x, Vue 3, and the Botble CMS platform.
Your task is to analyze the user's business request and collaborate as a multi-role workspace to generate the precise specifications, architecture, code files, and simulated CMS preview fields.

You must respond with a SINGLE valid JSON object matching the schema below. Keep code correct, fully detailed, and complete. Avoid shortened or truncated placeholders like "// REST OF CODE HERE". Generate complete, operational implementations of models, migrations, controllers, service providers, and Vue components.

IMPORTANT: Your response MUST be a single, strict JSON object. Do not wrap it in markdown code blocks (\`\`\`json ...) or any other characters. It must start with "{" and end with "}".

RESPONSES SCHEMA:
{
  "projectTitle": "Display name of the generated module/plugin",
  "projectSummary": "Detailed multi-paragraph description of the overall solution architecture, explaining how Laravel 12 features (e.g. native attributes, controller classes, simplified routing) and Vue 3 (Composition API, script setup) are paired with the Botble CMS structure.",
  "workflowSteps": [
    {
      "step": 1,
      "agentName": "Archi (Architecture Lead)",
      "agentRole": "Lead Botble Platform Architect",
      "status": "completed",
      "text": "Explain the architectural layout we are establishing, plugin configurations, and registering route service providers."
    },
    {
      "step": 2,
      "agentName": "Lara (Laravel Backend Pro)",
      "agentRole": "Senior Laravel 12 Developer",
      "status": "completed",
      "text": "Describe structural DB migrations, setting up Eloquent models with Laravel 12 features, registering API controller endpoints, and hooks."
    },
    {
      "step": 3,
      "agentName": "Vee (Vue 3 Frontend Core)",
      "agentRole": "Modern Frontend Specialist",
      "status": "completed",
      "text": "Describe how we build the Vue 3 component using <script setup> and integrates custom Tailwind CSS styles within Botble's asset loader, handling state management safely."
    },
    {
      "step": 4,
      "agentName": "Audit (QA & Security Auditor)",
      "agentRole": "Cybersecurity & Quality Lead",
      "status": "completed",
      "text": "Details the security audits (CRLF checks, Eloquent safety, CSRF tokens, strict prop validation) and test suites for this integration."
    }
  ],
  "botblePreview": {
    "title": "Configurable Admin Title",
    "description": "Short help description for Botble CMS general settings",
    "fields": [
      {
        "id": "setting_key_1",
        "label": "Setting Field Title",
        "type": "text | number | select | boolean",
        "value": "default value",
        "placeholder": "Helpful placeholder",
        "options": ["Option A", "Option B"] (include only if type is 'select')
      }
    ],
    "sidebarIcon": "Icon name (e.g., credit-card, shield, settings, database, users, eye)",
    "simulatedAction": "Submit Button Action Label",
    "simulatedResponse": "Action result message when admin clicks run/simulate action"
  },
  "files": [
    {
      "path": "Full path of file in Botble (e.g. platform/plugins/my-plugin/src/Http/Controllers/MyPluginController.php)",
      "language": "php | javascript | json | sql",
      "explanation": "What this file does, Botble hooks used, or Laravel 12 patterns utilized.",
      "content": "Full source code here. Make it complete and production-grade."
    }
  ]
}`;

      const userMessage = `Generate a high-grade plugin ecosystem for Botble CMS on Laravel 12 and Vue 3 based on this request: "${prompt}".
Verify that the output matches the JSON schema EXACTLY. Ensure the code generated is rigorous, has elegant spacing, correct syntax, and uses advanced Laravel 12 practices (like simplified route definitions, PHP 8.2 readonly properties where applicable, native typing) and Vue 3 Composition API with <script setup>.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userMessage,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2 // lower temperature for highly structured and code-heavy output
        }
      });

      const responseText = response.text || '{}';
      // Safety check: parse to verify it is valid JSON, then send.
      try {
        const parsed = JSON.parse(responseText.trim());
        res.json({ success: true, data: parsed });
      } catch (parseError) {
        console.error("JSON parsing error on Gemini output: ", responseText);
        res.status(500).json({ 
          error: "Gemini output was not in strict JSON format. Please try again.", 
          rawOutput: responseText 
        });
      }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || 'Error communicating with Gemini' });
    }
  });

  // Enable static or Vite based on environment
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Enterprise Multi-Agent Collaborative System</title>
  </head>
  <body class="bg-slate-50 text-slate-900 scroll-smooth">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running internally on port ${port}`);
  });
}

startServer();

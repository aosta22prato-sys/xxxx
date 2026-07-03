/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SkillItem {
  id: string;
  name: string;
  nameCn: string;
  phase: string;
  description: string;
  descriptionCn: string;
  steps: string[];
  excuse: string;
  excuseCn: string;
  rebuttal: string;
  rebuttalCn: string;
}

export interface PersonaItem {
  id: string;
  role: string;
  roleCn: string;
  title: string;
  titleCn: string;
  perspective: string;
  perspectiveCn: string;
  guidelines: string[];
  systemPrompt: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  titleCn: string;
  items: string[];
}

export const skillsData: SkillItem[] = [
  // 1. Meta
  {
    id: "using-agent-skills",
    name: "Using Agent Skills",
    nameCn: "使用代理技能",
    phase: "Meta",
    description: "Map received work to appropriate skill workflows and define shared rules.",
    descriptionCn: "将接收到的工作任务映射到适当的技能工作流程中，并定义共享的操作规则。",
    steps: [
      "Analyze the user query to detect intent and scope boundaries.",
      "Check the available 24 skills to identify matches.",
      "Load the corresponding SKILL.md file as a strict guidelines constraint.",
      "Follow steps sequentially, ensuring validation at each gate."
    ],
    excuse: "I can just build this directly without reviewing individual skill structures.",
    excuseCn: "我可以不看具体的技能规范，凭感觉直接写代码。",
    rebuttal: "Skipping workflow alignment leads to sloppy implementations. Aligning to standard skills ensures senior-engineer quality.",
    rebuttalCn: "跳过流程对齐会导致实现粗糙和思维漏洞。依技能规范操作能确保产出高级工程师级别的代码质量。"
  },
  // 2. Define
  {
    id: "interview-me",
    name: "Interview Me",
    nameCn: "采访我 / 盘问我",
    phase: "Define",
    description: "Use a single-question-at-a-time interview style to extract what the user truly wants.",
    descriptionCn: "采用每次只问一个问题的渐进式访谈方式，逐步发掘出用户真实的核心需求，避免主观臆测。",
    steps: [
      "Ask exactly one targeted question to clarify ambiguities.",
      "Do not overwhelm the user with multiple options at once.",
      "Listen, incorporate, and refine the requirements iteratively.",
      "Proceed to implementation only when confidence reaches ~95%."
    ],
    excuse: "Asking too many questions will annoy the user; I will just make intelligent assumptions.",
    excuseCn: "问太多问题会让用户觉得烦，我还是自己直接做出聪明的假设吧。",
    rebuttal: "Wrong assumptions waste more time in rework. One-at-a-time clarification focuses the scope immediately.",
    rebuttalCn: "错误的假设会导致后期返工，浪费更多时间。每次一个针对性提问能以最高效、最友善的方式收敛需求。"
  },
  {
    id: "idea-refine",
    name: "Idea Refinement",
    nameCn: "想法精炼及头脑风暴",
    phase: "Define",
    description: "Apply structured divergent and convergent thinking to transform raw concepts into robust specs.",
    descriptionCn: "运用结构化的发散与收敛思维模式，将初始、模糊的创意概念转化为结构清晰的具体执行方案。",
    steps: [
      "Diverge: Brainstorm multiple alternative approaches or edge cases.",
      "Analyze pros and cons, computational limits, and design feasibility.",
      "Converge: Narrow down to the single most effective design path.",
      "Draft a structured outline covering core features."
    ],
    excuse: "The user has already decided what they want. I don't need to suggest alternatives.",
    excuseCn: "用户已经告诉我要做什么了，我不需要多此一举去想其他方案或替代路径。",
    rebuttal: "Users appreciate seeing creative tradeoffs. Brainstorming refined ideas prevents early architectural traps.",
    rebuttalCn: "用户重视工程师的专业建议。提前权衡不同技术方案能有效避开隐蔽的架构陷阱。"
  },
  {
    id: "spec-driven-development",
    name: "Spec-Driven Development",
    nameCn: "规范驱动开发 (PRD)",
    phase: "Define",
    description: "Write a complete Product Requirement Document (PRD) before touched code.",
    descriptionCn: "在编写任何具体业务代码之前，先编写一份涵盖目标、边界、架构及非功能指标的 PRD 文档。",
    steps: [
      "Define high-level goals and strictly demarcate what is in-scope and out-of-scope.",
      "Draft interface boundaries and key data models.",
      "Select tech stack, frameworks, and library approaches based on official sources.",
      "Define clear acceptance and verification steps."
    ],
    excuse: "This is a small change. Writing a spec first is overkill and slows down progress.",
    excuseCn: "这只是个小改动，先写一份规范文档也太繁琐了，会严重阻碍我的开发速度。",
    rebuttal: "A spec is a contract. Documenting scope constraints prevents scope creep and saves debugging time later.",
    rebuttalCn: "规范即契约。清晰地界定需求与架构，可以极大程度规避开发过程中的‘需求蔓延’并节省后期的调试成本。"
  },
  // 3. Plan
  {
    id: "planning-and-task-breakdown",
    name: "Planning & Task Breakdown",
    nameCn: "计划与任务分解",
    phase: "Plan",
    description: "Decompose specs into safe, atomic chunks with strict acceptance criteria.",
    descriptionCn: "将需求规范分解为极小的、可增量验证的原子任务单元，并制定严格的准入/准出与依赖关系链。",
    steps: [
      "Break down features into independent milestones.",
      "Ensure each task represents a single, verifiable vertical slice.",
      "Detail concrete unit and integration verification methods for each step.",
      "Identify potential risk steps and fallback alternatives ahead of time."
    ],
    excuse: "I have the entire project plan in my context. Listing details is a waste of output tokens.",
    excuseCn: "我的脑海（上下文）中已经有了完整的计划，把细节一一列出来纯属浪费我的输出 Token。",
    rebuttal: "Explicit plans keep the implementation on track and expose flaws in sequencing before writing code.",
    rebuttalCn: "将计划显式化可以指引开发走在既定轨道上，并在编写代码前就暴露出执行顺序上的逻辑漏洞。"
  },
  // 4. Build
  {
    id: "incremental-implementation",
    name: "Incremental Implementation",
    nameCn: "增量式实现",
    phase: "Build",
    description: "Use lean, vertical structural slices with constant verification gates.",
    descriptionCn: "进行极简的纵向功能切片开发，遵循‘实现、测试、验证、提交’的微循环，避免一次性大篇幅编写。",
    steps: [
      "Write minimal functional logic for a single atomic slice first.",
      "Instantly compile or lint the code to catch typo and parsing failures.",
      "Run tests to prove correctness of the isolated change.",
      "Commit progress safely before starting the next incremental slice."
    ],
    excuse: "I can write 500 lines of perfect code safely and test it once at the very end.",
    excuseCn: "我对自己的技术有信心，可以直接写 500 行完美的代码，等最后写完了一起测就行。",
    rebuttal: "Big-bang integrations invite massive, messy debugging sessions. Tiny increments isolate bugs instantly.",
    rebuttalCn: "一次性集成大量代码是调试灾难的温床。小步快跑的增量提交能将 Bug 精确锁定在个位数代码行中。"
  },
  {
    id: "test-driven-development",
    name: "Test-Driven Development",
    nameCn: "测试驱动开发 (TDD)",
    phase: "Build",
    description: "Follow the red-green-refactor loop to guarantee code meets behavior expectations.",
    descriptionCn: "严格遵循 红-绿-重构 (Red-Green-Refactor) 的微循环，建立高质量开发信心，优先编写测试断言。",
    steps: [
      "Write a failing test representing the expected specific behavior (Red).",
      "Write the minimal necessary production code to make the test pass (Green).",
      "Refactor for clarity, elimination of redundancy, and premium style without breaking tests.",
      "Rely on Beyoncé's Rule: 'If you liked it, you should have put a test on it'."
    ],
    excuse: "Writing tests doubles development time, and this logic is too simple to require a test.",
    excuseCn: "写测试会把开发时间拉长一倍，而且这段逻辑这么简单，用不着大动干戈来写测试。",
    rebuttal: "Tests are executable specifications. They protect future developers (and you) from silent refactoring regressions.",
    rebuttalCn: "测试代码即可执行的需求契约，它能够在底层长效守护逻辑，防止未来重构时引发隐蔽的业务损坏。"
  },
  {
    id: "context-engineering",
    name: "Context Engineering",
    nameCn: "上下文工程管理",
    phase: "Build",
    description: "Provide the right information at the right time using structured rule-files.",
    descriptionCn: "在最合适的时间，向当前的工作上下文提供精确和清洗过的数据。合理切分代码、打包工具规则及外部依赖提示。",
    steps: [
      "Keep workspace files neat and modular, avoiding dead files.",
      "Identify stale information and prune it from compiler prompts.",
      "Ensure accurate configuration aliases and workspace rules match environments.",
      "Organize rules file logically to guide standard coding agents."
    ],
    excuse: "AI context is very large anyway. I will just feed all files into the prompt.",
    excuseCn: "反正现在的 AI 上下文窗口超级大，我把所有的关联文件、日志和代码一股脑扔给提示词就行了。",
    rebuttal: "Context clutter dilutes attention, increases retrieval error rates, and causes models to hallucinate or skip criteria.",
    rebuttalCn: "过于臃肿的上下文会分散模型注意力，拉低信息检索精度，极易诱发幻觉、断言缺失或死循环。"
  },
  {
    id: "source-driven-development",
    name: "Source-Driven Development",
    nameCn: "基于官方原始文档开发",
    phase: "Build",
    description: "Base framework decisions directly on official, verified documentation, citing precise sources.",
    descriptionCn: "框架与类库的决策和语法一律以官方最新发布的文档为准，严查非官方技术博客的二手陈旧方案，标明引用来源。",
    steps: [
      "Avoid using outdated syntax patterns from third-party blogs or historic libraries.",
      "Verify latest API routes, structures, parameters, and return types.",
      "Explicitly cite source sections when choosing crucial libraries.",
      "Mark any unverified experimental designs clearly as assumptions."
    ],
    excuse: "I already have the API specs memorized in my training data; no web verification is needed.",
    excuseCn: "我的训练数据里早就记住了这些 API 规范，根本不需要再去上网查最新官方文档了。",
    rebuttal: "Libraries update frequently. Direct verification against live docs prevents annoying type-checking and runtime failures.",
    rebuttalCn: "开源库迭代极快。依赖训练记忆往往会在接口变更、新版参数废弃等细节处栽跟头，查阅文档能避开各种语法黑洞。"
  },
  {
    id: "doubt-driven-development",
    name: "Doubt-Driven Development",
    nameCn: "怀疑驱使式评估与升级",
    phase: "Build",
    description: "Apply adversarial self-review to high-risk decisions: Claim -> Extract -> Skepticism -> Reconcile.",
    descriptionCn: "对所有中高风险（如安全、涉及金钱、不可逆文件删除）的设计采取对抗式自我审查，必要时触发人机协同协同决策。",
    steps: [
      "State any design claim or architectural assumption explicitly.",
      "Identify and extract the most vulnerable components or potential flaws.",
      "Adopt an aggressive skeptic perspective to find worst-case failure modes.",
      "Systematically reconcile skepticism with security boundaries or double-checks."
    ],
    excuse: "The current design is elegant and works fine. I shouldn't overthink failure scenarios.",
    excuseCn: "目前的方案非常完美，运行也很顺滑。我没必要疑神疑鬼去假设那些基本不可能发生的灾难场景。",
    rebuttal: "High-risk errors are expensive. Anticipating bad flows yields bulletproof systems, reducing production outages.",
    rebuttalCn: "高风险错误在生产环境代价巨大，在设计期主动扮演‘杠精’、寻找边界漏洞，能从源头铸就坚如磐石的软件系统。"
  },
  {
    id: "frontend-ui-engineering",
    name: "Frontend UI Engineering",
    nameCn: "前端用户界面工程",
    phase: "Build",
    description: "Deliver premium interfaces with robust state, beautiful layouts, and high accessibility standards.",
    descriptionCn: "交付工艺精湛的双重端视觉界面。拥有稳健的本地/全局状态机、极具质感的间距与排版，并符合 WCAG 无障碍准则。",
    steps: [
      "Establish coherent responsive layouts with fluid desktop-to-mobile rules.",
      "Avoid purple-to-blue gradient patterns. Utilize high-contrast, premium negative space.",
      "Design accessible click targets >= 44px on touch interfaces.",
      "Use robust state managers to handle loading, empty, and visual feedback scenarios."
    ],
    excuse: "This is a developer tool interface. It doesn't need to look beautiful or worry about accessibility.",
    excuseCn: "这只是个开发工具界面，随便放两个输入框跟按钮、排版能使就行了，不需要考虑美观或者无障碍设计。",
    rebuttal: "Professional design inspires developer trust. Clean UI typography, animations, and accessible tabs denote production-ready software.",
    rebuttalCn: "卓越的视觉工艺能瞬间建立专业信誉。精致的排版、舒适的过渡动效和清晰的信息层级，是高段位工程素养的直观体现。"
  },
  {
    id: "api-and-interface-design",
    name: "API & Interface Design",
    nameCn: "API 与模块接口设计",
    phase: "Build",
    description: "Follow contract-first principles, robust validation, and careful versioning controls.",
    descriptionCn: "奉行‘契约优先’的设计理念，拥有严密的入参模型校验体系、明确的异常返回语义，并慎重评估 Hyrum 定律带来的外部依赖压力。",
    steps: [
      "Draft clean, self-documenting interface definitions before writing handlers.",
      "Enforce boundary schema constraints to validate JSON inputs instantly.",
      "Map out standard, domain-aligned error messages and payload structures.",
      "Keep APIs backwards-compatible, avoiding breaking changes to clients."
    ],
    excuse: "I can just return arbitrary JSON objects from my handlers and adjust client integration later.",
    excuseCn: "我直接塞个 JSON 字段丢给前端，前端拿到能解析展示就行，没必要费时去写规范的入参出参模型定义。",
    rebuttal: "Undefined schemas cause communication friction and hidden deserialization bugs. Contract-first reduces coordination cost to zero.",
    rebuttalCn: "松散的 API 边界是联调摩擦的主要来源。实行强类型契约与严密入参校验能从根本上消除接口对接中的误判和崩溃。"
  },
  // 5. Verify
  {
    id: "browser-testing-with-devtools",
    name: "Browser Testing with DevTools",
    nameCn: "基于开发者工具的网页测试",
    phase: "Verify",
    description: "Inspect DOM structure, analyze runtime console anomalies, and trace networks directly to verify performance.",
    descriptionCn: "实时介入浏览器真机/仿真环境，深度审查 DOM 渲染树稳定性，盯防运行时控制台报错，追溯 HTTP 加载耗时排查异常点。",
    steps: [
      "Examine rendering artifacts, responsive layout sizing, and scrolling stability.",
      "Exhaustively check console outputs representing JS runtime warnings.",
      "Trace network requests to verify request payloads, payloads size, and response durations.",
      "Evaluate core Web Vitals like Cumulative Layout Shift (CLS)."
    ],
    excuse: "The code looks correct in the editor, and there's no major build error. It should run fine.",
    excuseCn: "我写的内容在代码编辑器里看起来格式挺对，编译也过了，基本上在浏览器里跑应该没什么问题。",
    rebuttal: "Eyes can miss runtime styling issues and slow rendering loops. Direct DevTools audits reveal true layout and network behaviors.",
    rebuttalCn: "编辑器的静态分析无法完全捕捉动态的样式变形或低效渲染逻辑。只有身临其境进行运行时实测，才能看清软件的真实运转细节。"
  },
  {
    id: "debugging-and-error-recovery",
    name: "Debugging & Error Recovery",
    nameCn: "调试与多级故障恢复",
    phase: "Verify",
    description: "Follow the 5-step triage: Reproduce -> Locate -> Reduce -> Fix -> Guard.",
    descriptionCn: "执行经典的五步排障法：‘极简复现、精准定位、最小化隔离、定向修复、长效阻断防护’。杜绝盲目修改重试。",
    steps: [
      "Reproduce: Create a minimal test case or step series reproducing the failure.",
      "Locate: Trace stack variables to isolate the pinpoint line of bug trigger.",
      "Reduce: Isolate variable states, stripping non-essential secondary assets.",
      "Fix: Apply standard, targeted repair, and guard against future regressions with a test."
    ],
    excuse: "I'll just try changing this line and re-running to see if the stack error disappears.",
    excuseCn: "我感觉是这行出的事，改改看能跑通不，编译多跑几次万一就好了呢。",
    rebuttal: "Blind guessing wastes hours and introduces cargo-cult logic. Systematic triage resolves root causes gracefully.",
    rebuttalCn: "‘试错型’调试不仅耗时低效，还容易引入莫名其妙的补丁代码。有条不紊地遵循五步排障才能真正斩断潜在的后座隐患。"
  },
  // 6. Review
  {
    id: "code-review-and-quality",
    name: "Code Review & Quality",
    nameCn: "代码严选评审 (PR Review)",
    phase: "Review",
    description: "Enforce a five-axis review system to ensure code health is highly professional.",
    descriptionCn: "严格执行五维审查机制（功能完备性、设计优雅度、测试周密性、安全性、性能影响），自省或互检，确保代码体魄强健。",
    steps: [
      "Review functionality: Does this change fully address all spec requirements?",
      "Review design: Does it maintain modular boundaries and correct encapsulation?",
      "Review tests: Are edge cases and exception branches securely covered with TDD?",
      "Scale changes sensibly, aiming for small, readable pull requests (< 100 lines)."
    ],
    excuse: "Since I am an AI, my code quality is already better than average. I don't need a structured self-review.",
    excuseCn: "我可是人工智能，写出来的代码品质已经很高了，用不着去套这些繁杂的代码评审条框来折腾自己。",
    rebuttal: "High self-auditing prevents downstream peer exhaustion. A meticulous 5-axis review is the mark of senior precision.",
    rebuttalCn: "高级工程师的力量恰恰源于其超乎常人的严谨。通过五维自检，能先发制人堵截隐患，保持代码资产的高度自洁和可读性。"
  },
  {
    id: "code-simplification",
    name: "Code Simplification",
    nameCn: "代码极简化与精简",
    phase: "Review",
    description: "Apply Chesterton's Fence principle: Never remove a block of logic unless you fully understand why it was built.",
    descriptionCn: "践行经典的‘切斯特顿栅栏’法则：在未能百分之百吃透一段历史晦涩逻辑的确切缘由及边界保护前，切勿草率重构或删改此代码。",
    steps: [
      "Audit active lines, seeking elegant and natural simplification paths.",
      "Verify the historical context and test suites for any old block of code.",
      "Avoid clever, overly dense single-liners. Prioritize human readability over code brevity.",
      "Adhere strictly to the Rule of 500: If a file exceeds 500 lines, split it."
    ],
    excuse: "This old legacy logic looks overly redundant and complicated. I'll delete it to clean up the file.",
    excuseCn: "这段老树根一样陈旧的代码看起来极其繁琐多余，留在文件里真碍眼，我直接删了它换成最新最潮的单行实现。",
    rebuttal: "Legacy code often covers obscure, painful production edge cases. Treat it with extreme respect until proven obsolete.",
    rebuttalCn: "古老繁杂的代码背后往往暗藏着无数次故障血泪换来的特种防御。在完全掌握其中逻辑奥秘前，敬畏历史是生存的铁则。"
  },
  {
    id: "security-and-hardening",
    name: "Security & Hardening",
    nameCn: "安全加固与边界防御",
    phase: "Review",
    description: "Apply OWASP safety rules, secure API secrets, and construct multiple border defenses.",
    descriptionCn: "全面落实 OWASP Top 10 安全防御准则。妥善密存 API 密钥等敏感机密信息，对各种不可信的用户输入构建严密边界屏障。",
    steps: [
      "Never commit passwords, tokens, API keys, or private variables to source code repositories.",
      "Strictly escape, validate, and sanitize all end-user inputs before processing.",
      "Add robust cross-origin resource sharing (CORS) rules and frame protection bounds.",
      "Enforce authentication and permission checks on all private service layers."
    ],
    excuse: "This app is running in a developers only sandboxed frame. Security is not a priority here.",
    excuseCn: "反正这玩意目前跑在开发测试沙箱环境里，就供少数人玩玩，没必要费心思去搭建高规格的安全防爆网。",
    rebuttal: "Vulnerabilities conceived in dev environments have a habit of leaking into production. Build securely from Day One.",
    rebuttalCn: "测试环境里的‘草台班子’代码极易在不经意间原封不动流向公网生产。凡是编码，必须把安全刻进基础本能。"
  },
  {
    id: "performance-optimization",
    name: "Performance Optimization",
    nameCn: "性能优化与极速加载",
    phase: "Review",
    description: "Follow the indicators-first paradigm: measure everything, eliminate rendering noise, and analyze bundles.",
    descriptionCn: "严格遵循‘指标先行’的科学优化路径：无度量不优化，绝不盲目改造，精确定位渲染垃圾，拆解分析分包体积阻值。",
    steps: [
      "Establish base loading performance targets (e.g. LCP < 2.5s, FID < 100ms).",
      "Avoid premature optimization. Identify true performance hotspots via Profiler traces.",
      "Reduce component re-renders: Keep state localized and dependencies memoized accurately.",
      "Analyze bundle map size, utilizing tree-shaking and dynamic import chunks."
    ],
    excuse: "This looks like a small application. It loads fast enough on my local machine anyway.",
    excuseCn: "这也就是个很常态的项目，在我本地的高端电脑上加载速度飞快，根本不需要再做什么细致的加载和内存省料优化。",
    rebuttal: "Development laptops hide slow execution chains. Optimizing for low-end devices and slow 3G mobile networks yields real equity.",
    rebuttalCn: "开发大牛的超级工作站极易粉饰加载缺陷。去到差网络、低配性能终端上实测，才能真正感知和体察到普通用户的阵痛。"
  },
  // 7. Ship
  {
    id: "git-workflow-and-versioning",
    name: "Git Workflow & Versioning",
    nameCn: "Git 工作流与原子提交",
    phase: "Ship",
    description: "Maintain a clean history with atomic, tiny commits and trunk-based development style.",
    descriptionCn: "维持清爽可追溯的项目历史脉络。坚守‘原子化小批次提交’原则，倡导‘基于主干’的轻量合并机制，保持主线永远发布就绪。",
    steps: [
      "Keep commits atomic: single feature or fix per commit, keeping diffs easy to read.",
      "Write concise, descriptive, and actionable commit messages following conventional commits.",
      "Use Git commits as save-points enabling straightforward rollbacks.",
      "Merge changes into main regularly, avoiding giant, complex branch synchronization."
    ],
    excuse: "I will just make one huge commit at the very end of development to save time.",
    excuseCn: "我写完这整套模块功能以后，临走前直接一个大提交打包带走，省得我一遍遍敲 Git 命令耽误时间。",
    rebuttal: "Large, opaque commits are impossible to bisect, isolate, or revert safely. Clean history represents professional grade governance.",
    rebuttalCn: "泥沙俱下的大坨提交文件会让代码定位、冲突排查和局部版本回滚完全沦为噩梦。细腻、原子化的提交历史才见真底蕴。"
  },
  {
    id: "ci-cd-and-automation",
    name: "CI/CD & Left-Shift QA Gate",
    nameCn: "自动集成部署与控制阀门",
    phase: "Ship",
    description: "Embed quality gates directly into active deployment chains, automating tests and lint runs.",
    descriptionCn: "将质量防线‘左移’，使各项语法规范检查、回归单元测试和漏洞扫描自动化运行在提交和部署流水线的最前线段落。",
    steps: [
      "Setup automated linting and typescript checks at branch push.",
      "Deploy code automatically to preview environments on Pull Request creation.",
      "Maintain zero tolerance for broken branches: red pipelines must halt the progress instantly.",
      "De-risk major feature updates using secure runtime feature flags."
    ],
    excuse: "I want to deploy my change quickly. I will temporarily bypass the pipeline to test live.",
    excuseCn: "情况紧急，我想快点把新改动推上线，我先临时把这些又是测试又是校验的构建流水线跳过，直接手动覆盖发布。",
    rebuttal: "Skipping gates is how catastrophic production outages are born. Automation is your strongest armor, never turn it off.",
    rebuttalCn: "九成重特大线上故障都始于‘偷步跳闸’的硬闯操作。自动化校验是软件质量抵御风暴的坚毅皮甲，任何时候都应誓死守卫。"
  },
  {
    id: "deprecation-and-migration",
    name: "Deprecation & Clean Migration",
    nameCn: "技术废弃迭代与干净迁移",
    phase: "Ship",
    description: "Deconstruct obsolete routes, decommission dead segments gracefully, and isolate zombie lines.",
    descriptionCn: "妥善关照过时废旧接口路由，遵循‘通知宣告 -> 兼容预警 -> 精准剥离’的三部曲优雅过渡，斩草除根防范僵尸逻辑复活。",
    steps: [
      "Design safe deprecation phases, signaling clear warnings to consumer lines.",
      "Audit codebases systematically to locate and remove dormant, unused helper blocks.",
      "Migrate database schema columns using additive-first, backward-compatible methods.",
      "Ensure all consumers are cleanly migrated before completely turning off legacy gateways."
    ],
    excuse: "I'll leave this old function in the utils file just in case we need it again in the future.",
    excuseCn: "虽然这个老函数现在没被调了，但难保以后什么时候想起来还要参考，我还是把它留在公共工具文件里供防万一吧。",
    rebuttal: "Zombie code breeds confusion. Version control exists to remember history, keep source code active and clutter-free.",
    rebuttalCn: "废代码是引发思维误导的毒药。Git 会帮你永久铭记曾经的功勋，而当下的生产分支必须轻装上阵、一尘不染。"
  },
  {
    id: "documentation-and-adrs",
    name: "Documentation & ADRs",
    nameCn: "架构决策日志 (ADR) 与架构白皮书",
    phase: "Ship",
    description: "Document crucial architectural decisions, explaining the deep rationale 'Why' rather than just 'What'.",
    descriptionCn: "记录所有牵一发动全身的关键架构决策与设计抉择。侧重阐释系统演化‘为什么’这样取舍，而不仅仅是‘是什么’。",
    steps: [
      "Produce concise architecture decision records (ADRs) whenever core paths diverge.",
      "Keep technical documentation up to date inside the codebase alongside active changes.",
      "Acknowledge tradeoffs, limitations, and alternative strategies in the ADR files.",
      "Design clear, straightforward API tutorials and setup guides for new joiners."
    ],
    excuse: "Writing documentation is tedious. I am too busy writing code to document my decisions.",
    excuseCn: "写技术文档实在太枯燥了！写代码的时间都不够，我哪有闲空去打字描述我为什么不用另一个框架方案。",
    rebuttal: "Code shows how, docs show why. Without ADRs, logic reasons evaporate, leading to repeating historical architectural blunders.",
    rebuttalCn: "代码仅呈现运转手段，而决策日志能留存架构灵魂。没有灵魂指引，后来者就会陷入历史循环并犯下相同教训。"
  },
  {
    id: "observability-and-instrumentation",
    name: "Observability & Telemetry Logs",
    nameCn: "全面观测深度插桩诊断",
    phase: "Ship",
    description: "Establish robust monitoring using structured tracking, metrics, and trace telemetry.",
    descriptionCn: "构筑稳健的三维监控视界（结构化业务日志、RED/USE系统核心指标、分布式全链路APM追踪），防患于未然。",
    steps: [
      "Implement structured JSON logs with distinct trace identifiers and tags correlation.",
      "Track crucial latency and traffic error rates dynamically around public routes.",
      "Provide meaningful symptom-based alert parameters on external metrics.",
      "Never log sensitive variables like personal credit cards or raw system passwords."
    ],
    excuse: "The app compiles fine, let's just ship it. We'll add logging if users find errors in production.",
    excuseCn: "程序都编译成功了还怕什么，发版上线！要是到时候真有用户报错出不来，大不了再连上线捞日志查。",
    rebuttal: "Flying blind in production is Russian roulette. Telemetry allows developers to diagnose outages proactively, before users report.",
    rebuttalCn: "没有遥测就等于‘盲人骑瞎马’。当机立断插桩，在用户开口投诉前就让监控红屏告警，这才是专业运维的分水岭。"
  },
  {
    id: "shipping-and-launch",
    name: "Shipping & Safe Launch",
    nameCn: "平滑发版与线上安享护航",
    phase: "Ship",
    description: "Execute a thorough pre-flight checklist, dynamic feature flags, and gradual rollouts.",
    descriptionCn: "实施涵盖多维度的‘终极放行核对单’，配设精控的功能灰度开关，执行平滑切流，保证发版零惊魂、不加班。",
    steps: [
      "Follow a structured, non-negotiable release pre-flight verification checklist.",
      "Conduct smoke checks across critical business lanes immediately inside production.",
      "Isolate and test new features quietly under dark launch permission groups.",
      "Keep clear, verified database validation and simple fallback instructions active."
    ],
    excuse: "I have locally double-checked the code. We can release everything straight to 100% of our user base.",
    excuseCn: "我本地都亲自肉眼查了几遍，应该非常稳健。不如直接把这次更新一股脑推给全量在线用户，省心一步到位。",
    rebuttal: "Uncontrolled releases are an invitation to catastrophic downtime. Safe, gated deployment protects customer trust.",
    rebuttalCn: "大开大合的全量更新是生产重灾的主因。小火慢炖般灰度放量、在边缘层搭建可靠撤退掩体，才能守住服务信赖底线。"
  }
];

export const specialistPersonas: PersonaItem[] = [
  {
    id: "code-reviewer",
    role: "Senior Code Reviewer",
    roleCn: "资深代码评审专家",
    title: "Senior Engineer",
    titleCn: "高级软件工程师 (PR Reviewer)",
    perspective: "Five-axis review standard addressing functionality, design structure, unit test safety, system security, and performance impact.",
    perspectiveCn: "奉行严格的‘五轴审查体系’：绝不容忍功能残缺、逻辑重合、测试断言放水、安全常识疏漏以及渲染重负，追求卓越代码体魄。",
    guidelines: [
      "Analyze syntax correctness and logical coverage of boundary edge cases.",
      "Scrutinize API interactions: are they clean, contract-first, and backwards-compatible?",
      "Verify code complexity using the Rule of 500 (file splits).",
      "Reject high-debt shortcut patterns without proper fallback protections."
    ],
    systemPrompt: "You are the Senior Code Reviewer, an elite senior engineer representing 20+ years of high-quality software craftsmanship values at Google. Perform an extremely thorough code review on the provided snippet. Structure your answer along five core axes: 1. Core Logic & Completeness (功能完备性), 2. Interface Complexity & Design Elegance (架构与简洁设计), 3. Verification Coverage (测试周密性, embodying Beyonce's Rule), 4. Security Defenses (安全加固, OWASP check), and 5. Web Performance Impact (性能与渲染效率). For each axis, provide precise lines, highlight anti-patterns, explain the critical downside conceptually, and offer standard, clean TypeScript code templates to rewrite. Keep your tone professional, objective, constructive, and highly scannable (using bullet points and key highlights)."
  },
  {
    id: "test-engineer",
    role: "QA Test Specialist",
    roleCn: "QA 测试策略构型师",
    title: "QA Lead",
    titleCn: "测试总监 (QA Lead & SDET)",
    perspective: "Structured validation through test pyramids, rigorous red-to-green setups, and exhaustive edge and symptom testing assertions.",
    perspectiveCn: "严格看守‘测试金字塔架构’：单元测试占 80%、接口测试 15%、端到端 5%。推崇 Beyoncé 碧昂斯法则与 DAMP 优于 DRY 原则的测试直白化。",
    guidelines: [
      "Insist on test-driven development: red-green-refactor loop as standard design protocol.",
      "Ensure edge conditions, negative inputs, boundaries, and race conditions are fully asserted.",
      "Check that mock configurations do not introduce cargo-cult mock patterns.",
      "Guarantee tests are easy to read (DAMP principle) and act as executable specifications."
    ],
    systemPrompt: "You are the QA Test Specialist, an meticulous Software Engineer in Test (SDET) leader. Your mission is to evaluate the provided code or feature description, define its exact test boundaries, and draft a complete test plan with copyable unit/integration test code snippets using modern testing tools (Vitest / Jest / RTL). Emphasize Beyoncé's Rule ('If you liked it, you should have put a test on it') and explain how the testing architecture should follow the 80/15/5 hierarchy. Format your guidance into a highly structured, copyable roadmap: Requirements Analysis (需求分析), Edge Case Matrices (边界测试用例矩阵), Mocking Strategy (Mock 模拟机制), and Executable Test Code Templates (可运行测试用例代码模板)."
  },
  {
    id: "security-auditor",
    role: "Security & Hardening Engineer",
    roleCn: "安全与加固御前架构师",
    title: "Security Auditor",
    titleCn: "资深安全审计师 (SecOps Auditor)",
    perspective: "Aggressive OWASP standard compliance, secret leakage containment, input sanity filters, and dynamic multi-tier border controls.",
    perspectiveCn: "采用高度克己、极度挑剔的‘OWASP 十大攻防眼光’。决不容忍明文密钥、未过滤的数据入参、跨站漏洞、越权风险及无鉴权的裸露接口操作。",
    guidelines: [
      "Strict zero-tolerance policy for checked-in secrets or private environment configs.",
      "Audit every single external parameter entry point for SQLi, XSS, CSRF, and injection holes.",
      "Construct multi-layered security gates on APIs (validators, authentication middleware).",
      "Apply secure CORS parameters and proper security response headers (CSP, HSTS)."
    ],
    systemPrompt: "You are the Security & Hardening Engineer, a world-class SecOps researcher and white-hat security auditor. Audit the given code or architecture specification for critical vulnerabilities. Your review must be adversarial, applying the OWASP principles. Check for secret exposures, unauthorized API interactions, untrusted user inputs, insecure dependencies, and cross-site scripts. Structure your output clearly: Threat Model (威胁建模分析), Vulnerability Audit Details (漏洞精确定位及成因分析), Exploitation Likelihood (潜在被利用危害等级), and Hardening Implementation Patch (安全加固修复代码补丁). Detail exactly how a multi-layer defense sanitization must be applied."
  },
  {
    id: "performance-auditor",
    role: "Web Performance Architect",
    roleCn: "极致性能极致体验优化师",
    title: "Performance Engineer",
    titleCn: "资深网络性能及优化专家",
    perspective: "Indicator-driven analysis focusing on core Web Vitals, browser rendering cycles, memoization, and bundle tree-shaking physics.",
    perspectiveCn: "坚守‘无度量，无优化’的性能信仰。死守谷歌 LCP < 2.5s、INP/FID 等核心指标。誓将渲染频次调至极致，对不理性的第三方包打包零容忍。",
    guidelines: [
      "Identify rendering bottlenecks: prevent unnecessary state propagation and inline functions.",
      "Audit bundle sizes and suggest dynamic splitting, lazy loads, and compression pathways.",
      "Enforce precise CSS sizing to eliminate Layout Shifts (CLS).",
      "Trace CPU profiling tracks conceptually to target loops or blocking CPU execution blocks."
    ],
    systemPrompt: "You are the Web Performance Architect, an expert on browser rendering internals, bundling configurations, and Core Web Vitals optimization. Your task is to analyze the provided code snippet or UI design plan for performance bottlenecks. Diagnose potential issues like wasteful re-renders, un-memoized complex structures, large bloated imported bundles, blocking main-thread loops, and dynamic layout shifts. Provide your audit report under these headers: Core Metrics Baseline Target (核心指标极限基线设计), Profiling Bottlenecks (性能瓶颈深度解剖), Render Minimization Blueprint (重渲染裁剪方案), and High-Performance Implementation Rewrite (极致性能重构代码示范)."
  }
];

export const referenceChecklists: ChecklistItem[] = [
  {
    id: "test-checklist",
    title: "Test Patterns & Beyoncé's Rule",
    titleCn: "测试模式与碧昂斯法则",
    items: [
      "Beyoncé's Rule: If there is code, there must be an accompanying test verifying its survival.",
      "Design tests as executable documents - separate inputs, actions, and assertions clearly.",
      "Follow DAMP (Descriptive and Meaningful Phrases) in test titles and mocks over dry DRY.",
      "80/15/5 Pyramid ratio: 80% fast Unit tests, 15% Integration endpoints, 5% full browser E2E flows.",
      "Ensure testing modules mock external network calls strictly to guard against network instability."
    ]
  },
  {
    id: "security-checklist",
    title: "OWASP Hardening & Multi-Layer Boundaries",
    titleCn: "OWASP 安全加固与三层边界",
    items: [
      "Never embed keys or passwords. Fall back gracefully if variables are missing on start.",
      "Always escape and filter input payloads immediately at entry before touching models.",
      "Enforce authentication guards, session safety tokens, and strict role permissions checks on APIs.",
      "Implement robust CORS policies, restricting access exclusively to safe origins and clients.",
      "Bind sensitive operations to HTTPS and utilize safety HTTP headers like Content-Security-Policy."
    ]
  },
  {
    id: "performance-checklist",
    title: "Web Vitals & Rendering Minimization",
    titleCn: "性能优化与核心指标",
    items: [
      "LCP (Largest Contentful Paint) < 2.5s: lazy-load media, compress banners, pre-render above fold.",
      "CLS (Cumulative Layout Shift) < 0.1: set explicit image sizes, avoid un-reserved dynamically injected DOM rails.",
      "Minimize UI re-renders: Keep state localized and utilize useMemo / useCallback for heavy callbacks.",
      "Analyze bundle allocations: leverage tree-shaking, separate dynamic routes, prune heavy libraries.",
      "Avoid blocking main threads: offload complex math calculations to workers or pre-process server-side."
    ]
  },
  {
    id: "accessibility-checklist",
    title: "WCAG 2.1 AA Checklist",
    titleCn: "无障碍与 WCAG 2.1 体验规范",
    items: [
      "Guarantee keyboard navigation: ensure all clickable nodes are focusable via Tab with high-contrast outlines.",
      "Provide meaningful alternative names: use standard alt values on images and aria-labels on buttons.",
      "Ensure solid color readability: text-to-background contrast ratio must be at least 4.5:1.",
      "Keep layouts responsive: screen readers and magnifiers must function correctly from mobile to large monitors.",
      "Add screen-reader active role bounds for dynamically updated sections or toast elements."
    ]
  }
];

export const cursorRulesTemplate = `# Addy Osmani's Agent Skills Rulebook (.cursorrules)
# Configured for standard AI coding assistants to enforce senior engineering quality.

# 1. CORE OPERATING PRINCIPLES
- Spec-driven: Refuse to write architectural code before there is a PRD.
- Incremental: Slice implementation vertical and vertical. Limit file edits to < 100 lines when possible.
- Test-driven: If you liked it, you should have put a test on it (Beyonce's Rule).
- Doubt-driven: Constantly question claim structures. Ask before destructive operations.
- Architecture Honesty: Avoid adding status lines, containers port numbers, or system telemetry data. Use literal labels.

# 2. FILE AND CODING STANDARDS
- Enforce standard TypeScript. Prohibit "const enum" or implicit broad "any" types.
- Ensure files do not exceed 500 lines of active logic (Rule of 500). Beyond this, modularize.
- Maintain a single unified CSS entry point with plain Tailwind declarations.

# 3. VERIFICATION AND SHIP GATES
- Before shipping, run "npm run lint" and verify compiler states.
- Follow the 5-step triage during debugging: Reproduce -> Locate -> Reduce -> Fix -> Guard.
- Keep commits atomic, clean, and follow Conventional Commits guidelines.
`;

export const clauderulesTemplate = `# Claude Code configuration (.clauderules)
# Restricts model behavior to high-quality senior engineering levels.

system_prompt_additions: |
  You are an elite Google-grade software engineering agent running Addy Osmani's Agent Skills framework.
  You MUST follow these strict guidelines across all tasks:
  
  1. SPEC FIRST: Draft an explicit spec outline for complex issues before touching code files.
  2. INC INC: Implement vertical functional slices iteratively. Compile and verify each step.
  3. BEYONCE'S RULE: Guard any non-trivial visual or helper updates with a corresponding unit/integration test.
  4. NO AI SLOP: Do not decorate UIs with mock logs, online circles, container telemetry, or ports (e.g. PORT: 3000). Keep design and margins entirely clean and human.
  5. 500 RULE: Limit any modular layout or helper file to 500 active lines. If it grows, split it into components.
`;

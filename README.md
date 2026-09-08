# Exocoetidae

[**轻量多智能体助手 · Lightweight Multi-Agent Assistant**](https://zim-l.github.io/exocoetidae)

一个可以随手打开的 AI 工作窗口：对话、处理文件、并行分工、记住上下文，也可以安排稍后执行的任务。

A compact AI workspace for conversations, file editing, parallel agents, shared memory and scheduled tasks.

## 中文

### 能做什么

- **对话与模型切换**：接入自己的 API，也可以先用内置免费兜底试聊。支持流式回答、Markdown、公式、历史搜索、项目分组、分支与临时对话。
- **授权访问本地文件**：关联指定文件夹，阅读并修改文档、文本资料与代码。文件修改带校验与撤销，帮助你安全地处理自己的文件。
- **多智能体并行工作**：让多个助手分别研究、编写、验证和整理，在同一对话中跟进进度；可为不同助手选择不同模型。
- **本轮改动总结**：查看新建、修改、删除的文件，增删行数与逐行差异，并按需撤销。每个文件旁的「下载」按钮可保存文件当前内容，保留原文件名；已删除的文件可先撤销删除再下载。
- **跨对话记忆**：延续长期偏好、项目背景和之前的讨论。在「设置 → 记忆」查看和修改全局记忆，在项目面板管理项目记忆。
- **提醒与定时执行**：用自然语言安排一次性、每日或每周任务，在「设置 → 提醒」查看和取消。页面打开时到点执行；配置推送后，关闭页面也能收到提醒，重新打开再执行任务。

### 开始使用

1. 下载 `exocoetidae.html` 并用现代浏览器打开，或访问静态托管的 `/exocoetidae.html`。
2. 初次打开会显示模型设置。可以关闭设置，用免费兜底试聊；也可以选择厂商、点击「添加」，填写 API key、Base URL 和模型名称。
3. 选择模型，开始对话。需要文件时上传文本资料或授权关联本地文件夹；需要并行分工、记忆或定时执行时，直接提出要求。

当前界面以中文为主，支持中英文交流。本地目录访问需要浏览器支持与授权，建议使用近期版本的 Chrome 或 Edge。文档编辑面向文本文件，不是 Word 或 PDF 的版式编辑器。

例如：“阅读这个文件夹里的 Markdown 文档，统一术语”“让一个助手改代码，另一个核对结果”“记住我偏好简短的中文回答”“每天下午五点总结这个项目的进展”。完成文件任务后，可在「本轮改动」检查结果。

### 免费兜底与自己的 API

内置兜底使用 OVHcloud AI Endpoints 的 `gpt-oss-120b` 匿名通道，无需填写 key。官方当前限制为每个 IP、每个模型每分钟 2 次请求，页面会安排等待；同一网络下的其他使用者也可能占用额度。参见 [OVHcloud 使用限制](https://docs.ovhcloud.com/en/guides/public-cloud/ai-machine-learning/ai-endpoints-capabilities)。适合试用和临时应急，复杂的多智能体任务建议使用自己的 API。

日常使用推荐 DeepSeek，可先充值约 50 元人民币作为文字对话的起步预算；这不是无限额度，实际消耗取决于模型、上下文和任务规模。Base URL 为 `https://api.deepseek.com`；模型名称可点击「拉取」获取，或按官方列表填写。参见 [DeepSeek 接入指南](https://api-docs.deepseek.com/zh-cn/)与[当前价格](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)。

也支持 [Kimi / Moonshot](https://platform.kimi.com/docs/get-api-key)、[通义千问](https://help.aliyun.com/zh/model-studio/first-api-call-to-qwen)等服务。厂商预设可编辑，请核对地址、地域、模型权限与余额。自己的 API 仍遵循厂商的计费与限流规则，通常与聊天会员订阅分开。

### 可选：本地体验增强器

两个使用文件为 `exocoetidae.html`（对话窗口）和可选的 `worker.js`（增强器），无需构建。增强器支持联网搜索、网页读取和推送提醒；基础对话、记忆、文件操作及页面打开时的定时任务无需配置它。

1. 在 Cloudflare Workers 创建服务，上传 `worker.js`。
2. 设置私密环境变量 `TOKEN` 为自己的访问口令；如使用 Brave Search，另设 `BRAVE_KEY`，否则使用默认搜索渠道。
3. 在「设置 → 搜索 → 本地体验增强器」填入服务的 HTTPS 地址与口令，点击「测试」。

如需关闭页面后的推送提醒：

1. 将同一个 `worker.js` 与 `exocoetidae.html` 放在静态网站的同一目录，通过 HTTPS 打开对话窗口。
2. 为增强服务绑定名为 `KV` 的 KV 命名空间，并添加每分钟一次的 Cron 触发器（`* * * * *`）。
3. 在「设置 → 提醒」点击「订阅推送」，允许浏览器通知。

定时执行需要设备与页面保持运行，浏览器休眠可能延迟触发。关闭页面时，模型任务会在重新打开后执行，推送本身只负责提醒。

### 数据

设置、key、历史与记忆保存在当前浏览器。发送任务时，相关对话、记忆和读取的文件内容可能发给所选模型厂商；免费兜底的接收方为 OVHcloud。联网功能会发送相关搜索词或网址；启用推送后，提醒信息也会同步到你配置的增强服务。

换设备、换访问地址或清理浏览器数据前，请在「设置 → 数据」导出备份并保存导出口令。不同地址的数据不会自动迁移。

## English

### What it does

- **Chat and provider switching**: connect your API or try the free fallback. Includes streaming replies, Markdown, maths, history search, projects, branches and temporary chats.
- **Local files with your permission**: authorise a selected folder to read and edit documents, text and code. Validation and undo help you make changes safely.
- **Parallel agents**: assign research, writing, verification and organisation to different assistants, follow progress in one conversation and optionally choose a model for each.
- **Changes This Turn**: review created, modified and deleted files, added and removed line counts, line-by-line differences and undo options. Download the current file contents with the original filename using 「下载」; restore deleted files before downloading them.
- **Memory across conversations**: carry preferences, project context and earlier discussions into new chats. Edit global memory under Settings → Memory (「设置 → 记忆」) and project memory in the project panel.
- **Reminders and scheduled tasks**: request one-off, daily or weekly tasks; review and cancel them under Settings → Reminders (「设置 → 提醒」). Tasks run while the page is open. With push configured, reminders can arrive while it is closed; tasks execute after you reopen it.

### Get started

1. Download and open `exocoetidae.html` in a modern browser, or visit `/exocoetidae.html` on a static host.
2. Model settings appear on first launch. Close them to try the free fallback, or select a provider, click Add (「添加」) and enter its API key, Base URL and model names.
3. Select a model and chat. Upload text or authorise a local folder for file tasks. Ask directly for parallel work, memory or scheduled execution.

The interface is primarily Chinese; conversations can be in Chinese or English. Folder access requires browser support and permission; recent Chrome or Edge versions are recommended. Document editing is for text files, not Word or PDF page layout.

Try “Read these Markdown documents and make the terminology consistent”, “Have one assistant edit the code and another check it”, “Remember that I prefer short answers” or “Summarise this project's progress every day at 5 pm”. Review file edits in Changes This Turn (「本轮改动」).

### Free fallback and your own API

The built-in fallback uses OVHcloud AI Endpoints' anonymous `gpt-oss-120b` service without a key. The documented limit is currently 2 requests per minute, per IP and per model. The page queues requests; other users on the same network can also consume the allowance. See [OVHcloud's service limits](https://docs.ovhcloud.com/en/guides/public-cloud/ai-machine-learning/ai-endpoints-capabilities). It suits quick trials and temporary sessions; use your own API for demanding multi-agent tasks.

DeepSeek is the recommended everyday starting option. Around RMB 50 is a suggested initial text-chat budget, not unlimited credit; consumption depends on the model, context and task size. Use `https://api.deepseek.com` as the Base URL and fetch model names with 「拉取」 or enter them from the official list. See the [setup guide](https://api-docs.deepseek.com/) and [current pricing](https://api-docs.deepseek.com/quick_start/pricing).

Other options include [Kimi / Moonshot](https://platform.kimi.com/docs/get-api-key) and [Qwen](https://help.aliyun.com/zh/model-studio/first-api-call-to-qwen). Presets are editable: check the endpoint, region, model access and credit. Your own API follows the provider's pricing and rate limits, usually separately from chat subscriptions.

### Optional local experience enhancer

The two usage files are `exocoetidae.html` (chat window) and optional `worker.js` (enhancer). No build step is required. The enhancer adds web search, webpage reading and push reminders. Basic chat, memory, file work and scheduling while the page is open do not require its setup.

1. Create a Cloudflare Worker and upload `worker.js`.
2. Set the secret environment variable `TOKEN` to your passphrase. Optionally set `BRAVE_KEY` for Brave Search; otherwise the default search channel is used.
3. Enter the service's HTTPS address and passphrase under Settings → Search → 本地体验增强器, then click 「测试」.

For push reminders while the page is closed:

1. Also place the same `worker.js` beside `exocoetidae.html` on your static host, and open the chat page over HTTPS.
2. Bind a KV namespace named `KV` to the enhancement service and add a Cron trigger that runs every minute (`* * * * *`).
3. Click Subscribe to Push (「订阅推送」) under Settings → Reminders and allow browser notifications.

Scheduled execution requires the device and page to stay running; browser suspension may delay it. When the page is closed, model tasks wait until you reopen it. Push delivers the reminder.

### Data

Settings, keys, history and memory stay in the current browser. Tasks may send relevant conversation, memory and file contents to your selected model provider; the free fallback sends them to OVHcloud. Web features send relevant queries or URLs, and enabling push also synchronises reminder information with your configured enhancement service.

Before changing devices or addresses, or clearing browser data, export a backup under Settings → Data and retain its passphrase. Data does not automatically migrate between addresses.

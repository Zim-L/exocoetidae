# Exocoetidae

[**轻量多智能体助手 · Lightweight Multi-Agent Assistant**](https://zim-l.github.io/exocoetidae)

一个可以随手打开的 AI 工作窗口：对话、处理文件、并行分工、记住上下文，也可以安排稍后执行的任务。

A compact AI workspace for conversations, file editing, parallel agents, shared memory and scheduled tasks.

## 中文

### 能做什么

- **打开即用的对话与模型切换**：默认模型会自动尝试多个免费通道，也可在设置中接入自己的 API。支持流式回答、Markdown、公式、历史搜索、项目分组、分支与临时对话；右上角可调字体或快速打开模型设置。
- **授权访问本地文件**：关联指定文件夹，阅读并修改文档、文本资料与代码。文件修改带校验与撤销，帮助你安全地处理自己的文件。
- **多智能体并行工作**：让多个助手分别研究、编写、验证和整理，在同一对话中跟进进度；可为不同助手选择不同模型。
- **本轮改动总结**：查看新建、修改、删除的文件，增删行数与逐行差异，并按需撤销。每个文件旁的「下载」按钮可保存文件当前内容，保留原文件名；已删除的文件可先撤销删除再下载。
- **项目文件栏**：右侧分别列出浏览器内的项目文件、当前对话附件和你明确授权的本地目录；支持刷新、文件名搜索、预览、原名下载、多文件上传与拖放。窄屏下以抽屉显示。
- **图片理解**：选择、拖放或粘贴图片，发送前检查缩略图并移除不需要的图片；支持视觉输入的模型会收到图片。图片会随对话保存，可放大查看和下载。
- **跨对话记忆**：延续长期偏好、项目背景和之前的讨论。在「设置 → 记忆」查看和修改全局记忆，在项目面板管理项目记忆。
- **提醒与定时执行**：用自然语言安排一次性、每日或每周任务，在「设置 → 提醒」查看和取消。页面打开时到点执行；配置推送后，关闭页面也能收到提醒，重新打开再执行任务。

### 开始使用

1. 下载 `exocoetidae.html` 并用现代浏览器打开，或访问静态托管的 `/exocoetidae.html`。
2. 页面会直接进入对话，右上角显示「默认模型－模型名」；无需先配置。想要更稳定时，再从右上角或左下角打开设置，添加自己的 API key、Base URL 和模型名称。
3. 输入任务即可。需要文件时打开右侧文件栏上传资料或授权关联本地文件夹；图片可通过「＋ 图片」、拖放或粘贴加入。需要并行分工、记忆或定时执行时，直接提出要求。

当前界面以中文为主，支持中英文交流。本地目录访问需要浏览器支持与授权，建议使用近期版本的 Chrome 或 Edge。文档编辑面向文本文件，不是 Word 或 PDF 的版式编辑器。

例如：“阅读这个文件夹里的 Markdown 文档，统一术语”“让一个助手改代码，另一个核对结果”“记住我偏好简短的中文回答”“每天下午五点总结这个项目的进展”。完成文件任务后，可在「本轮改动」检查结果。

### 免费兜底与自己的 API

「默认模型」无需 key，会依次尝试 OVHcloud 的 `gpt-oss-120b`、`Qwen3.8-27B` 与 Kilo 的 `kilo-auto/free`；明确无需工具或图片的普通文字任务还可使用 LLM7 的 `default`。成功后，右上角只显示服务实际返回的模型名；全部不可用时仍显示「模型」，并提示稍后重试或添加 API。免费服务会限流且可用模型可能变化；Kilo 若阻止浏览器跨域会被自动跳过。参见 [OVHcloud 使用限制](https://docs.ovhcloud.com/en/guides/public-cloud/ai-machine-learning/ai-endpoints-capabilities)、[Kilo Auto Free](https://kilo.ai/docs/gateway/models-and-providers) 与 [LLM7 文档](https://docs.llm7.io/quickstart)。复杂或包含机密信息的任务建议使用自己的 API。

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

设置、key、历史与记忆保存在当前浏览器。发送任务时，相关对话、记忆和读取的文件内容可能发给所选模型厂商；默认模型可能交给 OVHcloud、Kilo 路由的免费模型提供方或 LLM7。免费路由可能记录输入与输出，请勿提交个人或机密信息。联网功能会发送相关搜索词或网址；启用推送后，提醒信息也会同步到你配置的增强服务。

换设备、换访问地址或清理浏览器数据前，请在「设置 → 数据」导出备份并保存导出口令。不同地址的数据不会自动迁移。

## English

### What it does

- **Ready-to-use chat and provider switching**: the default model automatically tries several free routes, or you can connect your own API in Settings. Includes streaming replies, Markdown, maths, history search, projects, branches and temporary chats; font size and model settings are also available in the top bar.
- **Local files with your permission**: authorise a selected folder to read and edit documents, text and code. Validation and undo help you make changes safely.
- **Parallel agents**: assign research, writing, verification and organisation to different assistants, follow progress in one conversation and optionally choose a model for each.
- **Changes This Turn**: review created, modified and deleted files, added and removed line counts, line-by-line differences and undo options. Download the current file contents with the original filename using 「下载」; restore deleted files before downloading them.
- **Project file panel**: the right-hand panel separately shows browser-stored project files, attachments for the current conversation and explicitly authorised local folders. It supports refresh, filename search, previews, original-name downloads, multi-file upload and drag-and-drop, with a drawer layout on narrow screens.
- **Image understanding**: choose, drop or paste images, review and remove thumbnails before sending, then pass them to a vision-capable model. Images persist with the conversation and can be enlarged or downloaded.
- **Memory across conversations**: carry preferences, project context and earlier discussions into new chats. Edit global memory under Settings → Memory (「设置 → 记忆」) and project memory in the project panel.
- **Reminders and scheduled tasks**: request one-off, daily or weekly tasks; review and cancel them under Settings → Reminders (「设置 → 提醒」). Tasks run while the page is open. With push configured, reminders can arrive while it is closed; tasks execute after you reopen it.

### Get started

1. Download and open `exocoetidae.html` in a modern browser, or visit `/exocoetidae.html` on a static host.
2. The page opens directly into chat and shows “默认模型－model name” in the top bar; no setup is required. For steadier service, open Settings from the top right or bottom left and add your API key, Base URL and model names.
3. Type a task and send it. Use the right-hand file panel to upload files or authorise a local folder. Add images with 「＋ 图片」, drag-and-drop or paste. Ask directly for parallel work, memory or scheduled execution.

The interface is primarily Chinese; conversations can be in Chinese or English. Folder access requires browser support and permission; recent Chrome or Edge versions are recommended. Document editing is for text files, not Word or PDF page layout.

Try “Read these Markdown documents and make the terminology consistent”, “Have one assistant edit the code and another check it”, “Remember that I prefer short answers” or “Summarise this project's progress every day at 5 pm”. Review file edits in Changes This Turn (「本轮改动」).

### Free fallback and your own API

The key-free Default Model tries OVHcloud `gpt-oss-120b`, OVHcloud `Qwen3.8-27B`, then Kilo `kilo-auto/free`. For plain text tasks that clearly need neither tools nor images, it can also try LLM7 `default`. Once connected, the top bar shows only the model name returned by the service; if none can be resolved, it simply says “模型”. Free routes are rate-limited and their underlying models can change. Kilo is skipped automatically when its browser endpoint does not permit cross-origin requests. See [OVHcloud limits](https://docs.ovhcloud.com/en/guides/public-cloud/ai-machine-learning/ai-endpoints-capabilities), [Kilo Auto Free](https://kilo.ai/docs/gateway/models-and-providers) and [LLM7 quickstart](https://docs.llm7.io/quickstart). Use your own API for demanding or confidential work.

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

Settings, keys, history and memory stay in the current browser. Tasks may send relevant conversation, memory and file contents to your selected provider; the Default Model may use OVHcloud, a free provider selected by Kilo, or LLM7. Free routing providers may log prompts and outputs, so do not submit personal or confidential material. Web features send relevant queries or URLs, and enabling push also synchronises reminder information with your configured enhancement service.

Before changing devices or addresses, or clearing browser data, export a backup under Settings → Data and retain its passphrase. Data does not automatically migrate between addresses.

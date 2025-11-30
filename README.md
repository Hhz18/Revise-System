# Correction Loop - 高效迭代纠错系统

Correction Loop 是一个基于 **React + Vite** 开发的现代化个人成长辅助工具。它采用独特的**手绘/新拟态（Neo-Brutalism）**设计风格，旨在帮助用户通过“纠错”和“复盘”来提高学习与生活效率。

不仅包含单词记忆和算法题复盘，还支持**完全自定义**的纠错系统（如恋爱、交友、日常事务等），配合 **Google Gemini AI** 实现智能化辅助。

## ✨ 核心亮点

*   **🎨 独特画风**：全站采用 Paper/Hand-drawn 手绘风格，高对比度边框 + 舒适的交互动画，拒绝枯燥。
*   **🤖 AI 驱动**：集成 **Google Gemini API**，导入单词时自动获取精准的中文释义，无需手动输入。
*   **🧠 科学记忆**：内置 **艾宾浩斯遗忘曲线** 算法。单词复习会根据记忆规律自动安排时间（1天, 2天, 4天, 7天...）。
*   **🧩 松耦合架构**：基于 React Hooks 和组件化设计，逻辑清晰，易于扩展。
*   **🛠 高度可定制**：除了内置系统，你可以自由创建无限个“自定义纠错子系统”，支持自定义图标、主题色。

## 🚀 功能模块

### 1. 📖 单词纠错子系统
*   **批量导入**：支持章节标记，自动识别 `129章` 等标题。
*   **智能翻转**：点击单词卡片，自动翻转并显示 AI 翻译（Q弹动画效果）。
*   **复习机制**：
    *   只有到了复习时间的单词才允许“打勾”。
    *   连续打勾触发遗忘曲线推延下次复习时间。
    *   **自动归档**：连续正确打勾 3 次后，单词自动移入“已斩杀区”。
    *   **防误触**：打勾操作增加 600ms 确认动画，防止手滑。

### 2. 💻 算法错题集
*   **Markdown 支持**：点击题目弹出笔记框，支持富文本、代码块记录。
*   **状态追踪**：通过打勾记录复习次数，熟练度可视化。

### 3. ⚡ 自定义/通用纠错系统
*   **自由创建**：点击侧边栏“+”，创建属于你的系统（例如：恋爱纠错、情绪管理）。
*   **个性化**：内置多款手绘图标和 8 种主题配色（Amber, Sky, Lime, Pink 等）。
*   **管理便捷**：侧边栏直接删除不再需要的分类。

## 🛠️ 技术栈

*   **前端框架**: [React 18](https://react.dev/)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **图标库**: [Lucide React](https://lucide.dev/)
*   **AI SDK**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
*   **Markdown 渲染**: React Markdown

## 📦 安装与运行

1.  **克隆项目**
    ```bash
    git clone https://github.com/your-username/correction-loop.git
    cd correction-loop
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置 API Key**
    本项目依赖 Google Gemini API 进行翻译。请确保环境变量中包含 `API_KEY`。
    
    *如果是本地开发，请在根目录创建 `.env` 文件（或根据您的构建配置设置）：*
    ```env
    VITE_API_KEY=your_google_gemini_api_key
    ```
    *(注意：代码中目前使用 `process.env.API_KEY`，请根据您的 Vite 配置调整读取方式，通常推荐使用 `import.meta.env.VITE_API_KEY`)*

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

## 📝 使用指南

### 单词导入格式
在“单词纠错”页面点击“+ 批量导入”，格式如下：

```text
第1章
-------------
sociology
flee
distinct

第2章
-------------
hedge
tune
```

### 数据存储
目前所有数据（单词进度、笔记、自定义系统配置）均存储在浏览器的 **LocalStorage** 中。刷新页面数据不会丢失，但清除浏览器缓存会重置数据。

## 📄 License

MIT License. 
Designed with ❤️ for efficient iteration.

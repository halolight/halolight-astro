# Halolight Astro | Admin Pro

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/halolight/halolight-astro/blob/main/LICENSE)
[![Astro](https://img.shields.io/badge/Astro-5-%23BC52EE.svg)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-%233178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4.svg)](https://tailwindcss.com/)

基于 Astro 5 的现代化中文后台管理系统，具备 Islands 架构、零 JS 首屏和极致性能。

- 在线预览：<https://halolight-astro.h7ml.cn>
- GitHub：<https://github.com/halolight/halolight-astro>

## 功能亮点

- **Islands 架构**：默认零 JS，按需水合交互组件
- **多框架支持**：可在同一项目中使用 React、Vue、Svelte
- **内容优先**：静态优先，极致性能
- **TypeScript**：完整类型安全支持
- **Tailwind CSS**：原子化样式
- **客户端指令**：`client:load`、`client:visible`、`client:idle`

## 目录结构

```
├── astro.config.mjs  # Astro 配置
├── src/
│   ├── pages/        # 文件路由
│   │   └── api/      # API 端点
│   ├── layouts/      # 布局组件
│   ├── components/   # UI 组件
│   └── styles/       # 全局样式
└── public/           # 静态资源
```

## 快速开始

```bash
pnpm install
pnpm dev         # 开发模式
pnpm build       # 生产构建
pnpm preview     # 预览构建产物
pnpm astro add   # 添加集成
```

## 技术栈

| 类别     | 技术         |
| -------- | ------------ |
| 核心框架 | Astro 5      |
| 类型系统 | TypeScript   |
| 构建工具 | Vite (内置)  |
| 样式     | Tailwind CSS |

## Islands 架构

```astro
---
import Counter from '../components/Counter.tsx';
---

<!-- 静态 HTML，无 JS -->
<h1>Welcome</h1>

<!-- 页面加载时水合 -->
<Counter client:load />

<!-- 可见时水合 -->
<Counter client:visible />
```

## 客户端指令

| 指令             | 行为               |
| ---------------- | ------------------ |
| `client:load`    | 页面加载后立即水合 |
| `client:idle`    | 浏览器空闲时水合   |
| `client:visible` | 元素可见时水合     |
| `client:only`    | 仅客户端渲染       |

## 许可证

[MIT](LICENSE)

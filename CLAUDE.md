# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Halolight Astro 是一个基于 Astro 5 的现代化中文后台管理系统，具备内容优先架构和极致性能。

- **在线预览**: https://halolight-astro.h7ml.cn
- **GitHub**: https://github.com/halolight/halolight-astro

## 技术栈速览

- **核心框架**: Astro 5
- **构建工具**: Vite (内置)
- **路由**: Astro 文件路由
- **样式**: Tailwind CSS
- **类型**: TypeScript

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览构建产物
pnpm astro add    # 添加集成 (React, Vue, Tailwind 等)
```

## 架构

### Astro 核心概念

```astro
---
// Frontmatter - 服务端 JavaScript（不发送到客户端）
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';

const title = 'Dashboard';
const stats = await fetch('/api/stats').then((r) => r.json());
---

<!-- 模板 - 生成静态 HTML -->
<Layout title={title}>
  <h1>{title}</h1>
  <Card title="Total" value={stats.total} />
</Layout>

<style>
  /* 作用域样式 - 仅影响当前组件 */
  h1 {
    color: #333;
  }
</style>
```

### 目录结构

```
├── astro.config.mjs  # Astro 配置
├── src/
│   ├── pages/        # 文件路由
│   │   ├── index.astro
│   │   └── api/      # API 端点
│   ├── layouts/      # 布局组件
│   ├── components/   # UI 组件
│   └── styles/       # 全局样式
└── public/           # 静态资源
```

### 路由约定

- `pages/index.astro` - / 路由
- `pages/about.astro` - /about 路由
- `pages/blog/[slug].astro` - /blog/:slug 动态路由
- `pages/posts/[...path].astro` - /posts/\* 通配符路由
- `pages/api/users.ts` - /api/users API 端点

### Islands 架构

```astro
---
// 导入交互组件
import Counter from '../components/Counter.tsx';
import Newsletter from '../components/Newsletter.vue';
---

<!-- 默认：静态 HTML，无 JS -->
<h1>Welcome</h1>

<!-- client:load - 页面加载时水合 -->
<Counter client:load />

<!-- client:visible - 可见时水合 -->
<Newsletter client:visible />

<!-- client:idle - 浏览器空闲时水合 -->
<HeavyComponent client:idle />

<!-- client:only="react" - 仅客户端渲染 -->
<ClientOnlyChart client:only="react" />
```

### 客户端指令

| 指令             | 行为                     |
| ---------------- | ------------------------ |
| `client:load`    | 页面加载后立即水合       |
| `client:idle`    | 浏览器空闲时水合         |
| `client:visible` | 元素可见时水合           |
| `client:media`   | 媒体查询匹配时水合       |
| `client:only`    | 仅客户端渲染（跳过 SSR） |

### API 端点

```typescript
// src/pages/api/users.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const users = await getUsers();
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const user = await createUser(body);
  return new Response(JSON.stringify(user), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### 多框架支持

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [react(), vue(), svelte()],
});
```

### 代码规范

- **Frontmatter**: 服务端逻辑放在 `---` 块中
- **零 JS 默认**: 组件默认为静态 HTML
- **显式水合**: 需要交互的组件使用 `client:*` 指令
- **作用域样式**: `<style>` 默认仅影响当前组件

## 环境变量

```typescript
// 服务端（Frontmatter 中）
const apiKey = import.meta.env.API_KEY;

// 客户端（需要 PUBLIC_ 前缀）
const publicUrl = import.meta.env.PUBLIC_API_URL;
```

| 变量名             | 说明                       | 默认值      |
| ------------------ | -------------------------- | ----------- |
| `PUBLIC_API_URL`   | API 基础 URL（客户端可用） | `/api`      |
| `API_SECRET`       | API 密钥（仅服务端）       | -           |
| `PUBLIC_APP_TITLE` | 应用标题                   | `Admin Pro` |

## 新增功能开发指南

### 添加新页面

```astro
---
// src/pages/dashboard.astro
import Layout from '../layouts/Layout.astro';
import StatsCard from '../components/StatsCard.astro';

const stats = await fetch('/api/stats').then((r) => r.json());
---

<Layout title="Dashboard">
  <main class="p-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <StatsCard title="Users" value={stats.users} />
      <StatsCard title="Orders" value={stats.orders} />
      <StatsCard title="Revenue" value={stats.revenue} />
    </div>
  </main>
</Layout>
```

### 添加静态组件

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  href?: string;
}

const { title, href } = Astro.props;
---

<div class="p-4 border rounded-lg">
  <h2 class="text-lg font-semibold">{title}</h2>
  <slot />
  {
    href && (
      <a href={href} class="text-blue-600">
        Learn more →
      </a>
    )
  }
</div>
```

### 添加交互组件（React）

```tsx
// src/components/Counter.tsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount((c) => c + 1)}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Count: {count}
    </button>
  );
}
```

使用时添加客户端指令：

```astro
---
import Counter from '../components/Counter.tsx';
---

<Counter client:load />
```

## 注意事项

- **Frontmatter 限制**: `---` 块中的代码仅在服务端运行
- **客户端指令**: 交互组件必须使用 `client:*` 指令
- **环境变量**: 客户端可访问的变量需要 `PUBLIC_` 前缀
- **框架混用**: 可以在同一页面使用 React、Vue、Svelte 组件

## 与其他 Halolight 项目的对照

| 功能     | Astro 版本         | Next.js 版本      | Nuxt 版本 |
| -------- | ------------------ | ----------------- | --------- |
| 渲染模式 | 静态优先 + Islands | SSR/SSG           | SSR/SSG   |
| JS 加载  | 按需（client:\*）  | 全量              | 全量      |
| 框架支持 | 多框架             | React             | Vue       |
| 构建工具 | Vite               | Webpack/Turbopack | Vite      |

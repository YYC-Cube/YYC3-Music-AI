# D MusAI · 原创音乐播放器

> **_YanYuCloudCube_**
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

</div>

# D MusAI · 原创音乐播放器

<p align="center">
  <img src="/public/D-MusAI.png" alt="D MusAI" width="640" />
</p>

<p align="center">
  <strong>言启千行代码，语枢万物智能</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-Latest-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.12-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-Radix_UI-000000?logo=radixui&logoColor=white" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/pnpm-Latest-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

<p align="center">
  <a href="https://music-ai.yyc3.top" target="_blank">在线访问</a> · <a href="https://github.com/YYC-Cube/YYC3-Music-AI" target="_blank">GitHub 仓库</a> · <a href="mailto:admin@0379.email">联系我们</a>
</p>

<p align="center">
  <a href="#功能特性">功能</a> · <a href="#技术栈">技术栈</a> · <a href="#快速开始">快速开始</a> · <a href="#项目结构">结构</a> · <a href="./docs/ARCHITECTURE.md">架构</a> · <a href="./docs/API.md">API</a> · <a href="./docs/DEPLOYMENT.md">部署</a> · <a href="./docs/PWA.md">PWA</a>
</p>

---

## 概述

**YYC3D MusAI** 是一款基于原创音乐的沉浸式播放器，采用苹果经典 CoverFlow 3D 交互范式，搭载自研本地音频引擎，实现从视觉到听觉的完整音乐体验。

核心设计理念：

- **全端自适应** — 取消固定 iPad 尺寸，所有 UI 元素基于视口宽度动态计算（封面大小 `width × 0.18`、间距 `width × 0.15`），从 320px 手机到 4K 屏幕无缝适配
- **移动端优先** — 移动端进度条加粗（6px vs 4px）、按钮尺寸适配（56px 播放按钮）、触控热区增大、CoverFlow 容器高度动态调整（280px vs 384px）
- **本地化架构** — 零外部 API 依赖，所有音乐、封面、海报均为本地资源，支持中文路径和特殊字符
- **PWA 就绪** — 全端图标统一（Android / iOS / macOS / Windows / tvOS / watchOS），可安装到桌面

## 功能特性

| 功能 | 说明 |
| ---- | ---- |
| CoverFlow 3D | 苹果经典 CoverFlow 专辑封面浏览，支持拖拽、惯性滚动、键盘导航 |
| 本地音频引擎 | 基于 HTML5 Audio API 的本地 MP3 播放，支持中文路径和特殊字符 |
| 播放控制 | 播放 / 暂停、上一曲 / 下一曲、进度拖拽、音量调节 |
| 播放模式 | 顺序播放、列表循环、单曲循环、随机播放 |
| 全端自适应 | 取消 iPad 固定尺寸，基于视口动态计算封面、间距、按钮尺寸 |
| 移动端优化 | 进度条加粗、触控热区增大、控制按钮自适应、容器高度动态调整 |
| 智能搜索 | 歌手 / 歌曲名搜索，500ms 防抖 |
| PWA 支持 | 可安装到桌面，全端品牌统一（6 平台图标） |

## 技术栈

| 类别 | 技术 | 版本 | 用途 |
| ---- | ---- | ---- | ---- |
| 构建工具 | Vite | 6.3.5 | 开发服务器、生产构建 |
| 框架 | React | 18.3.1 | UI 渲染 |
| 语言 | TypeScript | Latest | 类型安全 |
| 样式 | TailwindCSS | 4.1.12 | 原子化 CSS |
| UI 组件 | shadcn/ui + Radix UI | Latest | 无障碍基础组件 |
| 动画 | Framer Motion | 12.23.24 | CoverFlow 3D 变换 |
| 包管理 | pnpm | Latest | 依赖管理 |
| 音频 | HTML5 Audio API | - | 本地 MP3 播放 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5180
# 线上地址 https://music-ai.yyc3.top
```

```bash
# 生产构建
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```text
Music/
├── index.html                          # HTML 入口（PWA meta 标签）
├── public/
│   ├── manifest.json                   # PWA 清单
│   ├── D-MusAI.png                     # 品牌主图
│   ├── D-brand/                        # 全端图标（Android/iOS/macOS/Windows/tvOS/watchOS）
│   ├── D-cover/                        # 专辑封面
│   ├── D-poster/                       # 艺人海报
│   └── D-Music/                        # 原创音乐 MP3
├── src/
│   ├── main.tsx                        # React 入口
│   └── app/
│       ├── App.tsx                     # 主应用（状态管理、歌曲切换）
│       ├── components/
│       │   ├── CoverFlow.tsx           # 3D 封面流（拖拽/惯性/键盘）
│       │   ├── Player.tsx              # 播放控制台（播放/切歌/音量/模式）
│       │   ├── SearchBar.tsx           # 搜索栏（防抖）
│       │   └── SimpleBackgroundVideo.tsx
│       ├── services/
│       │   ├── localAudioService.ts    # 核心音频引擎（loadId 竞态控制）
│       │   └── localAlbumService.ts    # 歌曲数据服务
│       ├── data/
│       │   └── albumsDatabase.ts       # 11 首原创音乐数据库
│       ├── hooks/
│       │   └── useResponsive.ts        # 响应式检测
│       └── types/
│           └── Song.ts                 # 歌曲类型定义
└── docs/
    ├── ARCHITECTURE.md                 # 架构文档
    ├── DEVELOPMENT.md                  # 开发规范
    ├── DEPLOYMENT.md                   # 部署指南
    ├── API.md                          # API 文档
    └── PWA.md                          # PWA 专项文档
```

## 核心架构

```text
┌─────────────────────────────────────────────┐
│                  UI 层                       │
│   SearchBar · CoverFlow · Player            │
├─────────────────────────────────────────────┤
│               应用逻辑层                     │
│   App.tsx（状态管理 · 歌曲切换 · 搜索）       │
├─────────────────────────────────────────────┤
│                服务层                        │
│   localAudioService · localAlbumService     │
├─────────────────────────────────────────────┤
│                数据层                        │
│   albumsDatabase.ts · 本地资源（MP3/封面）    │
└─────────────────────────────────────────────┘
```

> 详见 [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 文档导航

| 文档 | 说明 |
| ---- | ---- |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 系统架构、数据流、组件关系 |
| [DEVELOPMENT.md](./docs/DEVELOPMENT.md) | 代码规范、开发流程、调试技巧 |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | 构建配置、部署方案、PWA 部署 |
| [API.md](./docs/API.md) | localAudioService API、数据结构 |
| [PWA.md](./docs/PWA.md) | PWA 配置、图标资源、安装测试 |

---

<div align="center">

> **_YanYuCloudCube_**
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

**言启千行代码，语枢万物智能**

</div>

## 许可证

MIT License · Copyright (c) 2026 YanYuCloudCube Team

## 变更历史

| 版本   | 日期       | 变更内容                                         | 作者                |
| ------ | ---------- | ------------------------------------------------ | ------------------- |
| v1.1.0 | 2026-05-26 | 更新远程仓库地址、完善团队规范标头标尾、CNAME 部署 | YanYuCloudCube Team |
| v1.0.0 | 2026-03-06 | 初始版本                                         | YanYuCloudCube Team |

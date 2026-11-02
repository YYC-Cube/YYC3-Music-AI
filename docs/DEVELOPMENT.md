---
file: DEVELOPMENT.md
description: D MusAI 开发规范文档，覆盖技术栈、目录结构、命名与编码约定
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-05-26
updated: 2026-11-02
status: stable
tags: [开发规范],[技术栈],[目录结构]
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

## 核心理念

**五高架构**：高可用 | 高性能 | 高安全 | 高扩展 | 高智能
**五标体系**：标准化 | 规范化 | 自动化 | 可视化 | 智能化
**五化转型**：流程化 | 数字化 | 生态化 | 工具化 | 服务化
**五维评估**：时间维 | 空间维 | 属性维 | 事件维 | 关联维

---

# 开发规范文档

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3.1 | UI 框架 |
| TypeScript | Latest | 类型安全 |
| Vite | 6.3.5 | 构建工具 |
| TailwindCSS | 4.1.12 | 样式 |
| shadcn/ui + Radix UI | Latest | 无障碍组件 |
| Framer Motion | 12.23.24 | 动画 |
| pnpm | Latest | 包管理 |

## 代码风格

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `CoverFlow`, `SearchBar` |
| 函数/变量 | camelCase | `handleSearch`, `isPlaying` |
| 常量 | UPPER_SNAKE_CASE | `ALBUMS_DATABASE` |
| 接口/类型 | PascalCase | `Song`, `PlayerProps` |
| 文件 | camelCase 或 PascalCase | `localAudioService.ts`, `CoverFlow.tsx` |
| CSS | Tailwind 类名 | `bg-black`, `text-white` |

### 组件规范

```typescript
interface PlayerProps {
  audioPath: string;
  songs: Song[];
  currentIndex: number;
  onPlayingChange?: (isPlaying: boolean) => void;
  onSongChange?: (song: Song, index: number) => void;
}

export function Player({ audioPath, songs, currentIndex, onPlayingChange, onSongChange }: PlayerProps) {
  // ...
}
```

### 服务层规范

```typescript
class LocalAudioService {
  private audio: HTMLAudioElement | null = null;
  private loadId = 0;

  async loadAudio(audioPath: string): Promise<void> {
    const myId = ++this.loadId;
    // 竞态控制...
  }
}

export const localAudioService = new LocalAudioService();
```

## 目录结构

```
src/app/
├── components/         # UI 组件
│   ├── ui/            # shadcn/ui 基础组件
│   ├── CoverFlow.tsx  # 业务组件
│   ├── Player.tsx
│   └── SearchBar.tsx
├── services/          # 服务层
│   ├── localAudioService.ts   # 音频引擎
│   └── localAlbumService.ts   # 数据服务
├── data/              # 数据层
│   └── albumsDatabase.ts
├── hooks/             # 自定义 Hooks
│   └── useResponsive.ts
└── types/             # 类型定义
    └── Song.ts
```

## Git 提交规范

```
<type>(<scope>): <description>
```

| Type | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat(player): add shuffle mode` |
| fix | 修复 | `fix(audio): fix semicolon path encoding` |
| docs | 文档 | `docs: update README badges` |
| refactor | 重构 | `refactor(service): rewrite audio engine` |
| perf | 性能 | `perf(coverflow): optimize drag` |
| chore | 工具 | `chore: update vite config` |

## 开发流程

```bash
# 启动开发
pnpm install
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```

## 提交前检查

- [ ] 代码无 TypeScript 错误
- [ ] 组件有明确的 Props 接口
- [ ] 样式使用 Tailwind 类名
- [ ] 错误处理完整
- [ ] 事件处理使用 useCallback
- [ ] 无 console.log 遗留

## 调试

### React DevTools

安装浏览器扩展查看组件树和 props。

### 音频调试

```typescript
// localAudioService 内置日志
console.log('音频加载成功:', audioPath);
console.error('音频加载失败:', audioPath, err);
```

### 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 音频加载失败 | 路径含特殊字符 | encodeURI + replace(';','%3B') |
| 自动播放被阻止 | 浏览器安全策略 | 用户点击播放按钮 |
| 切歌后旧歌继续 | Audio 资源未释放 | removeAttribute('src') + load() |
| 封面不显示 | 路径错误 | 检查 /D-cover/ 目录 |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YYC³ Team. All Rights Reserved.**
</div>

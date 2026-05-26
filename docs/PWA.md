# PWA 专项文档

## 概述

D MusAI 作为 PWA（Progressive Web App）部署，支持安装到桌面、全屏运行、离线体验。全端品牌统一，覆盖 6 个平台图标资源。

## 配置文件

### manifest.json

**路径**: `public/manifest.json`

```json
{
  "name": "D MusAI",
  "short_name": "D MusAI",
  "description": "D MusAI 原创音乐播放器 - 沉浸式 CoverFlow 3D 音乐体验",
  "start_url": "https://music-ai.yyc3.top/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [...],
  "categories": ["music", "entertainment"],
  "lang": "zh-CN"
}
```

### index.html PWA Meta 标签

```html
<meta name="theme-color" content="#000000" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="D MusAI" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/D-brand/ios/AppIcon.appiconset/Icon-App-60x60@3x.png" />
<link rel="apple-touch-icon" sizes="1024x1024" href="/D-brand/ios/AppIcon.appiconset/Icon-App-1024x1024@1x.png" />
```

## 图标资源矩阵

### 资源目录：`public/D-brand/`

| 平台    | 目录                                    | 尺寸范围       | 图标数 |
| ------- | --------------------------------------- | -------------- | ------ |
| Android | `android/mipmap-*`                      | 48px - 512px   | 7      |
| iOS     | `ios/AppIcon.appiconset/`               | 20px - 1024px  | 19     |
| macOS   | `macos/AppIcon.iconset/`                | 16px - 1024px  | 10     |
| Windows | `windows/windows/`                      | 16px - 256px   | 6      |
| tvOS    | `tvos/AppIcon.brandassets/`             | 400px - 2560px | 6      |
| watchOS | `watchos/AppIcon.appiconset/`           | 24px - 1024px  | 10     |

### manifest.json 图标配置

| 用途   | 图标路径         | 尺寸      | 说明         |
| ------ | ---------------- | --------- | ------------ |
| 标准   | `mipmap-mdpi`    | 48x48     | mdpi         |
| 标准   | `mipmap-hdpi`    | 72x72     | hdpi         |
| 标准   | `mipmap-xhdpi`   | 96x96     | xhdpi        |
| 标准   | `mipmap-xxhdpi`  | 144x144   | xxhdpi       |
| 标准   | `mipmap-xxxhdpi` | 192x192   | xxxhdpi      |
| 可遮罩 | `1024x1024`      | 1024x1024 | iOS 适配     |

### favicon 配置

| 尺寸    | 文件                    |
| ------- | ----------------------- |
| 512×512 | `icon_512x512.png`      |
| 32×32   | `icon_32x32.png`        |
| 16×16   | `icon_16x16.png`        |

> 路径前缀：`/D-brand/macos/AppIcon.iconset/`

## 安装方式

### Android Chrome

1. 访问 `https://music-ai.yyc3.top`
2. Chrome 弹出「添加到主屏幕」横幅
3. 点击「安装」→ 应用图标出现在启动器
4. 从启动器打开 → 全屏 standalone 模式

### iOS Safari

1. 访问 `https://music-ai.yyc3.top`
2. 点击 Safari 分享按钮
3. 选择「添加到主屏幕」
4. 确认 → 应用图标出现在主屏幕
5. 从主屏幕打开 → 全屏模式 + 黑色状态栏

### macOS Chrome

1. 访问 `https://music-ai.yyc3.top`
2. 地址栏右侧出现安装图标
3. 点击「安装 D MusAI」→ 应用出现在 Launchpad

### Windows Chrome / Edge

1. 地址栏右侧安装图标
2. 点击「安装」→ 应用出现在开始菜单和桌面

## PWA 特性支持

| 特性         | 状态   | 说明                                  |
| ------------ | ------ | ------------------------------------- |
| 全屏模式     | 已完成 | standalone 无浏览器地址栏             |
| 品牌图标     | 已完成 | 6 平台 58 个图标文件                  |
| 黑色主题     | 已完成 | theme_color + background_color 纯黑   |
| 竖屏锁定     | 已完成 | orientation: portrait-primary         |
| 中文语言     | 已完成 | lang: zh-CN                           |
| 自动播放策略 | 注意   | 首次需用户点击播放按钮                |
| 离线缓存     | 待实现 | 需要 Service Worker                   |
| 推送通知     | 不适用 | 本地播放器无需推送                    |

## 浏览器兼容性

| 浏览器           | manifest | 安装 | Standalone | 测试   |
| ---------------- | -------- | ---- | ---------- | ------ |
| Chrome 90+       | 支持     | 支持 | 支持       | 通过   |
| Safari 15+       | 支持     | 支持 | 支持       | 通过   |
| Edge 90+         | 支持     | 支持 | 支持       | 通过   |
| Firefox 90+      | 支持     | 部分 | 支持       | 部分   |
| Samsung Internet | 支持     | 支持 | 支持       | 通过   |

## 测试清单

### 安装测试

- [ ] Android Chrome 弹出安装横幅
- [ ] iOS Safari「添加到主屏幕」正常
- [ ] macOS Chrome 安装到 Launchpad
- [ ] Windows Edge 安装到开始菜单
- [ ] 安装后图标正确显示 D MusAI 品牌图

### 运行测试

- [ ] Standalone 模式全屏运行（无地址栏）
- [ ] 黑色状态栏 + 黑色背景
- [ ] 竖屏方向锁定
- [ ] 音频播放正常
- [ ] CoverFlow 3D 交互正常
- [ ] 搜索、切歌功能正常
- [ ] 返回主屏幕后重新打开恢复状态

### 视觉测试

- [ ] 启动画面背景黑色
- [ ] 图标无变形无裁切
- [ ] iOS 状态栏透明融合
- [ ] Android 导航栏不遮挡内容

## Service Worker 路线图

当前版本未实现 Service Worker。后续规划：

### 阶段一：基础离线

```text
注册 SW → 缓存 App Shell（HTML/CSS/JS）
→ 离线可打开应用框架
```

### 阶段二：资源缓存

```text
缓存策略：
- 封面图：Cache First + 7天过期
- 音乐文件：用户播放后缓存到 IndexedDB
- CSS/JS：Stale While Revalidate
```

### 阶段三：完整离线体验

```text
所有已播放歌曲离线可用
后台同步播放状态
媒体会话 API 集成（锁屏控制）
```

## 媒体会话 API

用于锁屏 / 通知中心 / 车载系统的播放控制：

```typescript
if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: '奉陪',
    artist: '董小姐 ; 沫言',
    album: '原创音乐集',
    artwork: [{ src: '/D-cover/D-cover-01.jpg', sizes: '512x512', type: 'image/jpeg' }]
  });

  navigator.mediaSession.setActionHandler('play', () => localAudioService.play());
  navigator.mediaSession.setActionHandler('pause', () => localAudioService.pause());
  navigator.mediaSession.setActionHandler('previoustrack', () => { /* 上一曲 */ });
  navigator.mediaSession.setActionHandler('nexttrack', () => { /* 下一曲 */ });
}
```

> 此功能待实现，将作为 Service Worker 阶段三的一部分。

## 部署要求

PWA 正常运行需要：

| 要求       | 说明                                    |
| ---------- | --------------------------------------- |
| HTTPS      | Service Worker 需要安全上下文           |
| 正确 MIME  | manifest.json 需返回 application/json   |
| 图标可访问 | 所有图标路径返回 200                    |
| start_url  | 首页正常加载                            |

> Vercel / Netlify / GitHub Pages 默认满足以上要求。

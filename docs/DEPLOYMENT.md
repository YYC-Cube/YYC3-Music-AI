# 部署指南

## 构建配置

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src/app') },
  },
  server: {
    port: 5180,
    strictPort: true,
  },
})
```

### 本地开发

```bash
pnpm install
pnpm dev
# http://localhost:5180
```

### 生产构建

```bash
pnpm build
pnpm preview
```

## PWA 配置

### manifest.json

位于 `public/manifest.json`，配置应用名称、图标、显示模式。

```json
{
  "name": "D MusAI",
  "short_name": "D MusAI",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000"
}
```

### 图标资源

全端图标位于 `public/D-brand/`：

| 平台 | 目录 | 尺寸 |
|------|------|------|
| Android | `android/mipmap-*` | 48-192px |
| iOS | `ios/AppIcon.appiconset/` | 20-1024px |
| macOS | `macos/AppIcon.iconset/` | 16-1024px |
| Windows | `windows/windows/` | 16-256px |
| tvOS | `tvos/AppIcon.brandassets/` | 400-2560px |
| watchOS | `watchos/AppIcon.appiconset/` | 24-1024px |

## 部署方案

### Vercel（推荐）

```bash
# CLI 部署
npm i -g vercel
vercel login
vercel --prod
```

**vercel.json**:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify

**netlify.toml**:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t d-musai .
docker run -p 8080:80 d-musai
```

### GitHub Pages（当前方案）

自定义域名：`music-ai.yyc3.top`

```bash
# 构建
pnpm build

# 推送到 GitHub
git add . && git commit -m "deploy" && git push origin main
```

**GitHub Pages 配置**：

1. 仓库 Settings → Pages → Source: `main` 分支 / `dist` 目录
2. Custom domain: `music-ai.yyc3.top`
3. 勾选 Enforce HTTPS

**vite.config.ts 需要设置 base**：

```typescript
export default defineConfig({
  base: '/',
  // ...
})
```

### 其他方案

## 部署检查清单

### 部署前

- [ ] `pnpm build` 成功
- [ ] 无 TypeScript 错误
- [ ] manifest.json 配置正确
- [ ] 图标资源完整
- [ ] 音频文件可访问
- [ ] 封面图片可访问

### 部署后

- [ ] 应用可访问
- [ ] 音频播放正常
- [ ] 封面显示正常
- [ ] 搜索功能正常
- [ ] 切歌功能正常
- [ ] PWA 安装正常
- [ ] 移动端适配正常

## 性能优化

| 优化项 | 说明 |
|--------|------|
| 代码分割 | Vite 自动 code splitting |
| 静态资源 | MP3/JPG 通过 CDN 分发 |
| 缓存 | 静态资源设置长缓存 |
| 压缩 | 启用 Brotli/Gzip |
| PWA | 离线缓存支持 |

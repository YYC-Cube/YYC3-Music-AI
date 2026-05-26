# 架构文档

## 系统架构

```text
┌──────────────────────────────────────────────────────┐
│                      UI 层                            │
│  ┌────────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │ SearchBar  │ │ CoverFlow  │ │     Player       │  │
│  │ 搜索防抖   │ │ 3D封面流   │ │ 播放/切歌/音量   │  │
│  └────────────┘ └────────────┘ └──────────────────┘  │
├──────────────────────────────────────────────────────┤
│                   应用逻辑层                          │
│  App.tsx                                              │
│  · 状态管理: songs / selectedSong / currentIndex     │
│  · 歌曲切换: handleSongSelect / handleSongChange     │
│  · 搜索过滤: handleSearch / fetchSongs               │
├──────────────────────────────────────────────────────┤
│                     服务层                            │
│  ┌───────────────────┐  ┌─────────────────────────┐  │
│  │ localAudioService │  │   localAlbumService     │  │
│  │ · loadId 竞态控制  │  │ · 歌曲数据库查询        │  │
│  │ · 播放/暂停/切歌   │  │ · 搜索/过滤/随机        │  │
│  │ · 音量/模式/静音   │  │ · 情绪分类              │  │
│  └───────────────────┘  └─────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│                     数据层                            │
│  ┌───────────────────┐  ┌─────────────────────────┐  │
│  │ albumsDatabase.ts │  │     本地资源             │  │
│  │ · 11首原创音乐    │  │ · /D-Music/*.mp3        │  │
│  │ · Song 类型定义   │  │ · /D-cover/*.jpg        │  │
│  └───────────────────┘  │ · /D-poster/*.jpg       │  │
│                          │ · /D-brand/*            │  │
│                          └─────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## 组件关系图

```text
App.tsx
├── SearchBar
│   └── onSearch → fetchSongs()
│
├── CoverFlow
│   ├── songs[] + selectedSong + isPlaying
│   ├── onSongSelect → handleSongSelect()
│   └── useResponsive (响应式尺寸)
│
└── Player
    ├── audioPath + songs[] + currentIndex
    ├── onPlayingChange → setIsPlaying()
    └── onSongChange → handleSongChange()
```

## 数据流

### 歌曲加载

```text
用户访问 → fetchSongs() → localAlbumService.getTrendingSongs()
→ ALBUMS_DATABASE → setSongs() → CoverFlow 渲染
```

### 歌曲播放

```text
用户选择歌曲 → handleSongSelect(song)
→ setSelectedSong + setCurrentIndex
→ Player 接收 audioPath
→ localAudioService.loadAudio(path)
→ encodeURI + replace(';','%3B')
→ HTML5 Audio 加载 → 播放
```

### 歌曲切换

```text
用户点击下一曲 → Player.doNext()
→ getNextIndex(根据播放模式)
→ onSongChange(song, index)
→ App.handleSongChange → setSelectedSong + setCurrentIndex
→ Player audioPath 变化 → useEffect 触发重新加载
→ localAudioService.loadAudio() → stop旧音频 → 加载新音频
```

### 歌曲结束自动切歌

```text
Audio ended 事件 → localAudioService.onSongEnd 回调
→ Player.getNextIndex() → onSongChange()
```

## 状态管理

```text
App.tsx (单一状态源)
├── songs: Song[]             歌曲列表
├── selectedSong: Song | null 当前歌曲
├── loading: boolean          加载状态
├── error: string | null      错误信息
├── isPlaying: boolean        播放状态
├── currentIndex: number      CoverFlow 索引
└── searchQuery: string       搜索关键词
```

## localAudioService 核心设计

### loadId 竞态控制

```text
每次 loadAudio() 调用递增 loadId
Promise 回调检查 myId === this.loadId
过期回调自动忽略，防止快速切歌时状态混乱
```

### 彻底资源释放

```typescript
stop() {
  audio.pause()
  audio.removeAttribute('src')
  audio.load()
  audio = null
}
```

### 播放模式

| 模式     | 标识          | 行为                       |
| -------- | ------------- | -------------------------- |
| 顺序播放 | `sequential`  | 播放下一首，到末尾停止     |
| 列表循环 | `repeat-all`  | 末尾回到第一首继续播放     |
| 单曲循环 | `repeat-one`  | 重播当前歌曲               |
| 随机播放 | `shuffle`     | 随机选择不同歌曲           |

## 响应式架构

### 流式自适应（取消固定 iPad 尺寸）

```text
useResponsive() 基于视口宽度动态计算所有尺寸：

封面大小: clamp(120, width × 0.18, 220)
间距:     clamp(80, width × 0.15, 180)
容器高度: mobile 280px / desktop 384px
播放按钮: mobile 56px / desktop 64px
控制按钮: mobile 40px / desktop 44px
进度条:   mobile 6px / desktop 4px

断点: < 640px = mobile | 640-1024 = tablet | ≥ 1024 = desktop
```

### CoverFlow 动态参数

```text
albumSize: 基于视口宽度计算，不再使用固定 170/200
spacing: 替代固定 SPACING 120/160
containerHeight: 替代固定 h-96 (384px)
```

### Player 动态参数

```text
playBtnSize: 播放按钮直径
ctrlBtnSize: 上一曲/下一曲/音量按钮尺寸
iconSize: SVG 图标尺寸
modeIconSize: 播放模式图标尺寸
gap: 按钮间距
```

## 性能优化

### CoverFlow

- z-index 分层：中心 2000，相邻递减
- 拖拽时禁用 CSS transition
- requestAnimationFrame 平滑动画
- 速度检测 + 惯性滚动

### 音频

- 每次切歌彻底释放旧 Audio 对象
- 250ms 间隔更新进度条
- 拖拽进度条时暂停更新，松开后 seek

### 搜索

- 500ms 防抖减少不必要渲染

## 技术债务

| 项目         | 影响               | 优先级 |
| ------------ | ------------------ | ------ |
| MUI 依赖冗余 | Bundle 体积增大    | P2     |
| 缺少错误边界 | 组件崩溃无恢复     | P1     |
| 无持久化缓存 | 每次加载重建状态   | P3     |

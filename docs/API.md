# API 文档

## localAudioService

核心音频引擎，基于 HTML5 Audio API 实现。

**文件**: `src/app/services/localAudioService.ts`

### 类：LocalAudioService

单例导出：`localAudioService`

### 方法

#### loadAudio(path: string): Promise\<void\>

加载音频文件。

```typescript
await localAudioService.loadAudio('/D-Music/董小姐 - 岁月如歌.mp3');
```

| 行为 | 说明 |
|------|------|
| 竞态控制 | 每次调用递增 loadId，过期回调自动忽略 |
| 资源释放 | 先 stop() 旧音频（pause + removeAttribute('src') + load） |
| 路径编码 | `encodeURI(path).replace(/;/g, '%3B')` |
| 超时 | 15 秒加载超时 |

错误码：

| 错误码 | 含义 |
|--------|------|
| 1 | 加载被中止 |
| 2 | 网络错误 |
| 3 | 解码失败 |
| 4 | 格式不支持 |

#### play(): Promise\<void\>

播放当前音频。需先 loadAudio 成功。

#### pause(): void

暂停播放。

#### togglePlay(): Promise\<boolean\>

切换播放/暂停。返回当前是否播放中。

#### seek(time: number): void

跳转到指定时间（秒）。

#### setVolume(v: number): void

设置音量（0-1）。

#### toggleMute(): boolean

切换静音。返回当前是否静音。

#### cyclePlayMode(): PlayMode

循环切换播放模式：`sequential → repeat-all → repeat-one → shuffle → sequential`

#### onStateChange(cb: (playing: boolean) => void): () => void

订阅播放状态变化。返回取消订阅函数。

#### onSongEnd(cb: () => void): () => void

订阅歌曲播放结束事件。返回取消订阅函数。

### 获取器

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| getIsPlaying() | boolean | 是否正在播放 |
| getIsReady() | boolean | 音频是否就绪 |
| getCurrentTime() | number | 当前播放时间（秒） |
| getDuration() | number | 总时长（秒） |
| getVolume() | number | 当前音量（0-1） |
| getIsMuted() | boolean | 是否静音 |
| getPlayMode() | PlayMode | 当前播放模式 |

### 类型

```typescript
type PlayMode = 'sequential' | 'shuffle' | 'repeat-one' | 'repeat-all';
```

---

## localAlbumService

歌曲数据服务，提供数据库查询功能。

**文件**: `src/app/services/localAlbumService.ts`

### 方法

| 方法 | 返回 | 说明 |
|------|------|------|
| getTrendingSongs() | Song[] | 获取全部歌曲 |
| searchSongs(query) | Song[] | 按歌手/歌曲名搜索 |
| getSongsByArtist(artist) | Song[] | 按歌手过滤 |
| getRandomSelection(count) | Song[] | 随机选取 |
| getSongById(id) | Song \| null | 按 ID 查询 |
| getTotalSongCount() | number | 歌曲总数 |

---

## 数据结构

### Song 类型

```typescript
interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  audioPath: string;
  posterPath?: string;
  albumName?: string;
  year?: number;
}
```

### AlbumData 类型

```typescript
interface AlbumData {
  id: string;
  title: string;
  artist: string;
  audioPath: string;
  albumCover: string;
  posterPath?: string;
  albumName?: string;
  year?: number;
}
```

### 数据库示例

```typescript
{
  id: '1',
  title: '奉陪',
  artist: '董小姐 ; 沫言',
  audioPath: '/D-Music/董小姐 ; 沫言 - 奉陪.mp3',
  albumCover: '/D-cover/D-cover-01.jpg',
  posterPath: '/D-poster/D-poster-01.jpg',
  albumName: '原创音乐集',
  year: 2026
}
```

---

## 本地资源路径规范

| 资源 | 路径 | 格式 |
|------|------|------|
| 音乐文件 | `/D-Music/{歌手} - {歌名}.mp3` | MP3 |
| 专辑封面 | `/D-cover/D-cover-{序号}.jpg` | JPG |
| 艺人海报 | `/D-poster/D-poster-{序号}.jpg` | JPG |
| 品牌图标 | `/D-brand/{平台}/...` | PNG |

### 路径编码规则

- 使用 `encodeURI()` 编码中文和空格
- 分号 `;` 额外编码为 `%3B`（因为 `;` 是 URL 路径参数分隔符）
- 歌手合作使用分号分隔（如 `董小姐 ; 沫言`）

export interface AlbumData {
  id: string;
  title: string;
  artist: string;
  audioPath: string;
  albumCover: string;
  posterPath?: string;
  albumName?: string;
  year?: number;
}

// 董小姐原创音乐数据库 - 使用本地音频、封面和海报资源
// Last update: 2026-05-26
export const ALBUMS_DATABASE: AlbumData[] = [
  {
    id: '1',
    title: '奉陪',
    artist: '董小姐 ; 沫言',
    audioPath: '/D-Music/董小姐 ; 沫言 - 奉陪.mp3',
    albumCover: '/D-cover/D-cover-01.jpg',
    posterPath: '/D-poster/D-poster-01.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '2',
    title: '岁月如歌',
    artist: '董小姐 ; 沫言',
    audioPath: '/D-Music/董小姐 ; 沫言 - 岁月如歌.mp3',
    albumCover: '/D-cover/D-cover-02.jpg',
    posterPath: '/D-poster/D-poster-02.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '3',
    title: '时光',
    artist: '董小姐 ; 沫言',
    audioPath: '/D-Music/董小姐 ; 沫言 - 时光.mp3',
    albumCover: '/D-cover/D-cover-03.jpg',
    posterPath: '/D-poster/D-poster-03.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '4',
    title: '浮生如渡',
    artist: '董小姐 ; 沫言',
    audioPath: '/D-Music/董小姐 ; 沫言 - 浮生如渡.mp3',
    albumCover: '/D-cover/D-cover-04.jpg',
    posterPath: '/D-poster/D-poster-04.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '5',
    title: '渡心时序',
    artist: '董小姐 ; 沫言',
    audioPath: '/D-Music/董小姐 ; 沫言 - 渡心时序.mp3',
    albumCover: '/D-cover/D-cover-05.jpg',
    posterPath: '/D-poster/D-poster-05.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '6',
    title: '岁月如歌',
    artist: '董小姐',
    audioPath: '/D-Music/董小姐 - 岁月如歌.mp3',
    albumCover: '/D-cover/D-cover-06.jpg',
    posterPath: '/D-poster/D-poster-06.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '7',
    title: '我是渡船也是过客',
    artist: '董小姐',
    audioPath: '/D-Music/董小姐 - 我是渡船也是过客.mp3',
    albumCover: '/D-cover/D-cover-07.jpg',
    posterPath: '/D-poster/D-poster-01.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '8',
    title: '我的宝贝',
    artist: '董小姐',
    audioPath: '/D-Music/董小姐 - 我的宝贝.mp3',
    albumCover: '/D-cover/D-cover-01.jpg',
    posterPath: '/D-poster/D-poster-02.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '9',
    title: '秋风不问梧桐意',
    artist: '董小姐',
    audioPath: '/D-Music/董小姐 - 秋风不问梧桐意.mp3',
    albumCover: '/D-cover/D-cover-02.jpg',
    posterPath: '/D-poster/D-poster-03.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '10',
    title: '过客',
    artist: '董小姐',
    audioPath: '/D-Music/董小姐 - 过客.mp3',
    albumCover: '/D-cover/D-cover-03.jpg',
    posterPath: '/D-poster/D-poster-04.jpg',
    albumName: '原创音乐集',
    year: 2026
  },
  {
    id: '11',
    title: '除了你',
    artist: '董小姐',
    audioPath: '/D-Music/董小姐 - 除了你.mp3',
    albumCover: '/D-cover/D-cover-04.jpg',
    posterPath: '/D-poster/D-poster-05.jpg',
    albumName: '原创音乐集',
    year: 2026
  }
];

// Helper functions for database operations
export const getAlbumById = (id: string): AlbumData | undefined => {
  return ALBUMS_DATABASE.find(album => album.id === id);
};

export const getAlbumsByArtist = (artist: string): AlbumData[] => {
  return ALBUMS_DATABASE.filter(album => 
    album.artist.toLowerCase().includes(artist.toLowerCase())
  );
};

export const searchAlbums = (query: string): AlbumData[] => {
  const lowerQuery = query.toLowerCase();
  return ALBUMS_DATABASE.filter(album =>
    album.title.toLowerCase().includes(lowerQuery) ||
    album.artist.toLowerCase().includes(lowerQuery) ||
    (album.albumName && album.albumName.toLowerCase().includes(lowerQuery))
  );
};

export const getAllAlbums = (): AlbumData[] => {
  return ALBUMS_DATABASE;
};

// Get random subset of albums
export const getRandomAlbums = (count: number): AlbumData[] => {
  const shuffled = [...ALBUMS_DATABASE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

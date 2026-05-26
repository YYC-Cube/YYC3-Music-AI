import { useEffect, useState } from 'react';
import { CoverFlow } from './components/CoverFlow';
import { Player } from './components/Player';
import { SearchBar } from './components/SearchBar';
import { localAlbumService } from './services/localAlbumService';
import { Song } from './types/Song';

export default function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Load songs from local database
  const loadSongs = async (query: string = ''): Promise<Song[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));

    if (!query.trim()) {
      return localAlbumService.getTrendingSongs();
    } else {
      return localAlbumService.searchSongs(query);
    }
  };

  const fetchSongs = async (query: string = '') => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const songsData = await loadSongs(query);
      setSongs(songsData);
      setCurrentIndex(Math.floor(songsData.length / 2));
      setLoading(false);
    } catch (err) {
      setError('Failed to load songs');
      setSongs([]);
      setCurrentIndex(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Set initial selected song to middle track when songs load
  useEffect(() => {
    if (songs.length > 0 && !selectedSong) {
      const middleIndex = Math.floor(songs.length / 2);
      setSelectedSong(songs[middleIndex]);
      setIsPlaying(true);
    }
  }, [songs, selectedSong]);

  const handleSearch = (query: string) => {
    fetchSongs(query);
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    setIsPlaying(false);
    const index = songs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  const handlePlayingChange = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const handleSongChange = (song: Song, index: number) => {
    setSelectedSong(song);
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const totalSongsCount = localAlbumService.getTotalSongCount();
  const displayText = searchQuery
    ? `搜索 "${searchQuery}" 的结果 (${songs.length}首)`
    : `原创音乐 ${totalSongsCount}首`;

  return (
    <div
      className="h-screen text-white overflow-hidden relative"
      style={{
        background: 'linear-gradient(to bottom, #000000 0%, #111111 100%)',
        zIndex: 1,
        position: 'relative',
        width: '100vw',
        height: '100vh',
        isolation: 'isolate'
      }}
    >
      {/* Reflective floor */}
      <div
        className="fixed bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.02) 0%, transparent 100%)',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'bottom',
          zIndex: 1
        }}
      />

      {/* 头部 D-brand 标志 */}
      <div className="relative flex items-center justify-between p-4 bg-black/20 backdrop-blur-md" style={{ zIndex: 500 }}>
        <div className="flex items-center gap-2">
          <img src="/D-brand/macos/AppIcon.iconset/icon_32x32.png" alt="D-Brand" className="w-8 h-8 object-contain" />
          <span className="text-sm font-medium tracking-wide text-gray-300">D MusAI</span>
        </div>
        <div className="text-sm font-medium text-gray-300">
          {loading ? '加载中...' : displayText}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-sm shadow-sm"></div>
          <div className="text-xs text-gray-400">100%</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative p-4" style={{ zIndex: 450 }}>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* 主内容区 */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 md:px-8 pb-16" style={{ zIndex: 200, height: 'calc(100vh - 140px)' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            <span className="text-gray-300">正在加载歌曲...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>{error}</p>
            <button
              onClick={() => fetchSongs()}
              className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              重试
            </button>
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>未找到 "{searchQuery}" 的相关歌曲</p>
            <button
              onClick={() => fetchSongs()}
              className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              显示全部歌曲
            </button>
          </div>
        ) : (
          <>
            <CoverFlow
              songs={songs}
              onSongSelect={handleSongSelect}
              selectedSong={selectedSong}
              isPlaying={isPlaying}
            />

            {selectedSong && (
              <div className="mt-8 text-center relative" style={{ zIndex: 250 }}>
                <div className="bg-transparent p-2">
                  <h2 className="text-xl font-light mb-2 text-white drop-shadow-lg">
                    {selectedSong.title}
                  </h2>
                  <p className="text-base mb-1 font-light text-gray-300 drop-shadow-md">
                    {selectedSong.artist}
                  </p>
                  {selectedSong.albumName && (
                    <p className="text-sm mb-4 font-light text-gray-400 drop-shadow-md">
                      from {selectedSong.albumName} {selectedSong.year && `(${selectedSong.year})`}
                    </p>
                  )}
                  <Player
                    audioPath={selectedSong.audioPath}
                    posterPath={selectedSong.posterPath}
                    songs={songs}
                    currentIndex={currentIndex}
                    onPlayingChange={handlePlayingChange}
                    onSongChange={handleSongChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

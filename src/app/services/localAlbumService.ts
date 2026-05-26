import { Song } from '../types/Song';
import { 
  ALBUMS_DATABASE, 
  getAllAlbums, 
  getAlbumsByArtist, 
  searchAlbums,
  getRandomAlbums,
  AlbumData 
} from '../data/albumsDatabase';

// Convert AlbumData to Song interface
const convertAlbumToSong = (album: AlbumData): Song => {
  return {
    id: album.id,
    title: album.title,
    artist: album.artist,
    albumCover: album.albumCover,
    audioPath: album.audioPath,
    posterPath: album.posterPath,
    albumName: album.albumName,
    year: album.year
  };
};

class LocalAlbumService {
  // Get all original songs
  getTrendingSongs(): Song[] {
    return getAllAlbums().map(convertAlbumToSong);
  }

  // Search for songs by artist or title
  searchSongs(query: string): Song[] {
    if (!query.trim()) {
      return this.getTrendingSongs();
    }

    const results = searchAlbums(query);
    
    // If no results found, return a subset of songs
    if (results.length === 0) {
      return getRandomAlbums(10).map(convertAlbumToSong);
    }

    return results.map(convertAlbumToSong);
  }

  // Get songs by specific artist
  getSongsByArtist(artist: string): Song[] {
    if (!artist.trim()) {
      return this.getTrendingSongs();
    }

    const results = getAlbumsByArtist(artist);
    
    // If no results found, return all songs
    if (results.length === 0) {
      return this.getTrendingSongs();
    }

    return results.map(convertAlbumToSong);
  }

  // Get a random selection of songs
  getRandomSelection(count: number = 10): Song[] {
    return getRandomAlbums(count).map(convertAlbumToSong);
  }

  // Get song by ID
  getSongById(id: string): Song | null {
    const album = ALBUMS_DATABASE.find(a => a.id === id);
    return album ? convertAlbumToSong(album) : null;
  }

  // Get songs for specific genres or moods
  getSongsByMood(mood: string): Song[] {
    const moodKeywords: Record<string, string[]> = {
      '合作': ['董小姐 & 沫言', '沫言'],
      '独唱': ['董小姐'],
      '抒情': ['岁月如歌', '浮生如渡', '渡心时序', '过客'],
      '温暖': ['我的宝贝', '时光', '奉陪']
    };

    const keywords = moodKeywords[mood.toLowerCase()] || [];
    
    if (keywords.length === 0) {
      return this.getRandomSelection(8);
    }

    const filtered = ALBUMS_DATABASE.filter(album =>
      keywords.some(keyword =>
        album.artist.toLowerCase().includes(keyword.toLowerCase()) ||
        album.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    return filtered.length > 0 
      ? filtered.map(convertAlbumToSong)
      : this.getRandomSelection(8);
  }

  // Get total count of available songs
  getTotalSongCount(): number {
    return ALBUMS_DATABASE.length;
  }
}

export const localAlbumService = new LocalAlbumService();

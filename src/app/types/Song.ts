export interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  audioPath: string;
  posterPath?: string;
  albumName?: string;
  year?: number;
}

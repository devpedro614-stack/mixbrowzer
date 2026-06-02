export interface Music {
  id: string;
  user_id: string;
  name: string;
  artist: string;
  genre: string;
  rating: number;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MusicFormData {
  name: string;
  artist: string;
  genre: string;
  rating: number;
  url: string;
}

export interface MusicFilters {
  search: string;
  genre: string;
  artist: string;
}

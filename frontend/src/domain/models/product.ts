export type Category =
  | "ANIME"
  | "COMICS"
  | "GAMING"
  | "MERCHANDISE"
  | "COLLECTIBLES"
  | "BOARD_GAMES"
  | "MANGA"
  | "MOVIES"
  | "COSPLAY";

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
}

interface AnimeMetadata {
  regionCode?: string;
  episodes?: number;
}

interface ComicsMetadata {
  issueNumber?: number;
  publisher?: string;
}

interface GamingMetadata {
  platform?: string;
  edition?: string;
}

interface MerchandiseMetadata {
  size?: string;
  material?: string;
  brand?: string;
}

interface CollectiblesMetadata {
  rarity?: string;
  condition?: string;
  releaseYear?: number;
}

interface BoardGamesMetadata {
  players?: string;
  playTime?: string;
  complexity?: string;
}

interface MangaMetadata {
  volume?: number;
  author?: string;
  publisher?: string;
}

interface MoviesMetadata {
  duration?: number;
  director?: string;
  releaseYear?: number;
}

interface CosplayMetadata {
  size?: string;
  character?: string;
  franchise?: string;
}

type MetadataMap = {
  ANIME: AnimeMetadata;
  COMICS: ComicsMetadata;
  GAMING: GamingMetadata;
  MERCHANDISE: MerchandiseMetadata;
  COLLECTIBLES: CollectiblesMetadata;
  BOARD_GAMES: BoardGamesMetadata;
  MANGA: MangaMetadata;
  MOVIES: MoviesMetadata;
  COSPLAY: CosplayMetadata;
};

export interface ProductWithCategory<T extends Category = Category>
  extends Product {
  category: T;
  metadata?: MetadataMap[T];
}

export type AnimeProduct = ProductWithCategory<"ANIME">;
export type ComicsProduct = ProductWithCategory<"COMICS">;
export type GamingProduct = ProductWithCategory<"GAMING">;
export type MerchandiseProduct = ProductWithCategory<"MERCHANDISE">;
export type CollectiblesProduct = ProductWithCategory<"COLLECTIBLES">;
export type BoardGamesProduct = ProductWithCategory<"BOARD_GAMES">;
export type MangaProduct = ProductWithCategory<"MANGA">;
export type MoviesProduct = ProductWithCategory<"MOVIES">;
export type CosplayProduct = ProductWithCategory<"COSPLAY">;

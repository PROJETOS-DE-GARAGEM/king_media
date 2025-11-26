const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYzQ3ZWE5NmM5NTM3OTE1YzI4NjU2N2U5ZjVlZmIyNyIsIm5iZiI6MTc0MDM0MTQ3Mi4wNTEsInN1YiI6IjY3YmI4MGUwNDdiNzc2ZjMyODQ2NWVhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eRAcRabWE8_9ieGbyKpCao1u3nE7stPsaOKV9NV9xhE";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
}

export interface TMDBResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  runtime: number;
  vote_average: number;
}

export interface SeasonDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: Episode[];
  air_date: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface MediaDetails extends MediaItem {
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  status: string;
  seasons?: Season[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideosResponse {
  results: Video[];
}

// Função para buscar lançamentos (filmes e séries recentes)
export const getNewReleases = async (): Promise<MediaItem[]> => {
  try {
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${BASE_URL}/movie/now_playing?language=pt-BR&page=1`, options),
      fetch(`${BASE_URL}/tv/on_the_air?language=pt-BR&page=1`, options),
    ]);

    const moviesData: TMDBResponse = await moviesResponse.json();
    const tvData: TMDBResponse = await tvResponse.json();

    // Combinar e ordenar por data de lançamento
    const combined = [...moviesData.results, ...tvData.results];
    return combined.slice(0, 20);
  } catch (error) {
    console.error("Erro ao buscar lançamentos:", error);
    return [];
  }
};

// Função para buscar filmes populares
export const getPopularMovies = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?language=pt-BR&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [];
  }
};

// Função para buscar séries populares
export const getPopularTVShows = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?language=pt-BR&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    return [];
  }
};

// Função para buscar animes (séries de animação japonesas)
export const getAnimes = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/tv?language=pt-BR&with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar animes:", error);
    return [];
  }
};

// Função para buscar novelas (dramas/soap operas)
export const getSoapOperas = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/tv?language=pt-BR&with_genres=18&with_origin_country=BR|MX|CO&sort_by=popularity.desc&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar novelas:", error);
    return [];
  }
};

// Função para buscar documentários
export const getDocumentaries = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?language=pt-BR&with_genres=99&sort_by=popularity.desc&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar documentários:", error);
    return [];
  }
};

// Função para buscar novelas/dramas (séries dramáticas)
export const getDramas = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/tv?language=pt-BR&with_genres=18&sort_by=popularity.desc&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar dramas:", error);
    return [];
  }
};

// Função para buscar filmes de ação
export const getActionMovies = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?language=pt-BR&with_genres=28&sort_by=popularity.desc&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar filmes de ação:", error);
    return [];
  }
};

// Função para buscar comédias
export const getComedies = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?language=pt-BR&with_genres=35&sort_by=popularity.desc&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar comédias:", error);
    return [];
  }
};

// Função para buscar filmes de terror
export const getHorrorMovies = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?language=pt-BR&with_genres=27&sort_by=popularity.desc&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar filmes de terror:", error);
    return [];
  }
};

// Função auxiliar para obter URL completa da imagem
export const getImageUrl = (path: string | null): string => {
  if (!path) return "https://via.placeholder.com/500x750.png?text=Sem+Imagem";
  return `${IMAGE_BASE_URL}${path}`;
};

// Função auxiliar para obter o título (funciona para filmes e séries)
export const getTitle = (item: MediaItem): string => {
  return item.title || item.name || "Sem título";
};

// Mapa de gêneros do TMDB
export const genreMap: { [key: number]: string } = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  10770: "Filme de TV",
  53: "Suspense",
  10752: "Guerra",
  37: "Faroeste",
  10759: "Ação & Aventura",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

// Função para obter os gêneros como string
export const getGenres = (genreIds: number[]): string => {
  if (!genreIds || genreIds.length === 0) return "Sem gênero";
  const genres = genreIds
    .slice(0, 2)
    .map((id) => genreMap[id] || "Desconhecido");
  return genres.join(" / ");
};

// Função para buscar detalhes de uma temporada com episódios
export const getSeasonDetails = async (
  tvId: number,
  seasonNumber: number
): Promise<SeasonDetails | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?language=pt-BR`,
      options
    );
    const data: SeasonDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar detalhes da temporada:", error);
    return null;
  }
};

// Função para buscar detalhes de um filme
export const getMovieDetails = async (
  movieId: number
): Promise<MediaDetails | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?language=pt-BR`,
      options
    );
    const data: MediaDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do filme:", error);
    return null;
  }
};

// Função para buscar detalhes de uma série
export const getTVShowDetails = async (
  tvId: number
): Promise<MediaDetails | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}?language=pt-BR`,
      options
    );
    const data: MediaDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar detalhes da série:", error);
    return null;
  }
};

// Função para buscar vídeos/trailers de um filme
export const getMovieVideos = async (movieId: number): Promise<Video[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?language=pt-BR`,
      options
    );
    const data: VideosResponse = await response.json();

    // Se não houver vídeos em PT-BR, buscar em inglês
    if (data.results.length === 0) {
      const responseEN = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?language=en-US`,
        options
      );
      const dataEN: VideosResponse = await responseEN.json();
      return dataEN.results;
    }

    return data.results;
  } catch (error) {
    console.error("Erro ao buscar vídeos do filme:", error);
    return [];
  }
};

// Função para buscar vídeos/trailers de uma série
export const getTVShowVideos = async (tvId: number): Promise<Video[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}/videos?language=pt-BR`,
      options
    );
    const data: VideosResponse = await response.json();

    // Se não houver vídeos em PT-BR, buscar em inglês
    if (data.results.length === 0) {
      const responseEN = await fetch(
        `${BASE_URL}/tv/${tvId}/videos?language=en-US`,
        options
      );
      const dataEN: VideosResponse = await responseEN.json();
      return dataEN.results;
    }

    return data.results;
  } catch (error) {
    console.error("Erro ao buscar vídeos da série:", error);
    return [];
  }
};

// Função para obter o trailer principal
export const getMainTrailer = (videos: Video[]): Video | null => {
  // Priorizar trailers oficiais do YouTube
  const trailer = videos.find(
    (video) =>
      video.site === "YouTube" && video.type === "Trailer" && video.official
  );

  if (trailer) return trailer;

  // Se não houver trailer oficial, pegar qualquer trailer
  const anyTrailer = videos.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return anyTrailer || null;
};

// Função para buscar filmes similares
export const getSimilarMovies = async (
  movieId: number
): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?language=pt-BR&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results.slice(0, 10);
  } catch (error) {
    console.error("Erro ao buscar filmes similares:", error);
    return [];
  }
};

// Função para buscar séries similares
export const getSimilarTVShows = async (tvId: number): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}/similar?language=pt-BR&page=1`,
      options
    );
    const data: TMDBResponse = await response.json();
    return data.results.slice(0, 10);
  } catch (error) {
    console.error("Erro ao buscar séries similares:", error);
    return [];
  }
};

// Função para buscar recomendações personalizadas baseadas em filmes assistidos
export const getRecommendationsForUser = async (
  watchedMediaIds: { id: number; type: "movie" | "tv" }[]
): Promise<MediaItem[]> => {
  try {
    if (watchedMediaIds.length === 0) {
      // Se não tiver nada assistido, retornar populares
      return await getPopularMovies();
    }

    // Pegar os 3 últimos filmes/séries assistidos
    const recentMedia = watchedMediaIds.slice(-3);

    const allRecommendations: MediaItem[] = [];

    // Buscar similares para cada um
    for (const media of recentMedia) {
      if (media.type === "movie") {
        const similar = await getSimilarMovies(media.id);
        allRecommendations.push(...similar);
      } else {
        const similar = await getSimilarTVShows(media.id);
        allRecommendations.push(...similar);
      }
    }

    // Remover duplicatas
    const uniqueRecommendations = allRecommendations.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    // Remover itens que já foram assistidos
    const filteredRecommendations = uniqueRecommendations.filter(
      (item) => !watchedMediaIds.find((watched) => watched.id === item.id)
    );

    return filteredRecommendations.slice(0, 20);
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);
    return [];
  }
};

import { themas } from "@/global/themas";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CardSeries from "../../components/CardSeries";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import {
  getAnimes,
  getDocumentaries,
  getGenres,
  getImageUrl,
  getNewReleases,
  getPopularMovies,
  getPopularTVShows,
  getRecommendationsForUser,
  getSoapOperas,
  getTitle,
  MediaItem,
} from "../../services/tmdb";
import { getUserMedia } from "../../services/userMedia";
import styles from "./style";

type CategoryFilter =
  | "todos"
  | "lancamentos"
  | "filmes"
  | "series"
  | "animes"
  | "novelas"
  | "documentarios";

export default function Home() {
  const router = useRouter();
  const [newReleases, setNewReleases] = useState<MediaItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tvShows, setTVShows] = useState<MediaItem[]>([]);
  const [animes, setAnimes] = useState<MediaItem[]>([]);
  const [soapOperas, setSoapOperas] = useState<MediaItem[]>([]);
  const [documentaries, setDocumentaries] = useState<MediaItem[]>([]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("todos");

  // Estatísticas do usuário
  const [stats, setStats] = useState({
    totalItems: 0,
    watching: 0,
    completed: 0,
    wantToWatch: 0,
    favoriteGenre: "N/A",
  });

  useEffect(() => {
    loadContent();
  }, []);

  // Recarregar estatísticas sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadUserStats();
    }, [])
  );

  const loadUserStats = async () => {
    try {
      const userMedia = await getUserMedia();

      // Calcular estatísticas
      const totalItems = userMedia.length;
      const watching = userMedia.filter(
        (item) => item.status === "assistindo"
      ).length;
      const completed = userMedia.filter(
        (item) => item.status === "assistido"
      ).length;
      const wantToWatch = userMedia.filter(
        (item) => item.status === "quero_assistir"
      ).length;

      // Calcular gênero favorito
      const genreCounts: { [key: string]: number } = {};
      userMedia.forEach((item) => {
        if (item.genres && Array.isArray(item.genres)) {
          item.genres.forEach((genre) => {
            if (genre) {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            }
          });
        }
      });

      const favoriteGenre =
        Object.keys(genreCounts).length > 0
          ? Object.entries(genreCounts).sort(([, a], [, b]) => b - a)[0][0]
          : "N/A";

      setStats({
        totalItems,
        watching,
        completed,
        wantToWatch,
        favoriteGenre,
      });

      // Carregar recomendações baseadas no que foi assistido
      const watchedMedia = userMedia
        .filter((item) => item.status === "assistido")
        .map((item) => ({ id: item.mediaId, type: item.mediaType }));

      if (watchedMedia.length > 0) {
        const recs = await getRecommendationsForUser(watchedMedia);
        setRecommendations(recs);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const [
        newReleasesData,
        moviesData,
        tvShowsData,
        animesData,
        soapOperasData,
        documentariesData,
      ] = await Promise.all([
        getNewReleases(),
        getPopularMovies(),
        getPopularTVShows(),
        getAnimes(),
        getSoapOperas(),
        getDocumentaries(),
      ]);

      setNewReleases(newReleasesData);
      setMovies(moviesData);
      setTVShows(tvShowsData);
      setAnimes(animesData);
      setSoapOperas(soapOperasData);
      setDocumentaries(documentariesData);
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: "todos", label: "Todos" },
    { key: "lancamentos", label: "Lançamentos" },
    { key: "filmes", label: "Filmes" },
    { key: "series", label: "Séries" },
    { key: "animes", label: "Animes" },
    { key: "novelas", label: "Novelas" },
    { key: "documentarios", label: "Documentários" },
  ];

  // Função para filtrar itens com base na pesquisa
  const filterBySearch = (items: MediaItem[]): MediaItem[] => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const title = getTitle(item).toLowerCase();
      return title.includes(query);
    });
  };

  // Aplicar filtro de pesquisa
  const filteredNewReleases = filterBySearch(newReleases);
  const filteredMovies = filterBySearch(movies);
  const filteredTVShows = filterBySearch(tvShows);
  const filteredAnimes = filterBySearch(animes);
  const filteredSoapOperas = filterBySearch(soapOperas);
  const filteredDocumentaries = filterBySearch(documentaries);

  // Combinar todos os resultados da pesquisa
  const getAllSearchResults = (): MediaItem[] => {
    if (!searchQuery.trim()) return [];

    const allResults = [
      ...filteredNewReleases.map((item) => ({
        ...item,
        category: "Lançamentos",
      })),
      ...filteredMovies.map((item) => ({
        ...item,
        category: "Filmes Populares",
      })),
      ...filteredTVShows.map((item) => ({
        ...item,
        category: "Séries Populares",
      })),
      ...filteredAnimes.map((item) => ({ ...item, category: "Animes" })),
      ...filteredSoapOperas.map((item) => ({ ...item, category: "Novelas" })),
      ...filteredDocumentaries.map((item) => ({
        ...item,
        category: "Documentários",
      })),
    ];

    // Remover duplicatas baseado no ID
    const uniqueResults = allResults.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    return uniqueResults;
  };

  const searchResults = getAllSearchResults();
  const isSearching = searchQuery.trim().length > 0;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={themas.colors.Secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com busca */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>KingMedia</Text>
        </View>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar filmes, séries..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtros de categoria */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key &&
                  styles.categoryButtonActive,
              ]}
              onPress={() =>
                setSelectedCategory(category.key as CategoryFilter)
              }
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.key &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resultados da Pesquisa */}
        {isSearching ? (
          <View style={styles.searchResultsContainer}>
            {searchResults.length > 0 ? (
              <>
                <Text style={styles.searchResultsTitle}>
                  {searchResults.length} resultado
                  {searchResults.length !== 1 ? "s" : ""} encontrado
                  {searchResults.length !== 1 ? "s" : ""}
                </Text>
                <View style={styles.searchResultsGrid}>
                  {searchResults.map((item) => (
                    <CardSeries
                      key={item.id}
                      id={item.id}
                      title={getTitle(item)}
                      genre={getGenres(item.genre_ids)}
                      image={getImageUrl(item.poster_path)}
                      type={item.title ? "movie" : "tv"}
                    />
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.noResultsContainer}>
                <MaterialIcons name="search-off" size={64} color="#666" />
                <Text style={styles.noResultsText}>
                  Nenhum resultado encontrado para &quot;{searchQuery}&quot;
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Dashboard com Estatísticas */}
            {stats.totalItems > 0 && (
              <View style={styles.dashboardContainer}>
                <Text style={styles.dashboardTitle}>📊 Suas Estatísticas</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.statsScroll}
                >
                  <StatCard
                    icon="movie"
                    title="Total"
                    value={stats.totalItems}
                    subtitle="na sua lista"
                    color={themas.colors.Secondary}
                  />
                  <StatCard
                    icon="play-circle-filled"
                    title="Assistindo"
                    value={stats.watching}
                    subtitle="em progresso"
                    color="#4CAF50"
                  />
                  <StatCard
                    icon="check-circle"
                    title="Concluídos"
                    value={stats.completed}
                    subtitle="finalizados"
                    color="#2196F3"
                  />
                  <StatCard
                    icon="bookmark"
                    title="Quero Ver"
                    value={stats.wantToWatch}
                    subtitle="na fila"
                    color="#FF9800"
                  />
                  <StatCard
                    icon="stars"
                    title="Favorito"
                    value={stats.favoriteGenre}
                    subtitle="gênero"
                    color="#E91E63"
                  />
                </ScrollView>
              </View>
            )}

            {/* Recomendações Personalizadas */}
            {recommendations.length > 0 && (
              <>
                <Header title="✨ Recomendado Para Você" />
                <FlatList
                  data={recommendations}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <CardSeries
                      id={item.id}
                      title={getTitle(item)}
                      genre={getGenres(item.genre_ids)}
                      image={getImageUrl(item.poster_path)}
                      type={item.title ? "movie" : "tv"}
                    />
                  )}
                  contentContainerStyle={styles.list}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}

            {/* Lançamentos */}
            {(selectedCategory === "todos" ||
              selectedCategory === "lancamentos") && (
              <>
                <Header title="🎬 Lançamentos" />
                <FlatList
                  data={filteredNewReleases}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <CardSeries
                      id={item.id}
                      title={getTitle(item)}
                      genre={getGenres(item.genre_ids)}
                      image={getImageUrl(item.poster_path)}
                      type={item.title ? "movie" : "tv"}
                    />
                  )}
                  contentContainerStyle={styles.list}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}

            {/* Filmes Populares */}
            {(selectedCategory === "todos" ||
              selectedCategory === "filmes") && (
              <>
                <Header title="🎥 Filmes Populares" />
                <FlatList
                  data={filteredMovies}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <CardSeries
                      id={item.id}
                      title={getTitle(item)}
                      genre={getGenres(item.genre_ids)}
                      image={getImageUrl(item.poster_path)}
                      type="movie"
                    />
                  )}
                  contentContainerStyle={styles.list}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}

            {/* Séries Populares */}
            {(selectedCategory === "todos" ||
              selectedCategory === "series") && (
              <>
                <Header title="📺 Séries Populares" />
                <FlatList
                  data={filteredTVShows}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <CardSeries
                      id={item.id}
                      title={getTitle(item)}
                      genre={getGenres(item.genre_ids)}
                      image={getImageUrl(item.poster_path)}
                      type="tv"
                    />
                  )}
                  contentContainerStyle={styles.list}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}

            {/* Animes */}
            {(selectedCategory === "todos" ||
              selectedCategory === "animes") && (
              <>
                <Header title="🎌 Animes" />
                <FlatList
                  data={filteredAnimes}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <CardSeries
                      id={item.id}
                      title={getTitle(item)}
                      genre={getGenres(item.genre_ids)}
                      image={getImageUrl(item.poster_path)}
                      type="tv"
                    />
                  )}
                  contentContainerStyle={styles.list}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}

            {/* Novelas */}
            {(selectedCategory === "todos" ||
              selectedCategory === "novelas") && (
              <>
                <Header title="📖 Novelas" />
                <FlatList
                  data={filteredSoapOperas}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <CardSeries
                      id={item.id}
                      title={getTitle(item)}
                      genre={getGenres(item.genre_ids)}
                      image={getImageUrl(item.poster_path)}
                      type="tv"
                    />
                  )}
                  contentContainerStyle={styles.list}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}

            {/* Documentários */}
            {(selectedCategory === "todos" ||
              selectedCategory === "documentarios") && (
              <>
                <Header title="🎞️ Documentários" />
                <FlatList
                  data={filteredDocumentaries}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <CardSeries
                      id={item.id}
                      title={getTitle(item)}
                      genre={getGenres(item.genre_ids)}
                      image={getImageUrl(item.poster_path)}
                      type="movie"
                    />
                  )}
                  contentContainerStyle={styles.list}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

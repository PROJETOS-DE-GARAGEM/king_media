import { themas } from "@/global/themas";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import {
  getActionMovies,
  getAnimes,
  getComedies,
  getDocumentaries,
  getDramas,
  getGenres,
  getHorrorMovies,
  getImageUrl,
  getPopularMovies,
  getPopularTVShows,
  getTitle,
  MediaItem,
} from "../../services/tmdb";
import styles from "./style";

type CategoryFilter =
  | "todos"
  | "filmes"
  | "series"
  | "animes"
  | "documentarios";

export default function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tvShows, setTVShows] = useState<MediaItem[]>([]);
  const [animes, setAnimes] = useState<MediaItem[]>([]);
  const [documentaries, setDocumentaries] = useState<MediaItem[]>([]);
  const [dramas, setDramas] = useState<MediaItem[]>([]);
  const [actionMovies, setActionMovies] = useState<MediaItem[]>([]);
  const [comedies, setComedies] = useState<MediaItem[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("todos");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [
        moviesData,
        tvShowsData,
        animesData,
        documentariesData,
        dramasData,
        actionMoviesData,
        comediesData,
        horrorMoviesData,
      ] = await Promise.all([
        getPopularMovies(),
        getPopularTVShows(),
        getAnimes(),
        getDocumentaries(),
        getDramas(),
        getActionMovies(),
        getComedies(),
        getHorrorMovies(),
      ]);

      setMovies(moviesData);
      setTVShows(tvShowsData);
      setAnimes(animesData);
      setDocumentaries(documentariesData);
      setDramas(dramasData);
      setActionMovies(actionMoviesData);
      setComedies(comediesData);
      setHorrorMovies(horrorMoviesData);
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: "todos", label: "Todos" },
    { key: "filmes", label: "Filmes" },
    { key: "series", label: "Séries" },
    { key: "animes", label: "Animes" },
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
  const filteredMovies = filterBySearch(movies);
  const filteredTVShows = filterBySearch(tvShows);
  const filteredAnimes = filterBySearch(animes);
  const filteredDocumentaries = filterBySearch(documentaries);
  const filteredDramas = filterBySearch(dramas);
  const filteredActionMovies = filterBySearch(actionMovies);
  const filteredComedies = filterBySearch(comedies);
  const filteredHorrorMovies = filterBySearch(horrorMovies);

  // Combinar todos os resultados da pesquisa
  const getAllSearchResults = (): MediaItem[] => {
    if (!searchQuery.trim()) return [];

    const allResults = [
      ...filteredMovies.map((item) => ({
        ...item,
        category: "Filmes Populares",
      })),
      ...filteredActionMovies.map((item) => ({
        ...item,
        category: "Filmes de Ação",
      })),
      ...filteredComedies.map((item) => ({ ...item, category: "Comédias" })),
      ...filteredHorrorMovies.map((item) => ({ ...item, category: "Terror" })),
      ...filteredTVShows.map((item) => ({
        ...item,
        category: "Séries Populares",
      })),
      ...filteredDramas.map((item) => ({
        ...item,
        category: "Dramas & Novelas",
      })),
      ...filteredAnimes.map((item) => ({ ...item, category: "Animes" })),
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
          <TouchableOpacity
            style={styles.myListButton}
            onPress={() => router.push("/minhaLista")}
          >
            <MaterialIcons
              name="bookmarks"
              size={24}
              color={themas.colors.Secondary}
            />
          </TouchableOpacity>
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
            {/* Filmes Populares */}
            {(selectedCategory === "todos" ||
              selectedCategory === "filmes") && (
              <>
                <Header title="Filmes Populares" />
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

            {/* Filmes de Ação */}
            {(selectedCategory === "todos" ||
              selectedCategory === "filmes") && (
              <>
                <Header title="Filmes de Ação" />
                <FlatList
                  data={filteredActionMovies}
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

            {/* Comédias */}
            {(selectedCategory === "todos" ||
              selectedCategory === "filmes") && (
              <>
                <Header title="Comédias" />
                <FlatList
                  data={filteredComedies}
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

            {/* Terror */}
            {(selectedCategory === "todos" ||
              selectedCategory === "filmes") && (
              <>
                <Header title="Terror" />
                <FlatList
                  data={filteredHorrorMovies}
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
                <Header title="Séries Populares" />
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

            {/* Dramas/Novelas */}
            {(selectedCategory === "todos" ||
              selectedCategory === "series") && (
              <>
                <Header title="Dramas & Novelas" />
                <FlatList
                  data={filteredDramas}
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
                <Header title="Animes" />
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

            {/* Documentários */}
            {(selectedCategory === "todos" ||
              selectedCategory === "documentarios") && (
              <>
                <Header title="Documentários" />
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

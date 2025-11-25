import { themas } from "@/global/themas";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getImageUrl,
  getMovieDetails,
  getSeasonDetails,
  getTVShowDetails,
  MediaDetails as MediaDetailsType,
  SeasonDetails,
} from "../../services/tmdb";
import {
  addMediaToList,
  checkIfMediaInList,
  EpisodeProgress,
  getWatchedEpisodes,
  markEpisodeAsWatched,
  markSeasonAsWatched,
  removeMediaFromList,
  updateMediaStatus,
  UserMediaItem,
} from "../../services/userMedia";
import styles from "./styles";

export default function MediaDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { id, type } = params as { id: string; type: "movie" | "tv" };

  const [details, setDetails] = useState<MediaDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [seasonDetails, setSeasonDetails] = useState<{
    [key: number]: SeasonDetails;
  }>({});
  const [userMedia, setUserMedia] = useState<UserMediaItem | null>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<EpisodeProgress[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    loadDetails();
    checkMediaInList();
    if (type === "tv") {
      loadWatchedEpisodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const mediaId = parseInt(id);

      // Buscar detalhes
      const detailsData =
        type === "movie"
          ? await getMovieDetails(mediaId)
          : await getTVShowDetails(mediaId);

      setDetails(detailsData);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkMediaInList = async () => {
    try {
      const mediaId = parseInt(id);
      const inList = await checkIfMediaInList(mediaId, type);
      setUserMedia(inList);
    } catch (error) {
      console.error("Erro ao verificar mídia:", error);
    }
  };

  const loadWatchedEpisodes = async () => {
    try {
      const mediaId = parseInt(id);
      const episodes = await getWatchedEpisodes(mediaId);
      setWatchedEpisodes(episodes);
    } catch (error) {
      console.error("Erro ao carregar episódios assistidos:", error);
    }
  };

  const handleAddToList = async () => {
    if (loadingAction || !details) return;

    try {
      setLoadingAction(true);
      const mediaId = parseInt(id);
      const title = details.title || details.name || "Sem título";

      if (userMedia) {
        // Remover da lista
        const success = await removeMediaFromList(mediaId, type);
        if (success) {
          setUserMedia(null);
          Alert.alert("✅ Sucesso", "Removido da sua lista!");
        } else {
          Alert.alert("❌ Erro", "Não foi possível remover da lista");
        }
      } else {
        // Adicionar à lista
        const success = await addMediaToList({
          mediaId,
          mediaType: type,
          title,
          posterPath: details.poster_path || "",
          status: "quero_assistir",
          genres: details.genres.map((g) => g.name),
        });

        if (success) {
          // Atualizar estado local sem fazer nova query
          setUserMedia({
            id: "temp",
            userId: "",
            mediaId,
            mediaType: type,
            title,
            posterPath: details.poster_path || "",
            status: "quero_assistir",
            genres: details.genres.map((g) => g.name),
            addedAt: new Date() as any,
            updatedAt: new Date() as any,
          });
          Alert.alert("✅ Sucesso", "Adicionado à sua lista!");
        } else {
          Alert.alert("❌ Erro", "Verifique se você está logado");
        }
      }
    } catch (error) {
      console.error("❌ Erro:", error);
      Alert.alert("❌ Erro", "Não foi possível realizar a ação");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleStatusChange = async (
    status: "quero_assistir" | "assistindo" | "assistido" | "pausado"
  ) => {
    if (!userMedia) return;

    try {
      const mediaId = parseInt(id);
      const success = await updateMediaStatus(mediaId, type, status);
      if (success) {
        await checkMediaInList();
        Alert.alert("Sucesso", "Status atualizado!");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status");
    }
  };

  const isEpisodeWatched = (
    seasonNumber: number,
    episodeNumber: number
  ): boolean => {
    return watchedEpisodes.some(
      (ep) =>
        ep.seasonNumber === seasonNumber && ep.episodeNumber === episodeNumber
    );
  };

  const handleToggleEpisode = async (
    seasonNumber: number,
    episodeNumber: number
  ) => {
    try {
      const mediaId = parseInt(id);
      const watched = isEpisodeWatched(seasonNumber, episodeNumber);
      const success = await markEpisodeAsWatched(
        mediaId,
        seasonNumber,
        episodeNumber,
        !watched
      );

      if (success) {
        await loadWatchedEpisodes();
      }
    } catch (error) {
      console.error("Erro ao marcar episódio:", error);
    }
  };

  const handleToggleSeason = async (
    seasonNumber: number,
    totalEpisodes: number
  ) => {
    try {
      const mediaId = parseInt(id);

      // Verificar se todos os episódios estão assistidos
      const seasonEpisodes = watchedEpisodes.filter(
        (ep) => ep.seasonNumber === seasonNumber
      );
      const allWatched = seasonEpisodes.length === totalEpisodes;

      const success = await markSeasonAsWatched(
        mediaId,
        seasonNumber,
        totalEpisodes,
        !allWatched
      );

      if (success) {
        await loadWatchedEpisodes();
        Alert.alert(
          "Sucesso",
          allWatched
            ? "Temporada desmarcada"
            : "Temporada marcada como assistida"
        );
      }
    } catch (error) {
      console.error("Erro ao marcar temporada:", error);
    }
  };

  const loadSeasonEpisodes = async (seasonNumber: number) => {
    if (seasonDetails[seasonNumber]) {
      // Já carregou, apenas expande/colapsa
      setExpandedSeason(expandedSeason === seasonNumber ? null : seasonNumber);
      return;
    }

    try {
      const mediaId = parseInt(id);
      const data = await getSeasonDetails(mediaId, seasonNumber);
      if (data) {
        setSeasonDetails((prev) => ({ ...prev, [seasonNumber]: data }));
        setExpandedSeason(seasonNumber);
      }
    } catch (error) {
      console.error("Erro ao carregar episódios:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={themas.colors.Secondary} />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>
          Não foi possível carregar os detalhes
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const title = details.title || details.name || "Sem título";
  const releaseYear = details.release_date
    ? new Date(details.release_date).getFullYear()
    : details.first_air_date
    ? new Date(details.first_air_date).getFullYear()
    : "N/A";

  const genres = details.genres.map((g) => g.name).join(", ");
  const rating = details.vote_average.toFixed(1);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com backdrop */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: getImageUrl(details.backdrop_path) }}
            style={styles.backdrop}
          />
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <AntDesign name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Poster e informações principais */}
          <View style={styles.mainInfoContainer}>
            <Image
              source={{ uri: getImageUrl(details.poster_path) }}
              style={styles.poster}
            />
            <View style={styles.infoRight}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.metaContainer}>
                <View style={styles.ratingContainer}>
                  <AntDesign
                    name="star"
                    size={18}
                    color={themas.colors.Secondary}
                  />
                  <Text style={styles.rating}>{rating}</Text>
                </View>
                <Text style={styles.year}>{releaseYear}</Text>
              </View>
              <Text style={styles.genres}>{genres}</Text>

              {type === "movie" && details.runtime && (
                <View style={styles.durationContainer}>
                  <MaterialIcons name="access-time" size={18} color="#999" />
                  <Text style={styles.duration}>
                    {Math.floor(details.runtime / 60)}h {details.runtime % 60}
                    min
                  </Text>
                </View>
              )}

              {type === "tv" && (
                <View style={styles.tvInfoContainer}>
                  {details.number_of_seasons && (
                    <Text style={styles.tvInfo}>
                      {details.number_of_seasons} Temporadas
                    </Text>
                  )}
                  {details.number_of_episodes && (
                    <Text style={styles.tvInfo}>
                      {details.number_of_episodes} Episódios
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Botões de ação */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.addButton, userMedia && styles.addButtonActive]}
              onPress={handleAddToList}
              disabled={loadingAction}
            >
              <MaterialIcons
                name={userMedia ? "check" : "add"}
                size={20}
                color="#fff"
              />
              <Text style={styles.addButtonText}>
                {userMedia ? "Na Minha Lista" : "Adicionar à Lista"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seletor de status (se na lista) */}
          {userMedia && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    userMedia.status === "quero_assistir" &&
                      styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusChange("quero_assistir")}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      userMedia.status === "quero_assistir" &&
                        styles.statusButtonTextActive,
                    ]}
                  >
                    Quero Assistir
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    userMedia.status === "assistindo" &&
                      styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusChange("assistindo")}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      userMedia.status === "assistindo" &&
                        styles.statusButtonTextActive,
                    ]}
                  >
                    Assistindo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    userMedia.status === "assistido" &&
                      styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusChange("assistido")}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      userMedia.status === "assistido" &&
                        styles.statusButtonTextActive,
                    ]}
                  >
                    Assistido
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    userMedia.status === "pausado" && styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusChange("pausado")}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      userMedia.status === "pausado" &&
                        styles.statusButtonTextActive,
                    ]}
                  >
                    Pausado
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Sinopse */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinopse</Text>
            <Text style={styles.overview}>
              {details.overview || "Sinopse não disponível."}
            </Text>
          </View>

          {/* Temporadas (apenas para séries) */}
          {type === "tv" && details.seasons && details.seasons.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Temporadas</Text>
              {details.seasons
                .filter((season) => season.season_number > 0)
                .map((season) => (
                  <View key={season.id} style={styles.seasonContainer}>
                    <View style={styles.seasonHeader}>
                      <TouchableOpacity
                        style={styles.seasonHeaderLeft}
                        onPress={() => loadSeasonEpisodes(season.season_number)}
                        activeOpacity={0.7}
                      >
                        <Image
                          source={{
                            uri: season.poster_path
                              ? getImageUrl(season.poster_path)
                              : getImageUrl(details.poster_path),
                          }}
                          style={styles.seasonPosterSmall}
                        />
                        <View style={styles.seasonHeaderInfo}>
                          <Text style={styles.seasonNameLarge}>
                            {season.name}
                          </Text>
                          <Text style={styles.seasonMetaText}>
                            {season.episode_count} episódio
                            {season.episode_count !== 1 ? "s" : ""}
                            {season.air_date &&
                              ` • ${new Date(season.air_date).getFullYear()}`}
                          </Text>
                        </View>
                        <MaterialIcons
                          name={
                            expandedSeason === season.season_number
                              ? "keyboard-arrow-up"
                              : "keyboard-arrow-down"
                          }
                          size={28}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      {userMedia && (
                        <TouchableOpacity
                          style={styles.seasonCheckbox}
                          onPress={() =>
                            handleToggleSeason(
                              season.season_number,
                              season.episode_count
                            )
                          }
                        >
                          <MaterialIcons
                            name={
                              watchedEpisodes.filter(
                                (ep) => ep.seasonNumber === season.season_number
                              ).length === season.episode_count
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                            size={28}
                            color={themas.colors.Secondary}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Lista de Episódios */}
                    {expandedSeason === season.season_number &&
                      seasonDetails[season.season_number] && (
                        <View style={styles.episodesContainer}>
                          {seasonDetails[season.season_number].episodes.map(
                            (episode) => {
                              const watched = isEpisodeWatched(
                                season.season_number,
                                episode.episode_number
                              );
                              return (
                                <View
                                  key={episode.id}
                                  style={styles.episodeCard}
                                >
                                  <View style={styles.episodeNumber}>
                                    <Text style={styles.episodeNumberText}>
                                      {episode.episode_number}
                                    </Text>
                                  </View>
                                  <View style={styles.episodeInfo}>
                                    <Text
                                      style={[
                                        styles.episodeName,
                                        watched && styles.episodeWatched,
                                      ]}
                                    >
                                      {episode.name}
                                    </Text>
                                    {episode.overview && (
                                      <Text
                                        style={styles.episodeOverview}
                                        numberOfLines={2}
                                      >
                                        {episode.overview}
                                      </Text>
                                    )}
                                    {episode.runtime && (
                                      <Text style={styles.episodeRuntime}>
                                        {episode.runtime} min
                                      </Text>
                                    )}
                                  </View>
                                  {userMedia && (
                                    <TouchableOpacity
                                      style={styles.episodeCheckbox}
                                      onPress={() =>
                                        handleToggleEpisode(
                                          season.season_number,
                                          episode.episode_number
                                        )
                                      }
                                    >
                                      <MaterialIcons
                                        name={
                                          watched
                                            ? "check-circle"
                                            : "radio-button-unchecked"
                                        }
                                        size={24}
                                        color={
                                          watched
                                            ? themas.colors.Secondary
                                            : "#666"
                                        }
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              );
                            }
                          )}
                        </View>
                      )}
                  </View>
                ))}
            </View>
          )}

          {/* Informações adicionais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{details.status}</Text>
            </View>
            {details.production_countries.length > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>País:</Text>
                <Text style={styles.infoValue}>
                  {details.production_countries.map((c) => c.name).join(", ")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

import CardSeries from "@/components/CardSeries";
import { themas } from "@/global/themas";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserMedia, UserMediaItem } from "../../services/userMedia";
import styles from "./styles";

type FilterStatus =
  | "todos"
  | "quero_assistir"
  | "assistindo"
  | "assistido"
  | "pausado";

export default function MinhaLista() {
  const router = useRouter();
  const [allItems, setAllItems] = useState<UserMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("todos");

  // Recarregar sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getUserMedia();
      setAllItems(data);
    } catch (error) {
      console.error("❌ Erro ao carregar lista:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar localmente sem recarregar
  const items =
    selectedFilter === "todos"
      ? allItems
      : allItems.filter((item) => item.status === selectedFilter);

  const getFilterLabel = (filter: FilterStatus): string => {
    const labels = {
      todos: "Todos",
      quero_assistir: "Quero Assistir",
      assistindo: "Assistindo",
      assistido: "Assistido",
      pausado: "Pausado",
    };
    return labels[filter];
  };

  const getFilterIcon = (filter: FilterStatus): string => {
    const icons = {
      todos: "grid-view",
      quero_assistir: "bookmark",
      assistindo: "play-circle",
      assistido: "check-circle",
      pausado: "pause-circle",
    };
    return icons[filter];
  };

  const filters: FilterStatus[] = [
    "todos",
    "quero_assistir",
    "assistindo",
    "assistido",
    "pausado",
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Minha Lista</Text>
      </View>

      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <MaterialIcons
              name={getFilterIcon(filter) as any}
              size={18}
              color={
                selectedFilter === filter ? "#fff" : themas.colors.Secondary
              }
            />
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {getFilterLabel(filter)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {items.length} {items.length === 1 ? "item" : "itens"}
        </Text>
        <TouchableOpacity
          onPress={loadItems}
          style={{
            backgroundColor: themas.colors.Secondary,
            padding: 8,
            borderRadius: 5,
            marginLeft: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>Recarregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="movie" size={80} color="#555" />
      <Text style={styles.emptyText}>Sua lista está vazia</Text>
      <Text style={styles.emptySubtext}>
        Adicione filmes e séries que deseja assistir
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push("/(tabs)/menu")}
      >
        <Text style={styles.exploreButtonText}>Explorar Conteúdo</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={themas.colors.Secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {items.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.mediaType}-${item.mediaId}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadItems}
              colors={[themas.colors.Secondary]}
              tintColor={themas.colors.Secondary}
            />
          }
          renderItem={({ item }) => {
            const imageUrl = item.posterPath
              ? item.posterPath.startsWith("http")
                ? item.posterPath
                : `https://image.tmdb.org/t/p/w500${item.posterPath}`
              : null;

            return (
              <View style={styles.cardWrapper}>
                <CardSeries
                  id={item.mediaId}
                  title={item.title}
                  genre={item.genres.join(", ")}
                  image={imageUrl}
                  type={item.mediaType}
                />
                <View style={styles.statusBadge}>
                  <MaterialIcons
                    name={getFilterIcon(item.status) as any}
                    size={14}
                    color="#fff"
                  />
                  <Text style={styles.statusBadgeText}>
                    {getFilterLabel(item.status)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

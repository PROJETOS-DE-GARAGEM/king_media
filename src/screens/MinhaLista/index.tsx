import CardSeries from "@/components/CardSeries";
import { themas } from "@/global/themas";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getUserMedia,
  removeMediaFromList,
  UserMediaItem,
} from "../../services/userMedia";
import styles from "./styles";

type FilterStatus =
  | "todos"
  | "quero_assistir"
  | "assistindo"
  | "assistido"
  | "pausado";

export default function MinhaLista() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const listNameParam = params.listName as string | undefined;
  const [allItems, setAllItems] = useState<UserMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("todos");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserMediaItem | null>(null);

  // Recarregar sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      setLoading(true);
      // Se tiver listName, filtrar por ela
      const data = listNameParam
        ? await getUserMedia(undefined, listNameParam)
        : await getUserMedia();
      setAllItems(data);
    } catch (error) {
      console.error("❌ Erro ao carregar lista:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMenu = (item: UserMediaItem) => {
    setSelectedItem(item);
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
    setSelectedItem(null);
  };

  const handleRemoveMedia = async () => {
    if (!selectedItem) return;

    handleCloseMenu();

    Alert.alert(
      "Remover da Lista",
      `Deseja remover "${selectedItem.title}" da sua lista?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            // Atualizar lista local imediatamente para feedback visual instantâneo
            setAllItems((prev) =>
              prev.filter(
                (i) =>
                  !(
                    i.mediaId === selectedItem.mediaId &&
                    i.mediaType === selectedItem.mediaType
                  )
              )
            );

            // Remover do Firestore em background
            const success = await removeMediaFromList(
              selectedItem.mediaId,
              selectedItem.mediaType
            );

            if (!success) {
              // Se falhar, mostrar erro (sem reverter pois é pouco provável)
              Alert.alert("Erro", "Não foi possível remover do servidor.");
            }
            // Sem Alert de sucesso - remoção visual já é feedback suficiente
          },
        },
      ]
    );
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
        <Text style={styles.title}>
          {listNameParam ? listNameParam : "Minha Lista"}
        </Text>
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
        {/* <TouchableOpacity
          onPress={loadItems}
          style={{
            backgroundColor: themas.colors.Secondary,
            padding: 8,
            borderRadius: 5,
            marginLeft: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>Recarregar</Text>
        </TouchableOpacity> */}
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
                {/* Mostrar botão de menu apenas em listas personalizadas */}
                {listNameParam && (
                  <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => handleOpenMenu(item)}
                  >
                    <MaterialIcons name="more-vert" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}

      {/* Modal de Opções */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseMenu}
        >
          <View style={styles.menuModal}>
            <Text style={styles.menuTitle}>{selectedItem?.title}</Text>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={handleRemoveMedia}
            >
              <MaterialIcons name="delete" size={22} color="#FF3B30" />
              <Text style={[styles.menuOptionText, { color: "#FF3B30" }]}>
                Remover da Lista
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={handleCloseMenu}
            >
              <MaterialIcons name="close" size={22} color="#fff" />
              <Text style={styles.menuOptionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

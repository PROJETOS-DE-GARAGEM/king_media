import { themas } from "@/global/themas";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createUserList,
  deleteUserList,
  getUserLists,
  getUserMedia,
  UserList,
} from "../../src/services/userMedia";

export default function MinhasListas() {
  const router = useRouter();
  const [lists, setLists] = useState<UserList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Recarregar ao focar na tela
  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [])
  );

  const loadLists = async () => {
    try {
      setLoading(true);

      // Buscar listas personalizadas
      const userLists = await getUserLists();

      // Buscar todas as mídias para contar itens por lista
      const allMedia = await getUserMedia();

      // Adicionar contagem de itens em cada lista
      const listsWithCount = userLists.map((list) => ({
        ...list,
        itemCount: allMedia.filter((media) => media.listName === list.name)
          .length,
      }));

      setLists(listsWithCount);
    } catch (error) {
      console.error("Erro ao carregar listas:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Alert.alert("Atenção", "Digite um nome para a lista");
      return;
    }

    try {
      setCreating(true);
      const listId = await createUserList(
        newListName.trim(),
        newListDescription.trim()
      );

      if (listId) {
        Alert.alert("✅ Sucesso", "Lista criada com sucesso!");
        setModalVisible(false);
        setNewListName("");
        setNewListDescription("");
        await loadLists();
      } else {
        Alert.alert("❌ Erro", "Não foi possível criar a lista");
      }
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      Alert.alert("❌ Erro", "Erro ao criar lista");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteList = (list: any) => {
    Alert.alert(
      "Excluir Lista",
      `Deseja realmente excluir "${list.name}"?\n\nAs mídias não serão excluídas, apenas a lista.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const success = await deleteUserList(list.id);
            if (success) {
              Alert.alert("✅ Sucesso", "Lista excluída");
              await loadLists();
            } else {
              Alert.alert("❌ Erro", "Não foi possível excluir");
            }
          },
        },
      ]
    );
  };

  const handleOpenList = (listName: string) => {
    router.push({
      pathname: "/minhaLista",
      params: { listName },
    });
  };

  // Função para determinar o ícone baseado no nome da lista
  const getListIcon = (listName: string) => {
    const name = listName.toLowerCase();

    // Filmes
    if (name.includes("filme") || name.includes("movie")) return "movie";

    // Séries
    if (
      name.includes("série") ||
      name.includes("series") ||
      name.includes("serie")
    )
      return "live-tv";

    // Animes
    if (name.includes("anime")) return "animation";

    // Documentários
    if (
      name.includes("documentário") ||
      name.includes("documentario") ||
      name.includes("doc")
    )
      return "description";

    // Favoritos
    if (name.includes("favorito") || name.includes("fav")) return "favorite";

    // Assistir depois
    if (
      name.includes("depois") ||
      name.includes("ver") ||
      name.includes("assistir")
    )
      return "watch-later";

    // Família
    if (
      name.includes("família") ||
      name.includes("familia") ||
      name.includes("kids")
    )
      return "family-restroom";

    // Ação
    if (
      name.includes("ação") ||
      name.includes("acao") ||
      name.includes("action")
    )
      return "sports-martial-arts";

    // Terror
    if (name.includes("terror") || name.includes("horror")) return "warning";

    // Comédia
    if (
      name.includes("comédia") ||
      name.includes("comedia") ||
      name.includes("comedy")
    )
      return "mood";

    // Romance
    if (name.includes("romance") || name.includes("amor"))
      return "favorite-border";

    // Padrão
    return "bookmark";
  };

  // Função para obter cor baseada no tipo
  const getListColor = (listName: string) => {
    const name = listName.toLowerCase();

    if (name.includes("filme") || name.includes("movie")) return "#E50914"; // Vermelho Netflix
    if (
      name.includes("série") ||
      name.includes("series") ||
      name.includes("serie")
    )
      return "#00A8E1"; // Azul
    if (name.includes("anime")) return "#FF6B9D"; // Rosa
    if (name.includes("terror") || name.includes("horror")) return "#8B0000"; // Vermelho escuro
    if (name.includes("comédia") || name.includes("comedia")) return "#FFD700"; // Dourado
    if (name.includes("favorito") || name.includes("fav")) return "#E91E63"; // Pink

    return themas.colors.Primary;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={themas.colors.Secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Minhas Listas</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de listas */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id || ""}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadLists();
            }}
            tintColor={themas.colors.Secondary}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.listCardWrapper}>
            <TouchableOpacity
              style={styles.listCard}
              onPress={() => handleOpenList(item.name)}
            >
              <View style={styles.listCardLeft}>
                <View
                  style={[
                    styles.listIcon,
                    {
                      backgroundColor: getListColor(item.name),
                    },
                  ]}
                >
                  <MaterialIcons
                    name={getListIcon(item.name) as any}
                    size={28}
                    color="#fff"
                  />
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{item.name}</Text>
                  {item.description && (
                    <Text style={styles.listDescription}>
                      {item.description}
                    </Text>
                  )}
                  <Text style={styles.listCount}>
                    {(item as any).itemCount || 0}{" "}
                    {(item as any).itemCount === 1 ? "item" : "itens"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Botão de excluir */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteList(item)}
            >
              <MaterialIcons name="delete" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="bookmarks" size={64} color="#666" />
            <Text style={styles.emptyText}>Nenhuma lista ainda</Text>
            <Text style={styles.emptyHint}>
              Toque no + para criar sua primeira lista
            </Text>
          </View>
        }
      />

      {/* Modal de criar lista */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Lista</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome da lista"
              placeholderTextColor="#666"
              value={newListName}
              onChangeText={setNewListName}
              maxLength={30}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#666"
              value={newListDescription}
              onChangeText={setNewListDescription}
              multiline
              numberOfLines={3}
              maxLength={100}
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateList}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Criar Lista</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: themas.colors.grayStrong,
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: themas.colors.grayDark,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: themas.colors.Secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  listCardWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  listCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: themas.colors.grayDark,
    borderRadius: 12,
    padding: 16,
    paddingRight: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  deleteButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  listCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  listCount: {
    fontSize: 12,
    color: themas.colors.Secondary,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 16,
    fontWeight: "600",
  },
  emptyHint: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: themas.colors.grayDark,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    backgroundColor: themas.colors.grayStrong,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: themas.colors.Secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

import { themas } from "@/global/themas";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../../firebase/firebaseConfig";
import styles from "./styles";

export default function Perfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Dados do usuário
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [stats, setStats] = useState({
    totalItems: 0,
    watching: 0,
    completed: 0,
    wantToWatch: 0,
  });

  useEffect(() => {
    loadUserData();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    try {
      const { getUserMedia } = await import("../../services/userMedia");
      const allItems = await getUserMedia();

      setStats({
        totalItems: allItems.length,
        watching: allItems.filter((item) => item.status === "assistindo")
          .length,
        completed: allItems.filter((item) => item.status === "assistido")
          .length,
        wantToWatch: allItems.filter((item) => item.status === "quero_assistir")
          .length,
      });
    } catch (error) {
      console.error("❌ Erro ao carregar estatísticas:", error);
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Você precisa estar logado");
        router.replace("/login");
        return;
      }

      // console.log("👤 Carregando dados do usuário:", user.uid);

      // Dados do Firebase Auth
      setEmail(user.email || "");
      setNome(user.displayName || "");

      // Buscar dados do Firestore
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.data();
        // console.log("📊 Dados do Firestore:", userData);
        setUsername(userData.username || "");
        setNome(userData.nome || user.displayName || "");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar seus dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome não pode estar vazio");
      return;
    }

    if (novaSenha && novaSenha !== confirmarNovaSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      setSaving(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Sessão expirada. Faça login novamente");
        router.replace("/login");
        return;
      }

      // console.log("💾 Salvando alterações...");

      // Atualizar displayName no Auth
      await updateProfile(user, { displayName: nome });
      // console.log("✅ DisplayName atualizado");

      // Atualizar dados no Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        nome,
        username,
        atualizadoEm: new Date().toISOString(),
      });
      // console.log("✅ Dados do Firestore atualizados");

      // Atualizar senha se fornecida
      if (novaSenha) {
        await updatePassword(user, novaSenha);
        // console.log("✅ Senha atualizada");
        setNovaSenha("");
        setConfirmarNovaSenha("");
      }

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      setEditMode(false);
      await loadUserData();
      await loadStats();
    } catch (error: any) {
      console.error("❌ Erro ao salvar:", error);

      let errorMessage = "Não foi possível salvar as alterações";

      if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Por segurança, faça login novamente para alterar esses dados";
        Alert.alert("Atenção", errorMessage, [
          {
            text: "Fazer Login",
            onPress: () => {
              handleLogout();
            },
          },
          { text: "Cancelar" },
        ]);
        return;
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Senha muito fraca";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso";
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      "⚠️ Limpar Todos os Dados",
      "Isso vai remover TODOS os filmes, séries, listas e progresso. Esta ação não pode ser desfeita!\n\nDeseja continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              const { clearAllUserData } = await import(
                "../../services/userMedia"
              );
              const success = await clearAllUserData();

              if (success) {
                Alert.alert("✅ Sucesso", "Todos os dados foram removidos!", [
                  {
                    text: "OK",
                    onPress: () => {
                      loadStats();
                      router.push("/(tabs)/menu");
                    },
                  },
                ]);
              } else {
                Alert.alert("❌ Erro", "Não foi possível limpar os dados");
              }
            } catch (error) {
              console.error("❌ Erro ao limpar dados:", error);
              Alert.alert("❌ Erro", "Não foi possível limpar os dados");
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            // console.log("👋 Fazendo logout...");
            await signOut(auth);
            // console.log("✅ Logout realizado");
            router.replace("/");
          } catch (error) {
            console.error("❌ Erro ao sair:", error);
            Alert.alert("Erro", "Não foi possível sair");
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    setEditMode(false);
    setNovaSenha("");
    setConfirmarNovaSenha("");
    loadUserData();
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialIcons
                name="person"
                size={60}
                color={themas.colors.Secondary}
              />
            </View>
          </View>
          <Text style={styles.userName}>{nome || "Usuário"}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Estatísticas */}
        {!editMode && stats.totalItems > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.watching}</Text>
              <Text style={styles.statLabel}>Assistindo</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.wantToWatch}</Text>
              <Text style={styles.statLabel}>Quero Ver</Text>
            </View>
          </View>
        )}

        {/* Informações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            {!editMode && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditMode(true)}
              >
                <MaterialIcons
                  name="edit"
                  size={20}
                  color={themas.colors.Secondary}
                />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {editMode ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome de Usuário</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Seu username"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={email}
                  editable={false}
                  placeholderTextColor="#666"
                />
                <Text style={styles.helpText}>
                  O email não pode ser alterado
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.subsectionTitle}>Alterar Senha</Text>
              <Text style={styles.helpText}>
                Deixe em branco se não quiser alterar
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nova Senha</Text>
                <TextInput
                  style={styles.input}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <TextInput
                  style={styles.input}
                  value={confirmarNovaSenha}
                  onChangeText={setConfirmarNovaSenha}
                  placeholder="Confirme a nova senha"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={handleCancel}
                  disabled={saving}
                >
                  <Text style={styles.buttonSecondaryText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonPrimaryText}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name="person"
                  size={20}
                  color={themas.colors.Secondary}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nome Completo</Text>
                  <Text style={styles.infoValue}>
                    {nome || "Não informado"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons
                  name="alternate-email"
                  size={20}
                  color={themas.colors.Secondary}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Username</Text>
                  <Text style={styles.infoValue}>
                    @{username || "não definido"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons
                  name="email"
                  size={20}
                  color={themas.colors.Secondary}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{email}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Opções */}
        {!editMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => router.push("/minhaLista")}
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="bookmarks"
                  size={24}
                  color={themas.colors.Secondary}
                />
                <Text style={styles.optionText}>Minha Lista</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleClearAllData}
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="delete-forever"
                  size={24}
                  color="#FF3B30"
                />
                <Text style={[styles.optionText, { color: "#FF3B30" }]}>
                  Limpar Todos os Dados
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="exit-to-app"
                  size={24}
                  color={themas.colors.Primary}
                />
                <Text style={[styles.optionText, styles.logoutText]}>
                  Sair da Conta
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>KingMedia v1.0</Text>
          <Text style={styles.footerText}>
            © 2025 Todos os direitos reservados
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

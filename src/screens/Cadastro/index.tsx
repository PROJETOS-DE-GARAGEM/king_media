import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { auth } from "../../../firebase/firebaseConfig";
import { styles } from "./styles";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [campoFocado, setCampoFocado] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  async function handleCadastro() {
    // Validação básica
    if (!nome || !username || !email || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Digite um email válido.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const db = getDatabase();
      const dbRef = ref(db);

      // Verifica se o username já existe
      const snapshot = await get(child(dbRef, "users"));
      if (snapshot.exists()) {
        const users = snapshot.val();
        const usernamesExistentes = Object.values(users).map((u: any) => u.username);
        if (usernamesExistentes.includes(username)) {
          Alert.alert("Erro", "Este nome de usuário já está em uso.");
          setCarregando(false);
          return;
        }
      }

      // Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Atualiza displayName
      await updateProfile(user, { displayName: nome });

      // Salva dados no Realtime Database
      await set(ref(db, "users/" + user.uid), {
        nome,
        username,
        email,
        senha,
        criadoEm: new Date().toISOString(),
      });

      console.log("Dados salvos no Realtime Database com sucesso!");

      await new Promise((resolve) => setTimeout(resolve, 500));

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      setCarregando(false);

      router.replace("/login");
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      let mensagem = "Erro ao cadastrar. Tente novamente.";

      if (error.code === "auth/email-already-in-use") {
        mensagem = "Este email já está em uso.";
      } else if (error.code === "auth/invalid-email") {
        mensagem = "Email inválido.";
      } else if (error.code === "auth/weak-password") {
        mensagem = "Senha muito fraca.";
      }

      Alert.alert("Erro", mensagem);
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo2.png")}
        style={{ width: 220, height:220, marginBottom: 50 }}
        resizeMode="contain"
      />

      <Text style={styles.subtitulo}>Cadastrar</Text>

      <TextInput
        style={[styles.input, campoFocado === "nome" && styles.inputFocado]}
        placeholder="Nome completo"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
        onFocus={() => setCampoFocado("nome")}
        onBlur={() => setCampoFocado(null)}
      />

      <TextInput
        style={[styles.input, campoFocado === "username" && styles.inputFocado]}
        placeholder="Nome de usuário"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        onFocus={() => setCampoFocado("username")}
        onBlur={() => setCampoFocado(null)}
      />

      <TextInput
        style={[styles.input, campoFocado === "email" && styles.inputFocado]}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setCampoFocado("email")}
        onBlur={() => setCampoFocado(null)}
      />

      <TextInput
        style={[styles.input, campoFocado === "senha" && styles.inputFocado]}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        onFocus={() => setCampoFocado("senha")}
        onBlur={() => setCampoFocado(null)}
      />

      <TextInput
        style={[styles.input, campoFocado === "confirmar" && styles.inputFocado]}
        placeholder="Confirmar senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        onFocus={() => setCampoFocado("confirmar")}
        onBlur={() => setCampoFocado(null)}
      />

      <Text style={styles.textoAviso}>
        Ao se cadastrar, você concorda com nossos termos de uso e políticas de privacidade.
      </Text>

      <Pressable
        onPressIn={() => (scale.value = withTiming(0.96, { duration: 100 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 100 }))}
        onPress={handleCadastro}
        disabled={carregando}
        style={{ width: "100%" }}
      >
        <Animated.View style={[styles.botao, animatedStyle]}>
        
          {carregando ? (
            <ActivityIndicator color="#1B263B" />
          ) : (
            <Text style={styles.textoBotao}>Cadastrar-se</Text>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

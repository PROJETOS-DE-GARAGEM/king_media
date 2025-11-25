import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../../../firebase/firebaseConfig";
import { themas } from "@/global/themas";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRecuperar = async () => {
    if (!email) {
      Alert.alert("Atenção", "Digite o e-mail para recuperar a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      // Redireciona para login após 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successText}>E-mail enviado com sucesso!</Text>
        <Text style={styles.successSub}>
          Você receberá um link para redefinir sua senha.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Digite o e-mail da sua conta para receber o link de redefinição.
      </Text>

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#999"
        style={[styles.input, focused && styles.inputFocused]}
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={handleRecuperar} style={styles.button}>
        <LinearGradient colors={["#ff9a00", "#ff5f00"]} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Enviar</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.linkText} onPress={() => router.push("/login")}>
        Voltar para o login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.colors.grayStrong,
    justifyContent: "center",
    padding: 25,
  },
  title: {
    color: "#ff5f00",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: themas.colors.grayDark,
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#ff5f00",
  },
  button: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#ff5f00",
    textAlign: "center",
    fontWeight: "bold",
  },
  successContainer: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  successEmoji: {
    fontSize: 70,
    marginBottom: 20,
  },
  successText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  successSub: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
});

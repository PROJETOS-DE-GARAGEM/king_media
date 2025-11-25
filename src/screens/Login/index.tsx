import { ButtonBack } from "@/components/ButtonBack";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../../firebase/firebaseConfig";
import { style } from "./styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Verificar se já está logado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ Usuário já logado, redirecionando para menu...");
        router.replace("/(tabs)/menu");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function getLogin() {
    // Validação de campos vazios
    if (!email || !password) {
      return Alert.alert("Atenção", "Informe os campos obrigatórios!");
    }

    // Limpar espaços extras
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return Alert.alert(
        "Email Inválido",
        "Por favor, digite um email válido.\n\nExemplo: usuario@gmail.com"
      );
    }

    try {
      setLoading(true);
      console.log("🔐 Tentando login com:", emailTrimmed);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailTrimmed,
        passwordTrimmed
      );
      console.log("✅ Login bem-sucedido!", userCredential.user.uid);

      // O onAuthStateChanged no _layout vai detectar e navegar automaticamente
    } catch (error: any) {
      console.error("❌ Erro no login:", error);

      let errorMessage = "Erro ao fazer login";
      let errorTitle = "Erro";

      if (error.code === "auth/user-not-found") {
        errorTitle = "Usuário Não Encontrado";
        errorMessage =
          "Não existe uma conta com este email. Deseja criar uma conta?";
        Alert.alert(errorTitle, errorMessage, [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Cadastrar",
            onPress: () => router.push("/cadastro"),
          },
        ]);
        return;
      } else if (error.code === "auth/wrong-password") {
        errorTitle = "Senha Incorreta";
        errorMessage = "A senha está incorreta. Verifique e tente novamente.";
      } else if (error.code === "auth/invalid-email") {
        errorTitle = "Email Inválido";
        errorMessage =
          "O formato do email está incorreto. Use um email válido como exemplo@gmail.com";
      } else if (error.code === "auth/too-many-requests") {
        errorTitle = "Muitas Tentativas";
        errorMessage =
          "Você fez muitas tentativas. Aguarde alguns minutos e tente novamente.";
      } else if (error.code === "auth/invalid-credential") {
        errorTitle = "Credenciais Inválidas";
        errorMessage =
          "Email ou senha incorretos. Verifique seus dados e tente novamente.";
      } else if (error.code === "auth/network-request-failed") {
        errorTitle = "Sem Conexão";
        errorMessage =
          "Verifique sua conexão com a internet e tente novamente.";
      }

      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <View
        style={[
          style.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FAA916" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Verificando autenticação...
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#C73E1D", "#FAA916"]}
      start={{ x: 0.1, y: 0.54 }}
      end={{ x: 1, y: 0.6 }}
      locations={[0, 0.7]}
      style={style.container}
    >
      <ButtonBack />

      {/* Topo */}
      <View style={style.boxTop}>
        <Image
          style={style.img}
          source={require("../../../assets/images/logo2.png")}
        />
      </View>

      {/* Inputs */}
      <View style={style.boxMid}>
        <Text style={style.text}>Entrar</Text>

        {/* Email */}
        <View style={style.boxInput}>
          <MaterialIcons
            name="person"
            size={20}
            color={"white"}
            style={{ marginRight: 8 }}
          />
          <View style={style.separator}></View>

          <TextInput
            style={style.input}
            placeholder="exemplo@email.com"
            placeholderTextColor={"gray"}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase().trim())}
          />
        </View>
        <Text style={style.helpText}>
          💡 Use seu email completo (ex: seunome@gmail.com)
        </Text>

        {/* Senha */}
        <View style={style.boxInput}>
          <MaterialIcons
            name="lock"
            size={20}
            color={"white"}
            style={{ marginRight: 8 }}
          />
          <View style={style.separator}></View>

          <TextInput
            style={style.input}
            placeholder="Senha"
            placeholderTextColor={"gray"}
            secureTextEntry={!visible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <MaterialIcons
              name={visible ? "visibility-off" : "visibility"}
              size={20}
              color={"white"}
            />
          </TouchableOpacity>
        </View>

        <View style={style.boxEquecido}>
          <Link style={style.link} href={"/recuperarSenha"}>
            Esqueceu a senha?
          </Link>
        </View>
      </View>

      {/* Botão */}

      <View style={style.boxBottom}>
        <TouchableOpacity
          style={style.button}
          onPress={getLogin}
          disabled={loading}
        >
          <LinearGradient
            colors={["#FAA916", "#C73E1D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={style.button}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={style.buttonText}>Acessar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={style.textoCadastro}>
          Ainda não possui uma conta?{" "}
          <Link style={style.link} href={"/cadastro"}>
            Cadastre-se
          </Link>
        </Text>

        {/* Botão de teste - REMOVER EM PRODUÇÃO */}
        {__DEV__ && (
          <TouchableOpacity
            style={{
              marginTop: 15,
              padding: 10,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
            }}
            onPress={() => {
              Alert.alert(
                "Dica de Teste",
                "Para testar:\n\n1. Crie uma conta em 'Cadastre-se'\n2. Use um email válido: teste@gmail.com\n3. Senha: mínimo 6 caracteres\n\nOu use uma conta já criada.",
                [{ text: "Entendi" }]
              );
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 12 }}>
              ℹ️ Como fazer login?
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

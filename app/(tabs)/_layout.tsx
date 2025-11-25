import { themas } from "@/global/themas";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase/firebaseConfig";

export default function TabLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👤 Auth state changed:", user?.uid || "Não logado");

      setLoading(false);

      if (!user) {
        console.log("⚠️ Usuário não autenticado, redirecionando para login...");
        setTimeout(() => router.replace("/login"), 100);
      } else {
        console.log("✅ Usuário autenticado, permanecendo no menu");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themas.colors.grayStrong,
        }}
      >
        <ActivityIndicator size="large" color={themas.colors.Secondary} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themas.colors.Secondary,
        tabBarInactiveTintColor: themas.colors.White,
        tabBarStyle: {
          backgroundColor: themas.colors.grayDark,
        },
      }}
    >
      <Tabs.Screen
        name="menu"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={() => router.push("/criarMidia")}
              style={{
                top: -20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="add-circle"
                size={50}
                color={themas.colors.Secondary}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          headerShown: false,
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

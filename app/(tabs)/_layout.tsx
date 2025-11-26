import { themas } from "@/global/themas";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../../firebase/firebaseConfig";

export default function TabLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("👤 Auth state changed:", user?.uid || "Não logado");

      setLoading(false);

      if (!user) {
        // console.log("⚠️ Usuário não autenticado, redirecionando para login...");
        setTimeout(() => router.replace("/login"), 100);
      } else {
        // console.log("✅ Usuário autenticado, permanecendo no menu");
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
          paddingBottom: 8,
          paddingTop: 8,
          height: 100,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      <Tabs.Screen
        name="menu"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          headerShown: false,
          title: "Minhas Listas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmarks" color={color} size={size} />
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

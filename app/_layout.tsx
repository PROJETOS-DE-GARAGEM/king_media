import { themas } from "@/global/themas";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: themas.colors.White,
        headerTitleStyle: {
          fontWeight: "medium",
          fontSize: 22,
        },
        headerTitleAlign: "left",
        headerShown: true,
        presentation: "transparentModal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "", headerShown: false }}
      ></Stack.Screen>

      <Stack.Screen
        name="login"
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: themas.colors.White,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="menu"
        options={{ title: "Criar midia", headerShown: false }}
      ></Stack.Screen>

      <Stack.Screen name="formsMedia" options={{ title: "" }}></Stack.Screen>

      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      ></Stack.Screen>

      <Stack.Screen
        name="cadastro"
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: themas.colors.White,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="recuperarSenha"
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: themas.colors.White,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen name="minhaLista" options={{ headerShown: false }} />

      <Stack.Screen name="mediaDetails" options={{ headerShown: false }} />

      <Stack.Screen name="criarMidia" options={{ headerShown: false }} />
    </Stack>
  );
}

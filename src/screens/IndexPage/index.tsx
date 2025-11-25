import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { style } from "./styles";

export default function IndexPage() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#C73E1D", "#FAA916"]}
      start={{ x: 0.5, y: 0.54 }}
      end={{ x: 0.5, y: 1.1 }}
      locations={[0, 0.7]}
      style={style.container}
    >
      <Image
        style={style.img}
        source={require("../../../assets/images/logo.png")}
      />

      <TouchableOpacity
        style={style.roundButton}
        onPress={() => router.push("/login")}
      >
        <AntDesign name="right" size={32} color="#C73E1D" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

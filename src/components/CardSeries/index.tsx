import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

interface CardSeriesProps {
  id: number;
  title: string;
  genre: string;
  image?: string | null;
  type: "movie" | "tv";
}

export default function CardSeries({
  id,
  title,
  genre,
  image,
  type,
}: CardSeriesProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/mediaDetails",
      params: { id: id.toString(), type },
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <ImageBackground
        source={{
          uri: image
            ? image
            : "https://via.placeholder.com/150x200.png?text=Sem+Imagem",
        }}
        style={styles.image}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.genre} numberOfLines={1}>
            {genre}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

///boa noite///

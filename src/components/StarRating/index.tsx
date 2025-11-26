import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showValue?: boolean;
}

export default function StarRating({
  rating,
  onRatingChange,
  size = 32,
  readonly = false,
  showValue = false,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {stars.map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => !readonly && onRatingChange?.(star)}
            disabled={readonly}
            activeOpacity={readonly ? 1 : 0.7}
          >
            <MaterialIcons
              name={star <= rating ? "star" : "star-border"}
              size={size}
              color={star <= rating ? "#FFD700" : "#666"}
            />
          </TouchableOpacity>
        ))}
      </View>
      {showValue && (
        <Text style={styles.ratingText}>
          {rating > 0 ? `${rating.toFixed(1)}/5.0` : "Não avaliado"}
        </Text>
      )}
    </View>
  );
}

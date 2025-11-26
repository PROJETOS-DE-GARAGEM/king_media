import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

interface StatCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
}: StatCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <MaterialIcons name={icon} size={28} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

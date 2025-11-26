import { themas } from "@/global/themas";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1E1E2E",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    alignItems: "center",
    minWidth: 160,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    color: themas.colors.Secondary,
    fontSize: 11,
    fontWeight: "600",
  },
});

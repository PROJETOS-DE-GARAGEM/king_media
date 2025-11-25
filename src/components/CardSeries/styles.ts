import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    width: 141,
    height: 188,
    marginRight: 14,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#0F172A",
    elevation: 5, // sombra no Android
    shadowColor: "#000", // sombra no iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
  },
  genre: {
    fontSize: 11,
    color: "#cbd5e1",
  },
});

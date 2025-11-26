import { themas } from "@/global/themas";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.colors.grayStrong,
  },
  list: {
    paddingHorizontal: 16,
  },
  headerSection: {
    backgroundColor: themas.colors.grayDark,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: themas.colors.Secondary,
  },
  myListButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themas.colors.grayStrong,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
  },
  categoriesScroll: {
    marginTop: 5,
  },
  categoriesContainer: {
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryButtonActive: {
    backgroundColor: themas.colors.Primary,
    borderColor: themas.colors.Primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchResultsContainer: {
    padding: 16,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  searchResultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  dashboardContainer: {
    marginVertical: 16,
  },
  dashboardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 16,
    marginBottom: 16,
  },
  statsScroll: {
    paddingHorizontal: 8,
  },
});

import { themas } from "@/global/themas";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.colors.grayStrong,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 27
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 15,
    flexWrap: "wrap",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  filterButtonActive: {
    backgroundColor: themas.colors.Primary,
    borderColor: themas.colors.Primary,
  },
  filterText: {
    fontSize: 13,
    color: themas.colors.Secondary,
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  countContainer: {
    marginTop: 5,
  },
  countText: {
    fontSize: 14,
    color: "#999",
  },
  listContent: {
    padding: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardWrapper: {
    width: "48%",
    position: "relative",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  menuButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  menuModal: {
    backgroundColor: themas.colors.grayDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 10,
  },
  menuOptionText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: themas.colors.Primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

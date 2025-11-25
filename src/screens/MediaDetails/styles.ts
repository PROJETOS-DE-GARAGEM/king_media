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
  headerContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  backdrop: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
  },
  closeButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  contentContainer: {
    padding: 20,
  },
  mainInfoContainer: {
    flexDirection: "row",
    marginTop: -60,
    marginBottom: 20,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: themas.colors.grayStrong,
  },
  infoRight: {
    flex: 1,
    marginLeft: 15,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: themas.colors.Secondary,
  },
  year: {
    fontSize: 16,
    color: "#999",
  },
  genres: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  duration: {
    fontSize: 14,
    color: "#999",
  },
  tvInfoContainer: {
    marginTop: 5,
  },
  tvInfo: {
    fontSize: 14,
    color: "#999",
    marginBottom: 3,
  },
  trailerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themas.colors.Primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    gap: 10,
  },
  trailerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  trailerContainer: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  overview: {
    fontSize: 15,
    color: "#ddd",
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: themas.colors.Secondary,
    width: 80,
  },
  infoValue: {
    fontSize: 15,
    color: "#ddd",
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: themas.colors.Primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  seasonContainer: {
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    overflow: "hidden",
  },
  seasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  seasonPosterSmall: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: "#1a1a1a",
  },
  seasonHeaderInfo: {
    flex: 1,
  },
  seasonNameLarge: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  seasonMetaText: {
    fontSize: 13,
    color: "#999",
  },
  episodesContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 8,
  },
  episodeCard: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  episodeNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: themas.colors.Primary,
    justifyContent: "center",
    alignItems: "center",
  },
  episodeNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  episodeInfo: {
    flex: 1,
  },
  episodeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  episodeOverview: {
    fontSize: 13,
    color: "#ccc",
    lineHeight: 18,
    marginBottom: 4,
  },
  episodeRuntime: {
    fontSize: 12,
    color: "#999",
  },
  actionButtonsContainer: {
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themas.colors.Primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  addButtonActive: {
    backgroundColor: themas.colors.Secondary,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  statusButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statusButtonActive: {
    backgroundColor: themas.colors.Primary,
    borderColor: themas.colors.Primary,
  },
  statusButtonText: {
    fontSize: 13,
    color: "#999",
  },
  statusButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  seasonHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  seasonCheckbox: {
    padding: 8,
  },
  episodeCheckbox: {
    padding: 8,
  },
  episodeWatched: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
});

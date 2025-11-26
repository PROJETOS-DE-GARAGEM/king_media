import { themas } from "@/global/themas";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.colors.grayDark,
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  titulo: {
    color: themas.colors.Secondary,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitulo: {
    color: themas.colors.Secondary,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "left",
    width: "100%",
  },
  input: {
    width: "100%",
    backgroundColor: themas.colors.grayStrong,
    borderRadius: 10,
    padding: 12,
    color: themas.colors.White,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FFB70340",
  },
  inputFocado: {
    borderColor: themas.colors.Secondary,
    backgroundColor: themas.colors.grayStrong,
  },
  botao: {
    backgroundColor: themas.colors.Secondary,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    shadowColor: themas.colors.Black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  textoBotao: {
    color: themas.colors.grayDark,
    fontSize: 16,
    fontWeight: "bold",
  },
  textoAviso: {
    color: themas.colors.White,
    fontSize: 12,
    textAlign: "center",
    marginVertical: 10,
  },
});

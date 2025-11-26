import { themas } from "@/global/themas";
import { Dimensions, StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
  },

  text: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 35,
    marginLeft: 20,
    color: "orange",
    height: "auto",
  },

  boxTop: {
    flex: 2,
    height: Dimensions.get("window").height / 4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  boxMid: {
    height: Dimensions.get("window").height / 3,
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: themas.colors.grayStrong,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    gap: 4,
  },

  boxInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: themas.colors.grayStrong,
    borderColor: "orange",
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: themas.colors.Black,
  },
  separator: {
    width: 1,
    height: "100%",
    backgroundColor: themas.colors.Secondary,
    marginHorizontal: 8,
  },

  boxEquecido: {
    alignItems: "flex-end",
  },

  textEquecido: {
    color: "white",
    alignItems: "flex-end",
    height: 50,
  },

  boxBottom: {
    height: Dimensions.get("window").height / 3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themas.colors.grayStrong,
  },

  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: "90%",
  },

  buttonText: {
    color: themas.colors.Black,
    fontSize: 16,
    fontWeight: "bold",
  },

  textoCadastro: {
    marginTop: 20,
    color: "white",
  },

  container2: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },

  viewButao: {
    alignItems: "center",
    gap: 30,
    width: "100%",
  },

  buttonUm: {
    backgroundColor: "#313D49",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    padding: 10,
    width: "90%",
    borderRadius: 25,
  },

  buttonDois: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    padding: 10,
    width: "90%",
    borderWidth: 1,
    borderRadius: 25,
  },

  textoBotao: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  textoBotaoDois: {
    color: "#313D49",
    fontSize: 18,
    fontWeight: "bold",
  },

  img: {
    width: 320,
    height: 200,
    marginBottom: 20,
    alignSelf: "center",
    resizeMode: "contain",
  },

  cadeado: {
    alignItems: "flex-end",
  },

  link: {
    color: themas.colors.Secondary,
  },

  helpText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    marginLeft: 12,
  },
});

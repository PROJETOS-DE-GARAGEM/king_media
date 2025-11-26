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
    minHeight: 180,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },

  boxMid: {
    minHeight: Dimensions.get("window").height / 3,
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 30,
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
    minHeight: Dimensions.get("window").height / 3,
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: themas.colors.grayStrong,
    paddingBottom: 40,
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
    height: 200,
    width: 350,
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

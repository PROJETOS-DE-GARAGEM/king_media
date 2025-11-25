import { themas } from "@/global/themas";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    caixa1: {
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },


    caixa2: {
    backgroundColor: "#edb500ff",
    height: 40,
    width:"90%",
    borderRadius: 25,
    alignItems:"center",
    justifyContent:"center"

  },

    textoBotao: {
    color: themas.colors.Black,
    fontSize: 18,
    fontWeight: "bold",
   
  },


});
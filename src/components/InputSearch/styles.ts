import { themas } from "@/global/themas";
import { Dimensions, StyleSheet } from "react-native";

export const style = StyleSheet.create({
  
  boxInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderRadius: 25,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: themas.colors.LowYellow,
    borderColor: themas.colors.Secondary

  },

  input: {
    flex: 1,
    fontSize: 18,
    color: themas.colors.White,
  },

});
import { StyleSheet } from "react-native";
import { themas } from "@/global/themas";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 24,
        paddingTop: 0,
        flexDirection: "column",
        backgroundColor: themas.colors.grayStrong
    },

    footer: {
        flex: 1,
        justifyContent: "space-evenly",
        flexDirection: "column",
    },

    options: {
        flexDirection: "column",
        gap: 30,
    },

    headline: {
        fontSize: 40,
        fontWeight: "light", 
        color: themas.colors.White
    }
});
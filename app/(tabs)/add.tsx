import { themas } from "@/global/themas";
import { Text, View, StyleSheet} from "react-native";

export default function add() {
  return (
    <View style={styles.container}>
      <Text>menu</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: themas.colors.grayStrong,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    padding: 20,
  }
});
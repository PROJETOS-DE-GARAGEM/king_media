import { ButtonIcon } from "@/components/ButtonIcon";
import { InputSearch } from "@/components/InputSearch";
import { themas } from "@/global/themas";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, StyleSheet} from "react-native";

export default function LivroStep2() {
  return (
    <View style={styles.container}>
      <InputSearch placeholder="Pesquise o nome do livro"></InputSearch>
      <View>
        <View style={styles.lineBox}>
          <View style={styles.line}></View>
          <MaterialIcons name="sync" color={themas.colors.Secondary} size={24}></MaterialIcons>
          <View style={styles.line}></View>
        </View>
        <ButtonIcon title="Adicionar manualmente" href={"/criarMidia/livro/step3"} iconName="add"></ButtonIcon>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: themas.colors.grayStrong,
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 70,
    paddingHorizontal: 24,
  },

  line: {
    flex: 1,                 
    height: 2,               
    backgroundColor: themas.colors.Secondary, 
    marginHorizontal: 10,
    marginVertical: 15   
  },

  lineBox: {
    flexDirection: 'row',   
    alignItems: 'center',
    marginVertical: 15,
  }
});
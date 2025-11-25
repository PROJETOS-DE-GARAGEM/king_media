import { ButtonIcon } from "@/components/ButtonIcon";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";


export default function CriarMidia() {

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <Text style={styles.headline}>O que pretende organizar?</Text>
        <View style={styles.options}>
          <ButtonIcon href={"/criarMidia/serie/step2"} title="Série" iconName="smart-display"/>
          <ButtonIcon href={"/criarMidia/filme/step2"} title="Filme" iconName="movie" />
          <ButtonIcon href={"/criarMidia/livro/step2"} title="Livro" iconName="book" />
        </View>
      </View>
    </View>
  );
}

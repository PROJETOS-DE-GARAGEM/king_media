import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export function ButtonGeral({ title, path }: any) {
    const router = useRouter();
   
    
    function login(){
        router.push(path);
      }

    return (
        <View style={styles.caixa1}>       
             <TouchableOpacity onPress={login} style={styles.caixa2}>
            <Text style={styles.textoBotao}>{title}</Text>
        </TouchableOpacity>
        </View>

    )
};
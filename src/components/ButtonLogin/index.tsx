import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

export function ButtonLogin({ title, path }: any) {
    const router = useRouter();
   
    
    function login(){
        router.push(path);
      }

    return (

        <TouchableOpacity onPress={login} style={styles.buttonUm}>
            <Text style={styles.textoBotao}>{title}</Text>
        </TouchableOpacity>
        
    )
};
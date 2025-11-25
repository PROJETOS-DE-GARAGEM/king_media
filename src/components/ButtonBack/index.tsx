import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

// Podemos extender as props do TouchableOpacity para permitir passar estilos, etc.
interface ButtonBackProps extends TouchableOpacityProps {}

export function ButtonBack({ ...rest }: ButtonBackProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={() => router.back()} {...rest}>
            <Ionicons 
                name="arrow-back" 
                size={28} 
                color="#fff" 
            />
        </TouchableOpacity>
    );
}
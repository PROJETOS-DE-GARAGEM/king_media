import { MaterialIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { themas } from '@/global/themas';
import { Href, router } from 'expo-router'; // 1. Importar o router

type IconName = ComponentProps<typeof MaterialIcons>['name'];

type ButtonBaseProps = {
  title: string;
  iconName?: IconName;
};

type ButtonOnPressProps = ButtonBaseProps & {
  onPress: () => void;
  href?: never; 
};

type ButtonHrefProps = ButtonBaseProps & {
  href: Href;
  onPress?: never; 
};

type ButtonProps = ButtonOnPressProps | ButtonHrefProps;

export function ButtonIcon({ title, onPress, iconName, href }: ButtonProps) {
  function handlePress() {
    if (href) {
      router.push(href);
    } else if (onPress) {
      onPress();
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.group}>
        {iconName && (
          <MaterialIcons name={iconName} size={16} color={themas.colors.grayStrong}/>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
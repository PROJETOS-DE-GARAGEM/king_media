import { MaterialIcons } from "@expo/vector-icons"
import { TextInput, View } from "react-native"
import { style } from "./styles"
import { themas } from "@/global/themas"

type InputSearchProps = {
  placeholder: string;
};

export function InputSearch({placeholder} : InputSearchProps) {
    return (
        <View style={style.boxInput}>
            <MaterialIcons
                name="search"
                size={20}
                color={themas.colors.White}
                style={{ marginRight: 8 }}
            />

            <TextInput
                style={style.input}
                placeholder={placeholder}
                placeholderTextColor={"gray"}
            />
        </View>

    )
}


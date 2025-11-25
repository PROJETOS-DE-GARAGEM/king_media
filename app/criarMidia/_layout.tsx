import { themas } from '@/global/themas';
import { Stack } from 'expo-router';

export default function FormLayout() {
    return (
        <Stack screenOptions={{
            
            headerStyle: {
                backgroundColor: themas.colors.grayStrong,
            },
            headerTintColor: themas.colors.White,
            headerTitleStyle: {
                fontWeight: 'regular',
                fontSize: 22,
            },
            headerShown: true,
            presentation: 'transparentModal',

        }}>
            <Stack.Screen
                name="index"
                options={{ title: 'Criar midia' }}
            />
            <Stack.Screen
                name="serie/step2" 
                options={{ title: 'Pesquisar série' }}
            />
            <Stack.Screen
                name="filme/step2"
                options={{ title: 'Pesquisar filme' }}
            />
            <Stack.Screen
                name="livro/step2"
                options={{ title: 'Pesquisar livro' }}
            />
        </Stack>
    );
}
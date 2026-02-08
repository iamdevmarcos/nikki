import { Ionicons } from "@expo/vector-icons"
import { Image, Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const OnBoarding = () => {
    return(
        <SafeAreaView className="bg-black h-screen justify-center">
            <Pressable className="absolute top-14 right-10">
                <Text className="text-white text-sm">
                    Pular
                </Text>
            </Pressable>
            <View className="flex flex-col items-center align-center justify-center">
                <Image
                    source={require('../assets/images/login/bg.png')}
                    className="w-48 h-48 mb-10"
                    resizeMode="contain"
                />
                <View className="items-center flex flex-col gap-3">
                    <Text className="text-white tracking-[2px]">Novo App de Notas</Text>
                    <Text className="text-white text-xs tracking-[2px]">Bem-vindo ao seu novo App de Notas</Text>
                </View>
            </View>
            <Pressable className="w-10 h-10 bg-white flex justify-center align-center items-center rounded-full self-baseline-last absolute bottom-10 self-center">
                <Ionicons name="arrow-forward" size={15} color="black" />
            </Pressable>
        </SafeAreaView>
    )
}

export default OnBoarding
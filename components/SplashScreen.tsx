import { Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const SplashScreen = () => {
    return(
        <SafeAreaView className="bg-black h-screen flex justify-center items-center">
            <Image
                source={require('../assets/images/splashScreen/SplashScreenLogo.png')}
                className="w-60 h-60"
                resizeMode="contain"
            />
        </SafeAreaView>
    )
}

export default SplashScreen
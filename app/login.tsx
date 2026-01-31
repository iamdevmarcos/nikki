import { useOAuth } from "@clerk/clerk-expo";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { t } = useTranslation();

  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookFlow } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: startDiscordFlow } = useOAuth({ strategy: "oauth_discord" });

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL("/oauth-native-callback", { scheme: "nikki" }),
      });
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startGoogleFlow]);

  const onFacebookPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startFacebookFlow({
        redirectUrl: Linking.createURL("/oauth-native-callback", { scheme: "nikki" }),
      });
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startFacebookFlow]);

  const onDiscordPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startDiscordFlow({
        redirectUrl: Linking.createURL("/oauth-native-callback", { scheme: "nikki" }),
      });
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startDiscordFlow]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle={'light-content'} />
      <View className="flex-1 p-6">
        <View className="items-center mt-4">
          <Text className="text-white text-3xl font-bold tracking-[-.2px]">LOGO</Text>
        </View>

        <View className="flex-1 relative justify-center items-center">
          <Image
            source={require('../assets/images/login/bg.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', 'black']}
            className="absolute bottom-0 left-0 right-0 h-40"
          />
        </View>

        <View className="mt-auto mb-10">
          <View className="gap-3">
            <SocialLoginButton icon="google" text={t("login.continue_with_google")} onPress={onGooglePress} />
            <SocialLoginButton icon="facebook" text={t("login.continue_with_facebook")} onPress={onFacebookPress} />
            <SocialLoginButton text={t("login.continue_with_discord")} onPress={onDiscordPress} customIcon={<MaterialIcons name="discord" size={24} color="black" />} />
          </View>

          <View className="h-[0.5px] bg-zinc-600 my-8" />

          <Text className="font-serif text-zinc-200 text-md text-center leading-relaxed px-8">
            {t("login.slogan")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const SocialLoginButton = ({ icon, customIcon, text, onPress }: { icon?: any, customIcon?: React.ReactNode, text: string, onPress: () => void }) => {
  return (
    <TouchableOpacity
      className="bg-white flex-row items-center justify-center py-4 rounded"
      activeOpacity={0.7}
      onPress={onPress}
    >
      {customIcon ? customIcon : <FontAwesome name={icon} size={20} color="black" />}
      <Text className="text-black text-lg font-semibold ml-3 tracking-[-0.2px]">{text}</Text>
    </TouchableOpacity>
  );
}
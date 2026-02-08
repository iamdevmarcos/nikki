import { useOAuth } from "@clerk/clerk-expo";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookFlow } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: startXFlow } = useOAuth({ strategy: "oauth_x" });

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

  const onXPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startXFlow({
        redirectUrl: Linking.createURL("/oauth-native-callback", { scheme: "nikki" }),
      });
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startXFlow]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.18)', 'rgba(230, 168, 53, 0.15)', '#000000', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView className="flex-1">
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
          </View>

          <View className="mt-auto mb-10">
            <View className="gap-3">
              <SocialLoginButton icon="google" text={t("login.continue_with_google")} onPress={onGooglePress} />
              <SocialLoginButton icon="facebook" text={t("login.continue_with_facebook")} onPress={onFacebookPress} />
              <SocialLoginButton icon="x-twitter" text={t("login.continue_with_x")} onPress={onXPress} />
            </View>

            <View className="h-[0.5px] bg-cadet-gray my-8" />

            <Text className="font-serif text-cadet-gray text-md text-center leading-relaxed px-8">
              {t("login.slogan")}
            </Text>

          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});

const SocialLoginButton = ({ icon, customIcon, text, onPress }: { icon?: any, customIcon?: React.ReactNode, text: string, onPress: () => void }) => {
  return (
    <TouchableOpacity
      className="bg-white flex-row items-center justify-center py-4 rounded"
      activeOpacity={0.7}
      onPress={onPress}
    >
      {customIcon ? customIcon : (icon === "x-twitter" ? <FontAwesome6 name={icon} size={20} color="#071011" /> : <FontAwesome name={icon} size={20} color="#071011" />)}
      <Text className="text-richBlack text-lg font-semibold ml-3 tracking-[-0.2px]">{text}</Text>
    </TouchableOpacity>
  );
}
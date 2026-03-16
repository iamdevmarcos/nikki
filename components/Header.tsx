import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const DAMPING = 12;
const STIFFNESS = 150;
const MASS = 0.5;
const TRANSLATION_X_MULTIPLIER = 34;
const AVATAR_SCALE_DOWN = 0.9;
const AVATAR_SCALE_NORMAL = 1;

interface HeaderProps {
  hideLanguageToggle?: boolean;
}

const Header = ({ hideLanguageToggle = false }: HeaderProps) => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const isPT = currentLang.startsWith("pt");

  const translationX = useSharedValue(isPT ? 1 : 0);
  const avatarScale = useSharedValue(1);

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t("settings.logout_confirm_title"),
      t("settings.logout_confirm_message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.logout"),
          style: "destructive",
          onPress: () => signOut(),
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    translationX.value = withSpring(isPT ? 1 : 0, {
      damping: DAMPING,
      stiffness: STIFFNESS,
      mass: MASS,
    });
  }, [isPT]);

  const toggleLanguage = () => {
    const nextLang = isPT ? "en" : "pt";
    console.log("[Header] Toggling language from", i18n.language, "to", nextLang);
    i18n.changeLanguage(nextLang)
      .then(() => console.log("[Header] Language changed to:", i18n.language))
      .catch(err => console.error("[Header] Error changing language:", err));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value * TRANSLATION_X_MULTIPLIER }],
  }));

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  return (
    <View className="p-6 w-full">
      <View className="flex-row items-center justify-between h-14">
        <Pressable
          onPressIn={() => (avatarScale.value = withSpring(AVATAR_SCALE_DOWN))}
          onPressOut={() => (avatarScale.value = withSpring(AVATAR_SCALE_NORMAL))}
          onPress={handleLogout}
        >
          <Animated.View style={[animatedAvatarStyle, { relative: true } as any]}>
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-14 h-14 rounded-full border-[2px] border-white/20 shadow-lg"
            />
            <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#071011]" />
          </Animated.View>
        </Pressable>

        {!hideLanguageToggle && (
          <Pressable
            onPress={toggleLanguage}
            className="bg-white/5 border border-white/10 rounded-full p-1 flex-row items-center relative w-[76px] h-[40px]"
          >
            <Animated.View
              style={[styles.thumb, animatedThumbStyle]}
              className="bg-hunyadi-yellow shadow-md"
            />

            <View className="flex-1 items-center justify-center">
              <Text className="text-lg opacity-90">🇺🇸</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <Text className="text-lg opacity-90">🇧🇷</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  thumb: {
    position: "absolute",
    left: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    zIndex: 0,
  },
});

export default Header;

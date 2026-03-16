import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AMBIENT_LIGHT_SIZE = 500;

export default function FollowUsScreen() {
  const { t, i18n } = useTranslation();
  const [, setTick] = React.useState(0);

  useEffect(() => {
    const handleLanguageChange = () => setTick((tick) => tick + 1);
    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const SocialItem = ({
    icon,
    label,
    handle,
    url,
    isLast = false,
    iconColor = "white"
  }: {
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    handle: string,
    url: string,
    isLast?: boolean,
    iconColor?: string
  }) => (
    <Pressable
      onPress={() => Linking.openURL(url)}
      className={`flex-row items-center px-5 py-5 ${!isLast ? 'border-b border-white/5' : ''}`}
      style={({ pressed }) => ({
        backgroundColor: pressed ? 'rgba(255,255,255,0.02)' : 'transparent'
      })}
    >
      <View className="w-12 h-12 items-center justify-center bg-white/10 rounded-2xl mr-4 border border-white/5">
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold text-[17px] tracking-tight">{label}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-white/30 mr-2 text-[15px] font-medium">{handle}</Text>
        <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.2)" />
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.18)', 'rgba(230, 168, 53, 0.15)', '#000000', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        className="absolute top-1/3 left-1/2 rounded-full"
        style={{
          width: AMBIENT_LIGHT_SIZE,
          height: AMBIENT_LIGHT_SIZE,
          backgroundColor: 'rgba(230, 168, 53, 0.05)',
          opacity: 0.5,
          transform: [{ translateX: -(AMBIENT_LIGHT_SIZE / 2) }, { translateY: -(AMBIENT_LIGHT_SIZE / 2) }]
        }}
      />

      <SafeAreaView className="flex-1">
        <Header />
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 40, paddingBottom: 120 }}
        >
          <View className="items-center mb-12">
            <View className="flex-row items-center justify-center">
              <View className="relative z-10">
                <Image
                  source={{ uri: "https://github.com/iamdevmarcos.png" }}
                  className="w-28 h-28 rounded-full"
                />
              </View>
              <View className="relative -ml-10">
                <Image
                  source={{ uri: "https://github.com/bluejono.png" }}
                  className="w-28 h-28 rounded-full"
                />
              </View>
            </View>

            <View className="items-center mt-10 px-4 max-w-[280px]">
              <Text className="text-white text-center text-lg leading-6 font-medium">
                {t('follow_us.minds_behind')}
              </Text>
              <Text className="text-white/40 text-center text-[15px] mt-6 font-normal">
                {t('follow_us.call_to_action')}
              </Text>
            </View>
          </View>

          <View className="gap-y-6">
            <View className="bg-white/5 rounded-[32px] overflow-hidden border border-white/10">
              <SocialItem
                icon="logo-linkedin"
                label="LinkedIn"
                handle="iamdevmarcos"
                url="https://www.linkedin.com/in/iamdevmarcos/"
                iconColor="#0A66C2"
              />
              <SocialItem
                icon="logo-github"
                label="GitHub"
                handle="iamdevmarcos"
                url="https://github.com/iamdevmarcos"
                isLast
                iconColor="white"
              />
            </View>

            <View className="bg-white/5 rounded-[32px] overflow-hidden border border-white/10">
              <SocialItem
                icon="logo-linkedin"
                label="LinkedIn"
                handle="bluejono"
                url="https://www.linkedin.com/in/bluejono/"
                iconColor="#0A66C2"
              />
              <SocialItem
                icon="logo-github"
                label="GitHub"
                handle="bluejono"
                url="https://github.com/bluejono"
                isLast
                iconColor="white"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

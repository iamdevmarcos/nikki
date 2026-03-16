import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NOON_HOUR = 12;
const EVENING_HOUR = 18;
const REFRESH_INTERVAL_MS = 60000;

const DECORATION_LARGE_SIZE = 192;
const DECORATION_SMALL_SIZE = 96;

const HomeHero = () => {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState("");
  const router = useRouter();

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();

      let greetingKey = "home.hero_greeting_evening";
      if (currentHour < NOON_HOUR) {
        greetingKey = "home.hero_greeting_morning";
      } else if (currentHour < EVENING_HOUR) {
        greetingKey = "home.hero_greeting_afternoon";
      }

      setGreeting(t(greetingKey));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [t]);

  const handleNewNote = () => {
    router.push("/new-note");
  };


  return (
    <View className="mb-6 rounded-3xl overflow-hidden bg-hunyadi-yellow p-6 shadow-xl shadow-hunyadi-yellow/20">
      <View className="z-10 gap-6">
        <View>
          <Text className="text-3xl font-black leading-tight tracking-tighter text-[#071011]">
            {greeting}
          </Text>
          <Text className="mt-2 text-[#071011]/70 font-semibold text-base">
            {t("home.hero_question")}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleNewNote}
          activeOpacity={0.9}
          className="bg-[#071011] self-start flex-row items-center gap-2 px-6 py-3.5 rounded-2xl shadow-lg"
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text className="text-white font-bold text-sm">
            {t("home.quick_note")}
          </Text>
        </TouchableOpacity>
      </View>


      <View
        style={[styles.decorationLarge, { backgroundColor: "rgba(255,255,255,0.2)" }]}
        className="absolute -right-8 -bottom-8 rounded-full"
      />
      <View
        style={[styles.decorationSmall, { backgroundColor: "rgba(255,255,255,0.1)" }]}
        className="absolute right-4 top-4 rounded-full"
      />
    </View>
  );
};

export default HomeHero;

const styles = StyleSheet.create({
  decorationLarge: {
    width: DECORATION_LARGE_SIZE,
    height: DECORATION_LARGE_SIZE,
  },
  decorationSmall: {
    width: DECORATION_SMALL_SIZE,
    height: DECORATION_SMALL_SIZE,
  },
});

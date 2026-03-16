import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const EmptyState = ({ isFiltered = false }: { isFiltered?: boolean }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleCreateNote = () => {
    router.push("/new-note");
  };

  return (
    <View className="flex-1 items-center justify-center px-10 pt-20">
      <Animated.View 
        entering={FadeInUp.delay(200).duration(1000).springify()}
        className="mb-10 items-center justify-center"
      >
        <View className="w-40 h-40 bg-hunyadi-yellow/10 rounded-full items-center justify-center border border-hunyadi-yellow/20">
          <View className="w-32 h-32 bg-hunyadi-yellow/20 rounded-full items-center justify-center border border-hunyadi-yellow/30">
            <Ionicons name="leaf-outline" size={64} color="#e6a835" />
          </View>
        </View>
        
        {/* Floating sparkles */}
        <Animated.View 
          entering={FadeInDown.delay(600)}
          className="absolute -top-2 -right-2"
        >
          <Ionicons name="sparkles" size={24} color="#e6a835" />
        </Animated.View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(400).duration(1000).springify()}
        className="items-center"
      >
        <Text className="text-white text-3xl font-black text-center tracking-tighter mb-4">
          {isFiltered ? t("empty_state.filtered_title") : t("empty_state.title")}
        </Text>
        <Text className="text-white/40 text-center text-lg font-medium leading-6 max-w-[260px]">
          {isFiltered ? t("empty_state.filtered_description") : t("empty_state.description")}
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(600).duration(1000).springify()}
        className="mt-12 w-full"
      >
        <Pressable
          onPress={handleCreateNote}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
          className="bg-hunyadi-yellow py-5 rounded-[24px] items-center justify-center flex-row shadow-xl shadow-hunyadi-yellow/20"
        >
          <Ionicons name="add-circle-outline" size={24} color="#071011" className="mr-2" />
          <Text className="text-[#071011] font-black text-lg">
            {t("empty_state.button")}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default EmptyState;

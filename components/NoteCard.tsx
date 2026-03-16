import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const DECORATION_LARGE_SIZE = 192;
const DECORATION_SMALL_SIZE = 96;
const NUMBER_OF_LINES = 2;

interface NoteCardProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSwipeableWillOpen?: (swipeable: Swipeable) => void;
}

const NoteCard = ({ id, title, description, createdAt, onDelete, onEdit, onSwipeableWillOpen }: NoteCardProps) => {

  const swipeableRef = React.useRef<Swipeable>(null);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-192, 0],
      outputRange: [0, 192],
    });

    return (
      <View style={{ width: 192, flexDirection: "row" }}>
        <Animated.View
          style={{
            flex: 1,
            flexDirection: "row",
            transform: [{ translateX: trans }],
          }}
        >
          <TouchableOpacity
            onPress={() => {
              swipeableRef.current?.close();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onEdit(id);
            }}
            activeOpacity={0.8}
            className="bg-blue-500 justify-center items-center flex-1 h-full"
          >
            <Ionicons name="pencil-outline" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              swipeableRef.current?.close();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onDelete(id);
            }}
            activeOpacity={0.8}
            className="bg-red-500 justify-center items-center flex-1 h-full"
          >
            <Ionicons name="trash-outline" size={32} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };




  return (
    <View
      className="shadow-xl shadow-hunyadi-yellow/20"
      style={{
        marginBottom: 16,
        marginHorizontal: 24,
        borderRadius: 24,
        overflow: "hidden",
      }}
    >
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        overshootRight={false}
        leftThreshold={30}
        rightThreshold={40}
        onSwipeableWillOpen={() => {
          if (swipeableRef.current) {
            onSwipeableWillOpen?.(swipeableRef.current);
          }
        }}
      >
        <View className="bg-hunyadi-yellow p-6 relative">
          <View className="z-10 gap-2">
            <View className="flex-row justify-between items-start">
              <Text
                className="flex-1 text-3xl font-black leading-tight tracking-tighter text-[#071011]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
              <Text className="text-[#071011]/50 font-bold text-xs mt-2">
                {createdAt}
              </Text>
            </View>

            <Text
              className="text-[#071011]/70 font-semibold text-base leading-snug"
              numberOfLines={NUMBER_OF_LINES}
            >
              {description}
            </Text>
          </View>

          <View
            style={[styles.decorationLarge, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            className="absolute -right-8 -bottom-8 rounded-full z-0"
          />
          <View
            style={[styles.decorationSmall, { backgroundColor: "rgba(255,255,255,0.1)" }]}
            className="absolute right-4 top-4 rounded-full z-0"
          />
        </View>
      </Swipeable>
    </View>
  );
};

export default NoteCard;

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


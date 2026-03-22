import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";

import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_HEIGHT_IOS = 88;
const TAB_BAR_HEIGHT_ANDROID = 70;
const TAB_BAR_BOTTOM_OFFSET = 20;

const FAB_SIZE = 60;
const FAB_CONTAINER_SIZE = 64;
const FAB_TOP_OFFSET = -20;

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors["rich-black"],
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? TAB_BAR_HEIGHT_IOS : TAB_BAR_HEIGHT_ANDROID,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          position: "absolute",
          bottom: Platform.OS === "android" ? TAB_BAR_BOTTOM_OFFSET + insets.bottom : TAB_BAR_BOTTOM_OFFSET,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors["hunyadi-yellow"],
        tabBarInactiveTintColor: colors["cadet-gray"],
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-note"
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <View style={styles.fabContainer}>
              <View style={[styles.fab, { backgroundColor: colors["hunyadi-yellow"] }]}>
                <Ionicons name="add" size={32} color={colors["rich-black"]} />
              </View>
            </View>
          ),
          tabBarButton: (props: any) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.8}
              style={[props.style, styles.fabWrapper]}
              onPress={() => {
                router.push("/new-note");
              }}
            />
          ),

        }}
      />

      <Tabs.Screen
        name="follow-us"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="server-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    top: FAB_TOP_OFFSET,
    justifyContent: "center",
    alignItems: "center",
  },
  fabContainer: {
    width: FAB_CONTAINER_SIZE,
    height: FAB_CONTAINER_SIZE,
    borderRadius: FAB_CONTAINER_SIZE / 2,
    backgroundColor: "transparent",
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e6a835",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const handleSignOut = () => {
    Alert.alert(
      t("settings.logout_confirm_title", "Logout"),
      t("settings.logout_confirm_message", "Are you sure you want to logout?"),
      [
        { text: t("common.cancel", "Cancel"), style: "cancel" },
        {
          text: t("settings.logout", "Logout"),
          style: "destructive",
          onPress: () => signOut()
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View className="flex-1">
        <DrawerItemList {...props} />
      </View>

      <View className="p-4 border-t border-border/10 mb-8">
        <DrawerItem
          label={t("settings.logout", "Logout")}
          labelStyle={{
            color: "#EF4444",
            fontSize: 16,
            fontWeight: "600"
          }}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color="#EF4444" />
          )}
          onPress={handleSignOut}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { colorScheme, colors } = useTheme();

  const iconColor = colors.foreground;
  const activeBackgroundColor = colorScheme === "dark" ? "#27272A" : "#F4F4F5";

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerActiveTintColor: colors.foreground,
        drawerInactiveTintColor: colorScheme === "dark" ? "#A1A1AA" : "#71717A",
        drawerActiveBackgroundColor: activeBackgroundColor,
        drawerStyle: {
          backgroundColor: colors.background,
          borderLeftWidth: 1,
          borderLeftColor: '#f5f5f5',
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerShown: false,
          drawerIcon: ({ size }) => (
            <Ionicons name="home-outline" size={size} color={iconColor} />
          ),
        }}
      />
      <Drawer.Screen
        name="new-note"
        options={{
          drawerLabel: "New Note",
          title: "New Note",
          headerShown: false,
          drawerIcon: ({ size }) => (
            <Ionicons name="add-circle-outline" size={size} color={iconColor} />
          ),
        }}
      />
      <Drawer.Screen
        name="favorites"
        options={{
          drawerLabel: "Favorites",
          title: "Favorites",
          drawerIcon: ({ size }) => (
            <Ionicons name="star-outline" size={size} color={iconColor} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerIcon: ({ size }) => (
            <Ionicons name="settings-outline" size={size} color={iconColor} />
          ),
        }}
      />
    </Drawer>
  );
}

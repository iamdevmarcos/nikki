import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

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
      <View className="flex-1 mt-4">
        <DrawerItemList {...props} />

        <View className="px-2 mt-2">
          <DrawerItem
            label="Follow Us"
            labelStyle={{ color: colors.foreground, fontSize: 16, fontWeight: "500" }}
            icon={({ size }) => (
              <Ionicons name="people-outline" size={size} color={colors.foreground} />
            )}
            onPress={() => router.push("/(drawer)/(tabs)/follow-us")}
          />

          <DrawerItem
            label="See Onboarding"
            labelStyle={{ color: colors.foreground, fontSize: 16, fontWeight: "500" }}
            icon={({ size }) => (
              <Ionicons name="information-circle-outline" size={size} color={colors.foreground} />
            )}
            onPress={() => router.push("/onboarding")}
          />
        </View>
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
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: t("navigation.home", "Home"),
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

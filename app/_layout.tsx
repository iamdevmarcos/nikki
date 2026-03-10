import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  Merriweather_300Light,
  Merriweather_400Regular,
  Merriweather_700Bold,
  Merriweather_900Black,
} from "@expo-google-fonts/merriweather";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "../db/client";
import migrations from "../db/migrations/migrations";

import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoadingScreen from "@/components/LoadingScreen";
import "@/global.css";
import "@/i18n";
import { ThemeProvider } from "@/theme/ThemeContext";
import { Text } from "react-native";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(drawer)";
    const isCallbackPage = segments[0] === "oauth-native-callback";

    if (isSignedIn && !inAuthGroup) {
      router.replace("/(drawer)/(tabs)");
    } else if (
      !isSignedIn &&
      segments[0] !== "login" &&
      segments[0] !== "onboarding" &&
      !isCallbackPage
    ) {
      router.replace("/login");
    }
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoadingScreen hideTexts />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="oauth-native-callback"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    Merriweather_300Light,
    Merriweather_400Regular,
    Merriweather_700Bold,
    Merriweather_900Black,
  });

  const { success: migrationSuccess, error: dbError } = useMigrations(
    db,
    migrations,
  );

  if (!loaded && !fontError) {
    return null;
  }

  if (fontError || dbError) {
    return <Text>Error: {fontError?.message || dbError?.message}</Text>;
  }

  if (!migrationSuccess) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={publishableKey}
          >
            <ClerkLoaded>
              <InitialLayout />
            </ClerkLoaded>
          </ClerkProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

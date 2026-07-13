import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo'
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
} from '@expo-google-fonts/inter'
import {
  Merriweather_300Light,
  Merriweather_400Regular,
  Merriweather_700Bold,
  Merriweather_900Black,
} from '@expo-google-fonts/merriweather'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { db } from '../db/client'
import migrations from '../db/migrations/migrations'

import Constants from 'expo-constants'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'


import '@/global.css'
import '@/i18n'
import { ThemeProvider } from '@/theme/ThemeContext'
import { Text } from 'react-native'

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key)
    } catch {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch {
      return
    }
  },
}

const publishableKey =
  Constants.expoConfig?.extra?.clerkPublishableKey ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  const inAuthGroup = segments[0] === '(drawer)'
  const isCallbackPage = segments[0] === 'oauth-native-callback'
  const isCorrectRoute = isSignedIn
    ? inAuthGroup
    : segments[0] === 'login' || isCallbackPage

  useEffect(() => {
    if (!isLoaded) return
    if (isCorrectRoute) return

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(drawer)/(tabs)')
    } else if (!isSignedIn && segments[0] !== 'login' && !isCallbackPage) {
      router.replace('/login')
    }
  }, [isCorrectRoute, isSignedIn, isLoaded, segments, router, inAuthGroup, isCallbackPage])

  if (!isLoaded || !isCorrectRoute) {
    return null
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
  )
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
  })

  const { success: migrationSuccess, error: dbError } = useMigrations(
    db,
    migrations,
  )

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={publishableKey}
          >
            <ClerkLoaded>
              {fontError || dbError ? (
                <Text>Error: {fontError?.message || dbError?.message}</Text>
              ) : !loaded || !migrationSuccess ? (
                null
              ) : (
                <InitialLayout />
              )}
            </ClerkLoaded>
          </ClerkProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

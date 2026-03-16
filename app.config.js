export default {
  expo: {
    name: 'nikki',
    slug: 'nikki',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'nikki',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.teamx.nikki',
      infoPlist: {
        NSSpeechRecognitionUsageDescription:
          'Allow Nikki to transcribe your voice into text.',
        NSMicrophoneUsageDescription:
          'Allow Nikki to access your microphone for voice notes.',
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.teamx.nikki',
      permissions: [
        'RECORD_AUDIO',
        'MODIFY_AUDIO_SETTINGS',
        'INTERNET',
        'android.permission.RECORD_AUDIO',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      'expo-font',
      'expo-secure-store',
      [
        'expo-speech-recognition',
        {
          microphonePermission:
            'Allow Nikki to access your microphone for voice notes.',
          speechRecognitionPermission:
            'Allow Nikki to transcribe your voice into text.',
        },
      ],
      'expo-sqlite',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '45c2fd77-ba2c-4eeb-8caf-eaa2ac910600',
      },
      clerkPublishableKey:
        'pk_test_ZHJpdmluZy1lbGYtMjUuY2xlcmsuYWNjb3VudHMuZGV2JA',
    },
  },
}

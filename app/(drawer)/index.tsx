import Header from "@/components/Header";
import { useTheme } from "@/theme/ThemeContext";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { isDark, colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-background items-center gap-8"
    >
      <Header />
      <View className="flex-1 justify-center items-center">
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View className="absolute top-12 right-6 flex-row gap-4">
          <TouchableOpacity
            onPress={toggleLanguage}
            className="p-3 rounded-full bg-secondary"
          >
            <Text className="text-secondary-foreground font-bold">
              {i18n.language.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-primary text-center text-4xl font-black mb-2">
            {t("home.title")}
          </Text>
          <Text className="text-foreground text-center text-3xl font-bold">
            {t("home.subtitle")}
          </Text>
          <Text className="text-muted-foreground text-center text-lg italic mt-4">
            {t("home.default_font")}
          </Text>
        </View>

        <View className="flex-row gap-4">
          <Link href="/login" asChild>
            <TouchableOpacity className="bg-primary px-8 py-4 rounded-xl shadow-lg border border-border">
              <Text className="text-primary-foreground font-bold text-lg">
                {t("home.go_to_login")}
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/new-note" asChild>
            <TouchableOpacity className="bg-primary px-8 py-4 rounded-xl shadow-lg border border-border">
              <Text className="text-primary-foreground font-bold text-lg">
                {t("home.go_to_new_note")}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="p-6 bg-secondary rounded-2xl w-5/6">
          <Text className="text-secondary-foreground font-semibold text-center">
            {t("home.container_text")}
          </Text>
        </View>
      </View>
    </SafeAreaView >
  );
}


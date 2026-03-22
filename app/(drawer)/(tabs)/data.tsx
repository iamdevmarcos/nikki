import Header from "@/components/Header";
import { db } from "@/db/client";
import { notes } from "@/db/schema";
import { useNotes } from "@/hooks/useNotes";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ANIMATION_DURATION = 800;
const GRADIENT_HEIGHT = "h-96";
const DELAY_INCREMENT = 200;

const DataCard = ({
  title,
  description,
  icon,
  onPress,
  delay = 0
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  delay?: number;
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(ANIMATION_DURATION).springify()}
      className="mb-4"
    >
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
        className="bg-[#1A1A1A] p-6 rounded-[32px] border border-white/5 flex-row items-center"
      >
        <View className="w-14 h-14 bg-hunyadi-yellow/10 rounded-2xl items-center justify-center mr-4">
          <Ionicons name={icon} size={28} color="#e6a835" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-xl font-bold mb-1">{title}</Text>
          <Text className="text-white/40 text-sm leading-relaxed">{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
      </Pressable>
    </Animated.View>
  );
};

export default function DataScreen() {
  const { t, i18n } = useTranslation();
  const { refreshNotes } = useNotes();
  const router = useRouter();

  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const handleLanguageChange = () => setTick((tick) => tick + 1);
    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const handleExport = async () => {
    try {
      const allNotes = await db.select().from(notes);
      
      if (allNotes.length === 0) {
        Alert.alert(t("data_backup.export_title"), t("data_backup.export_empty"));
        return;
      }

      const jsonData = JSON.stringify(allNotes, null, 2);
      const filename = `nikki-backup-${new Date().toISOString().split('T')[0]}.json`;

      if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          return;
        }

        const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          "application/json"
        );
        
        await FileSystem.writeAsStringAsync(newUri, jsonData, {
          encoding: "utf8" as any,
        });
        
        Alert.alert(t("common.success"), t("data_backup.export_success"));
      } else {
        const dir = FileSystem.documentDirectory || FileSystem.cacheDirectory || "";
        const fileUri = `${dir}${filename}`;

        await FileSystem.writeAsStringAsync(fileUri, jsonData, {
          encoding: "utf8" as any,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/json",
            dialogTitle: t("data_backup.export_title"),
            UTI: "public.json"
          });
          Alert.alert(t("common.success"), t("data_backup.export_success"));
        } else {
          Alert.alert(t("common.error"), t("data_backup.sharing_unavailable"));
        }
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert(t("common.error"), t("data_backup.export_error"));
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const importedNotes = JSON.parse(fileContent);

      if (!Array.isArray(importedNotes)) {
        throw new Error("Invalid format");
      }

      Alert.alert(
        t("data_backup.import_confirm_title"),
        t("data_backup.import_confirm_message"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.continue"),
            onPress: async () => {
              try {
                for (const note of importedNotes) {
                  if (note.id && note.title && note.content) {
                    await db.insert(notes).values({
                      id: note.id,
                      title: note.title,
                      content: note.content,
                      createdAt: new Date(note.createdAt),
                      updatedAt: new Date(note.updatedAt),
                      isSynced: !!note.isSynced,
                    }).onConflictDoUpdate({
                      target: notes.id,
                      set: {
                        title: note.title,
                        content: note.content,
                        updatedAt: new Date(),
                      }
                    });
                  }
                }
                await refreshNotes();
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                  t("common.success"), 
                  `${t("data_backup.import_success")}\n\n${t("data_backup.import_success_redirect")}`,
                  [
                    {
                      text: t("common.continue"),
                      onPress: () => {
                        router.replace("/");
                      }
                    }
                  ]
                );
              } catch (err) {
                console.error("Insert error:", err);
                Alert.alert(t("common.error"), t("data_backup.import_error"));
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Import error:", error);
      Alert.alert(t("common.error"), t("data_backup.import_error"));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#071011]" edges={["top"]}>
      <Header hideLanguageToggle />
      <LinearGradient
        colors={["rgba(230, 168, 53, 0.05)", "transparent"]}
        className={`absolute top-0 left-0 right-0 ${GRADIENT_HEIGHT}`}
      />

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(ANIMATION_DURATION).springify()}
          className="mb-10"
        >
          <Text className="text-white text-5xl font-black tracking-tighter mb-4">
            {t("data_backup.title")}
          </Text>
          <Text className="text-white/50 text-lg leading-relaxed max-w-[280px]">
            {t("data_backup.description")}
          </Text>
        </Animated.View>

        <View className="space-y-4">
          <DataCard
            title={t("data_backup.export_title")}
            description={t("data_backup.export_description")}
            icon="cloud-download-outline"
            onPress={handleExport}
            delay={DELAY_INCREMENT}
          />

          <DataCard
            title={t("data_backup.import_title")}
            description={t("data_backup.import_description")}
            icon="cloud-upload-outline"
            onPress={handleImport}
            delay={DELAY_INCREMENT * 2}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(DELAY_INCREMENT * 3).duration(ANIMATION_DURATION).springify()}
          className="mt-8 p-6 bg-hunyadi-yellow/5 rounded-[32px] border border-hunyadi-yellow/10"
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark-outline" size={20} color="#e6a835" />
            <Text className="text-hunyadi-yellow font-bold ml-2 uppercase tracking-widest text-[10px]">
              {t("data_backup.privacy_title")}
            </Text>
          </View>
          <Text className="text-white/40 text-xs leading-5">
            {t("data_backup.privacy_description")}
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

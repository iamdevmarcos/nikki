import { useNoteSpeechRecognition } from "@/hooks/useNoteSpeechRecognition";
import { useNotes } from "@/hooks/useNotes";
import { Language } from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import { formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";


import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MIN_CONTENT_HEIGHT = 400;
const ACTIVE_OPACITY_HIGH = 0.8;
const ACTIVE_OPACITY_MEDIUM = 0.7;

export default function NewNote() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const { addNote, updateNote, deleteNote, notes } = useNotes();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const isIos = Platform.OS === "ios";
  const contentInputRef = useRef<TextInput>(null);

  const onFinalResult = useCallback((transcript: string) => {
    setContent((prev) => {
      const needsSpace = prev.length > 0 && !prev.endsWith(" ");
      return `${prev}${needsSpace ? " " : ""}${transcript}`;
    });
  }, []);

  const {
    isListening,
    interimTranscript,
    pulseAnim,
    handleMicPress,
    stopListening
  } = useNoteSpeechRecognition({ onFinalResult });

  useFocusEffect(
    useCallback(() => {
      const isEditing = id && id !== "null" && id !== "";

      if (isEditing && notes) {
        const note = notes.find((n) => n.id === id);
        if (note) {
          setTitle(note.title || "");
          setContent(note.content || "");
          setDate(new Date(note.createdAt));
        }
      } else {
        setTitle("");
        setContent("");
        setDate(new Date());
      }
    }, [id, notes])
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopListening();
      };
    }, [stopListening])
  );





  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const getFormattedContent = () => {
    if (!interimTranscript) return content;
    const needsSpace = content.length > 0 && !content.endsWith(" ");
    return `${content}${needsSpace ? " " : ""}${interimTranscript}`;
  };

  const formattedContent = getFormattedContent();

  const handleFocusTitle = () => {
    setKeyboardVisible(false);
    stopListening();
  };

  const handleSave = async () => {
    if (!title.trim() && !formattedContent.trim()) {
      handleBack();
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (id) {
        await updateNote(id, title, formattedContent, date);
      } else {
        await addNote(title, formattedContent, date);
      }
      router.setParams({ id: undefined });
      router.back();
    } catch (error) {
      console.error("Error saving note:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      t("delete_note.title"),
      t("delete_note.message"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await deleteNote(id);
              router.setParams({ id: undefined });
              router.back();
            } catch (error) {
              console.error("Error deleting note:", error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };





  return (
    <SafeAreaView className="bg-background flex-1" edges={["top"]}>
      <KeyboardAvoidingView behavior={isIos ? "padding" : "height"} className="flex-1">
        <View className="flex-row justify-between items-center p-6 pb-0">
          <TouchableOpacity
            onPress={handleBack}
            className="w-12 h-12 rounded-full bg-primary items-center justify-center border border-border/10"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>

          <View className="flex-1 items-center px-4 flex-row justify-center gap-4">
            {(isKeyboardVisible || isListening) && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  onPress={handleMicPress}
                  activeOpacity={ACTIVE_OPACITY_MEDIUM}
                  className={`w-12 h-12 rounded-full items-center justify-center border border-white/10 ${isListening ? 'bg-red-500' : 'bg-zinc-800'}`}
                >
                  <Ionicons name={isListening ? "stop" : "mic"} size={24} color="white" />
                </TouchableOpacity>
              </Animated.View>
            )}

            {id && !isListening && (
              <TouchableOpacity
                onPress={handleDelete}
                className="w-12 h-12 rounded-full bg-red-500/10 items-center justify-center border border-red-500/20"
              >
                <Ionicons name="trash-outline" size={24} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>


          <TouchableOpacity
            onPress={handleSave}
            className="w-12 h-12 rounded-full bg-hunyadi-yellow items-center justify-center border border-border/10"
          >
            <Ionicons name="checkmark" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="mt-4">
            <TextInput
              className="text-foreground text-3xl font-bold leading-tight tracking-[-0.8px]"
              placeholder={t("note_editor.title_placeholder")}
              placeholderTextColor={isDark ? "#555" : "#999"}
              multiline
              value={title}
              onChangeText={setTitle}
              scrollEnabled={false}
              style={{ fontFamily: 'Inter_600SemiBold' }}
              onFocus={handleFocusTitle}
            />

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDatePicker(true);
              }}
              className={`${isIos ? "mt-2" : "mt-0 px-1"}`}
            >
              <Text className="text-muted-foreground text-md font-regular opacity-80 tracking-[-0.6px]">
                {formatDate(date, i18n.language as Language)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={isIos ? "default" : "calendar"}
                onChange={(e, d) => {
                  setShowDatePicker(isIos);
                  if (d) setDate(d);
                }}
                themeVariant={isDark ? "dark" : "light"}
              />
            )}
          </View>

          <View className="mt-2 pb-32">
            <TextInput
              ref={contentInputRef}
              className="text-foreground text-xl leading-relaxed text-justify tracking-[-0.3px]"
              placeholder={t("note_editor.content_placeholder")}
              placeholderTextColor={isDark ? "#444" : "#ccc"}
              multiline
              value={formattedContent}
              onChangeText={setContent}
              scrollEnabled={false}
              style={{ minHeight: MIN_CONTENT_HEIGHT, textAlignVertical: "top", fontFamily: 'Inter_400Regular' }}
              onFocus={() => setKeyboardVisible(true)}
            />
          </View>
        </ScrollView>

        {(isKeyboardVisible || isListening) && (
          <Animated.View 
            style={{ transform: [{ scale: pulseAnim }] }} 
            className="absolute bottom-6 self-center z-50 shadow-2xl shadow-black/40"
          >
            <TouchableOpacity
              onPress={handleMicPress}
              activeOpacity={ACTIVE_OPACITY_HIGH}
              className={`flex-row items-center justify-center px-8 py-4 rounded-[32px] border ${
                isListening 
                  ? 'bg-red-500 border-red-400' 
                  : 'bg-[#071011] border-hunyadi-yellow/30'
              }`}
            >
              <Ionicons 
                name={isListening ? "recording" : "mic"} 
                size={24} 
                color={isListening ? "white" : "#e6a835"} 
              />
              <Text className={`ml-3 font-bold text-lg tracking-tight ${
                isListening ? 'text-white' : 'text-hunyadi-yellow'
              }`}>
                {isListening ? t("note_editor.listening") : t("note_editor.tap_to_speak")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

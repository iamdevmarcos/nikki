import { useNoteSpeechRecognition } from "@/hooks/useNoteSpeechRecognition";
import { Language } from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import { formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
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

export default function NewNote() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();

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

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleFocusTitle = () => {
    setKeyboardVisible(false);
    stopListening();
  };

  const getFormattedContent = () => {
    if (!interimTranscript) return content;
    const needsSpace = content.length > 0 && !content.endsWith(" ");
    return `${content}${needsSpace ? " " : ""}${interimTranscript}`;
  };

  const formattedContent = getFormattedContent();

  return (
    <SafeAreaView className="bg-background flex-1" edges={["top"]}>
      <KeyboardAvoidingView behavior={isIos ? "padding" : "height"} className="flex-1">
        {/* Top Bar */}
        <View className="flex-row justify-between items-center p-6 pb-0">
          <TouchableOpacity
            onPress={handleBack}
            className="w-12 h-12 rounded-full bg-primary items-center justify-center border border-border/10"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>

          <View className="flex-1 items-center px-4">
            {(isKeyboardVisible || isListening) && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  onPress={handleMicPress}
                  activeOpacity={0.7}
                  className={`w-12 h-12 rounded-full items-center justify-center border border-white/10 ${isListening ? 'bg-red-500' : 'bg-zinc-800'}`}
                >
                  <Ionicons name={isListening ? "stop" : "mic"} size={24} color="white" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleBack}
            className="w-12 h-12 rounded-full bg-hunyadi-yellow items-center justify-center border border-border/10"
          >
            <Ionicons name="checkmark" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Note Header */}
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

          {/* Note Content Section */}
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
              style={{ minHeight: 400, textAlignVertical: "top", fontFamily: 'Inter_400Regular' }}
              onFocus={() => setKeyboardVisible(true)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

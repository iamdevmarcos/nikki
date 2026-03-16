import Header from "@/components/Header";
import NoteCard from "@/components/NoteCard";
import { Note } from "@/db/schema";
import { useNotes } from "@/hooks/useNotes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { searchNotes, deleteNote } = useNotes();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[]>([]);
  const activeSwipeableRef = useRef<Swipeable | null>(null);

  const handleSwipeOpen = useCallback((swipeable: Swipeable) => {
    if (activeSwipeableRef.current && activeSwipeableRef.current !== swipeable) {
      activeSwipeableRef.current.close();
    }
    activeSwipeableRef.current = swipeable;
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        const searchResults = await searchNotes(query);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleEdit = (id: string) => {
    router.push({
      pathname: "/new-note",
      params: { id },
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      t("delete_note.title"),
      t("delete_note.message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteNote(id);
            // Refresh results after delete if there's still a query
            if (query.trim()) {
              const searchResults = await searchNotes(query);
              setResults(searchResults);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Header />

      <View className="px-6 mt-2">
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 h-14">
          <Ionicons name="search" size={20} color="#91A0AA" />
          <TextInput
            className="flex-1 ml-3 text-foreground text-lg"
            placeholder={t("search.placeholder")}
            placeholderTextColor="#91A0AA"
            value={query}
            onChangeText={setQuery}
            autoFocus
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color="#91A0AA" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        className="flex-1 mt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center mt-20 px-10">
            <View className="w-20 h-20 bg-white/5 rounded-full items-center justify-center mb-4">
              <Ionicons
                name={query.trim() ? "search-outline" : "document-text-outline"}
                size={40}
                color="#91A0AA"
              />
            </View>
            <Text className="text-[#91A0AA] text-center text-lg font-semibold">
              {query.trim() ? t("search.no_results") : t("search.start_typing")}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <NoteCard
            id={item.id}
            title={item.title}
            description={item.content}
            createdAt={new Date(item.createdAt).toLocaleString()}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onSwipeableWillOpen={handleSwipeOpen}
          />
        )}
        onScroll={() => Keyboard.dismiss()}
      />
    </SafeAreaView>
  );
}

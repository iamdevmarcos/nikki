import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import HorizontalCalendar from "@/components/HorizontalCalendar";
import NoteCard from "@/components/NoteCard";
import { useNotes } from "@/hooks/useNotes";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { notes, refreshNotes, deleteNote, hasAnyNotesGlobally, noteCountsByDate } = useNotes(selectedDate);
  const activeSwipeableRef = useRef<Swipeable | null>(null);
  const { t } = useTranslation();

  const handleSwipeOpen = useCallback((swipeable: Swipeable) => {
    if (activeSwipeableRef.current && activeSwipeableRef.current !== swipeable) {
      activeSwipeableRef.current.close();
    }
    activeSwipeableRef.current = swipeable;
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshNotes();
    }, [refreshNotes]),
  );

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
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteNote(id),
        },
      ],
      { cancelable: true }
    );
  };

  const hasNotes = notes && notes.length > 0;

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-background"
      edges={["top", "bottom"]}
    >
      <Header />
      <HorizontalCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} noteCountsByDate={noteCountsByDate} />

      <ScrollView
        className="flex-1 mt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 160,
          flexGrow: 1
        }}
      >
        {!hasNotes ? (
          <View className="flex-1">
            <EmptyState isFiltered={hasAnyNotesGlobally} />
          </View>
        ) : (
          <View className="gap-0">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                description={note.content}
                createdAt={new Date(note.createdAt).toLocaleString()}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSwipeableWillOpen={handleSwipeOpen}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

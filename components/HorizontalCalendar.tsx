import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface HorizontalCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  noteCountsByDate?: Record<string, number>;
}

const DAYS_RANGE = 30;
const ITEM_WIDTH = 64;
const SCROLL_TIMEOUT_MS = 100;
const SCROLL_RETRY_MS = 500;
const CENTER_VIEW_POSITION = 0.5;

export default function HorizontalCalendar({ selectedDate, onSelectDate, noteCountsByDate = {} }: HorizontalCalendarProps) {
  const { i18n } = useTranslation();
  const flatListRef = useRef<FlatList>(null);

  const dates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = [];
    for (let i = -DAYS_RANGE; i <= DAYS_RANGE; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const index = dates.findIndex((d) => isSameDay(d, selectedDate));
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: CENTER_VIEW_POSITION,
        });
      }
    }, SCROLL_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [selectedDate, dates]);

  const formatWeekday = (date: Date) => {
    try {
      return new Intl.DateTimeFormat(i18n.language || 'en', { weekday: 'short' }).format(date);
    } catch {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
    }
  };

  return (
    <View className="py-2 mb-2 border-b border-border/20">
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={dates}
        initialScrollIndex={DAYS_RANGE}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, SCROLL_RETRY_MS));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: CENTER_VIEW_POSITION });
          });
        }}
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        renderItem={({ item: date }) => {
          const selected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const dateStr = date.toISOString().split("T")[0];
          const count = noteCountsByDate[dateStr] || 0;

          return (
            <View style={{ width: ITEM_WIDTH }} className="items-center py-2">
              <TouchableOpacity
                onPress={() => onSelectDate(date)}
                className={`w-14 items-center justify-center py-2 rounded-2xl relative ${
                  selected 
                    ? "bg-foreground" 
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs mb-1 font-medium ${
                    selected 
                      ? "text-background"
                      : (isToday ? "text-hunyadi-yellow" : "text-cadet-gray")
                  } capitalize`}
                >
                  {formatWeekday(date)}
                </Text>

                <View className={`w-8 h-8 rounded-full items-center justify-center border-2 ${
                  selected 
                    ? "border-background/50"
                    : (isToday ? "border-hunyadi-yellow/50" : "border-transparent")
                }`}>
                  <Text
                    className={`text-base font-bold ${
                      selected 
                        ? "text-background"
                        : (isToday ? "text-hunyadi-yellow" : "text-foreground")
                    }`}
                  >
                    {date.getDate()}
                  </Text>
                </View>

                {count > 0 && (
                  <View className="absolute top-0 right-0 z-10 w-[18px] h-[18px] rounded-full items-center justify-center border-2 border-[#071011] bg-hunyadi-yellow">
                    <Text className="text-[10px] font-black leading-none text-rich-black">
                      {count > 9 ? '9+' : count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

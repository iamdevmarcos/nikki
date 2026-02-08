import { useTheme } from "@/theme/ThemeContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingScreen = () => {
  const { colors } = useTheme();

  const loadingPhrases = [
    { pt: "Preparando seu dia", jp: "一日を準備中" },
    { pt: "Organizando ideias", jp: "アイデアを整理中" },
    { pt: "Respirando fundo", jp: "深呼吸して" },
  ];

  const [currentInfoIndex, setCurrentInfoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInfoIndex((prevIndex) => (prevIndex + 1) % loadingPhrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentPhrase = loadingPhrases[currentInfoIndex];

  return (
    <SafeAreaView
      className="flex flex-col bg-black gap-6 items-center justify-center align-center h-screen">
      <ActivityIndicator className="justify-center align-center items-center" size="large" color={colors.background} />
      <Animated.View 
        key={currentInfoIndex} 
        entering={FadeInDown.springify()} 
        exiting={FadeOutUp.duration(200)}
        className="items-center flex flex-col gap-1">
          <Text className="text-white">{currentPhrase.pt}</Text>
          <Text className="text-xs text-white">"{currentPhrase.jp}"</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoadingScreen;

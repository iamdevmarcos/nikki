import { useAuth } from "@clerk/clerk-expo";
import OnBoarding from "@/components/OnBoarding";
import LoadingScreen from "@/components/LoadingScreen";
import { View } from "react-native";

export default function RootIndex() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded || isSignedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: "#071011" }}>
        <LoadingScreen hideTexts />
      </View>
    );
  }

  return <OnBoarding />;
}

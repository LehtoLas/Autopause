import { View, Text, ActivityIndicator, SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "../theme";

export function LoadingScreen({ userName }) {
  const t = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ActivityIndicator size="large" color="#00B4D8" />
      <Text style={{ fontSize: 18, fontWeight: "700", color: t.text, marginTop: 24, marginBottom: 8, textAlign: "center" }}>
        Haetaan ajoneuvotietoja
      </Text>
      <Text style={{ fontSize: 14, color: t.textSub, textAlign: "center", lineHeight: 22 }}>
        Tarkistetaan {userName} ajoneuvot Traficomista…
      </Text>
    </SafeAreaView>
  );
}

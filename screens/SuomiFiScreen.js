import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { BANKS } from "../constants";

export function SuomiFiScreen({ onSelectBank }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#003479" }}>
      <StatusBar barStyle="light-content" backgroundColor="#003479" />
      <View style={sf.topBar}>
        <View style={sf.logoBox}><Text style={sf.logoText}>suomi.fi</Text></View>
        <Text style={sf.topSub}>tunnistautuminen</Text>
      </View>
      <ScrollView style={sf.sheet} contentContainerStyle={sf.content} keyboardShouldPersistTaps="handled">
        <Text style={sf.title}>Tunnistaudu palveluun</Text>
        <Text style={sf.subtitle}>AutoPause — Traficom-asiointi</Text>
        <View style={sf.divider} />
        <Text style={sf.bankLabel}>Valitse tunnistautumistapa</Text>
        <View style={sf.bankGrid}>
          {BANKS.map((bank) => (
            <TouchableOpacity key={bank.id} activeOpacity={0.75}
              style={[sf.bankBtn, { backgroundColor: bank.bg, borderColor: bank.color + "55" }]}
              onPress={() => onSelectBank(bank)}>
              <Text style={[sf.bankName, { color: bank.color }]}>{bank.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={sf.divider} />
        <Text style={sf.disclaimer}>Tunnistautuminen tapahtuu turvallisesti Suomi.fi-palvelun kautta.</Text>
        <View style={sf.demoBox}>
          <Text style={sf.demoTitle}>🧪 Demo-tila</Text>
          <Text style={sf.demoText}>
            Käyttäjätunnus: <Text style={sf.demoCode}>123456</Text> tai <Text style={sf.demoCode}>654321</Text>
          </Text>
          <Text style={sf.demoText}>Salasana: mikä tahansa</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const sf = StyleSheet.create({
  topBar:    { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  logoBox:   { backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  logoText:  { fontSize: 17, fontWeight: "800", color: "#003479" },
  topSub:    { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  sheet:     { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1 },
  content:   { padding: 24, paddingBottom: 40 },
  title:     { fontSize: 20, fontWeight: "700", color: "#1a1a2e", marginBottom: 4 },
  subtitle:  { fontSize: 14, color: "#666" },
  divider:   { height: 0.5, backgroundColor: "#e0e0e0", marginVertical: 20 },
  bankLabel: { fontSize: 12, fontWeight: "700", color: "#555", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 },
  bankGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  bankBtn:   { width: "47.5%", padding: 16, borderRadius: 12, alignItems: "center", borderWidth: 1.5 },
  bankName:  { fontSize: 14, fontWeight: "700" },
  disclaimer:{ fontSize: 12, color: "#888", lineHeight: 18, textAlign: "center" },
  demoBox:   { marginTop: 20, backgroundColor: "#FFF8E1", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#FFD54F" },
  demoTitle: { fontSize: 13, fontWeight: "700", color: "#F57F17", marginBottom: 6 },
  demoText:  { fontSize: 13, color: "#555", marginTop: 3, lineHeight: 20 },
  demoCode:  { fontWeight: "700", color: "#333" },
});

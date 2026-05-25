import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
} from "react-native";
import { MOCK_USERS } from "../constants";

export function BankLoginScreen({ bank, onBack, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  const handleLogin = () => {
    setError("");
    if (!username || !password) { setError("Täytä molemmat kentät."); return; }
    const user = MOCK_USERS[username.trim()];
    if (!user) { setError("Tunnusta ei löydy. Kokeile 123456 tai 654321."); return; }
    onLogin(user);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bank.color }}>
      <StatusBar barStyle="light-content" backgroundColor={bank.color} />
      <View style={[bl.topBar, { backgroundColor: bank.color }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={bl.backText}>← Takaisin</Text>
        </TouchableOpacity>
        <Text style={bl.bankTitle}>{bank.name}</Text>
        <Text style={bl.bankSub}>Verkkopankki · Suomi.fi</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView style={bl.sheet} contentContainerStyle={bl.content} keyboardShouldPersistTaps="handled">
          <Text style={bl.suomifi}>🔒 Suomi.fi-tunnistautuminen</Text>
          <Text style={bl.formTitle}>Kirjaudu sisään</Text>
          <Text style={bl.label}>Käyttäjätunnus</Text>
          <TextInput style={bl.input} value={username} onChangeText={setUsername}
            placeholder="Käyttäjätunnus" placeholderTextColor="#aaa"
            keyboardType="numeric" autoCapitalize="none" />
          <Text style={bl.label}>Salasana</Text>
          <TextInput style={bl.input} value={password} onChangeText={setPassword}
            placeholder="••••••••" placeholderTextColor="#aaa" secureTextEntry />
          {!!error && <Text style={bl.error}>{error}</Text>}
          <TouchableOpacity style={[bl.loginBtn, { backgroundColor: bank.color }]}
            onPress={handleLogin} activeOpacity={0.85}>
            <Text style={bl.loginBtnText}>Kirjaudu</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const bl = StyleSheet.create({
  topBar:       { paddingHorizontal: 20, paddingVertical: 16 },
  backText:     { color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: "500", marginBottom: 8 },
  bankTitle:    { fontSize: 24, fontWeight: "800", color: "#fff" },
  bankSub:      { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  sheet:        { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1 },
  content:      { padding: 24, paddingBottom: 40 },
  suomifi:      { fontSize: 12, color: "#003479", fontWeight: "600", marginBottom: 18, textAlign: "center" },
  formTitle:    { fontSize: 20, fontWeight: "700", color: "#1a1a2e", marginBottom: 22 },
  label:        { fontSize: 13, color: "#555", marginBottom: 7, fontWeight: "500" },
  input:        { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, fontSize: 16, color: "#222", marginBottom: 16, backgroundColor: "#fafafa" },
  error:        { color: "#e74c3c", fontSize: 13, marginBottom: 14, textAlign: "center" },
  loginBtn:     { padding: 15, borderRadius: 12, alignItems: "center", marginTop: 8 },
  loginBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});

import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeCtx, DARK, LIGHT } from "./theme";
import { SuomiFiScreen }   from "./screens/SuomiFiScreen";
import { BankLoginScreen } from "./screens/BankLoginScreen";
import { LoadingScreen }   from "./screens/LoadingScreen";
import { AppScreen }       from "./screens/AppScreen";

export default function Root() {
  const [screen, setScreen] = useState("suomifi");
  const [bank,   setBank]   = useState(null);
  const [user,   setUser]   = useState(null);
  const [isDark, setIsDark] = useState(true);

  // Load saved theme preference on startup
  useEffect(() => {
    AsyncStorage.getItem("theme").then(val => {
      if (val !== null) setIsDark(val === "dark");
    });
  }, []);

  // Save theme preference whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const theme = isDark ? DARK : LIGHT;

  return (
    <ErrorBoundary>
      <ThemeCtx.Provider value={theme}>
        {screen === "suomifi" && (
          <SuomiFiScreen onSelectBank={(b) => { setBank(b); setScreen("bank"); }} />
        )}
        {screen === "bank" && (
          <BankLoginScreen
            bank={bank}
            onBack={() => setScreen("suomifi")}
            onLogin={(u) => {
              setUser(u);
              setScreen("loading");
              setTimeout(() => setScreen("app"), 2500);
            }}
          />
        )}
        {screen === "loading" && <LoadingScreen userName={user?.name} />}
        {screen === "app" && (
          <AppScreen
            user={user}
            isDark={isDark}
            onToggleTheme={() => setIsDark((d) => !d)}
            onLogout={() => { setUser(null); setBank(null); setScreen("suomifi"); }}
          />
        )}
      </ThemeCtx.Provider>
    </ErrorBoundary>
  );
}

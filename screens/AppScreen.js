import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../theme";
import { formatTime } from "../utils";
import { ThemedModal, ModalActions } from "../components/ModalShells";
import { EditModal } from "../components/EditModal";

export function AppScreen({ user, onLogout, isDark, onToggleTheme }) {
  const t = useTheme();
  const [vehicles,      setVehicles]      = useState(user.vehicles);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modal,         setModal]         = useState(null);
  const [editTarget,    setEditTarget]    = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [log,           setLog]           = useState([]);

  // Load saved vehicles and log when the screen mounts
  useEffect(() => {
    AsyncStorage.getItem("vehicles_" + user.hetu).then(data => {
      if (data) setVehicles(JSON.parse(data));
    });
    AsyncStorage.getItem("log_" + user.hetu).then(data => {
      if (data) setLog(JSON.parse(data));
    });
  }, []);

  // Save vehicles to storage whenever they change
  useEffect(() => {
    AsyncStorage.setItem("vehicles_" + user.hetu, JSON.stringify(vehicles));
  }, [vehicles]);

  // Save log to storage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("log_" + user.hetu, JSON.stringify(log));
  }, [log]);

  const vehicle = vehicles[selectedIndex] ?? vehicles[0];
    if (!vehicle) return null;
  const isOff   = vehicle.status === "OFF";

  const updateVehicle = (index, changes) =>
    setVehicles((prev) => prev.map((v, i) => (i === index ? { ...v, ...changes } : v)));

  const addLog = (plate, action, icon) =>
    setLog((prev) => [{ plate, action, icon, time: formatTime(), id: Date.now() }, ...prev].slice(0, 10));

  const handleAction = (type) => {
    setPendingAction({ type, index: selectedIndex });
    setModal("confirm");
  };

  const executeAction = () => {
    await AsyncStorage.removeItem("vehicles_" + userHetu);
    await AsyncStorage.removeItem("log_" + userHetu);
    setVehicles(user.vehicles);
    setSelectedIndex(0);
    setLog([]);
    setModal(null);
    setModal("processing");
    const action = pendingAction;
    setTimeout(() => {
      if (action.type === "remove") {
        updateVehicle(action.index, { status: "OFF" });
        addLog(vehicles[action.index].plate, "poistettu liikennekäytöstä", "🔴");
      } else {
        updateVehicle(action.index, { status: "ON" });
        addLog(vehicles[action.index].plate, "otettu liikennekäyttöön", "🟢");
      }
      setModal("done");
      setTimeout(() => setModal(null), 1400);
    }, 2000);
  };

  const confirmTitle = pendingAction?.type === "remove" ? "Poista liikennekäytöstä" : "Ota liikennekäyttöön";
  const confirmDesc  = pendingAction?.type === "remove"
    ? `Poistetaanko ajoneuvo ${vehicle.plate} liikennekäytöstä? Toimenpide välitetään Traficomiin.`
    : `Otetaanko ajoneuvo ${vehicle.plate} liikennekäyttöön? Toimenpide välitetään Traficomiin.`;
  const doneIcon = pendingAction?.type === "remove" ? "🔴" : "🟢";
  const doneMsg  = pendingAction?.type === "remove" ? "Poistettu liikennekäytöstä" : "Otettu liikennekäyttöön";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />

      {/* Main content — scrollable, stops above the log */}
      <ScrollView contentContainerStyle={as.body} style={{ flex: 1 }}>

        {/* User bar */}
        <View style={as.userBar}>
          <View style={[as.iconWrap, { backgroundColor: t.iconWrapBg }]}>
            <Text style={{ fontSize: 16 }}>🚐</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[as.userName, { color: t.text }]}>{user.name}</Text>
            <Text style={[as.userHetu, { color: t.textMuted }]}>{user.hetu}</Text>
          </View>
          {/* Theme toggle */}
          <TouchableOpacity style={[as.iconBtn, { backgroundColor: t.btnSecBg, borderColor: t.btnSecBorder }]}
            onPress={onToggleTheme} activeOpacity={0.7}>
            <Text style={{ fontSize: 16 }}>{t.themeIcon}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[as.logoutBtn, { backgroundColor: t.btnSecBg, borderColor: t.btnSecBorder }]}
            onPress={onLogout} activeOpacity={0.7}>
            <Text style={[as.logoutText, { color: t.btnSecText }]}>Kirjaudu ulos</Text>
          </TouchableOpacity>
          {__DEV__ && (
          <>  
            <TouchableOpacity
              style={[as.logoutBtn, { backgroundColor: "#e74c3c", borderColor: "#c0392b", marginLeft: 4 }]}
              onPress={() => { throw new Error("Testi virhe"); }}
            >
              <Text style={{ color: "#fff", fontSize: 11 }}>💥</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[as.logoutBtn,{backgroundColor: "#1a6b9a", borderColor: "#1a5c85", marginLeft:4}]}
              onPress={handleDevReset}
              >
                <Text style={{color: "#fff", fontSize:11}}>↺</Text>
              </TouchableOpacity>
            </>  
          )}
        </View>

        {/* Card */}
        <View style={[as.card, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={as.cardHeader}>
            <Text style={[as.appName, { color: t.textMuted }]}>AUTOPAUSE  v3.0</Text>
            <View style={{ flex: 1 }} />
            {vehicles.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={as.tabsRow} contentContainerStyle={{ alignItems: "center" }}>
                {vehicles.map((v, i) => (
                  <TouchableOpacity key={v.plate} activeOpacity={0.7}
                    style={[as.tab,
                      { backgroundColor: t.tabBg, borderColor: t.tabBorder },
                      i === selectedIndex && { backgroundColor: "rgba(99,153,34,0.12)", borderColor: "rgba(99,153,34,0.3)" }]}
                    onPress={() => setSelectedIndex(i)}>
                    <View style={[as.tabDot,
                      i === selectedIndex
                        ? (v.status === "OFF" ? { backgroundColor: "#e24b4a" } : { backgroundColor: "#639922" })
                        : { backgroundColor: t.textMuted }]} />
                    <Text style={[as.tabText, { color: t.tabText }, i === selectedIndex && { color: "#97c459" }]}>
                      {v.plate}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity style={[as.editBtn, { backgroundColor: t.btnSecBg, borderColor: t.btnSecBorder }]}
              activeOpacity={0.7}
              onPress={() => { setEditTarget(selectedIndex); setModal("edit"); }}>
              <Text style={{ fontSize: 14 }}>✏️</Text>
            </TouchableOpacity>
            {vehicles.length > 1 &&(
            <TouchableOpacity style ={[as.editBtn, {backgroundColor:"rgba(226,75,74,0.15)",borderColor: "rgba(226,75,74,0.3)"}]}
              activeOpacity={0.7}
              onPress={() => setModal("deletevehicle")}>
                <Text style={{fontSize:14}}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={[as.divider, { backgroundColor: t.divider }]} />

          <View style={as.vehicleRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={[as.vLabel, { color: t.textMuted }]}>Rekisterinumero</Text>
              <Text style={[as.plate, { color: t.text }]}>{vehicle.plate}</Text>
              {(vehicle.make || vehicle.model) &&
                <Text style={[as.makeModel, { color: t.textSub }]}>{vehicle.make} {vehicle.model}</Text>}
            </View>
            <View style={[as.badge, isOff ? as.badgeOff : as.badgeOn]}>
              <View style={[as.dot, isOff ? { backgroundColor: "#e24b4a" } : { backgroundColor: "#639922" }]} />
              <Text style={[as.badgeText, isOff ? { color: "#f09595" } : { color: "#97c459" }]}>
                {isOff ? "Poissa käytöstä" : "Liikennekäytössä"}
              </Text>
            </View>
          </View>

          <View style={as.infoGrid}>
            {[
              ["Luokka",   `${vehicle.code} · ${vehicle.name}`],
              ["Vuosi",    vehicle.year  || "–"],
              ["Väri",     vehicle.color || "–"],
              ["Vakuutus", "Voimassa"],
            ].map(([label, value]) => (
              <View key={label} style={[as.infoCell, { backgroundColor: t.rowBg }]}>
                <Text style={[as.icLabel, { color: t.textMuted }]}>{label}</Text>
                <Text style={[as.icValue, { color: t.textSub }]} numberOfLines={2}>{value}</Text>
              </View>
            ))}
          </View>

          {isOff ? (
            <TouchableOpacity style={as.btnSuccess} activeOpacity={0.85} onPress={() => handleAction("restore")}>
              <Text style={as.btnSuccessText}>🟢 Ota liikennekäyttöön</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={as.btnDanger} activeOpacity={0.85} onPress={() => handleAction("remove")}>
              <Text style={as.btnDangerText}>🔴 Poista liikennekäytöstä</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Add vehicle */}
        <TouchableOpacity style={[as.addBtn, { backgroundColor: t.btnSecBg, borderColor: t.btnSecBorder }]}
          activeOpacity={0.7} onPress={() => { setEditTarget(null); setModal("edit"); }}>
          <Text style={[as.addBtnText, { color: t.textSub }]}>＋ Lisää ajoneuvo</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Log — always visible, fixed at bottom */}
      <View style={[as.logCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
        <Text style={[as.logTitle, { color: t.logTitleColor }]}>Tapahtumahistoria</Text>
        <ScrollView style={as.logScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {log.length === 0 ? (
            <View style={as.logEmpty}>
              <Text style={[as.logEmptyText, { color: t.textMuted }]}>Ei tapahtumia vielä</Text>
            </View>
          ) : (
            log.map((entry, i) => (
              <View key={entry.id} style={[as.logRow,
                { borderBottomColor: t.rowBorder },
                i === log.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={as.logIcon}>{entry.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[as.logPlate, { color: t.text }]}>
                    {entry.plate}
                    <Text style={[as.logAction, { color: t.logActionColor }]}>{"  "}{entry.action}</Text>
                  </Text>
                  <Text style={[as.logTime, { color: t.logTimeColor }]}>{entry.time}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Confirm modal */}
      <ThemedModal visible={modal === "confirm"}>
        <Text style={as.modalIcon}>⚠️</Text>
        <Text style={[as.modalTitle, { color: t.text }]}>{confirmTitle}</Text>
        <Text style={[as.modalDesc, { color: t.modalDesc }]}>{confirmDesc}</Text>
        <ModalActions onCancel={() => setModal(null)} onConfirm={executeAction} confirmLabel="Vahvista" />
      </ThemedModal>

      {/* Processing modal */}
      <ThemedModal visible={modal === "processing"}>
        <ActivityIndicator size="large" color="#00B4D8" style={{ marginBottom: 16 }} />
        <Text style={[as.modalTitle, { color: t.text }]}>Lähetetään Traficomiin...</Text>
        <Text style={[as.modalDesc, { color: t.modalDesc }]}>Odota hetki</Text>
      </ThemedModal>

      {/* Delete vehicle modal */}
      <ThemedModal visible={modal === "deletevehicle"}>
        <Text style={as.modalIcon}>🗑️</Text>
        <Text style={[as.modalTitle, {color:t.text}]}>Poista ajoneuvo</Text>
        <Text style={as.modalDesc, {color: t.modalDesc}}>
          Poistetaanko ajoneuvo {vehicle.plate} tiedoista?
        </Text>
        <ModalActions
          onCancel={() => setModal(null)}
          onConfirm={() => {
            const updated = vehicles.filter((_, i) => i !==selectedIndex);
            setVehicles(updated);
            setSelectedIndex(0);
            addLog(vehicle.plate, "Poistettu sovelluksesta","🗑️");
            setModal(null);
          }}
          confirmLabel="Poista"
          confirmColor="e74c3c"
          />
      </ThemedModal>
      
      {/* Done modal */}
      <ThemedModal visible={modal === "done"}>
        <Text style={as.modalIcon}>{doneIcon}</Text>
        <Text style={[as.modalTitle, { color: t.text }]}>Valmis</Text>
        <Text style={[as.modalDesc, { color: t.modalDesc }]}>{doneMsg}</Text>
      </ThemedModal>

      <EditModal
        key={modal === "edit" ? `edit-${editTarget ?? "new"}` : "closed"}
        visible={modal === "edit"}
        vehicle={editTarget !== null ? vehicles[editTarget] : null}
        onCancel={() => setModal(null)}
        onSave={(data) => {
          if (editTarget !== null) {
            updateVehicle(editTarget, data);
            addLog(data.plate, "tietoja muokattu", "✏️");
          } else {
            setVehicles((prev) => [...prev, { ...data, status: "ON" }]);
            setSelectedIndex(vehicles.length);
            addLog(data.plate, "ajoneuvo lisätty", "➕");
          }
          setModal(null);
        }}
      />
    </SafeAreaView>
  );
}

const as = StyleSheet.create({
  body:          { flexGrow: 1, padding: 12, paddingTop: 20, justifyContent: "center" },
  userBar:       { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  iconWrap:      { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  userName:      { fontSize: 13, fontWeight: "600" },
  userHetu:      { fontSize: 10, marginTop: 1 },
  iconBtn:       { width: 34, height: 34, borderRadius: 9, borderWidth: 0.5, alignItems: "center", justifyContent: "center" },
  logoutBtn:     { borderRadius: 8, borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 6 },
  logoutText:    { fontSize: 11 },
  card:          { borderRadius: 16, padding: 14, borderWidth: 0.5 },
  cardHeader:    { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  appName:       { fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  tabsRow:       { maxWidth: 160, marginHorizontal: 6 },
  tab:           { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 0.5, marginRight: 5 },
  tabDot:        { width: 5, height: 5, borderRadius: 3 },
  tabText:       { fontSize: 11, fontWeight: "600" },
  editBtn:       { width: 34, height: 34, borderRadius: 9, borderWidth: 0.5, alignItems: "center", justifyContent: "center" },
  divider:       { height: 0.5, marginBottom: 12 },
  vehicleRow:    { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 },
  vLabel:        { fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 },
  plate:         { fontSize: 24, fontWeight: "700", letterSpacing: 1.5 },
  makeModel:     { fontSize: 12, marginTop: 3 },
  badge:         { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12, borderWidth: 0.5, flexShrink: 1 },
  badgeOn:       { backgroundColor: "rgba(99,153,34,0.15)", borderColor: "rgba(99,153,34,0.25)" },
  badgeOff:      { backgroundColor: "rgba(226,75,74,0.15)", borderColor: "rgba(226,75,74,0.25)" },
  badgeText:     { fontSize: 11, fontWeight: "500" },
  dot:           { width: 7, height: 7, borderRadius: 4 },
  infoGrid:      { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 14 },
  infoCell:      { width: "48%", borderRadius: 10, padding: 9 },
  icLabel:       { fontSize: 10, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.7 },
  icValue:       { fontSize: 13, fontWeight: "500" },
  btnDanger:     { borderRadius: 11, padding: 13, alignItems: "center", backgroundColor: "#e74c3c" },
  btnDangerText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  btnSuccess:    { borderRadius: 11, padding: 13, alignItems: "center", backgroundColor: "#3b6d11" },
  btnSuccessText:{ fontSize: 15, fontWeight: "700", color: "#c0dd97" },
  addBtn:        { marginTop: 8, padding: 11, borderRadius: 11, borderWidth: 0.5, alignItems: "center" },
  addBtnText:    { fontSize: 14, fontWeight: "500" },
  logCard:       { height: 220, padding: 14, borderTopWidth: 0.5, borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  logTitle:      { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  logScroll:     { flex: 1 },
  logRow:        { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8, borderBottomWidth: 0.5 },
  logIcon:       { fontSize: 13, marginRight: 10, marginTop: 2 },
  logPlate:      { fontSize: 13, fontWeight: "700" },
  logAction:     { fontSize: 13, fontWeight: "400" },
  logTime:       { fontSize: 11, marginTop: 3 },
  logEmpty:      { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  logEmptyText:  { fontSize: 13 },
  modalIcon:     { fontSize: 34, textAlign: "center", marginBottom: 12 },
  modalTitle:    { fontSize: 17, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  modalDesc:     { fontSize: 13, textAlign: "center", lineHeight: 20, marginBottom: 22 },
});

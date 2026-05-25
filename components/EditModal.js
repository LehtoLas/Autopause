import { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Modal, StyleSheet, Keyboard, useWindowDimensions,
} from "react-native";
import { useTheme } from "../theme";
import { VEHICLES } from "../constants";

export function EditModal({ visible, vehicle, onCancel, onSave }) {
  const t = useTheme();
  const { height: SCREEN_H } = useWindowDimensions();

  const [plateVal,   setPlateVal]   = useState(vehicle?.plate || "");
  const [plateError, setPlateError] = useState("");
  const [makeVal,    setMakeVal]    = useState(vehicle?.make  || "");
  const [modelVal,   setModelVal]   = useState(vehicle?.model || "");
  const [yearVal,    setYearVal]    = useState(vehicle?.year  || "");
  const [colorVal,   setColorVal]   = useState(vehicle?.color || "");
  const [search,     setSearch]     = useState("");
  const [dropOpen,   setDropOpen]   = useState(false);
  const [selected,   setSelected]   = useState(
    vehicle ? VEHICLES.find((v) => v.code === vehicle.code) || VEHICLES[0] : VEHICLES[0]
  );
  const [keyboardH, setKeyboardH] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => setKeyboardH(e.endCoordinates.height));
    const hide  = Keyboard.addListener("keyboardDidHide", () => setKeyboardH(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const SHEET_H = SCREEN_H * 0.85 - keyboardH;

  const filtered = VEHICLES.filter(
    (v) => v.name.toLowerCase().includes(search.toLowerCase()) ||
           v.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    setPlateError("");
    if (!plateVal.trim()) {
      setPlateError("Syötä rekisterinumero");
      return;
    }
    if (!/^[A-ZÅÄÖ]{1,3}-[0-9]{1,3}$/.test(plateVal.trim())) {
      setPlateError("Tarkista muoto - esim. ABC-123");
      return;
    }
    onSave({
      plate: plateVal.trim().toUpperCase(),
      make:  makeVal.trim(),
      model: modelVal.trim(),
      year:  yearVal.trim(),
      color: colorVal.trim(),
      code:  selected.code,
      name:  selected.name,
    });
  };

  const inp = [em.input, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.inputText }];
  const lbl = [em.label, { color: t.textMuted }];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel} statusBarTranslucent>
      <TouchableOpacity style={em.overlay} activeOpacity={1} onPress={onCancel} />
      <View style={[em.sheet, { height: SHEET_H, backgroundColor: t.card, borderColor: t.cardBorder }]}>

        {/* Header */}
        <View style={[em.header, { borderBottomColor: t.divider }]}>
          <Text style={[em.headerTitle, { color: t.text }]}>
            {vehicle ? "Muokkaa ajoneuvoa" : "Lisää ajoneuvo"}
          </Text>
          <TouchableOpacity onPress={onCancel} hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}>
            <Text style={[em.closeBtn, { color: t.textMuted }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable form */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={em.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Plate */}
          <Text style={lbl}>Rekisterinumero</Text>
          <TextInput
            style={[em.plateInput, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.inputText }]}
            value={plateVal} maxLength={10} placeholder="ABC-123"
            placeholderTextColor={t.textMuted} autoCapitalize="characters"
            returnKeyType="done" onChangeText={(tx) => setPlateVal(tx.toUpperCase())}
          />
          {!!plateError && (
            <Text style={{ color: "#e74c3c", fontSize: 12, marginTop: -10, marginBottom: 12 }}>
              {plateError}
            </Text>
          )}

          {/* Make — chips include Volvo as per your addition */}
          <Text style={lbl}>Merkki</Text>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            style={em.chipsRow}
            contentContainerStyle={{ flexDirection: "row", alignItems: "center", paddingVertical: 4 }}
            keyboardShouldPersistTaps="handled"
          >
            {["Toyota", "Volkswagen", "Ford", "BMW", "Mercedes-Benz", "Volvo"].map((m) => (
              <TouchableOpacity key={m} activeOpacity={0.7}
                style={[em.chip, {
                  backgroundColor: makeVal === m ? "rgba(99,153,34,0.18)" : t.chipBg,
                  borderColor: makeVal === m ? "#639922" : t.chipBorder,
                }]}
                onPress={() => setMakeVal(m)}
              >
                <Text style={[em.chipText, { color: makeVal === m ? "#97c459" : t.chipText }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput style={inp} value={makeVal} placeholder="Tai kirjoita merkki..."
            placeholderTextColor={t.textMuted} returnKeyType="next" onChangeText={setMakeVal} />

          {/* Model + Year */}
          <View style={em.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={lbl}>Malli</Text>
              <TextInput style={inp} value={modelVal} placeholder="Malli"
                placeholderTextColor={t.textMuted} returnKeyType="next" onChangeText={setModelVal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={lbl}>Vuosi</Text>
              <TextInput style={inp} value={yearVal} placeholder="Vuosi"
                placeholderTextColor={t.textMuted} keyboardType="numeric"
                returnKeyType="next" onChangeText={setYearVal} />
            </View>
          </View>

          {/* Color */}
          <Text style={lbl}>Väri</Text>
          <TextInput style={inp} value={colorVal} placeholder="Väri"
            placeholderTextColor={t.textMuted} returnKeyType="done" onChangeText={setColorVal} />

          {/* Vehicle type dropdown */}
          <Text style={lbl}>Ajoneuvotyyppi</Text>
          <TouchableOpacity activeOpacity={0.7}
            style={[em.dropdownBtn, { backgroundColor: t.dropdownBg, borderColor: t.inputBorder }]}
            onPress={() => setDropOpen((o) => !o)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[em.dropdownValue, { color: t.text }]}>{selected.name}</Text>
              <Text style={[em.dropdownCode,  { color: t.textMuted }]}>{selected.code}</Text>
            </View>
            <Text style={[em.dropdownArrow, { color: t.textSub }]}>{dropOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {dropOpen && (
            <View style={[em.vehicleList, { backgroundColor: t.vehicleListBg, borderColor: t.vehicleListBorder }]}>
              <View style={[em.searchWrap, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
                <Text style={em.searchIcon}>🔍</Text>
                <TextInput style={[em.searchInput, { color: t.inputText }]}
                  placeholder="Hae tyyppiä..." placeholderTextColor={t.textMuted}
                  value={search} returnKeyType="search" onChangeText={setSearch} />
              </View>
              {filtered.map((v, i) => (
                <TouchableOpacity key={v.code} activeOpacity={0.7}
                  style={[
                    em.vehItem,
                    v.code === selected.code && { backgroundColor: "rgba(99,153,34,0.1)" },
                    i < filtered.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: t.rowBorder },
                  ]}
                  onPress={() => { setSelected(v); setDropOpen(false); }}
                >
                  <View>
                    <Text style={[em.vehName, { color: t.text }]}>{v.name}</Text>
                    <Text style={[em.vehCode, { color: t.vehCode }]}>{v.code}</Text>
                  </View>
                  {v.code === selected.code && <Text style={em.checkIcon}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom actions */}
        <View style={[em.actions, { borderTopColor: t.divider }]}>
          <TouchableOpacity
            style={[em.btnCancel, { backgroundColor: t.btnSecBg, borderColor: t.btnSecBorder }]}
            onPress={onCancel} activeOpacity={0.7}
          >
            <Text style={[em.btnCancelText, { color: t.btnSecText }]}>Peruuta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={em.btnSave} onPress={handleSave} activeOpacity={0.85}>
            <Text style={em.btnSaveText}>Tallenna</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const em = StyleSheet.create({
  overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet:         { position: "absolute", bottom: 0, left: 0, right: 0, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 0.5 },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, paddingBottom: 14, borderBottomWidth: 0.5 },
  headerTitle:   { fontSize: 17, fontWeight: "700" },
  closeBtn:      { fontSize: 18, padding: 4 },
  formContent:   { padding: 18, paddingBottom: 8 },
  label:         { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 },
  plateInput:    { borderWidth: 0.5, borderRadius: 11, padding: 13, fontSize: 22, fontWeight: "700", letterSpacing: 2, marginBottom: 14 },
  input:         { borderWidth: 0.5, borderRadius: 11, padding: 11, fontSize: 14, marginBottom: 14 },
  chipsRow:      { marginBottom: 10 },
  chip:          { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  chipText:      { fontSize: 13, fontWeight: "500" },
  row:           { flexDirection: "row" },
  dropdownBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8 },
  dropdownValue: { fontSize: 14, fontWeight: "600" },
  dropdownCode:  { fontSize: 11, marginTop: 2 },
  dropdownArrow: { fontSize: 13, marginLeft: 10 },
  vehicleList:   { borderRadius: 11, borderWidth: 0.5, marginBottom: 8 },
  searchWrap:    { flexDirection: "row", alignItems: "center", borderWidth: 0.5, borderRadius: 10, paddingHorizontal: 12, margin: 8, marginBottom: 4 },
  searchIcon:    { fontSize: 14, marginRight: 8 },
  searchInput:   { flex: 1, paddingVertical: 10, fontSize: 14 },
  vehItem:       { paddingHorizontal: 14, paddingVertical: 11, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  vehName:       { fontSize: 14, fontWeight: "500" },
  vehCode:       { fontSize: 12, marginTop: 2 },
  checkIcon:     { fontSize: 15, color: "#97c459" },
  actions:       { flexDirection: "row", gap: 10, padding: 16, borderTopWidth: 0.5 },
  btnCancel:     { flex: 1, padding: 13, borderRadius: 11, borderWidth: 0.5, alignItems: "center" },
  btnCancelText: { fontSize: 14, fontWeight: "500" },
  btnSave:       { flex: 1, padding: 13, borderRadius: 11, backgroundColor: "#3b6d11", alignItems: "center" },
  btnSaveText:   { fontSize: 14, fontWeight: "700", color: "#c0dd97" },
});

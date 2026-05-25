import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useTheme } from "../theme";

export function ThemedModal({ visible, children }) {
  const t = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.modalOverlay}>
        <View style={[s.modalBox, { backgroundColor: t.modalBg, borderColor: t.modalBorder }]}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function ModalActions({ onCancel, onConfirm, confirmLabel, confirmColor }) {
  const t = useTheme();
  return (
    <View style={s.modalRow}>
      <TouchableOpacity
        style={[s.mBtnCancel, { borderColor: t.btnSecBorder, backgroundColor: t.btnSecBg }]}
        onPress={onCancel}
      >
        <Text style={[s.mBtnCancelText, { color: t.btnSecText }]}>Peruuta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.mBtnOk, { backgroundColor: confirmColor || "#e74c3c" }]}
        onPress={onConfirm}
      >
        <Text style={s.mBtnOkText}>{confirmLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  modalOverlay:   { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", alignItems: "center", justifyContent: "center", padding: 20 },
  modalBox:       { width: "100%", maxWidth: 370, borderRadius: 20, padding: 24, borderWidth: 0.5 },
  modalRow:       { flexDirection: "row", gap: 9, marginTop: 4 },
  mBtnCancel:     { flex: 1, padding: 12, borderRadius: 11, borderWidth: 0.5, alignItems: "center" },
  mBtnCancelText: { fontSize: 14, fontWeight: "500" },
  mBtnOk:         { flex: 1, padding: 12, borderRadius: 11, alignItems: "center" },
  mBtnOkText:     { fontSize: 14, fontWeight: "700", color: "#fff" },
});

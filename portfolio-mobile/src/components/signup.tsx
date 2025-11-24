// src/components/modal/SignupModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  /**
   * onSubmit will be called with { name, email, password } when user submits
   */
  onSubmit: (payload: {
    name: string;
    email: string;
    password: string;
  }) => void;
};

export default function SignupModal({ visible, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit() {
    if (!name.trim() || !email.trim() || !password) {
      alert("Please fill all fields");
      return;
    }
    onSubmit({ name: name.trim(), email: email.trim(), password });
    setName("");
    setEmail("");
    setPassword("");
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.centerOuter}
      >
        <ScrollView
          contentContainerStyle={styles.scrollWrap}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalCard}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>
              Join us and build beautiful mobile portfolios.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={submit}>
              <Text style={styles.primaryBtnText}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 12 }} onPress={onClose}>
              <Text style={styles.loginLink}>
                Already have an account?{" "}
                <Text style={{ color: "#0B79FF" }}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 68,
    bottom: 0,
    backgroundColor: "#071133",
    opacity: 0.6,
    zIndex: 10,
  },
  centerOuter: {
    flex: 1,
    zIndex: 20,
    justifyContent: "center",
  },
  scrollWrap: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: Math.min(420, Math.max(320, 360)),
    minHeight: 380,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.05)",
    alignSelf: "center",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 6,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    color: "#64748b",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 14,
  },
  input: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    color: "#0f172a",
    marginTop: 12,
  },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#0B79FF",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    elevation: 6,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  loginLink: {
    textAlign: "center",
    color: "#475569",
    fontSize: 14,
  },
});

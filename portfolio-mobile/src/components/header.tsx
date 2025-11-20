// src/components/Header.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

type HeaderProps = {
  logo?: ImageSourcePropType; // local require(...) or { uri: '...' }
  title?: string; // default "Portfolio designer"
  onLogin?: () => void;
  onSignup?: () => void;
};

export default function Header({
  logo,
  title = "Portfolio designer",
  onLogin,
  onSignup,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Left: Logo + Title */}
        <View style={styles.left}>
          {logo ? (
            <Image
              source={logo}
              style={styles.logoImage}
              accessibilityLabel={`${title} logo`}
            />
          ) : null}

          <Text style={styles.titleText}>{title}</Text>
        </View>

        {/* Right: Login / Signup */}
        <View style={styles.right}>
          <TouchableOpacity
            onPress={onLogin}
            style={styles.loginBtn}
            accessibilityLabel="Login"
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSignup}
            style={styles.signupBtn}
            accessibilityRole="button"
          >
            <Text style={styles.signupText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F6F1E8", // beige header background
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  inner: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // pushes left and right to extremes
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    resizeMode: "cover",
    marginRight: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
    borderRadius: 8,
  },
  loginText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  signupBtn: {
    backgroundColor: "#0B79FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 4,
  },
  signupText: {
    color: "#fff",
    fontWeight: "700",
  },
});

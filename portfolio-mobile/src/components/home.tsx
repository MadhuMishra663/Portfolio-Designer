// src/components/home.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SignupModal from "./signup";
import LoginModal from "./login";
import { loginApi, signupApi } from "../services/authApi";
import { RootStackParamList } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "./header";

const { width, height } = Dimensions.get("window");

// Update this path if your asset is located elsewhere
const BG_IMAGE: ImageSourcePropType = require("../../assets/images/background3.png");
// If your file is images-background.png/jpg/etc, change the path above accordingly.
type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Home() {
  const [signupVisible, setSignupVisible] = useState(false);
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // dim animation for overlay
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [loginVisible, setLoginVisible] = useState(false);

  // handler to open login
  function openLogin() {
    setLoginVisible(true);
  }
  function closeLogin() {
    setLoginVisible(false);
  }
  function handleLogin() {
    navigation.navigate("Login");
  }
  // Parent.tsx
  async function handleSignup(payload: SignupPayload) {
    console.log("[Parent] handleSignup payload:", payload);
    try {
      const data = await signupApi(payload);
      alert("Signup successful");
      setVisible(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Signup failed";
      alert("Signup failed: " + msg);
    }
  }

  function handleOpenSignup() {
    setSignupVisible(true);
  }
  function handleCloseSignup() {
    setSignupVisible(false);
  }

  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bgAnim]);

  const translateY = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18], // moves up to -18px and back
  });

  const scale = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02], // tiny zoom in/out
  });
  async function handleModalSubmit(payload: {
    name: string;
    email: string;
    password: string;
  }) {
    const data = await signupApi(payload);

    alert(`Thanks ${payload.name}! Signup submitted.`);
    setSignupVisible(false);
  }
  async function handleLoginSubmit(payload: {
    email: string;
    password: string;
  }) {
    const data = await loginApi(payload);

    // TODO: perform auth API call here
    // after successful login you can close modal and navigate:
    setLoginVisible(false);
    console.log("nav state:", JSON.stringify(navigation.getState(), null, 2));

    navigation.navigate("Form");
    // navigation.navigate('TemplateSelect') // example
  }
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <Header
        title="Portfolio designer"
        onLogin={openLogin}
        onSignup={handleOpenSignup}
        logo={undefined}
        isLoggedIn={false}
      />

      {/* Background image (animated) - absolute, behind content */}
      <View style={styles.bgWrapper} pointerEvents="none">
        <Animated.Image
          source={BG_IMAGE}
          style={[
            styles.bgImage,
            {
              transform: [{ translateY }, { scale }],
            },
          ]}
          blurRadius={0.3}
          resizeMode="cover"
          accessible={false}
        />

        {/* subtle overlay to improve contrast for the about card */}
        <Animated.View style={[styles.bgOverlay, { opacity: 0.2 }]} />
      </View>

      {/* Main: place content above background */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrap}>
          {/* About card centered */}
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>About us</Text>
            <Text style={styles.aboutText}>
              We design playful and professional portfolios for mobile —
              beautiful templates, exportable CVs, and easy sharing. Clean
              design, delightful micro-interactions, and fast workflows.
            </Text>

            <View style={{ marginTop: 18, alignItems: "center" }}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate("TemplateSelect" as any)}
              >
                <Text style={styles.primaryBtnText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Spacer so content doesn't collide with footer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Simple footer (keeps at bottom visually) */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Portfolio designer
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Text style={styles.footerLink}>Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <SignupModal
        visible={signupVisible}
        onClose={handleCloseSignup}
        onSubmit={handleModalSubmit}
      />
      <LoginModal
        visible={loginVisible}
        onClose={closeLogin}
        onSubmit={handleLoginSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 68, // leave header space (approx header height). adjust if your header is taller.
    bottom: 0,
    zIndex: 0,
    overflow: "hidden",
  },
  bgImage: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -40, // small offset so the translateY looks natural
    height: height * 1.1,
    width: "100%",
    opacity: 0.95,
  },
  bgOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -40,
    height: height * 1.1,
    backgroundColor: "#071133",
  },

  centerWrap: {
    zIndex: 2, // sits above animated background
    minHeight: Math.max(420, height - 220),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 36,
  },

  aboutCard: {
    width: "100%",
    maxWidth: 920,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    paddingVertical: 28,
    paddingHorizontal: 28,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.04)",
    alignItems: "center",
  },

  aboutTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  aboutText: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 760,
  },

  primaryBtn: {
    backgroundColor: "#0B79FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    elevation: 6,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  footer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "rgba(15,23,42,0.04)",
    zIndex: 3,
  },
  footerInner: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerText: {
    color: "#64748b",
    fontSize: 12,
  },
  footerLink: {
    color: "#475569",
    fontSize: 12,
  },
});
function setVisible(arg0: boolean) {
  throw new Error("Function not implemented.");
}

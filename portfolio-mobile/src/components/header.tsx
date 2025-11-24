// // src/components/Header.tsx
// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ImageSourcePropType,
// } from "react-native";

// type HeaderProps = {
//   logo?: ImageSourcePropType; // local require(...) or { uri: '...' }
//   title?: string; // default "Portfolio designer"
//   onLogin?: () => void;
//   onSignup?: () => void;
// };

// export default function Header({
//   logo,
//   title = "Portfolio designer",
//   onLogin,
//   onSignup,
// }: HeaderProps) {
//   return (
//     <View style={styles.container}>
//       <View style={styles.inner}>
//         {/* Left: Logo + Title */}
//         <View style={styles.left}>
//           {logo ? (
//             <Image
//               source={logo}
//               style={styles.logoImage}
//               accessibilityLabel={`${title} logo`}
//             />
//           ) : null}

//           <Text style={styles.titleText}>{title}</Text>
//         </View>

//         {/* Right: Login / Signup */}
//         <View style={styles.right}>
//           <TouchableOpacity
//             onPress={onLogin}
//             style={styles.loginBtn}
//             accessibilityLabel="Login"
//           >
//             <Text style={styles.loginText}>Login</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={onSignup}
//             style={styles.signupBtn}
//             accessibilityRole="button"
//           >
//             <Text style={styles.signupText}>Signup</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     backgroundColor: "#F6F1E8", // beige header background
//     borderBottomLeftRadius: 10,
//     borderBottomRightRadius: 10,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.02,
//     shadowRadius: 6,
//   },
//   inner: {
//     maxWidth: 1200,
//     width: "100%",
//     alignSelf: "center",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between", // pushes left and right to extremes
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   left: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   logoImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     resizeMode: "cover",
//     marginRight: 8,
//   },
//   titleText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#0f172a",
//   },

//   right: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   loginBtn: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     marginRight: 12,
//     borderRadius: 8,
//   },
//   loginText: {
//     color: "#0f172a",
//     fontWeight: "600",
//   },
//   signupBtn: {
//     backgroundColor: "#0B79FF",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 10,
//     elevation: 4,
//   },
//   signupText: {
//     color: "#fff",
//     fontWeight: "700",
//   },
// });

// src/components/Header.tsx
// src/components/Header.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type HeaderProps = {
  logo?: any;
  title?: string;
  isLoggedIn?: boolean;
  userName?: string;
  onLogin?: () => void;
  onSignup?: () => void;
  onProfile?: () => void;
  onLogout?: () => void;
};

export default function Header({
  logo,
  title = "Portfolio designer",
  isLoggedIn = false,
  userName,
  onLogin,
  onSignup,
  onProfile,
  onLogout,
}: HeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  // hover state for web (and used as "pressed" visual on native)
  const [loginHover, setLoginHover] = useState(false);
  const [signupHover, setSignupHover] = useState(false);

  return (
    <View style={styles.container}>
      {/* LEFT — LOGO */}
      <View style={styles.left}>
        {logo ? (
          <Image source={logo} style={styles.logo} />
        ) : (
          <Ionicons name="sparkles-outline" size={28} color="#0f172a" />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* RIGHT SIDE — PERSON ICON or Login/Signup buttons */}
      {isLoggedIn ? (
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => setMenuVisible((s) => !s)}
            accessibilityLabel="Open account menu"
            style={styles.personBtn}
          >
            <Ionicons name="person-circle-outline" size={36} color="#333" />
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.menuBox}>
              <Pressable
                onPress={() => {
                  setMenuVisible(false);
                  onProfile && onProfile();
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <Text style={styles.menuItemText}>Profile</Text>
              </Pressable>

              <View style={styles.menuDivider} />

              <Pressable
                onPress={() => {
                  setMenuVisible(false);
                  onLogout && onLogout();
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <Text style={[styles.menuItemText, { color: "#DC2626" }]}>
                  Logout
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.row}>
          <Pressable
            onPress={onLogin}
            onHoverIn={() => setLoginHover(true)}
            onHoverOut={() => setLoginHover(false)}
            android_ripple={{ color: "#e6f0ff" }}
            style={({ pressed }) => [
              styles.btn,
              loginHover && styles.btnHover,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={[styles.btnText, loginHover && styles.btnTextHover]}>
              Login
            </Text>
          </Pressable>

          <Pressable
            onPress={onSignup}
            onHoverIn={() => setSignupHover(true)}
            onHoverOut={() => setSignupHover(false)}
            android_ripple={{ color: "#064eec1a" }}
            style={({ pressed }) => [
              styles.signupBtn,
              signupHover && styles.signupBtnHover,
              pressed && styles.signupBtnPressed,
            ]}
          >
            <Text
              style={[styles.signupText, signupHover && styles.signupTextHover]}
            >
              Signup
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 36, height: 36, borderRadius: 8 },
  title: { marginLeft: 10, fontSize: 18, fontWeight: "700", color: "#0f172a" },

  // login button
  row: { flexDirection: "row", alignItems: "center" },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "transparent",
  },
  btnHover: {
    backgroundColor: "#eef6ff",
  },
  btnPressed: {
    opacity: 0.85,
  },
  btnText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "600",
  },
  btnTextHover: {
    color: "#0B79FF",
  },

  // signup button (primary)
  signupBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#0B79FF",
    elevation: 3,
  },
  signupBtnHover: {
    backgroundColor: "#0960d6",
  },
  signupBtnPressed: {
    opacity: 0.9,
  },
  signupText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  signupTextHover: { color: "#fff" },

  // person menu
  personBtn: {
    padding: 4,
  },
  menuBox: {
    position: "absolute",
    top: 44,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: 140,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    zIndex: 9999,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemPressed: {
    backgroundColor: "#f2f6ff",
  },
  menuItemText: {
    fontSize: 15,
    color: "#0f172a",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.04)",
    marginVertical: 4,
  },
});

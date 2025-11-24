// // // src/api/api.ts
// // import axios from "axios";
// // import { Platform } from "react-native";

// // export const API_BASE =
// //   Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

// // console.log("[api.ts module load] API_BASE:", API_BASE);

// // const instance = axios.create({ baseURL: API_BASE });
// // export default instance;

// // src/api/api.ts
// import axios from "axios";
// import { Platform } from "react-native";

// /**
//  * If testing on Android emulator use 10.0.2.2
//  * iOS simulator -> localhost
//  * Physical device -> replace LAN_HOST with your machine IP (e.g. 192.168.1.42)
//  */
// const PORT = 4000;
// const ANDROID_EMU_HOST = "10.0.2.2";
// const IOS_SIM_HOST = "localhost";
// const LAN_HOST = "192.168.x.y"; // <- replace when using a physical device

// const HOST =
//   Platform.OS === "android"
//     ? ANDROID_EMU_HOST
//     : // if you're on a real iOS device change this to LAN_HOST as well
//       IOS_SIM_HOST;

// const baseURL = `http://${HOST}:${PORT}`; // keep '/api/auth' in request paths, not here
// console.log(baseURL);
// const api = axios.create({
//   baseURL,
//   timeout: 15000,
// });

// export default api;
// src/api/api.ts
import axios from "axios";
import { Platform } from "react-native";

/**
 * Rules:
 * - Android emulator -> 10.0.2.2
 * - iOS simulator -> localhost
 * - Physical device -> set LAN_HOST to your machine IP (e.g. 192.168.1.42)
 * - Expo web -> uses window.location.hostname
 *
 * Replace LAN_HOST with your computer IP when testing on a real phone.
 */

const PORT = 4000;
const ANDROID_EMU_HOST = "10.0.2.2";
const IOS_SIM_HOST = "localhost";
// <-- replace this with your machine IP when testing on a real phone
const LAN_HOST = "192.168.1.100";

function pickHost(): string {
  // Running in browser via expo web
  if (Platform.OS === "web") {
    // @ts-ignore window exists on web
    const hostFromWindow =
      typeof window !== "undefined" ? window.location.hostname : "";
    // if running from localhost on web, keep localhost; otherwise use that host
    return hostFromWindow || IOS_SIM_HOST;
  }

  // Android emulator
  if (Platform.OS === "android") return ANDROID_EMU_HOST;

  // iOS simulator
  return IOS_SIM_HOST;
}

const AUTO_HOST = pickHost();

// If you want to force a LAN host (e.g. testing on a real device), set this flag to true
const FORCE_LAN = false;

// final host to use
const HOST = FORCE_LAN ? LAN_HOST : AUTO_HOST;

const baseURL = `http://${HOST}:${PORT}`;
console.log("[api] baseURL =", baseURL);

const api = axios.create({
  baseURL,
  timeout: 15000,
});

export default api;

import axios from "axios";
import { Platform } from "react-native";
const API_BASE =
  Platform.OS === "android"
    ? "http://10.0.2.2:4000" // Android emulator
    : "http://localhost:4000";
export default axios.create({ baseURL: API_BASE });

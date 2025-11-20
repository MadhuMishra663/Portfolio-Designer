import axios from "axios";
const API_BASE = "http://10.0.2.2:4000"; // emulator, or use local network IP or Expo tunnel
export default axios.create({ baseURL: API_BASE });

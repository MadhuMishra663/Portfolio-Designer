// src/services/authApi.ts
import api from "../api/api"; // default axios instance

type AxiosLikeError = {
  isAxiosError?: boolean;
  response?: { status?: number; data?: any };
  request?: any;
  message?: string;
};

function isAxiosLikeError(err: unknown): err is AxiosLikeError {
  return (
    typeof err === "object" &&
    err !== null &&
    ("isAxiosError" in err ||
      "response" in (err as any) ||
      "request" in (err as any))
  );
}

export async function signupApi(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const base = api.defaults?.baseURL ?? "<unknown>";
  // console.log("[signupApi] using base:", base);
  // console.log("[signupApi] payload:", payload);

  try {
    const res = await api.post("/api/auth/signup", payload, { timeout: 10000 });
    // console.log("[signupApi] status:", res.status, "data:", res.data);
    return res.data;
  } catch (err: unknown) {
    if (isAxiosLikeError(err)) {
      console.error("[signupApi] axios-like error message:", err.message);
      if (err.response) {
        console.error(
          "[signupApi] server responded:",
          err.response.status,
          err.response.data
        );
      } else if (err.request) {
        console.error(
          "[signupApi] no response received. request:",
          err.request
        );
      }
      throw err; // rethrow so caller can handle it
    } else {
      console.error("[signupApi] non-axios error:", err);
      throw err;
    }
  }
}

export async function loginApi(payload: { email: string; password: string }) {
  const base = api.defaults?.baseURL ?? "<unknown>";
  // console.log("[loginApi] using base:", base);
  // console.log("[loginApi] payload:", payload);

  try {
    const res = await api.post("/api/auth/login", payload, { timeout: 10000 });
    // console.log("[loginApi] status:", res.status, "data:", res.data);
    return res.data;
  } catch (err: unknown) {
    if (isAxiosLikeError(err)) {
      console.error("[loginApi] axios-like error message:", err.message);
      if (err.response) {
        console.error(
          "[loginApi] server responded:",
          err.response.status,
          err.response.data
        );
      } else if (err.request) {
        console.error("[loginApi] no response received. request:", err.request);
      }
      throw err;
    } else {
      console.error("[loginApi] non-axios error:", err);
      throw err;
    }
  }
}

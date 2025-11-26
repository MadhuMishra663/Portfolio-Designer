// src/screens/FormScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Field from "../components/field";
import api from "../api/api";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../components/header";
import { Paths, Directory } from "expo-file-system";
import { decode as decodeBase64 } from "base64-arraybuffer";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
type FormScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Form">;
};

type PickedFile = {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string;
  type?: string;
  name?: string;
};

type Project = {
  title: string;
  description: string;
  image: PickedFile | null;
  github?: string;
  live?: string;
};

type CreatePortfolioResponse = {
  publicUrl: string;
  slug?: string; // optional
  message?: string;
};

export default function FormScreen({ navigation }: FormScreenProps) {
  // basic profile fields
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  // uploads
  const [profileImage, setProfileImage] = useState<PickedFile | null>(null);
  const [resume, setResume] = useState<PickedFile | null>(null);

  // projects
  const [projects, setProjects] = useState<Project[]>([
    { title: "", description: "", image: null, github: "", live: "" },
  ]);

  const [template, setTemplate] = useState("template1");

  // new fields that align with template1.ejs
  const [interestsInput, setInterestsInput] = useState(""); // comma-separated
  const [skillsInput, setSkillsInput] = useState(""); // comma-separated
  const [contactsInput, setContactsInput] = useState(""); // comma-separated
  const [quote, setQuote] = useState("");
  const [role, setRole] = useState("");

  const [logoUrlInput, setLogoUrlInput] = useState(""); // optional remote logo url

  // auth / header state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  // On mount, check token + stored name
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const storedName = await AsyncStorage.getItem("userName");
        setIsLoggedIn(!!token);
        if (storedName) setUserName(storedName);
      } catch (e) {
        console.warn("Auth check failed", e);
      }
    })();
  }, []);

  // helper: fetch blobUri → data:... base64 string (used on native)
  async function blobToBase64(blobUri: string) {
    const response = await fetch(blobUri);
    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // blob → data:<mime>;base64,...
    });
  }

  /**
   * convertBlobToRealFile
   * - On web: returns a File object (in memory) — append that to FormData.
   * - On native: writes to FileSystem.cacheDirectory and returns { uri, name, type }.
   */
  async function convertBlobToRealFile(
    blobUri: string,
    fileName: string,
    mimeType = "application/pdf"
  ) {
    // ---------- WEB ----------
    if (Platform.OS === "web") {
      // fetch the blob and create a File object
      const resp = await fetch(blobUri);
      const blob = await resp.blob();
      const file = new File([blob], fileName, { type: mimeType });
      // return file directly so submit() can append it
      return { webFile: file, uri: blobUri, name: fileName, type: mimeType };
    }

    // ---------- NATIVE (iOS / Android / Expo) ----------
    // Use legacy write if needed — the modern API may also work depending on SDK.
    // We'll use FileSystem.writeAsStringAsync with Base64 encoding.
    const base64 = await blobToBase64(blobUri);
    const fileUri = (FileSystem as any).cacheDirectory + fileName;

    // On some Expo SDKs EncodingType is available; fall back to string if not.
    const encoding = (FileSystem as any).EncodingType?.Base64 ?? "base64";

    await (FileSystem as any).writeAsStringAsync(
      fileUri,
      base64.replace(/^data:.*;base64,/, ""),
      { encoding }
    );

    return { uri: fileUri, name: fileName, type: mimeType };
  }

  /**
   * pickFile:
   * - when allowPDF === true, uses DocumentPicker.getDocumentAsync and narrows using runtime check `result.type === 'success'`.
   * - otherwise it uses expo-image-picker.
   *
   * We use lightweight casts only to read optional fields (name/mimeType) so this works across Expo versions.
   */
  const pickFile = async (
    onPick: (file: PickedFile) => void,
    allowPDF = false
  ) => {
    // ---------- RESUME: Document Picker ----------
    if (allowPDF) {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      // support both old/new shapes: result.type === 'success' or result.canceled + result.assets (some SDKs)
      const gotAsset =
        (result as any).type === "success"
          ? (result as any)
          : // older shape: result.canceled && result.assets
            (result as any).assets?.length > 0
            ? (result as any).assets[0]
            : null;

      if (!gotAsset) {
        return;
      }

      const asset: any = gotAsset;
      const fileName = asset.name ?? "resume.pdf";
      const mimeType = asset.mimeType ?? "application/pdf";

      const fixed = await convertBlobToRealFile(asset.uri, fileName, mimeType);

      // For web, fixed.webFile exists. For native, fixed.uri is a file:// path.
      if ((fixed as any).webFile) {
        onPick({
          uri: asset.uri,
          fileName,
          type: mimeType,
          webFile: (fixed as any).webFile,
        } as PickedFile & { webFile?: File });
      } else {
        onPick({
          uri: (fixed as any).uri,
          fileName,
          type: mimeType,
        } as PickedFile);
      }
      return;
    }

    // ---------- IMAGE PICKER (Profile & Project images) ----------
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("DEBUG image library permission:", perm);

    if (!perm.granted) {
      Alert.alert("Permission required", "We need access to your gallery.");
      return;
    }

    const imgResult = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    console.log("DEBUG ImagePicker result:", imgResult);

    // If cancelled or no assets — stop
    if (imgResult.canceled || !imgResult.assets?.length) return;

    const asset = imgResult.assets[0] as any;
    const fileName = asset.fileName ?? `image_${Date.now()}.jpg`;
    const mimeType = asset.mimeType ?? asset.type ?? "image/jpeg";

    if (Platform.OS === "web") {
      // create a real File object on web (important)
      const resp = await fetch(asset.uri);
      const blob = await resp.blob();
      const webFile = new File([blob], fileName, { type: mimeType });
      onPick({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileName,
        type: mimeType,
        webFile, // important for submit()
      } as PickedFile & { webFile?: File });
      return;
    }

    // Native: return the uri-based object
    onPick({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileName,
      type: mimeType,
    } as PickedFile);
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { title: "", description: "", image: null, github: "", live: "" },
    ]);
  };

  // header callbacks
  function handleLogin() {
    navigation.navigate("Login");
  }
  function handleSignup() {
    navigation.navigate("Login");
  }
  function handleProfile() {
    navigation.navigate("Form");
  }
  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userName");
      await AsyncStorage.removeItem("userEmail");
      setIsLoggedIn(false);
      setUserName(undefined);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (err) {
      console.error("Logout failed", err);
      Alert.alert("Error", "Could not logout. Try again.");
    }
  }
  // src/screens/FormScreen.tsx

  // submit handler
  const submit = async () => {
    try {
      // parse comma-separated inputs into arrays
      const parsedInterests = interestsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedSkills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedContacts = contactsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const fd = new FormData();
      fd.append("name", name);
      fd.append("about", about);
      fd.append("qualification", qualification);
      fd.append("experience", experience);
      fd.append("linkedin", linkedin);
      fd.append("github", github);
      fd.append("template", template);

      // new template-specific fields
      fd.append("interests", JSON.stringify(parsedInterests));
      fd.append("skills", JSON.stringify(parsedSkills));
      fd.append("contacts", JSON.stringify(parsedContacts));
      fd.append("role", role);
      fd.append("quote", quote);

      // logoUrl: use typed input or fallback dev local path (uploaded file)
      const logoToSend =
        logoUrlInput.trim() || "/mnt/data/Screenshot 2025-11-24 171811.png";
      fd.append("logoUrl", logoToSend);

      // include user's email from storage if available
      const userEmail = await AsyncStorage.getItem("userEmail");
      if (userEmail) fd.append("email", userEmail);

      // projects metadata (title/description/github/live)
      const projectsPayload = projects.map((p) => ({
        title: p.title,
        description: p.description,
        github: p.github || "",
        live: p.live || "",
      }));
      fd.append("projects", JSON.stringify(projectsPayload));

      if (profileImage) {
        const webFile = (profileImage as any).webFile as File | undefined;
        if (webFile && Platform.OS === "web") {
          fd.append(
            "profileImage",
            webFile,
            profileImage.fileName ?? webFile.name
          );
        } else {
          // native (iOS/Android) uses { uri, name, type } object expected by RN FormData
          const ext =
            profileImage.fileName?.split(".").pop() ??
            profileImage.uri.split(".").pop() ??
            "jpg";
          fd.append("profileImage", {
            uri: profileImage.uri,
            name: profileImage.fileName ?? `profile.${ext}`,
            type: profileImage.type ?? `image/${ext}`,
          } as any);
        }
      }

      projects.forEach((p, idx) => {
        if (!p.image) return;
        const webFile = (p.image as any).webFile as File | undefined;
        if (webFile && Platform.OS === "web") {
          // append the real File object (browser)
          fd.append("projectImages", webFile, p.image.fileName ?? webFile.name);
        } else {
          // native: pass RN file object
          const ext =
            p.image.fileName?.split(".").pop() ??
            p.image.uri.split(".").pop() ??
            "jpg";
          fd.append("projectImages", {
            uri: p.image.uri,
            name: p.image.fileName ?? `proj_${idx}.${ext}`,
            type: p.image.type ?? `image/${ext}`,
          } as any);
        }
      });

      // inside submit(), replace resume append section with this:
      if (resume) {
        // If web: we stored a File object on resume.webFile
        const webFile = (resume as any).webFile as File | undefined;

        if (webFile && Platform.OS === "web") {
          // append the actual File object (browser-friendly)
          fd.append("resume", webFile, resume.fileName ?? webFile.name);
        } else {
          // native path (file://...) — append object expected by React Native FormData
          const fileName =
            resume.fileName ?? resume.uri.split("/").pop() ?? "resume.pdf";
          const mime =
            resume.type ??
            (fileName.split(".").pop() === "pdf"
              ? "application/pdf"
              : "application/octet-stream");

          fd.append("resume", {
            uri: resume.uri,
            name: fileName,
            type: mime,
          } as any);
        }
      }

      // project images (mapped by index on server)
      projects.forEach((p, idx) => {
        if (p.image) {
          const ext = p.image.uri.split(".").pop() ?? "jpg";
          fd.append("projectImages", {
            uri: p.image.uri,
            name: p.image.fileName || `proj_${idx}.${ext}`,
            type: p.image.type || `image/${ext}`,
          } as any);
        }
      });

      // headers (do not set Content-Type explicitly)
      const token = await AsyncStorage.getItem("authToken");
      const headers: Record<string, unknown> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // headers["Content-Type"] = "multipart/form-data";

      const res = await api.post<CreatePortfolioResponse>(
        "/api/portfolios",
        fd,
        {
          headers,
        }
      );

      const { publicUrl } = res.data;
      Alert.alert("Success", `Portfolio ready: ${publicUrl}`);
      navigation.navigate("TemplateSelect", { publicUrl });
    } catch (err: any) {
      console.error("Submit error:", err);
      if (err?.response) {
        console.error("Server response status:", err.response.status);
        console.error("Server response data:", err.response.data);
        Alert.alert(
          "Server error",
          `${err.response.status}: ${JSON.stringify(err.response.data)}`
        );
      } else {
        Alert.alert("Error", "Could not create portfolio");
      }
    }
  };

  // a simple dev logo object that can be shown in the header
  const uploadedLogo = { uri: "/mnt/data/Screenshot 2025-11-24 171811.png" };

  // -----------------------
  // UI
  // -----------------------
  return (
    <View style={{ flex: 1 }}>
      <Header
        logo={uploadedLogo}
        title="Create Portfolio"
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onProfile={handleProfile}
        onLogout={handleLogout}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 200,
          minHeight: "240%",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {/* BASIC FIELDS */}
        <Field label="Name" value={name} onChangeText={setName} />
        <Field
          label="Qualification"
          value={qualification}
          onChangeText={setQualification}
        />
        <Field label="About" value={about} onChangeText={setAbout} multiline />
        <Field
          label="Experience"
          value={experience}
          onChangeText={setExperience}
          multiline
        />
        <Field
          label="Role (e.g. Fullstack Developer)"
          value={role}
          onChangeText={setRole}
        />
        <Field label="Quote" value={quote} onChangeText={setQuote} multiline />
        {/* Interests / Skills / Contacts inputs (comma separated) */}
        <Field
          label="Interests (comma separated)"
          value={interestsInput}
          onChangeText={setInterestsInput}
        />
        <Field
          label="Skills (comma separated)"
          value={skillsInput}
          onChangeText={setSkillsInput}
        />
        <Field
          label="Contact links (comma separated)"
          value={contactsInput}
          onChangeText={setContactsInput}
        />

        <Field
          label="Logo URL (optional)"
          value={logoUrlInput}
          onChangeText={setLogoUrlInput}
        />
        <Field
          label="LinkedIn URL"
          value={linkedin}
          onChangeText={setLinkedin}
        />
        <Field label="GitHub URL" value={github} onChangeText={setGithub} />
        {/* Profile Image */}
        <Text style={{ marginTop: 10 }}>Profile Image</Text>
        <TouchableOpacity
          onPress={() =>
            pickFile((f) => {
              setProfileImage(f);
            })
          }
          style={{ marginVertical: 8 }}
        >
          <View style={styles.uploadBox}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage.uri }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
            ) : (
              <Text>Select Profile Image</Text>
            )}
          </View>
        </TouchableOpacity>
        {/* Resume */}
        <Text style={{ marginTop: 10 }}>Resume (PDF or Image)</Text>
        <TouchableOpacity
          onPress={async () => {
            await pickFile((file) => {
              // pickFile will provide webFile on web, or native file object on mobile
              setResume({
                uri: file.uri,
                fileName: file.fileName ?? file.name ?? "resume.pdf",
                type: file.type ?? "application/pdf",
                // preserve webFile if present
                ...((file as any).webFile
                  ? { webFile: (file as any).webFile }
                  : {}),
              } as PickedFile & { webFile?: File });
            }, true);
          }}
        >
          <View style={styles.uploadBox}>
            {resume ? (
              <Text>{resume.fileName || "Resume Selected"}</Text>
            ) : (
              <Text>Select Resume File</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Projects */}
        <Text style={{ marginTop: 10, fontWeight: "600" }}>Projects</Text>
        {projects.map((p, i) => (
          <View key={i} style={{ marginTop: 10 }}>
            <Field
              label={`Project ${i + 1} Title`}
              value={p.title}
              onChangeText={(t) => {
                const arr = [...projects];
                arr[i].title = t;
                setProjects(arr);
              }}
            />

            <Field
              label={`Project ${i + 1} Description`}
              value={p.description}
              onChangeText={(t) => {
                const arr = [...projects];
                arr[i].description = t;
                setProjects(arr);
              }}
              multiline
            />

            <Field
              label={`Project ${i + 1} GitHub URL`}
              value={p.github || ""}
              onChangeText={(t) => {
                const arr = [...projects];
                arr[i].github = t;
                setProjects(arr);
              }}
            />

            <Field
              label={`Project ${i + 1} Live URL`}
              value={p.live || ""}
              onChangeText={(t) => {
                const arr = [...projects];
                arr[i].live = t;
                setProjects(arr);
              }}
            />

            <TouchableOpacity
              onPress={() =>
                pickFile((img) => {
                  const arr = [...projects];
                  arr[i].image = img;
                  setProjects(arr);
                })
              }
              style={{ marginVertical: 8 }}
            >
              <View style={styles.uploadBox}>
                {p.image ? (
                  <Image
                    source={{ uri: p.image.uri }}
                    style={{ width: 120, height: 80, borderRadius: 8 }}
                  />
                ) : (
                  <Text>Select image for project {i + 1}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ marginTop: 8 }}>
          <Button title="Add Project" onPress={addProject} />
        </View>
        {/* Templates */}
        <Text style={{ marginTop: 12 }}>Choose Template</Text>
        <View style={{ flexDirection: "column", gap: 8, marginTop: 8 }}>
          {[
            "template1",
            "template2",
            "template3",
            "template4",
            "template5",
          ].map((t) => (
            <Button
              key={t}
              title={template === t ? `${t} ✓` : t}
              onPress={() => setTemplate(t)}
            />
          ))}
        </View>
        {/* Submit */}
        <View style={{ marginTop: 20 }}>
          <Button
            title="Create Portfolio"
            onPress={() => {
              console.log("Create Portfolio button pressed");
              submit();
            }}
          />
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadBox: {
    backgroundColor: "#eee",
    padding: 8,
    alignItems: "center",
    borderRadius: 8,
  },
});

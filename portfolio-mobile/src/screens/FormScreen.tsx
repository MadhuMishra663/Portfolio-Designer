import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Field from "../components/field";
import api from "../api/api";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type FormScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Form">;
};

type PickedImage = {
  uri: string;
  width: number;
  height: number;
  fileName?: string;
  type?: string;
};

type Project = {
  title: string;
  description: string;
  image: PickedImage | null;
};
type CreatePortfolioResponse = {
  publicUrl: string;
};

export default function FormScreen({ navigation }: FormScreenProps) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [profileImage, setProfileImage] = useState<PickedImage | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    { title: "", description: "", image: null },
  ]);

  const [template, setTemplate] = useState("template1");

  const pickImage = async (onPick: (image: PickedImage) => void) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled && res.assets?.length > 0) {
      const a = res.assets[0];

      const img: PickedImage = {
        uri: a.uri,
        width: a.width,
        height: a.height,
        fileName: a.fileName ?? undefined,
        type: a.mimeType,
      };

      onPick(img);
    }
  };

  const addProject = () =>
    setProjects((prev) => [
      ...prev,
      { title: "", description: "", image: null },
    ]);

  const submit = async () => {
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("about", about);
      fd.append("qualification", qualification);
      fd.append("experience", experience);
      fd.append("linkedin", linkedin);
      fd.append("github", github);
      fd.append("template", template);

      const projectsPayload = projects.map((p) => ({
        title: p.title,
        description: p.description,
      }));
      fd.append("projects", JSON.stringify(projectsPayload));

      // profile image
      if (profileImage) {
        const uriParts = profileImage.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        fd.append("profileImage", {
          uri: profileImage.uri,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      // project images
      projects.forEach((p, idx) => {
        if (p.image) {
          const uriParts = p.image.uri.split(".");
          const fileType = uriParts[uriParts.length - 1];

          fd.append("projectImages", {
            uri: p.image.uri,
            name: `proj${idx}.${fileType}`,
            type: `image/${fileType}`,
          } as any);
        }
      });

      const res = await api.post<CreatePortfolioResponse>(
        "/api/portfolios",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { publicUrl } = res.data;
      Alert.alert("Success", `Portfolio ready: ${publicUrl}`);
      navigation.navigate("TemplateSelect", { publicUrl });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not create portfolio");
    }
  };

  return (
    <ScrollView
      style={{ padding: 16 }}
      contentContainerStyle={{ paddingBottom: 150 }}
      showsVerticalScrollIndicator={true}
    >
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
      <Field label="LinkedIn URL" value={linkedin} onChangeText={setLinkedin} />
      <Field label="GitHub URL" value={github} onChangeText={setGithub} />

      <Text style={{ marginTop: 10 }}>Profile Image</Text>

      {/* FIXED callback */}
      <TouchableOpacity
        onPress={() =>
          pickImage((img) => {
            setProfileImage(img);
          })
        }
        style={{ marginVertical: 8 }}
      >
        <View
          style={{
            backgroundColor: "#eee",
            padding: 8,
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage.uri }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
          ) : (
            <Text>Select image</Text>
          )}
        </View>
      </TouchableOpacity>

      <Text style={{ marginTop: 10, fontWeight: "600" }}>Projects</Text>

      {projects.map((p, i) => (
        <View key={i} style={{ marginTop: 10 }}>
          <Field
            label={`Project ${i + 1} Title`}
            value={p.title}
            onChangeText={(t: string) => {
              const arr = [...projects];
              arr[i].title = t;
              setProjects(arr);
            }}
          />

          <Field
            label={`Project ${i + 1} Description`}
            value={p.description}
            onChangeText={(t: string) => {
              const arr = [...projects];
              arr[i].description = t;
              setProjects(arr);
            }}
            multiline
          />

          {/* FIXED callback */}
          <TouchableOpacity
            onPress={() =>
              pickImage((img) => {
                const arr = [...projects];
                arr[i].image = img;
                setProjects(arr);
              })
            }
            style={{ marginVertical: 8 }}
          >
            <View
              style={{
                backgroundColor: "#eee",
                padding: 8,
                alignItems: "center",
                borderRadius: 8,
              }}
            >
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

      <Button title="Add Project" onPress={addProject} />

      <Text style={{ marginTop: 12 }}>Choose Template</Text>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <Button
          title={template === "template1" ? "Template 1 ✓" : "Template 1"}
          onPress={() => setTemplate("template1")}
        />
        <Button
          title={template === "template2" ? "Template 2 ✓" : "Template 2"}
          onPress={() => setTemplate("template2")}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Create Portfolio" onPress={submit} />
        <Text style={{ fontSize: 24, color: "red" }}>BOTTOM</Text>
      </View>
    </ScrollView>
  );
}

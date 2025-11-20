// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   Button,
//   Image,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import Field from "../components/field";
// import api from "../api/api";
// import { RootStackParamList } from "../types";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// type FormScreenProps = {
//   navigation: NativeStackNavigationProp<RootStackParamList, "Form">;
// };

// type PickedImage = {
//   uri: string;
//   width: number;
//   height: number;
//   fileName?: string;
//   type?: string;
// };

// type Project = {
//   title: string;
//   description: string;
//   image: PickedImage | null;
// };
// type CreatePortfolioResponse = {
//   publicUrl: string;
// };

// export default function FormScreen({ navigation }: FormScreenProps) {
//   const [name, setName] = useState("");
//   const [about, setAbout] = useState("");
//   const [qualification, setQualification] = useState("");
//   const [experience, setExperience] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [github, setGithub] = useState("");
//   const [profileImage, setProfileImage] = useState<PickedImage | null>(null);
//   const [projects, setProjects] = useState<Project[]>([
//     { title: "", description: "", image: null },
//   ]);
//   const [resume, setResume] = useState<PickedImage | null>(null);

//   const [template, setTemplate] = useState("template1");

//   const pickImage = async (onPick: (image: PickedImage) => void) => {
//     const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!perm.granted) {
//       Alert.alert("Permission required");
//       return;
//     }

//     const res = await ImagePicker.launchImageLibraryAsync({
//       quality: 0.7,
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     });

//     if (!res.canceled && res.assets?.length > 0) {
//       const a = res.assets[0];

//       const img: PickedImage = {
//         uri: a.uri,
//         width: a.width,
//         height: a.height,
//         fileName: a.fileName ?? undefined,
//         type: a.mimeType,
//       };

//       onPick(img);
//     }
//   };

//   const addProject = () =>
//     setProjects((prev) => [
//       ...prev,
//       { title: "", description: "", image: null },
//     ]);

//   const submit = async () => {
//     try {
//       const fd = new FormData();
//       fd.append("name", name);
//       fd.append("about", about);
//       fd.append("qualification", qualification);
//       fd.append("experience", experience);
//       fd.append("linkedin", linkedin);
//       fd.append("github", github);
//       fd.append("template", template);

//       const projectsPayload = projects.map((p) => ({
//         title: p.title,
//         description: p.description,
//       }));
//       fd.append("projects", JSON.stringify(projectsPayload));

//       // profile image
//       if (profileImage) {
//         const uriParts = profileImage.uri.split(".");
//         const fileType = uriParts[uriParts.length - 1];

//         fd.append("profileImage", {
//           uri: profileImage.uri,
//           name: `profile.${fileType}`,
//           type: `image/${fileType}`,
//         } as any);
//       }

//       // project images
//       projects.forEach((p, idx) => {
//         if (p.image) {
//           const uriParts = p.image.uri.split(".");
//           const fileType = uriParts[uriParts.length - 1];

//           fd.append("projectImages", {
//             uri: p.image.uri,
//             name: `proj${idx}.${fileType}`,
//             type: `image/${fileType}`,
//           } as any);
//         }
//       });

//       const res = await api.post<CreatePortfolioResponse>(
//         "/api/portfolios",
//         fd,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       const { publicUrl } = res.data;
//       Alert.alert("Success", `Portfolio ready: ${publicUrl}`);
//       navigation.navigate("TemplateSelect", { publicUrl });
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Could not create portfolio");
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView
//         contentContainerStyle={{
//           padding: 16,
//           paddingBottom: 200,
//           minHeight: "240%", // forces scroll on all screens
//         }}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={true}
//       >
//         <Field label="Name" value={name} onChangeText={setName} />
//         <Field
//           label="Qualification"
//           value={qualification}
//           onChangeText={setQualification}
//         />
//         <Field label="About" value={about} onChangeText={setAbout} multiline />
//         <Field
//           label="Experience"
//           value={experience}
//           onChangeText={setExperience}
//           multiline
//         />
//         <Field
//           label="LinkedIn URL"
//           value={linkedin}
//           onChangeText={setLinkedin}
//         />
//         <Field label="GitHub URL" value={github} onChangeText={setGithub} />

//         <Text style={{ marginTop: 10 }}>Profile Image</Text>

//         {/* FIXED callback */}
//         <TouchableOpacity
//           onPress={() =>
//             pickImage((img) => {
//               setProfileImage(img);
//             })
//           }
//           style={{ marginVertical: 8 }}
//         >
//           <View
//             style={{
//               backgroundColor: "#eee",
//               padding: 8,
//               alignItems: "center",
//               borderRadius: 8,
//             }}
//           >
//             {profileImage ? (
//               <Image
//                 source={{ uri: profileImage.uri }}
//                 style={{ width: 100, height: 100, borderRadius: 8 }}
//               />
//             ) : (
//               <Text>Select image</Text>
//             )}
//           </View>
//         </TouchableOpacity>

//         <Text style={{ marginTop: 10, fontWeight: "600" }}>Projects</Text>

//         {projects.map((p, i) => (
//           <View key={i} style={{ marginTop: 10 }}>
//             <Field
//               label={`Project ${i + 1} Title`}
//               value={p.title}
//               onChangeText={(t: string) => {
//                 const arr = [...projects];
//                 arr[i].title = t;
//                 setProjects(arr);
//               }}
//             />

//             <Field
//               label={`Project ${i + 1} Description`}
//               value={p.description}
//               onChangeText={(t: string) => {
//                 const arr = [...projects];
//                 arr[i].description = t;
//                 setProjects(arr);
//               }}
//               multiline
//             />

//             {/* FIXED callback */}
//             <TouchableOpacity
//               onPress={() =>
//                 pickImage((img) => {
//                   const arr = [...projects];
//                   arr[i].image = img;
//                   setProjects(arr);
//                 })
//               }
//               style={{ marginVertical: 8 }}
//             >
//               <View
//                 style={{
//                   backgroundColor: "#eee",
//                   padding: 8,
//                   alignItems: "center",
//                   borderRadius: 8,
//                 }}
//               >
//                 {p.image ? (
//                   <Image
//                     source={{ uri: p.image.uri }}
//                     style={{ width: 120, height: 80, borderRadius: 8 }}
//                   />
//                 ) : (
//                   <Text>Select image for project {i + 1}</Text>
//                 )}
//               </View>
//             </TouchableOpacity>
//           </View>
//         ))}

//         <Button title="Add Project" onPress={addProject} />

//         <Text style={{ marginTop: 12 }}>Choose Template</Text>
//         <View style={{ flexDirection: "column", gap: 8, marginTop: 8 }}>
//           <Button
//             title={template === "template1" ? "Template 1 ✓" : "Template 1"}
//             onPress={() => setTemplate("template1")}
//           />
//           <Button
//             title={template === "template2" ? "Template 2 ✓" : "Template 2"}
//             onPress={() => setTemplate("template2")}
//           />
//           <Button
//             title={template === "template3" ? "Template 3 ✓" : "Template 3"}
//             onPress={() => setTemplate("template3")}
//           />
//           <Button
//             title={template === "template4" ? "Template 4 ✓" : "Template 4"}
//             onPress={() => setTemplate("template4")}
//           />
//           <Button
//             title={template === "template5" ? "Template 5 ✓" : "Template 5"}
//             onPress={() => setTemplate("template5")}
//           />
//         </View>

//         <View style={{ marginTop: 20 }}>
//           <Button
//             title="Create Portfolio"
//             onPress={() => {
//               console.log("Create Portfolio button pressed");
//               submit();
//             }}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
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
import * as DocumentPicker from "expo-document-picker";
import Field from "../components/field";
import api from "../api/api";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type FormScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Form">;
};

type PickedFile = {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string;
  type?: string;
};

type Project = {
  title: string;
  description: string;
  image: PickedFile | null;
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

  const [profileImage, setProfileImage] = useState<PickedFile | null>(null);
  const [resume, setResume] = useState<PickedFile | null>(null);

  const [projects, setProjects] = useState<Project[]>([
    { title: "", description: "", image: null },
  ]);

  const [template, setTemplate] = useState("template1");

  // ---------------------------------------------------------
  // GENERIC PICKER (image/pdf)
  // ---------------------------------------------------------
  // pick image or PDF
  const pickFile = async (
    onPick: (file: PickedFile) => void,
    allowPDF = false
  ) => {
    if (allowPDF) {
      // ---- PICK PDF ----
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        onPick({
          uri: file.uri,
          fileName: file.name,
          type: file.mimeType,
        });
      }
    } else {
      // ---- PICK IMAGE ----
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

        const img: PickedFile = {
          uri: a.uri,
          width: a.width,
          height: a.height,
          fileName: a.fileName ?? undefined,
          type: a.mimeType,
        };

        onPick(img);
      }
    }
  };

  // ---------------------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------------------
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
      fd.append("email", email);

      const projectsPayload = projects.map((p) => ({
        title: p.title,
        description: p.description,
      }));
      fd.append("projects", JSON.stringify(projectsPayload));

      // PROFILE IMAGE UPLOAD
      if (profileImage) {
        const ext = profileImage.uri.split(".").pop();
        fd.append("profileImage", {
          uri: profileImage.uri,
          name: `profile.${ext}`,
          type: profileImage.type || `image/${ext}`,
        } as any);
      }

      // RESUME UPLOAD (PDF OR IMAGE)
      if (resume) {
        const ext = resume.uri.split(".").pop();
        fd.append("resume", {
          uri: resume.uri,
          name: resume.fileName || `resume.${ext}`,
          type: resume.type || "application/pdf",
        } as any);
      }

      // PROJECT IMAGES UPLOAD
      projects.forEach((p, idx) => {
        if (p.image) {
          const ext = p.image.uri.split(".").pop();
          fd.append("projectImages", {
            uri: p.image.uri,
            name: `proj_${idx}.${ext}`,
            type: p.image.type || `image/${ext}`,
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
  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { title: "", description: "", image: null },
    ]);
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <View style={{ flex: 1 }}>
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
          label="LinkedIn URL"
          value={linkedin}
          onChangeText={setLinkedin}
        />
        <Field label="GitHub URL" value={github} onChangeText={setGithub} />

        {/* PROFILE IMAGE */}
        <Text style={{ marginTop: 10 }}>Profile Image</Text>
        <TouchableOpacity
          onPress={() =>
            pickFile((f) => {
              setProfileImage(f);
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
              <Text>Select Profile Image</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* RESUME UPLOAD */}
        <Text style={{ marginTop: 10 }}>Resume (PDF or Image)</Text>
        <TouchableOpacity
          onPress={() =>
            pickFile((file) => {
              setResume(file);
            }, true)
          }
          style={{ marginVertical: 8 }}
        >
          <View
            style={{
              backgroundColor: "#eee",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            {resume ? (
              <Text>{resume.fileName || "Resume Selected"}</Text>
            ) : (
              <Text>Select Resume File</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* PROJECTS */}
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

        {/* TEMPLATE SELECT */}
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

        {/* SUBMIT */}
        <View style={{ marginTop: 20 }}>
          <Button
            title="Create Portfolio"
            onPress={() => {
              console.log("Create Portfolio button pressed");
              submit();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

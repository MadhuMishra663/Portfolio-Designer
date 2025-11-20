import React from "react";
import { View, Text, Button, Linking } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type TemplateSelectScreenProps = {
  route: RouteProp<RootStackParamList, "TemplateSelect">;
};

export default function TemplateSelectScreen({
  route,
}: TemplateSelectScreenProps) {
  const { publicUrl } = route.params;

  return (
    <View style={{ padding: 16 }}>
      <Text>Your portfolio is generated:</Text>
      <Text style={{ color: "blue", marginVertical: 8 }}>{publicUrl}</Text>

      <Button title="Open" onPress={() => Linking.openURL(publicUrl)} />
    </View>
  );
}

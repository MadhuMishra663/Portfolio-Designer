import React from "react";
import { View, TextInput, Text } from "react-native";

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
};

export default function Field({
  label,
  value,
  onChangeText,
  multiline = false,
}: FieldProps) {
  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          borderRadius: 8,
          minHeight: multiline ? 80 : 44,
        }}
      />
    </View>
  );
}

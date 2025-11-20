import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import FormScreen from "./screens/FormScreen";
import TemplateSelectScreen from "./screens/TemplateSelectScreen";
import { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Form">
        <Stack.Screen name="Form" component={FormScreen} />
        <Stack.Screen name="TemplateSelect" component={TemplateSelectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

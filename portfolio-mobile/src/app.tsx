import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import FormScreen from "./screens/FormScreen";
import TemplateSelectScreen from "./screens/TemplateSelectScreen";
import { RootStackParamList } from "./types";
import Home from "./components/home";
import Signup from "./components/signup";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Form"
          component={FormScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="TemplateSelect" component={TemplateSelectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

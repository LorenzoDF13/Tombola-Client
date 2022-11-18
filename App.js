import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import CartelleScreen from "./screens/CartelleScreen";
import TabelloneScreen from "./screens/TabelloneScreen";
import { Provider } from "react-native-paper";
import AppBar from "./components/AppBar";
import LobbyScreen from "./screens/LobbyScreen";
import SettingsScreen from "./screens/SettingScreen";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: (props) => <AppBar {...props} />,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lobby" component={LobbyScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Cartelle" component={CartelleScreen} />
          <Stack.Screen name="Tabellone" component={TabelloneScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { Alert, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const SettingsScreen = () => {
  const [text, setText] = React.useState("http://37.116.160.184:3000");

  return (
    <View>
      <TextInput label="Server url" value={text} onChangeText={setText} />
      <Button
        onPress={async () => {
          setServer(text);
          await AsyncStorage.setItem("SERVER_URL");
          Alert.alert("Riavvia per appliacre le modifiche ");
        }}
      >
        Cambia
      </Button>
    </View>
  );
};

export default SettingsScreen;

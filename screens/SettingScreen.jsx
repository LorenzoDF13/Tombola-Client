import * as React from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { setServer } from "../utils/socket";
const SettingsScreen = () => {
  const [text, setText] = React.useState("http://37.116.160.184:3000");

  return (
    <View>
      <TextInput label="Server url" value={text} onChangeText={setText} />
      <Button
        onPress={() => {
          setServer(text);
        }}
      >
        Cambia
      </Button>
    </View>
  );
};

export default SettingsScreen;

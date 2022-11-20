import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
export default function Avatarr({ text }) {
  const [realText, setRealText] = useState();
  useEffect(() => {
    console.log(text + " MATCHES " + text?.match(/[A-Z]/g) + " AVATAR");
    let letters = text?.match(/[A-Z]/g);

    if (letters.length < 2) {
      setRealText(letters[0] + text[text.length - 1]);
    } else {
      setRealText(letters[0] + letters[1]);
    }
  }, []);
  return <Avatar.Text size={24} label={realText?.toUpperCase()}></Avatar.Text>;
}

import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Styles from "../styles/CartelleScreenStyle";
import { useTheme } from "react-native-paper";
export default function CartellaCell({
  extractedNumbers,
  selectedNumbers,
  value,
}) {
  const theme = useTheme();
  const [selected, setSelected] = useState(false);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (
            !selected &&
            extractedNumbers.current.includes(value) &&
            !selectedNumbers.current.includes(value)
          ) {
            selectedNumbers.current.push(value);
            setSelected(true);
          }
        }}
        style={
          selectedNumbers.current.includes(value)
            ? {
                ...Styles.cartellaText,
                backgroundColor: theme.colors.primaryContainer,
                borderColor: theme.colors.primaryContainer,
                color: theme.colors.primaryContainer,
              }
            : {
                ...Styles.cartellaText,
                borderColor: theme.colors.primaryContainer,
                color: "black",
              }
        }
      >
        <Text style={{ color: theme.colors.onBackground }}>
          {value == -1 ? "    " : value}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

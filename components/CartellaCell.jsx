import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Styles from "../styles/CartelleScreenStyle";
import { useTheme } from "react-native-paper";
export default function CartellaCell({
  extractedNumbers,
  selectedNumbers,
  value,
  tabellone,
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
                padding: tabellone ? 8 : 10,
              }
            : {
                ...Styles.cartellaText,
                borderColor: theme.colors.primaryContainer,
                color: "black",
                padding: tabellone ? 8 : 10,
              }
        }
      >
        <Text style={{ color: theme.colors.onBackground }}>
          {value == -1 ? "    " : value < 10 ? "0" + value : value}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

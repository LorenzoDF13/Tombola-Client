import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import CartellaCell from "./CartellaCell";

export default function CartellaTabellone({ firstValue, extractedNumbers }) {
  const theme = useTheme();
  return (
    <View>
      {Array.from(Array(3), (_, i) => {
        let index = firstValue;
        index + 6;

        return Array.from(Array(5), (_, j) => {
          index++;
          <CartellaCell value={index} />;
        });
      })}
    </View>
  );
}

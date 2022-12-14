import { ScrollView, View } from "react-native";
import React from "react";
import { Chip } from "react-native-paper";

export default function Points({ points }) {
  return (
    <View>
      <ScrollView horizontal={true}>
        {Object.entries(points).map((point) =>
          point[1] != false ? (
            <Chip
              key={point[0]}
              style={{ marginLeft: 5, marginRigth: 5 }}
              mode="outlined"
            >
              {point[0] + ": " + point[1]}
            </Chip>
          ) : (
            ""
          )
        )}
      </ScrollView>
    </View>
  );
}

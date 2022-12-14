import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Chip } from "react-native-paper";
import Avatar from "./Avatar";
import socket from "../utils/socket";

export default function Users(props) {
  const [users, setUsers] = useState(props.users);
  // console.log("USERS: " + users);
  useEffect(() => {
    socket.on("roomChange", (users) => {
      setUsers(users);
    });
    return () => {
      socket.off("roomChange");
    };
  }, []);
  return (
    <View style={{ margin: 10 }}>
      <ScrollView horizontal={true}>
        {users.map((user) => (
          <Chip
            key={user.username || Math.random() * 9999}
            avatar={<Avatar text={user.username} />}
            style={{ marginLeft: 5, marginRigth: 5 }}
          >
            {user.username}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  item: {
    borderRadius: 50,
    backgroundColor: "white",
    fontSize: 15,
    textAlign: "center",
    margin: 5,
    padding: 5,
    width: 33,
    height: 33,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 5,
    marginTop: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    backgroundColor: "red",
    color: "white",
    borderRadius: 20,
    margin: 10,
    padding: 10,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
  },
  extractedNumber: {
    textAlign: "center",
    fontSize: 15,
    backgroundColor: "red",
    color: "white",
    padding: 10,
    width: 50,
    margin: 10,
    textAlign: "center",
    borderRadius: 50,
  },
});

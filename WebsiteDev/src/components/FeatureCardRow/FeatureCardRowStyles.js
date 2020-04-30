import { StyleSheet } from "react-native-web";

export default StyleSheet.create({
  cardRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "96vw",
    marginLeft: "2vw",
    height: "90vh",
  },
  cardContainer: {
    width: "22.5vw",
    height: "75vh",
    borderWidth: 4,
    borderColor: "#00B0F0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: "5vh",
  },
  cardTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: "3vh",
    width: "85%",
  },
  iconContainer: {
    background: "#41CBEF",
    width: "10vw",
    padding: 20,
    height: "10vw",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5vw",
    alignContent: "center",
  },
  cardTitle: {
    fontFamily: "Lucida Grande",
    fontSize: 40,
    color: "#567681",
    fontWeight: "bold",
  },
  cardText: {
    fontFamily: "Lucida Grande",
    fontSize: 29,
    color: "#567681",
    marginTop: "2vh",
    marginBottom: "10vh",
  },
});

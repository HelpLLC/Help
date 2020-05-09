import { StyleSheet } from "react-native";
import colors from "../../config/colors";

export default StyleSheet.create({
  //Default button size to use
  Container: {
    width: "27vw",
    height: "80vh",
    borderWidth: 6,
    borderColor: colors.green,
    borderRadius: "2.5vh",
  },

  TitleContainer: { marginLeft: "1.5vw", marginTop: "1vh" },

  Title: {
    color: "#707070",
    fontSize: "2vw",
    fontFamily: "Lucida Grande",
    fontWeight: "bold",
  },

  //The style for a perfect round button that is small
  CardContainer: {
    width: "24vw",
    height: "20vh",
    borderWidth: 5,
    borderColor: colors.green,
    borderRadius: "2.5vh",
    marginLeft: "1.25vw",
    marginTop: "2vh",
    flexDirection: "row",
  },
  ImageStyle: {
    height: "14vh",
    width: "10vw",
    marginLeft: "1vw",
    marginTop: "3vh",
    borderRadius: "1vh",
  },
  CardTitleContainer: { marginLeft: "1vw", marginTop: "3vh", width: "13vw" },
  CardTitle: {
    color: colors.darkGray,
    fontSize: "1.5vw",
    fontFamily: "Lucida Grande",
    fontWeight: "bold",
  },
  DateContainer: { marginLeft: "1vw", marginTop: "1vh" },
  Date: {
    color: colors.darkGray,
    fontSize: "1.25vw",
    fontFamily: "Lucida Grande",
    fontWeight: "bold",
  },
  ButtonContainer:{ marginLeft: "1vw", marginTop: "4vh" },
});

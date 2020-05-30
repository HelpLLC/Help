//This is going to contain the styles for the Business Card
import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../../config/dimensions";
import colors from "../../config/colors";

export default StyleSheet.create({
  cardcontainer: {
    width: "47vw",
    height: "25vh",
    borderWidth: 6,
    borderColor: colors.green,
    borderRadius: "2.5vh",
    flexDirection: "row",
    overflow: "hidden",
  },
  image: {
    height: "18.50vh",
    width: "13.5vw",
    marginLeft: "1vw",
    marginTop: "2.5vh",
    borderRadius: "1vh",
  },
  title: {
    fontFamily: "Lucida Grande",
    fontSize: "2vw",
    color: colors.darkBlue,
    fontWeight: "bold",
  },
  titleContainer: { marginTop: "2.5vh", marginLeft: "1.5vw" },
  requestsContainer: { marginTop: "2vh", width: "10vw" },
  requestsText: {
    fontFamily: "Lucida Grande",
    fontSize: "1.5vw",
    color: colors.darkBlue,
  },
  reviewsText: {
    fontFamily: "Lucida Grande",
    fontSize: "1.25vw",
    color: colors.darkBlue,
  },
  starsContainer: { marginTop: "1vh" },
  bottomSectionContainer: { marginTop: "13vh", marginLeft: '4vw' },
  priceContainer: { width: "12vw" },
  priceText: {
    fontFamily: "Lucida Grande",
    fontSize: "1.5vw",
    color: colors.darkBlue,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    width: "12.5vw",
    marginTop: "1.5vh",
    marginBottom: "1vh",
    
  },
});

// This is going to be the StyleSheet for the confirmPaymentScreen
import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
  AddServiceButton: {
    marginLeft: screenWidth * 0.05,
    marginTop: screenHeight * 0.05,
  },
  ServiceCard: {
    borderColor: colors.lightBlue,
    borderWidth: 3,
    borderRadius: 25,
    flexDirection: 'row',
    padding: screenWidth * 0.05,
    marginLeft: screenWidth * 0.05,
    marginTop: screenHeight * 0.05
  },
  imageStyle: {
    width: screenWidth * 0.4 - 3,
    height: screenHeight * 0.13 - 3,
    borderRadius: 25,
  },
  CardText: {
    marginTop: screenHeight * 0.005,
    marginBottom: screenHeight * 0.005,
  },
  TextPlusButton: {
  marginTop: screenHeight * 0.05,
  marginLeft: screenWidth * 0.05
  },
  BottomSpacer: {
    marginBottom: screenHeight * 0.02,
  }
});

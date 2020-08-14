// This is going to be the StyleSheet for the confirmPaymentScreen
import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
  ServiceCard: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.25,
    borderColor: colors.lightBlue,
    borderWidth: 3,
    borderRadius: 25,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: screenHeight * 0.05,
  },
  imageSection: {
      marginLeft: screenWidth * 0.25,
    flexDirection: 'column',
    marginTop: screenHeight * 0.025,
    alignItems: 'center',
    justifyContent: 'center'
},
  imagePicker: {
    alignSelf: 'center',
    width: screenWidth * 0.25,
    marginBottom: screenHeight * 0.02,
    height: screenWidth * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.lightBlue,
    borderWidth: (screenWidth * 0.25) / 18,
    borderRadius: (screenWidth * 0.25) / 2,
    backgroundColor: colors.white,
},
  imageStyle: {
    width: screenWidth * 0.4 - 3,
    height: screenHeight * 0.13 - 3,
    borderRadius: 25,
  },
  ServiceTitleView: {
      marginTop: screenHeight * 0.05,
      marginBottom: screenHeight * 0.05,
      marginLeft: screenWidth * 0.05
  },
  ServiceTitleInput: {
      marginTop: screenHeight * 0.01,
      marginLeft: screenWidth * -0.02
  },
  ServiceDescriptionView: {
    marginTop: screenHeight * 0.005,
    marginBottom: screenHeight * 0.05,
    marginLeft: screenWidth * 0.05
  },
  ServiceDescriptionInput:{
    marginTop: screenHeight * 0.01,
    marginLeft: screenWidth * -0.02
  },
  ServiceDurationView: {
    marginLeft: screenWidth * 0.05
  },
  ServiceDurationInputsView:{
    marginTop: screenHeight * 0.03,
    display: 'flex',
    flexDirection: "row",
  },
  DurationHours: {
      marginLeft: screenWidth * 0.05,
      display: 'flex',
      flexDirection: "row",
  },
  DurationMinutes: {
    marginLeft: screenWidth * 0.05,
    display: 'flex',
    flexDirection: "row",
  }
});

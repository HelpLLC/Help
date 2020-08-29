// This is going to be the StyleSheet for the confirmPaymentScreen
import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
  Title: {
      marginTop: screenHeight * 0.02,
      marginBottom: screenHeight * 0.02,
      marginLeft: screenWidth * 0.05
  },
  Description:{
    marginBottom: screenHeight * 0.02,
    marginLeft: screenWidth * 0.05
  },
  TextInputView: {
    display: 'flex',
    flexDirection: "row",
    marginLeft: screenWidth * 0.05
  },
  EmployeesText:{
    marginLeft: screenWidth * 0.05,
    marginTop: screenHeight * 0.015,
  },
  NextButton:{
    marginTop: screenHeight * 0.08,
    position: 'absolute',
    left: screenWidth * 0.7,
    top: screenHeight * 0.5
},
BackButton:{
    marginTop: screenHeight * 0.08,
    position: 'absolute',
   marginLeft: screenWidth * 0.02,
    top: screenHeight * 0.5
},
});
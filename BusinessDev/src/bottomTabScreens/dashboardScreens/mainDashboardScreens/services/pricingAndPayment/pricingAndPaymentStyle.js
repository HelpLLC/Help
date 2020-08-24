// This is going to be the StyleSheet for the confirmPaymentScreen
import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
  PricingTitleView: {
      marginTop: screenHeight * 0.05,
      marginBottom: screenHeight * 0.05,
      marginLeft: screenWidth * 0.05
  },
  PricingTitleInputsView:{
    marginTop: screenHeight * 0.03,
    display: 'flex',
    flexDirection: "row",
  },
  IconandInputView: {
    display: 'flex',
    flexDirection: "row",
    marginRight: screenWidth * 0.05
  },
  Icon: {
marginRight: screenWidth * 0.05
  },
  Per:{
    marginRight: screenWidth * 0.05,
    marginTop: screenHeight * 0.01,
  },
  PaymentTiteleView: {
    marginBottom: screenHeight * 0.05,
    marginLeft: screenWidth * 0.05
},
PaymentTypeButtons: {
    marginTop: screenHeight * 0.03,
    marginLeft: screenWidth * 0.2,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column'
},
CashButton: {
    marginBottom: screenHeight * 0.02
},
NextButton:{
    marginTop: screenHeight * 0.08,
    position: 'absolute',
    left: screenWidth * 0.7,
    top: screenHeight * 0.75
},
BackButton:{
    marginTop: screenHeight * 0.08,
    position: 'absolute',
   marginLeft: screenWidth * 0.02,
    top: screenHeight * 0.75
},
});

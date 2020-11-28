// This is going to be the StyleSheet for the confirmPaymentScreen
import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
  ServiceCardwithAddress: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.15,
    borderColor: colors.lightBlue,
    borderWidth: 3,
    borderRadius: 25,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  ServiceCard: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.1,
    borderColor: colors.lightBlue,
    borderWidth: 3,
    borderRadius: 25,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  HeaderMargin: {
    marginTop: screenHeight * 0.05,
    marginLeft: screenWidth * 0.05,
  },
  TitleandLocation: {
    marginLeft: screenWidth * 0.4,
  },
  TitleandAccuratetime: {
    marginLeft: screenWidth * 0.2,
    paddingRight: screenWidth * 0.15,
  },
  Title: {
    marginTop: screenHeight * 0.02,
  },
  AddressandAccuratetime: {
    marginTop: screenHeight * 0.02,
  },
  TimeandButtonwithAdress: {
    marginRight: screenWidth * 0.2,
  },
  TimeandButton: {
    marginRight: screenWidth * 0.1,
  },
  TimewithAdress: {
    marginTop: screenHeight * 0.02,
  },
  Time: {
    marginTop: screenHeight * 0.01,
  },
  ButtonwithAddress: {
    marginRight: screenWidth * 0.2,
    marginTop: screenHeight * 0.07,
  },
  Button: {
    marginRight: screenWidth * 0.1,
    marginTop: screenHeight * 0.025,
  },
});

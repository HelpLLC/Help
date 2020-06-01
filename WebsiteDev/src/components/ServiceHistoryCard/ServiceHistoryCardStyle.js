//This is the styles for the HelpTextInput component
import { StyleSheet } from 'react-native';
import colors from '../../config/colors';
import { screenHeight, screenWidth } from '../../config/dimensions';
import fontStyles from '../../config/fontStyles';

export default {
	card: {
      paddingStart: '2vh',
      paddingTop: '2vh',
      width: '65vw',
      height: '24vh',
      borderRadius: 25,
      borderWidth: 2,
      'borderColor': 'rgba(92, 198, 188, 255)',
   },
   row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
   },
   paymentStatus: {
      alignItems: 'flex-start',
      marginTop: '0.5vh',
      borderRadius: 15,
      marginStart: '1vw',
      paddingHorizontal: '0.5vw',
      paddingVertical: '1vh',
      'background': 'linear-gradient(90deg, #5cc6bc, #41cbef)',
   },
   profileImage: {
      marginTop: '4vh',
      width: '5vw',
      height: '5vw',
   },
   firstInfoRow: {
      alignItems: 'flex-start',
      marginStart: '1vw',
      marginTop: '3vh',
   },
   viewMoreButton: {
      alignItems: 'flex-start',
      marginStart: '50vw',
      marginTop: '-7vh',
      height: '3vh',
   },
   requestFromText: {
      ...fontStyles.subTextStyle,
      ...fontStyles.darkBlue,
      marginTop: '2vh',
   },
   completedText: {
      ...fontStyles.bigTextStyle,
      ...fontStyles.darkBlue,
      ...fontStyles.bold,
      marginTop: '2vh',
      marginStart: '27vw',
   },
   nameText: {
      ...fontStyles.bigSubTitleStyle,
      ...fontStyles.darkBlue,
      ...fontStyles.bold,
      marginStart: '-0.5vw',
   },
   totalText: {
      ...fontStyles.bigTextStyle,
      ...fontStyles.darkBlue,
      ...fontStyles.bold,
      marginTop: '2vh',
      marginStart: '23.5vw',
   }
}

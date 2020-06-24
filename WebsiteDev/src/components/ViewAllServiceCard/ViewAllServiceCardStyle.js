//This is the styles for the HelpTextInput component
import { StyleSheet } from 'react-native';
import colors from '../../config/colors';
import { screenHeight, screenWidth } from '../../config/dimensions';
import fontStyles from '../../config/fontStyles';

export default {
	card: {
      paddingStart: '2vh',
      paddingTop: '2vh',
      marginTop: '2vh',
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
   col: {
      flexDirection: 'column',
      alignItems: 'flex-start',
   },
   dateText: {
      ...fontStyles.mainTextStyle,
      ...fontStyles.darkBlue,
      marginTop: '1vh',
      marginStart: '27vw',
   },
   profileImage: {
      marginTop: '3vh',
      width: '5vw',
      height: '5vw',
      borderRadius: '5vw'
   },
   firstInfoRow: {
      alignItems: 'flex-start',
      marginStart: '1vw',
      marginTop: '3vh',
   },
   secondInfoRow: {
      alignItems: 'flex-start',
      marginStart: '5.5vw',
   },
   viewMoreButton: {
      alignItems: 'flex-start',
      marginStart: '42vw',
      height: '3vh',
   },
   requestFromText: {
      ...fontStyles.subTextStyle,
      ...fontStyles.darkBlue,
      marginTop: '1vh'
   },
   nameText: {
      ...fontStyles.mainTextStyle,
      ...fontStyles.darkBlue,
      ...fontStyles.bold,
      marginStart: '0.5vw',
      marginTop: '-5vh'
   },
   timeText: {
      ...fontStyles.mainTextStyle,
      ...fontStyles.darkBlue,
      ...fontStyles.bold,
      marginStart: '27.5vw',
      marginTop: '-5vh'
   }
}

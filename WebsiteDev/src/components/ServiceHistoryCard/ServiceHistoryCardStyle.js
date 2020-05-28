//This is the styles for the HelpTextInput component
import { StyleSheet } from 'react-native';
import colors from '../../config/colors';
import { screenHeight, screenWidth } from '../../config/dimensions';
import fontStyles from '../../config/fontStyles';

export default StyleSheet.create({
	card: {
      paddingStart: '2vh',
      paddingTop: '2vh',
      width: '65vw',
      height: '24vh',
      borderRadius: 25,
      borderWidth: 2,
   },
   row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
   }
});

//This is the styles for the HelpTextInput component
import colors from '../../config/colors';
import fontStyles from '../../config/fontStyles';
import { isMobile } from 'react-device-detect';

export default {
  textInputContainerStyle: {
    borderRadius: 20,
    backgroundColor: colors.white,
    borderColor: colors.blue,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    shadowOpacity: 10,
    shadowColor: colors.lightBlue,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 3,
    ...fontStyles.black,
    ...fontStyles.mainTextStyle,
    fontSize: isMobile ? '3.5vw': '1.75vw'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
};

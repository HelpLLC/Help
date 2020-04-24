//This is going to export the screen height and the screen width to be references in the rest of the code
import { Dimensions } from 'react-native-web';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export { screenHeight, screenWidth };

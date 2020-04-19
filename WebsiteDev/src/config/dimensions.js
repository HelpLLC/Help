//This is going to export the screen height and the screen width to be references in the rest of the code
import { Dimensions } from 'react-native-web';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export { screenHeight, screenWidth };

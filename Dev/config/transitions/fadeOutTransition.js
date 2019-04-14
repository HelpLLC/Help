//This transition will make the screens fade out into each other instead of react native's 
//default "right sliding" animation
import { Easing, Animated } from 'react-native';

//This function will get called when stack navigator initialized
export default fadeOutTransition = () => {
    return {
        //Configures animation timing & other configurations
        transitionSpec: {
            //Controls the duration of the animation
            duration: 750,

            //Other native configs
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },

        //Configures the actual transformation between screens
        screenInterpolator: sceneProps => {

            //Retrieves the required screen props for the fade in transition
            const { position, scene } = sceneProps;

            //Gets the scene of the current index
            const thisSceneIndex = scene.index;

            //Actually makes the opacity change using the interpolate function... basically makes
            //it so as the scene index shifts from current screen to new screen (1 to 2), the
            //opacity will gradually increase, until the new screen is here.
            const opacity = position.interpolate({
                //This defines for each input, what should be the output... for example, if current
                //scene (input) is 0.5, then the opacity (output) is going to be 50.
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [0, 1],
            });

            //returns the opacity constant
            return { opacity };
        }
    }
}
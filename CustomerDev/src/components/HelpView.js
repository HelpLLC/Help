//This is a higher order component that should adapt to the keyboard coming up. It will utilize
//KeyboardAvoidingView to make sure the TextInput being typed into is visible, as well as making sure
//that if the keyboard is clicked away from, it should hide. It will take care of the screen's background
//color and everything
import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { screenWidth, screenHeight } from 'config/dimensions';

//Creates the higher order component
const HelpViewHOC = (Comp) => {
	return ({ children, ...props }) => (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<KeyboardAwareScrollView
				resetScrollToCoords={{ x: 0, y: 0 }}
				scrollEnabled={false}
				contentContainerStyle={screenStyle.container}
				extraScrollHeight={5}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}>
				<View>
					<Comp {...props}>{children}</Comp>
				</View>
			</KeyboardAwareScrollView>
		</TouchableWithoutFeedback>
	);
};

//Creats the component & exports it
const HelpView = HelpViewHOC(View);
export default HelpView;

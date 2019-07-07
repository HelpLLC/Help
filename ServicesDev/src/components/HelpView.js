//This is a higher order component that should adapt to the keyboard coming up. It will utilize 
//KeyboardAvoidingView to make sure the TextInput being typed into is visible, as well as making sure
//that if the keyboard is clicked away from, it should hide. It will take care of the screen's background
//color and everything
import React from 'react';
import { SafeAreaView, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import screenStyle from 'config/styles/screenStyle';

//Creates the higher order component
const HelpViewHOC = (Comp) => {
    return ({ children, ...props }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView style={screenStyle.container} enabled behavior='padding'>
                <Comp {...props} >
                    {children}
                </Comp>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

//Creats the component & exports it
const HelpView = HelpViewHOC(SafeAreaView);
export default HelpView;
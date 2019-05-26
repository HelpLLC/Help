//This screen will be the one where users can log into their accounts if they already have one
//created. Since there will be no payments or anything secure in the mvp, then users will only 
//log in with their phone numbers. And that will be what is linked with their accoun
import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineTextInput from '../components/OneLineTextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import firebase from 'react-native-firebase';
import FirebaseFunctions from '../../config/FirebaseFunctions';

//The class that will create the look of this screen
class logInScreen extends Component {

    //This state will contain the current entered text, as well as the text underneeth the text
    //input that will appear if the entered phone number is incorrect
    state = {
        //The text being typed in by the user
        email: "",
        password: "",

        //The message which will display if the user types in a phone number which doesn't exist
        warningMessage: "",

        //This will determine whether the loading widget appears or not. Initially false
        isLoading: false
    }

    //This function will login based on the entered phone number... if the number is non existent,
    //Then the user will be instructed to go create an account or try again
    logIn() {

        const { email, password } = this.state;
        Keyboard.dismiss();
        //If no username was entered, or all empty spaces, then an error message will pop up
        if (email.trim().length === 0 || password.trim().length === 0) {
            this.setState({ warningMessage: strings.PleaseFillOutAllFields });
        } else {

            //Turns on the loading indicator
            this.setState({ isLoading: true });
            firebase.auth().signInWithEmailAndPassword(email, password).then((account) => {

                //Tests whether this is a provider or a requester & based on that, navigates to the
                //correct screen
                const { uid } = account.user;
                //Starts with searching if this is a requester since that is more common
                FirebaseFunctions.getRequesterByID(uid).then((requester) => {
                    if (requester === -1) {
                        //This means this account is a provider since a requester with this ID was not found
                        FirebaseFunctions.getProviderByID(uid).then((provider) => {
                            this.props.navigation.push('ProviderScreens', {
                                provider
                            });
                        });
                    } else {
                        FirebaseFunctions.getAllProducts().then((allProducts) => {
                            //If this is a requester, then it will navigate to the screens & pass in the
                            //correct params
                            this.props.navigation.push('RequesterScreens', {
                                requester: requester,
                                allProducts
                            });
                        })
                    }
                });
            }).catch((error) => {
                this.setState({ warningMessage: strings.IncorrectInfo, isLoading: false });
            })

        }
    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <TopBanner
                            title={strings.LogIn}
                            leftIconName="angle-left"
                            leftOnPress={() => {
                                //Method will go back to the splash screen
                                this.props.navigation.goBack();
                            }} />
                    </View>

                    <View style={{ paddingTop: 30, paddingRight: 10, paddingLeft: 10 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>{strings.Email}</Text>
                    </View>

                    <View style={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
                        <OneLineTextInput
                            placeholder={strings.EnterAnEmail}
                            onChangeText={(input) => this.setState({ email: input })}
                            value={this.state.email}
                        />
                    </View>

                    <View style={{ paddingTop: 30, paddingRight: 10, paddingLeft: 10 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>{strings.Password}</Text>
                    </View>

                    <View style={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}>
                        <OneLineTextInput
                            placeholder={strings.ChooseAPassword}
                            onChangeText={(input) => this.setState({ password: input })}
                            value={this.state.password}
                        />
                    </View>

                    <View style={{ paddingLeft: 20, paddingTop: 10 }}>
                        <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                    </View>

                    <View style={{ paddingTop: 35, paddingRight: 10, paddingLeft: 10 }}>
                        <RoundBlueButton
                            title={strings.LogIn}
                            style={roundBlueButtonStyle.MediumSizeButton}
                            textStyle={fontStyles.bigTextStyleWhite}
                            //Method logs the person in based on what is entered into the text
                            //input
                            onPress={() => { this.logIn() }} />
                    </View>
                    <LoadingSpinner isVisible={this.state.isLoading} />
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }
};

//exports the screen
export default logInScreen;


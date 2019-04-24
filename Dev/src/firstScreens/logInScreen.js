//This screen will be the one where users can log into their accounts if they already have one
//created. Since there will be no payments or anything secure in the mvp, then users will only 
//log in with their phone numbers. And that will be what is linked with their accoun
import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import { connect } from 'react-redux'
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineTextInput from '../components/OneLineTextInput';

//The class that will create the look of this screen
class logInScreen extends Component {

    //This state will contain the current entered text, as well as the text underneeth the text
    //input that will appear if the entered phone number is incorrect
    state = {
        //The text being typed in by the user
        inputText: "",

        //The message which will display if the user types in a phone number which doesn't exist
        incorrectUsernameMessage: ""
    }

    //This function will login based on the entered phone number... if the number is non existent,
    //Then the user will be instructed to go create an account or try again
    logIn() {
        //Retrieves what is currently typed into the TextInput by the user
        const input = this.state.inputText.trim();

        //Retrieves the array of providers & requesters
        const requesters = this.props.requesters;
        const providers = this.props.providers;

        //Loops through the array and finds the index of the user with the entered information
        //If the user is not found the function returns -1 & the user does not exist... loops through
        //both the requesters & providers
        const requesterIndex = requesters.findIndex((element) => {
            return element.username === input;
        });

        const providerIndex = providers.findIndex((element) => {
            return element.username === input;
        });

        //If the user's index is found, it logs into the correct account based on type, if it is not found... then
        //The user will be asked to either try again or sign up
        if (requesterIndex === -1 && providerIndex === -1) {
            //Displays incorrect phone number message
            this.setState({ incorrectUsernameMessage: "" })
            this.setState({ incorrectUsernameMessage: strings.IncorrectUsername })
        } else {
            //If it is a provider account, navigates to the provider screen, if it is a requester account, navigates
            //to the requester screens add pushes the account index by searching for the correct user
            //name
            if (requesterIndex === -1) {
                const accountIndex = providers.findIndex((value) => {
                    return value.username === input;
                });
                this.props.navigation.push('ProviderScreens', {
                    userIndex: accountIndex
                });
            } else {
                const accountIndex = requesters.findIndex((value) => {
                    return value.username === input;
                });
                this.props.navigation.push('RequesterScreens', {
                    userIndex: accountIndex
                });
            }
        }
    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={screenStyle.container}>
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
                        <Text style={fontStyles.mainTextStyleBlack}>{strings.WhatIsYourUsernameQuestion}</Text>
                    </View>

                    <View style={{ paddingTop: 50, paddingRight: 10, paddingLeft: 10 }}>
                        <OneLineTextInput
                            placeholder={strings.EnterYourUsername}
                            onChangeText={(input) => this.setState({ inputText: input })}
                        />
                    </View>

                    <View style={{ paddingTop: 10 }}>
                        <Text style={fontStyles.subTextStyleRed}>{this.state.incorrectUsernameMessage}</Text>
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
                </View>
            </TouchableWithoutFeedback>
        );
    }
};

//Connnects this screens' props with all of the users in the database to prepare for login
const mapStateToProps = state => {
    const providers  = state.providerReducer.accounts;
    const requesters = state.requesterReducer;
    return { providers, requesters };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(logInScreen);


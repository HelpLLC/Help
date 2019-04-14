//This is the screen that will pop up when users first come to sign up for the app, it will
//ask for a username (how they will access their account), and what type of account
//they want to create
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import colors from 'config/colors';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineTextInput from '../components/OneLineTextInput';
import { createRequesterAccount } from '../redux/requester/requesterActions/createRequesterAccount';


//The class that will create the look of this screen
class signUpScreen extends Component {

    //The state which will contain whatever the user typed in, along with the selected account type
    //Only one account can be selected at a time.
    //The state will also include warning message that will display different messages to the user
    //if they have done something wrong, such as the username given already exists, or no buttons
    //were selected, etc.
    state = {
        inputText: "",
        buttonSelected: "",
        warningMessage: ""
    }

    //This method signs up the user & creates an account for them based on what they chose and their
    //username
    //To-Do: Currently, just goes to the screens corresponding with what they chose. i.e. doesn't
    //create an account for them
    signUp() {
        //If no username was entered, or all empty spaces, then an error message will pop up
        if (this.state.inputText.trim().length === 0) {
            this.setState({ inputText: "", warningMessage: strings.InvalidUserName });

            //If no button was selected a different error message would appear
        } else if (this.state.buttonSelected === "") {
            this.setState({ warningMessage: strings.NoButtonSelected });

            //If an account with this selected username already exists then another error message will
            //appear
        } else {
            //Retrieves the array of providers & requesters
            const requesters = this.props.requesters;
            const providers = this.props.providers;

            //Retrieves what is currently typed into the TextInput by the user
            const input = this.state.inputText.trim();

            //Loops through the array and finds the index of the user with the entered information
            //If the user is not found the function returns -1 & the user does not exist... loops through
            //both the requesters & providers
            const requesterIndex = requesters.findIndex((element) => {
                return element.username === input;
            });

            const providerIndex = providers.findIndex((element) => {
                return element.username === input;
            });

            //As a final test, we will make sure an account with that name that doesn't already exist
            if (requesterIndex === -1 && providerIndex === -1) {

                //fetches the username
                let username = this.state.inputText.trim();

                //Tests whether to create a business or a provider account
                if (this.state.buttonSelected === "Business") {

                    //Navigates to the create business account screen & passes in the username
                    this.props.navigation.push("CreateProviderProfileScreen", {
                        username: username
                    });
                } else {
                    //creates the new account object
                    let accountType = "requester";
                    let newAccount = {
                        username: username,
                        accountType: accountType
                    };
                    this.props.createRequesterAccount(newAccount);

                    //Pushes the account information to the next screens by finding the index which the
                    //user belongs to.
                    this.props.navigation.push('RequesterScreens', {
                        userIndex: this.props.requesters.length,
                    });
                }
            } else {
                this.setState({ warningMessage: strings.UserNameExists });
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
                            title={strings.SignUp}
                            leftIconName="angle-left"
                            leftOnPress={() => {
                                //Method will go back to the splash screen
                                this.props.navigation.goBack();
                            }} />
                    </View>

                    <View style={{ paddingTop: 30, paddingRight: 10, paddingLeft: 10 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>{strings.ChooseAUserName}</Text>
                    </View>

                    <View style={{ paddingTop: 35, paddingRight: 10, paddingLeft: 10 }}>
                        <OneLineTextInput
                            placeholder={strings.TypeInAUsername}
                            onChangeText={(input) => this.setState({ inputText: input })}
                            value={this.state.inputText}
                        />
                    </View>

                    <View style={{ paddingTop: 60, paddingRight: 30, paddingLeft: 30 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>
                            {strings.WhatTypeOfAccountQuestion}</Text>
                    </View>

                    <View style={{
                        paddingTop: 30,
                        paddingRight: 30,
                        paddingLeft: 30,
                        flexDirection: 'row',
                        width: Dimensions.get('window').width,
                        justifyContent: 'space-between'
                    }}>
                        <RoundBlueButton
                            title={strings.Business}
                            //Tests if this button is selected, if it is, then the border color will
                            //be blue
                            style={[roundBlueButtonStyle.AccountTypeButton, {
                                borderColor: this.state.buttonSelected === "Business" ?
                                    colors.lightBlue : colors.white
                            }]}
                            textStyle={fontStyles.mainTextStyleBlue}
                            //Method selects the business button and deselects the other
                            onPress={() => { this.setState({ buttonSelected: "Business" }) }} />
                        <RoundBlueButton
                            title={strings.Customer}
                            //Tests if this button is selected, if it is, then the border color will
                            //be blue
                            style={[roundBlueButtonStyle.AccountTypeButton, {
                                borderColor: this.state.buttonSelected === "Customer" ?
                                    colors.lightBlue : colors.white
                            }]}
                            textStyle={fontStyles.mainTextStyleBlue}
                            //Method selects the customer button and deselects the other
                            onPress={() => { this.setState({ buttonSelected: "Customer" }) }} />
                    </View>

                    <View style={{ paddingTop: 50 }}>
                        <RoundBlueButton
                            title={strings.SignUp}
                            style={roundBlueButtonStyle.MediumSizeButton}
                            textStyle={fontStyles.bigTextStyleWhite}
                            onPress={() => { this.signUp() }}
                        />
                    </View>
                    <View style={{ padding: 20 }}>
                        <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
};

//Connects this screens' props with the users of the app to prepare for account creation
const mapStateToProps = state => {
    const providers = state.providerReducer;
    const requesters = state.requesterReducer;
    return { providers, requesters };
};

//Connects the screen with the actions that will add data to the database. These actions will
//be the ones that create the accounts
export const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            createRequesterAccount
        },
        dispatch
    );

//connects the screen with the redux persist state
export default connect(mapStateToProps, mapDispatchToProps)(signUpScreen);
//This is the screen that will pop up when users first come to sign up for the app, it will
//ask for an email and a password, and what type of account they want to create
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import colors from 'config/colors';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineTextInput from '../components/OneLineTextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import firebase from 'react-native-firebase';
import FirebaseFunctions from '../../config/FirebaseFunctions';


//The class that will create the look of this screen
class signUpScreen extends Component {

    //The state which will contain whatever the user typed in, along with the selected account type
    //Only one account can be selected at a time.
    //The state will also include warning message that will display different messages to the user
    //if they have done something wrong, such as the username given already exists, or no buttons
    //were selected, etc.
    state = {
        email: "",
        password: "",
        buttonSelected: "",
        warningMessage: "",
        isLoading: false
    }

    //This method signs up the user & creates an account for them based on what they chose and their
    //username
    signUp() {
        //fetches the entered email and password
        const { email, password, buttonSelected } = this.state;

        //If no username was entered, or all empty spaces, then an error message will pop up
        if (email.trim().length === 0 || password.trim().length === 0) {
            this.setState({ inputText: "", warningMessage: strings.PleaseFillOutAllFields });

            //If no button was selected a different error message would appear
        } else if (buttonSelected === "") {
            this.setState({ warningMessage: strings.NoButtonSelected });
        } else if (!email.includes("@")) {
            this.setState({ warningMessage: strings.PleaseEnterAValidEmail });
        } else if (password.length < 6) {
            this.setState({ warningMessage: strings.ShortPassword });
        } else {

            this.setState({ isLoading: true });
            //If the accout already exists, then an error will appear
            //If the account is new, then it will go through the normal process to create
            //the account
            firebase.auth().fetchSignInMethodsForEmail(email).then((array) => {
                if (array.length > 0) {
                    this.setState({ warningMessage: strings.EmailExists });
                    this.setState({ isLoading: false });
                } else {
                    if (buttonSelected === "Customer") {
                        //If this is a customer, then the account will be created here and
                        //along with the new requester being added to the database then
                        //the screen will shift to the new account's screen
                        firebase.auth().createUserWithEmailAndPassword(email, password).then((account) => {
                            FirebaseFunctions.addRequesterToDatabase(account, email).then((requester) => {
                                firebase.auth().signInWithEmailAndPassword(email, password);
                                FirebaseFunctions.getAllProducts().then((allProducts) => {
                                    this.props.navigation.push('RequesterScreens', {
                                        requester,
                                        allProducts
                                    });
                                });
                            });
                        });

                    } else {
                        //If this is a business account, then it will navigate to the create provider
                        //profile screen to finish creating the account there
                        this.props.navigation.push("CreateProviderProfileScreen", {
                            email,
                            password
                        });
                    }
                }
            });
        }
    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={screenStyle.container}>
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
                    <View style={{ paddingTop: 10 }}>
                        <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                    </View>
                    <View style={{ paddingTop: 50 }}>
                        <RoundBlueButton
                            title={strings.SignUp}
                            style={roundBlueButtonStyle.MediumSizeButton}
                            textStyle={fontStyles.bigTextStyleWhite}
                            onPress={() => { this.signUp() }}
                        />
                    </View>

                    <LoadingSpinner isVisible={this.state.isLoading} />

                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }
};

//Exports the screen
export default signUpScreen;
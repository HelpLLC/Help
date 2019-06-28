//This will be the screen where the businesses will actually create their profiles & provide info
//such as company name, description etc.
import React, { Component } from 'react';
import { View, Text, Keyboard, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineTextInput from '../components/OneLineTextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import RoundTextInput from '../components/RoundTextInput';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';

//The class that will create the look of this screen
class createProviderProfileScreen extends Component {

    //The state containing what the user has typed into each input and whether the screen is loading
    //or not
    state = {
        businessName: "",
        businessInfo: "",
        warningMessage: "",
        isLoading: false
    }

    //This method will return whether the company name is taken or not (boolean)
    //Checks if the company name is taken by another user or not
    async isCompanyNameTaken(businessName) {

        //Queries the providers to see if a provider exists
        const ref = FirebaseFunctions.providers.where("companyName", "==", businessName);
        const snapshot = await ref.get();

        //If the array contains anything, then the name is taken and true will be returned
        if (snapshot.docs.length === 0) {
            return false;
        } else {
            return true;
        }

    }

    //This method will register the business into the database based on the entered info
    async signUp() {

        //Dismisses the keyboard
        Keyboard.dismiss();
        //If either of the two inputs is empty, an error message will be displayed
        if (this.state.businessName.trim() === "") {

            this.setState({ warningMessage: strings.PleaseEnterACompanyName });

        } else if (this.state.businessInfo.trim() === "") {

            this.setState({ warningMessage: strings.PleaseEnterADescription });

        } else {

            this.setState({ isLoading: true });

            const { email, password } = this.props.navigation.state.params;
            const { businessName, businessInfo } = this.state;

            //If the business name is already taken, then a warning message will appear,
            //Else, the profile will be created
            const isCompanyNameTaken = await this.isCompanyNameTaken(businessName);
            if (isCompanyNameTaken === true) {
                this.setState({ warningMessage: strings.CompanyNameTakenPleaseChooseAnotherName, isLoading: false });
            } else {

                //Creates the account and then navigates to the correct screens while passing in
                //the correct params and logs in
                try {
                    const account = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    const provider = await FirebaseFunctions.addProviderToDatabase(account, email, businessName, businessInfo);
                    await firebase.auth().signInWithEmailAndPassword(email, password);
                    this.props.navigation.push('ProviderScreens', {
                        providerID: provider.providerID
                    });
                } catch (error) {
                    this.setState({ warningMessage: strings.SomethingWentWrong, isLoading: false });
                    FirebaseFunctions.reportIssue("App Error", error.message);
                }
                
            }
        }
    }

    render() {
        return (
            <KeyboardAvoidingView enabled behavior="padding" style={screenStyle.container}>
                <SafeAreaView>
                    <View>
                        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                            <View>
                                <Text style={fontStyles.mainTextStyleBlack}>
                                    {strings.WhatsYourBusinessCalledQuestion}</Text>
                            </View>

                            <View>
                                <OneLineTextInput
                                    placeholder={strings.EnterCompanyNameDotDotDot}
                                    onChangeText={(input) => this.setState({ businessName: input })}
                                    value={this.state.businessName}
                                    maxLength={18}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                            <View>
                                <Text style={fontStyles.mainTextStyleBlack}>
                                    {strings.WhatDoesYourBusinessDoQuestion}</Text>
                            </View>

                            <View>
                                <RoundTextInput
                                    width={275}
                                    height={100}
                                    placeholder={strings.TellYourCustomersAboutYourselfDotDotDot}
                                    onChangeText={(input) => this.setState({ businessInfo: input })}
                                    value={this.state.businessInfo} />
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                            </View>

                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <RoundBlueButton
                                    title={strings.GetStarted}
                                    style={roundBlueButtonStyle.MediumSizeButton}
                                    textStyle={fontStyles.bigTextStyleWhite}
                                    onPress={() => { this.signUp() }}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <LoadingSpinner isVisible={this.state.isLoading} />
                            </View>
                        </View>

                        <View style={{ flex: 1 }}></View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
};

//exports the screen
export default createProviderProfileScreen;
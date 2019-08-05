//This will be the screen where the businesses will actually create their profiles & provide info
//such as company name, description etc.
import React, { Component } from 'react';
import { View, Text, Keyboard, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineTextInput from '../components/OneLineTextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpView from '../components/HelpView';
import RoundTextInput from '../components/RoundTextInput';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ErrorAlert from '../components/ErrorAlert';
import firebase from 'react-native-firebase';

//The class that will create the look of this screen
class createProviderProfileScreen extends Component {

    //The state containing what the user has typed into each input and whether the screen is loading
    //or not
    state = {
        businessName: "",
        businessInfo: "",
        companyNameTakenError: false,
        nameError: false,
        descriptionError: false,
        isLoading: false,
        isErrorVisible: false
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

            this.setState({ nameError: true });

        } else if (this.state.businessInfo.trim() === "") {

            this.setState({ descriptionError: true });

        } else {

            this.setState({ isLoading: true });

            const { email, password } = this.props.navigation.state.params;
            const { businessName, businessInfo } = this.state;

            //If the business name is already taken, then a warning message will appear,
            //Else, the profile will be created
            try {
                firebase.auth().signInAnonymously();
                const isCompanyNameTaken = await this.isCompanyNameTaken(businessName);
                if (isCompanyNameTaken === true) {
                    this.setState({ companyNameTakenError: true, isLoading: false });
                } else {

                    //Creates the account and then navigates to the correct screens while passing in
                    //the correct params and logs in
                    const account = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    const provider = await FirebaseFunctions.addProviderToDatabase(account, email, businessName, businessInfo);
                    await FirebaseFunctions.logIn(email, password);
                    this.props.navigation.push('ProviderScreens', {
                        providerID: provider.providerID
                    });
                }
            } catch (error) {
                this.setState({ isLoading: false, isErrorVisible: true });
                FirebaseFunctions.logIssue(error, "CreateProviderProfileScreen");
            }
        }
    }

    render() {
        return (
            <HelpView style={screenStyle.container}>
                <View>
                    <View style={{ flex: 0.7, justifyContent: 'center', alignSelf: 'center' }}>
                        <View>
                            <Text style={fontStyles.mainTextStyleBlack}>
                                {strings.WhatsYourBusinessCalledQuestion}</Text>
                        </View>

                        <View>
                            <OneLineTextInput
                                placeholder={strings.EnterCompanyNameDotDotDot}
                                onChangeText={(input) => this.setState({ businessName: input })}
                                value={this.state.businessName}
                                password={false}
                                maxLength={18}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.7, justifyContent: 'center', alignSelf: 'center' }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={fontStyles.mainTextStyleBlack}>
                                {strings.WhatDoesYourBusinessDoQuestion}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <RoundTextInput
                                width={(Dimensions.get('window').width * 0.669)}
                                height={(Dimensions.get('window').height * 0.14641)}
                                placeholder={strings.TellYourCustomersAboutYourselfDotDotDot}
                                onChangeText={(input) => this.setState({ businessInfo: input })}
                                value={this.state.businessInfo} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <RoundBlueButton
                                title={strings.GetStarted}
                                style={roundBlueButtonStyle.MediumSizeButton}
                                textStyle={fontStyles.bigTextStyleWhite}
                                onPress={() => { this.signUp() }}
                                disabled={this.state.isLoading}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <LoadingSpinner isVisible={this.state.isLoading} />
                        </View>
                    </View>

                </View>
                <ErrorAlert
                    isVisible={this.state.isErrorVisible}
                    onPress={() => { this.setState({ isErrorVisible: false }) }}
                    title={strings.Whoops}
                    message={strings.SomethingWentWrong}
                />
                <ErrorAlert
                    isVisible={this.state.nameError}
                    onPress={() => { this.setState({ nameError: false }) }}
                    title={strings.Whoops}
                    message={strings.PleaseEnterACompanyName}
                />
                <ErrorAlert
                    isVisible={this.state.descriptionError}
                    onPress={() => { this.setState({ descriptionError: false }) }}
                    title={strings.Whoops}
                    message={strings.PleaseEnterADescription}
                />
                <ErrorAlert
                    isVisible={this.state.companyNameTakenError}
                    onPress={() => { this.setState({ companyNameTakenError: false }) }}
                    title={strings.Whoops}
                    message={strings.CompanyNameTakenPleaseChooseAnotherName}
                />
            </HelpView>
        );
    }
};

//exports the screen
export default createProviderProfileScreen;
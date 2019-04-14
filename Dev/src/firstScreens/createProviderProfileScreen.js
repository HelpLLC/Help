//This will be the screen where the businesses will actually create their profiles & provide info
//such as company name, description etc.
import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineTextInput from '../components/OneLineTextInput';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createProviderAccount } from '../redux/provider/providerActions/createProviderAccount';
import RoundTextInput from '../components/RoundTextInput';

//The class that will create the look of this screen
class createProviderProfileScreen extends Component {

    //The state containing what the user has typed into each input
    state = {
        businessName: "",
        businessInfo: "",
        warningMessage: ""
    }

    //This method will register the business into the database based on the entered info
    signUp() {

        //If either of the two inputs is empty, an error message will be displayed
        if (this.state.businessName.trim() === "") {

            this.setState({ warningMessage: strings.PleaseEnterACompanyName });

        } else if (this.state.businessInfo.trim() === "") {

            this.setState({ warningMessage: strings.PleaseEnterADescription });

        } else {

            //Will test if a company with that name already exists... first fetches the array of
            //existing providers
            const providers = this.props.providers;

            //fetches the entered text
            const businessName = this.state.businessName;
            const businessInfo = this.state.businessInfo;

            //loops through every provider & check if one already has this company name. If one does,
            //then the method will return false and an error message will pop up to the current user
            const companyNameAvailable = providers.every((provider) => {
                return provider.companyName !== businessName;
            });

            //If company name is taken, user will be asked to choose another, otherwise, the account
            //will be created.
            if (companyNameAvailable === true) {

                //Signs up the user with the chosen account
                let newAccount = {
                    username: this.props.navigation.state.params.username,
                    companyName: businessName,
                    companyDescription: businessInfo,
                    products: []
                }

                //Passes in the parameter to the action in order for the account to be created
                this.props.createProviderAccount(newAccount);

                //Pushes the account information to the next screens by finding the index which the
                //user belongs to.
                this.props.navigation.push('ProviderScreens', {
                    userIndex: this.props.providers.length,
                });

            } else {
                this.setState({ warningMessage: strings.CompanyNameTakenPleaseChooseAnotherName});
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
                            title={strings.CreateProfile}
                            leftIconName="angle-left"
                            leftOnPress={() => {
                                //Method will go back to the splash screen
                                this.props.navigation.goBack();
                            }} />
                    </View>

                    <View style={{ paddingTop: 20, paddingRight: 10, paddingLeft: 10 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>
                            {strings.WhatsYourBusinessCalledQuestion}</Text>
                    </View>

                    <View style={{ paddingTop: 20, paddingRight: 10, paddingLeft: 10 }}>
                        <OneLineTextInput
                            placeholder={strings.EnterCompanyNameDotDotDot}
                            onChangeText={(input) => this.setState({ businessName: input })}
                            value={this.state.businessName}
                            maxLength={18}
                        />
                    </View>

                    <View style={{ paddingTop: 30, paddingRight: 10, paddingLeft: 10 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>
                            {strings.WhatDoesYourBusinessDoQuestion}</Text>
                    </View>

                    <View style={{ padding: 20 }}>
                        <RoundTextInput
                            width={275}
                            height={100}
                            placeholder={strings.TellYourCustomersAboutYourselfDotDotDot}
                            onChangeText={(input) => this.setState({ businessInfo: input })}
                            value={this.state.businessInfo} />
                    </View>

                    <View style={{ paddingTop: 20 }}>
                        <RoundBlueButton
                            title={strings.GetStarted}
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
    return { providers };
};

//Connects the screen with the actions that will add data to the database. These actions will
//be the ones that create the accounts
export const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            createProviderAccount,
        },
        dispatch
    );

//connects the screen with the redux persist state
export default connect(mapStateToProps, mapDispatchToProps)(createProviderProfileScreen);
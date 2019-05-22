//This will be the screen where the businesses will actually create their profiles & provide info
//such as company name, description etc.
import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
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
import Functions from 'config/Functions';
import firebase from '../../Firebase';

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

            const { email, password } = this.props.navigation.state.params;
            const { businessName, businessInfo } = this.state;

            //If the business name is already taken, then a warning message will appear,
            //Else, the profile will be created
            if (Functions.isCompanyNameTaken(businessName) === true) {

                this.setState({ warningMessage: strings.CompanyNameTakenPleaseChooseAnotherName });

            } else {

                //Creates the account and then navigates to the correct screens while passing in
                //the correct params
                firebase.auth().createUserWithEmailAndPassword(email, password).then((account) => {
                    Functions.addProviderToDatabase(account, email, businessName, businessInfo).then(() => {
                        Functions.getProviderByID(account.user.uid).then((provider) => {
                            Functions.getProviderProducts(provider).then((providerProducts) => {
                                this.props.navigation.push('ProviderScreens', {
                                    provider,
                                    providerProducts
                                });
                            })
                        })
                    });
                    
                })

            }

        }
    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={screenStyle.container}>
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
                </SafeAreaView>
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
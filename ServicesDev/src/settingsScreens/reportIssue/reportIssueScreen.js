//This is the screen which will allow users to report some kind of bug or issue with the app.
//The user will report it and the report will be visible to the developers
import React, { Component } from 'react';
import { View, Text, Keyboard, Dimensions } from 'react-native';
import RoundTextInput from '../../components/RoundTextInput';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../../components/RoundBlueButton';
import ErrorAlert from '../../components/ErrorAlert';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpView from '../../components/HelpView';

class reportIssueScreen extends Component {

    //The current state of the screen. If the button clicked, then the issue will be reported
    //and the screen will confirm this, then rerender
    state = {
        userInput: "",
        fieldsError: false,
        isErrorVisible: false
    }

    //This method will report the issue to the developers as well as confirm the reported issue 
    //with the User. It will take in a parameter of the entered user input
    reportIssue() {

        Keyboard.dismiss();
        const { user } = this.props.navigation.state.params;
        const { userInput } = this.state;
        if (userInput.trim() === "") {
            this.setState({ fieldsError: true });
        } else {
            try {
                FirebaseFunctions.reportIssue(user, this.state.userInput);
                this.props.navigation.push('IssueReportedScreen', {
                    user: this.props.navigation.state.params.user
                });
            } catch (error) {
                this.setState({ isLoading: false, isErrorVisible: true });
                FirebaseFunctions.logIssue(error);
            }

        }

    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <HelpView style={screenStyle.container}>
                <View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={fontStyles.mainTextStyleBlack}>
                            {strings.WhatSeemsToBeTheProblemQuestion}</Text>
                    </View>
                    <View style={{ flex: 0.5 }}></View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <RoundTextInput
                            width={(Dimensions.get('window').width * 0.66909)}
                            height={(Dimensions.get('window').height * 0.29282577)}
                            placeholder={strings.DescribeYourIssueHereDotDotDot}
                            onChangeText={(input) => this.setState({ userInput: input })}
                            value={this.state.userInput} />
                    </View>
                    <View style={{ flex: 0.5 }}></View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 0.025 }}></View>
                        <View style={{ flex: 1 }}>
                            <RoundBlueButton
                                title={strings.Report}
                                style={roundBlueButtonStyle.MediumSizeButton}
                                textStyle={fontStyles.reportIssueButtonTextStyle}
                                onPress={() => {
                                    this.reportIssue();
                                }} />
                        </View>
                    </View>
                    <View style={{ flex: 1.5 }}></View>
                </View>
                <ErrorAlert
                    isVisible={this.state.isErrorVisible}
                    onPress={() => { this.setState({ isErrorVisible: false }) }}
                    title={strings.Whoops}
                    message={strings.SomethingWentWrong}
                />
                <ErrorAlert
                    isVisible={this.state.fieldsError}
                    onPress={() => { this.setState({ fieldsError: false }) }}
                    title={strings.Whoops}
                    message={strings.PleaseFillOutAllFields}
                />
            </HelpView>
        )
    }
}

export default reportIssueScreen;
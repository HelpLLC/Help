//This is the screen which will allow users to report some kind of bug or issue with the app.
//The user will report it and the report will be visible to the developers
import React, { Component } from 'react';
import { View, Text, Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner';
import RoundTextInput from '../../components/RoundTextInput';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../../components/RoundBlueButton';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';

class reportIssueScreen extends Component {

    //The current state of the screen. If the button clicked, then the issue will be reported
    //and the screen will confirm this, then rerender
    state = {
        userInput: ""
    }

    //This method will report the issue to the developers as well as confirm the reported issue 
    //with the User. It will take in a parameter of the entered user input
    reportIssue() {

        const { user } = this.props.navigation.state.params;
        FirebaseFunctions.reportIssue(user, this.state.userInput);

    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <TopBanner
                            title={strings.ReportAnIssue}
                            leftIconName="angle-left"
                            leftOnPress={() => {
                                //Method will dismiss the current stack and then go back to 
                                //make sure the animation is to the left
                                this.props.navigation.dismiss();
                                this.props.navigation.goBack();
                            }} />
                    </View>
                    <View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={fontStyles.mainTextStyleBlack}>
                                {strings.WhatSeemsToBeTheProblemQuestion}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <RoundTextInput
                                width={275}
                                height={200}
                                placeholder={strings.DescribeYourIssueHereDotDotDot}
                                onChangeText={(input) => this.setState({ userInput: input })}
                                value={this.state.userInput} />
                        </View>


                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <RoundBlueButton
                                title={strings.Report}
                                style={roundBlueButtonStyle.MediumSizeButton}
                                textStyle={fontStyles.reportIssueButtonTextStyle}
                                onPress={() => {
                                    this.props.navigation.push('IssueReportedScreen', {
                                        user: this.props.navigation.state.params.user
                                    })
                                    this.reportIssue()
                                }} />
                        </View>
                        <View style={{ flex: 1.5 }}></View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback >
        )
    }
}

export default reportIssueScreen;
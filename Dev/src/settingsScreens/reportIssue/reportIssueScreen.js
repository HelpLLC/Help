//This is the screen which will allow users to report some kind of bug or issue with the app.
//The user will report it and the report will be visible to the developers
import React, { Component } from 'react';
import { View, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../../components/TopBanner';
import RoundTextInput from '../../components/RoundTextInput';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../../components/RoundBlueButton';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';

class reportIssueScreen extends Component {

    //The current state of the screen. If the button clicked, then the issue will be reported
    //and the screen will confirm this, then rerender
    state = {
        userInput: ""
    }

    //This method will report the issue to the developers as well as confirm the reported issue 
    //with the User. It will take in a parameter of the entered user input
    reportIssue(userInput) {

        //to-do: Actually report the issue

        //to-do: Go to other screen where confirmation happens, then return to this screen

    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                <View style={screenStyle.container}>
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
                    <View style={{ paddingBottom: 25, paddingTop: 25 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>
                            {strings.WhatSeemsToBeTheProblemQuestion}</Text>
                    </View>

                    <View style={{ padding: 25 }}>
                        <RoundTextInput
                            width={275}
                            height={200}
                            placeholder={strings.DescribeYourIssueHereDotDotDot} />
                    </View>

                    <View>
                        <RoundBlueButton
                            title={strings.Report}
                            style={roundBlueButtonStyle.MediumSizeButton}
                            textStyle={fontStyles.reportIssueButtonTextStyle}
                            onPress={() => { this.props.navigation.push('IssueReportedScreen') }} />
                    </View>
                </View>
            </TouchableWithoutFeedback >
        )
    }
}

export default reportIssueScreen;
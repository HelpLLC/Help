//This screen will be the one confirming that the issue was successfully reported to the
//developers. The screen will stay visible for about 4 seconds and then will shift back
//to the reportIssueScreen
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import { View, Text, SafeAreaView } from 'react-native';
import TopBanner from '../../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';

export default class issueReportedScreen extends Component {
    //This method will wait 5 seconds then return to the reportIssueScreen
    componentDidMount() {
        //Start counting when the page is loaded
        this.timeoutHandle = setTimeout(() => {
            //Transitions back to the screen
            this.props.navigation.push('ReportIssueScreen');
            //Makes sure the screen only stays on for three seconds
        }, 3350);
    }

    //Renders the UI
    render() {
        return (
            <SafeAreaView style={screenStyle.container}>

                <View>
                    <TopBanner
                        title={strings.ReportAnIssue}
                        leftIconName="angle-left" />
                </View>

                <View style={{ alignItems: 'center', paddingTop: 65 }}>
                    <Text
                        style={fontStyles.mainTextStyleBlack}>
                        {strings.ThankYouForReporting}</Text>
                    <Text style={{ padding: 10 }}></Text>
                    <Text
                        style={fontStyles.mainTextStyleBlack}>
                        {strings.WellFixItRightAway}</Text>
                </View>

            </SafeAreaView>
        );
    }
}
//This screen will be the one confirming that the issue was successfully reported to the
//developers. The screen will stay visible for about 4 seconds and then will shift back
//to the reportIssueScreen
import React, { Component } from 'react';
import { screenWidth, screenHeight } from 'config/dimensions';
import { View, Text } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../../components/HelpView';
import TopBanner from '../../components/TopBanner/TopBanner';
import FirebaseFunctions from 'config/FirebaseFunctions';

export default class issueReportedScreen extends Component {
	//This method will wait 5 seconds then return to the reportIssueScreen
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('IssueReportedScreen', 'IssueReportedScreen');

		//Start counting when the page is loaded
		this.timeoutHandle = setTimeout(() => {
			//Transitions back to the screen
			this.props.navigation.push('ReportIssueScreen', {
				businessID: this.props.navigation.state.params.businessID
			});
			//Makes sure the screen only stays on for three seconds
		}, 3350);
	}

	//Renders the UI
	render() {
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner title={strings.ReportAnIssue} leftIconName='angle-left' leftOnPress={() => {}} />
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Text style={fontStyles.mainTextStyleBlack}>{strings.ThankYouForReporting}</Text>
					<Text style={{}}></Text>
					<Text style={fontStyles.mainTextStyleBlack}>{strings.WellFixItRightAway}</Text>
				</View>
			</HelpView>
		);
	}
}

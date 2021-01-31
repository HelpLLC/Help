//This is the screen which will allow users to report some kind of bug or issue with the app.
//The user will report it and the report will be visible to the developers
import React, { Component } from 'react';
import { View, Text, Keyboard, Dimensions } from 'react-native';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
 
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../components/HelpButton/HelpButton';
import HelpAlert from '../../components/HelpAlert';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpView from '../../components/HelpView';

class reportIssueScreen extends Component {
	//The current state of the screen. If the button clicked, then the issue will be reported
	//and the screen will confirm this, then rerender
	state = {
		userInput: '',
		fieldsError: false,
		isErrorVisible: false
	};

	//This method will report the issue to the developers as well as confirm the reported issue
	//with the User. It will take in a parameter of the entered user input
	reportIssue() {
		Keyboard.dismiss();
		const { businessID } = this.props.navigation.state.params;
		const { userInput } = this.state;
		if (userInput.trim() === '') {
			this.setState({ fieldsError: true });
		} else {
			try {
				FirebaseFunctions.call('reportIssue', { userID: businessID, issue: this.state.userInput });
				this.props.navigation.push('IssueReportedScreen', {
					businessID
				});
			} catch (error) {
				this.setState({ isLoading: false, isErrorVisible: true });
				FirebaseFunctions.call('logIssue', {
					error,
					userID: {
						screen: 'ReportIssueScreen',
						userID: 'b-' + businessID
					}
				});
			}
		}
	}

	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ReportIssueScreen', 'reportIssueScreen');
	}

	render() {
		return (
			//View that dismisses the keyboard when clicked anywhere else
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.ReportAnIssue}
					leftIconName='angle-left'
					leftOnPress={() => {
						//Method will dismiss the current stack and then go back to
						//make sure the animation is to the left
						this.props.navigation.dismiss();
						this.props.navigation.goBack();
					}}
				/>
				<View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: screenHeight * 0.1,
							marginBottom: screenHeight * 0.05
						}}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
							{strings.WhatSeemsToBeTheProblemQuestion}
						</Text>
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginBottom: screenHeight * 0.05
						}}>
						<HelpTextInput
							width={screenWidth * 0.66909}
							isMultiline={true}
							height={screenHeight * 0.29282577}
							placeholder={strings.DescribeYourIssueHereDotDotDot}
							onChangeText={(input) => this.setState({ userInput: input })}
							value={this.state.userInput}
						/>
					</View>
					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<View style={{ flex: 0.025 }}></View>
						<View style={{ flex: 1 }}>
							<HelpButton
								title={strings.Report}
								width={screenWidth * 0.39}
								onPress={() => {
									this.reportIssue();
								}}
							/>
						</View>
					</View>
				</View>
				<HelpAlert
					isVisible={this.state.isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<HelpAlert
					isVisible={this.state.fieldsError}
					onPress={() => {
						this.setState({ fieldsError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseFillOutAllFields}
				/>
			</HelpView>
		);
	}
}

export default reportIssueScreen;

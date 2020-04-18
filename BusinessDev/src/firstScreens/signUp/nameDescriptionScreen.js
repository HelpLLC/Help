//This will be the screen where the businesses will actually create their profiles & provide info such as company name,
//description etc. It'll be part one of the business creation process. Once they are done and click "Next", they'll be forwarded
//to another screen where they add some more information
import React, { Component } from 'react';
import { View, Text, Keyboard, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import helpButtonStyles from 'config/styles/helpButtonStyles';
import HelpButton from '../../components/HelpButton';
import OneLineRoundedBoxInput from '../../components/OneLineRoundedBoxInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpView from '../../components/HelpView';
import MultiLineRoundedBoxInput from '../../components/MultiLineRoundedBoxInput';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpAlert from '../../components/HelpAlert';
import TopBanner from '../../components/TopBanner/TopBanner';

//The class that will create the look of this screen
class nameDescriptionScreen extends Component {
	//Method will detect if this screen is in editing mode, and will display the business's previous information if so
	componentDidMount() {
		const { editing } = this.props.navigation.state.params;
		if (editing === true) {
			FirebaseFunctions.setCurrentScreen(
				'EditNameDescriptionScreen',
				'nameDescriptionScreen'
			);
			const { business, businessID } = this.props.navigation.state.params;
			this.setState({
				businessInfo: business.businessDescription,
				businessName: business.businessName,
				businessID,
				business,
				isLoadingScreen: false,
				editing
			});
		} else {
			FirebaseFunctions.setCurrentScreen(
				'CreateNameDescriptionScreen',
				'nameDescriptionScreen'
			);
			this.setState({
				businessInfo: '',
				businessName: '',
				isLoadingScreen: false,
				editing
			});
		}
	}

	//The state containing what the user has typed into each input and whether the screen is loading
	//or not
	state = {
		businessName: '',
		businessInfo: '',
		companyNameTakenError: false,
		nameError: false,
		descriptionError: false,
		isLoading: false,
		isLoadingScreen: true,
		isErrorVisible: false
	};
	//Double checks that all of the information has been fully filled out and then passes it onto the next screen which collects
	//additional info then signs them up. It first checks if this company name is already taken
	async goToAddtionalInfoScreen() {
		//Dismisses the keyboard
		Keyboard.dismiss();
		//If either of the two inputs is empty, an error message will be displayed
		if (this.state.businessName.trim() === '') {
			this.setState({ nameError: true });
		} else if (
			this.state.businessInfo.trim() === '' ||
			this.state.businessInfo.trim().length < 150
		) {
			this.setState({ descriptionError: true });
		} else {
			this.setState({ isLoading: true });

			//Tests if this is an editing screen or not to go to the correct screen & pass the correct params
			const { businessName, businessInfo, businessID, business } = this.state;
			if (this.state.editing === true) {
				//navigates to the next screen
				this.setState({ isLoading: false });
				this.props.navigation.push('AdditionalInformationScreen', {
					businessInfo,
					businessName,
					business,
					businessID,
					editing: true
				});
			} else {
				const { email, password } = this.props.navigation.state.params;
				this.setState({ isLoading: false });
				//navigates to the next screen
				this.props.navigation.push('AdditionalInformationScreen', {
					email,
					password,
					businessInfo,
					businessName,
					editing: false,
					requesterAccountExists: this.props.navigation.state.params.requesterAccountExists
				});
			}
		}
	}

	render() {
		if (this.state.isLoadingScreen === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={
							this.props.navigation.state.params.editing === true
								? strings.EditCompany
								: strings.CreateProfile
						}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={this.state.editing === true ? strings.EditCompany : strings.CreateProfile}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View
					style={{
						alignSelf: 'flex-start',
						justifyContent: 'flex-end',
						marginVertical: screenHeight * 0.04,
						marginLeft: screenWidth * 0.2
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.BusinessName}</Text>
				</View>
				<View style={{ alignSelf: 'center', justifyContent: 'center' }}>
					<OneLineRoundedBoxInput
						placeholder={strings.EnterCompanyNameDotDotDot}
						onChangeText={(input) => this.setState({ businessName: input })}
						value={this.state.businessName}
						password={false}
						maxLength={20}
					/>
				</View>
				<View
					style={{
						alignSelf: 'flex-start',
						justifyContent: 'flex-end',
						marginVertical: screenHeight * 0.04,
						marginLeft: screenWidth * 0.2
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.BusinessDescription}</Text>
				</View>
				<View style={{ alignSelf: 'center', justifyContent: 'flex-start' }}>
					<MultiLineRoundedBoxInput
						width={screenWidth * 0.6}
						height={screenHeight * 0.14641}
						placeholder={strings.TellYourCustomersAboutYourselfDotDotDot}
						onChangeText={(input) => this.setState({ businessInfo: input })}
						value={this.state.businessInfo}
						maxLength={350}
					/>
				</View>
				<View
					style={{
						height: screenHeight * 0.1,
						marginTop: screenHeight * 0.25,
						justifyContent: 'flex-end',
						alignSelf: 'center'
					}}>
					<HelpButton
						title={strings.Next}
						isLoading={this.state.isLoading}
						style={helpButtonStyles.MediumSizeButton}
						textStyle={fontStyles.bigTextStyleWhite}
						onPress={() => {
							this.goToAddtionalInfoScreen();
						}}
						disabled={this.state.isLoading}
					/>
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
					isVisible={this.state.nameError}
					onPress={() => {
						this.setState({ nameError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseEnterACompanyName}
				/>
				<HelpAlert
					isVisible={this.state.descriptionError}
					onPress={() => {
						this.setState({ descriptionError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseEnterADescriptionWithAtLeast150Characters}
				/>
			</HelpView>
		);
	}
}

//exports the screen
export default nameDescriptionScreen;

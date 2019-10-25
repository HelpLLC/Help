//This screen will allow the user to edit his/her company profile... which includes the name of
//of the business and the description
import React, { Component } from 'react';
import { View, Text, Keyboard, Dimensions } from 'react-native';
import OneLineRoundedBoxInput from '../../components/OneLineRoundedBoxInput';
import fontStyles from 'config/styles/fontStyles';
import MultiLineRoundedBoxInput from '../../components/MultiLineRoundedBoxInput';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../components/LoadingSpinner';
import strings from 'config/strings';
import HelpView from '../../components/HelpView';
import ErrorAlert from '../../components/ErrorAlert';

class editCompanyProfileScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('EditCompanyProfileScreen', 'editCompanyProfileScreen');
	}

	//The state containing what the user has typed into each input
	state = {
		businessName: this.props.navigation.state.params.provider.companyName,
		businessInfo: this.props.navigation.state.params.provider.companyDescription,
		isLoading: false,
		isErrorVisible: false,
		nameError: false,
		descriptionError: false
	};

	//Saves the edited company profile to the redux persist state
	async saveCompanyInfo() {
		Keyboard.dismiss();
		//retrieves what was entered along with the current provider
		const { provider, providerID } = this.props.navigation.state.params;
		const newBusinessName = this.state.businessName;
		const newBusinessInfo = this.state.businessInfo;

		//If either of the two inputs is empty, an error message will be displayed
		if (newBusinessName === '') {
			this.setState({ nameError: true });
		} else if (newBusinessInfo === '' || newBusinessInfo.trim().length < 150) {
			this.setState({ descriptionError: true });

			//This next statement checks if any information has been changed, if not, then it will
			//not update any information to save memory & simply return the previous screen
		} else if (provider.companyName === newBusinessName && provider.companyDescription === newBusinessInfo) {
			this.props.navigation.goBack();
		} else {
			try {
				//Calls the firebase function to update the provider's information
				this.setState({ isLoading: true });
				await FirebaseFunctions.updateProviderInfo(providerID, newBusinessName, newBusinessInfo);
				//Navigates back to the business screen
				this.setState({ isLoading: false });
				this.props.navigation.goBack();
			} catch (error) {
				this.setState({ isLoading: false, isErrorVisible: true });
				FirebaseFunctions.logIssue(error, {
					screen: 'EditCompanyProfileScreen',
					userID: 'p-' + providerID
				});
			}
		}
	}

	//Renders main UI
	render() {
		return (
			<HelpView style={screenStyle.container}>
				<View>
					<View style={{ flex: 0.7, justifyContent: 'center', alignSelf: 'center' }}>
						<View style={{ flex: 1, justifyContent: 'flex-end' }}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.EditName}</Text>
						</View>

						<View style={{ flex: 1, justifyContent: 'center' }}>
							<OneLineRoundedBoxInput
								placeholder={strings.EnterCompanyNameDotDotDot}
								onChangeText={(input) => this.setState({ businessName: input })}
								value={this.state.businessName}
								password={false}
								maxLength={20}
							/>
						</View>
					</View>

					<View style={{ flex: 0.7, justifyContent: 'center', alignSelf: 'center' }}>
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.EditDescription}</Text>
						</View>
						<View style={{ flex: 1, justifyContent: 'flex-start' }}>
							<MultiLineRoundedBoxInput
								width={Dimensions.get('window').width * 0.669}
								height={Dimensions.get('window').height * 0.14641}
								placeholder={strings.TellYourCustomersAboutYourselfDotDotDot}
								onChangeText={(input) => this.setState({ businessInfo: input })}
								value={this.state.businessInfo}
								maxLength={350}
							/>
						</View>
					</View>
					<View style={{ flex: 1 }}></View>
					<View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
						<View style={{ flex: 1, alignItems: 'center' }}>
							<RoundBlueButton
								title={strings.Done}
								style={roundBlueButtonStyle.MediumSizeButton}
								textStyle={fontStyles.bigTextStyleWhite}
								onPress={() => {
									this.saveCompanyInfo();
								}}
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
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<ErrorAlert
					isVisible={this.state.nameError}
					onPress={() => {
						this.setState({ nameError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseEnterACompanyName}
				/>
				<ErrorAlert
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

//Exports the screen
export default editCompanyProfileScreen;

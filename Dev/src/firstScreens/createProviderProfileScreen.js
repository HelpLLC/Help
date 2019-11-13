//This will be the screen where the businesses will actually create their profiles & provide info such as company name,
//description etc. It'll be part one of the business creation process. Once they are done and click "Next", they'll be forwarded
//to another screen where they add some more information
import React, { Component } from 'react';
import { View, Text, Keyboard, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpView from '../components/HelpView';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ErrorAlert from '../components/ErrorAlert';
import TopBanner from '../components/TopBanner';

//The class that will create the look of this screen
class createProviderProfileScreen extends Component {
	//Method will detect if this screen is in editing mode, and will display the business's previous information if so
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen(
			'CreateProviderProfileScreen',
			'createProviderProfileScreen'
		);

		const { editing } = this.props.navigation.state.params;
		if (editing === true) {
			const { provider, providerID } = this.props.navigation.state.params;
			this.setState({
				businessInfo: provider.companyDescription,
				businessName: provider.companyName,
				providerID,
				provider,
				isLoadingScreen: false,
				editing
			});
		} else {
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

	//This method will return whether the company name is taken or not (boolean)
	//Checks if the company name is taken by another user or not
	async isCompanyNameTaken(businessName) {
		//Queries the providers to see if a provider exists
		const ref = FirebaseFunctions.providers.where('companyName', '==', businessName);
		const snapshot = await ref.get();

		//If the array contains anything, then the name is taken and true will be returned
		if (snapshot.docs.length === 0) {
			return false;
		} else {
			return true;
		}
	}

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
			const { businessName, businessInfo, providerID, provider } = this.state;
			if (this.state.editing === true) {
				//navigates to the next screen
				this.setState({ isLoading: false });
				this.props.navigation.push('ProviderAdditionalInformationScreen', {
					businessInfo,
					businessName,
					providerID,
					provider,
					editing: true
				});
			} else {
				const { email, password } = this.props.navigation.state.params;
				const isCompanyNameTaken = await this.isCompanyNameTaken(businessName);
				this.setState({ isLoading: false });
				if (isCompanyNameTaken === true) {
					this.setState({ companyNameTakenError: true });
				} else {
					//navigates to the next screen
					this.props.navigation.push('ProviderAdditionalInformationScreen', {
						email,
						password,
						businessInfo,
						businessName,
						editing: false
					});
				}
			}
		}
	}

	render() {
		if (this.state.isLoadingScreen === true) {
			return (
				<HelpView style={screenStyle.container}>
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
            marginVertical: Dimensions.get('window').height * 0.04,
            marginLeft: Dimensions.get('window').width * 0.2
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
            marginVertical: Dimensions.get('window').height * 0.04,
            marginLeft: Dimensions.get('window').width * 0.2
					}}>
					<Text style={fontStyles.bigTextStyleBlack}>{strings.BusinessDescription}</Text>
				</View>
				<View style={{ alignSelf: 'center', justifyContent: 'flex-start' }}>
					<MultiLineRoundedBoxInput
						width={Dimensions.get('window').width * 0.6}
						height={Dimensions.get('window').height * 0.14641}
						placeholder={strings.TellYourCustomersAboutYourselfDotDotDot}
						onChangeText={(input) => this.setState({ businessInfo: input })}
						value={this.state.businessInfo}
						maxLength={350}
					/>
				</View>
				<View
					style={{
						height: Dimensions.get('window').height * 0.1,
						marginTop: Dimensions.get('window').height * 0.25,
						justifyContent: 'flex-end',
						alignSelf: 'center'
					}}>
					<RoundBlueButton
						title={strings.Next}
						isLoading={this.state.isLoading}
						style={roundBlueButtonStyle.MediumSizeButton}
						textStyle={fontStyles.bigTextStyleWhite}
						onPress={() => {
							this.goToAddtionalInfoScreen();
						}}
						disabled={this.state.isLoading}
					/>
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
				<ErrorAlert
					isVisible={this.state.companyNameTakenError}
					onPress={() => {
						this.setState({ companyNameTakenError: false });
					}}
					title={strings.Whoops}
					message={strings.CompanyNameTakenPleaseChooseAnotherName}
				/>
			</HelpView>
		);
	}
}

//exports the screen
export default createProviderProfileScreen;

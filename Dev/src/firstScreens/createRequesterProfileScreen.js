//This screen is the screen after you fill out basic info and choose customer and it creates the requester and signs you in

import React, { Component } from 'react';
import { View, Text, Dimensions, Keyboard } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpView from '../components/HelpView';
import firebase from 'react-native-firebase';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import screenStyle from '../../config/styles/screenStyle';

class createRequesterProfileScreen extends Component {
	state = {
		email: '',
		password: '',
		phoneNumber: '',
		name: '',
		city: '',
		state: '',
		isLoading: false
	};

	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CreateRequesterProfileScreen', 'createRequesterProfileScreen');
	}

	async signUp() {
		Keyboard.dismiss();
		//fetches the entered email and password
		const { email, password } = this.props.navigation.state.params;
		const { phoneNumber, name, city, state } = this.state;
		if (phoneNumber.trim().length != 10) {
			this.setState({ invalidPhoneNumberError: true });
		} else {
			this.setState({ isLoading: true });
			//If the accout already exists, then an error will appear
			//If the account is new, then it will go through the normal process to create
			//the account
			try {
				//If this is a customer, then the account will be created here and
				//along with the new requester being added to the database then
				//the screen will shift to the new account's screen
				const account = await firebase.auth().createUserWithEmailAndPassword(email, password);
				const requester = await FirebaseFunctions.addRequesterToDatabase(account, email, phoneNumber, state, city, name);
				await FirebaseFunctions.logIn(email, password);
				const allProducts = await FirebaseFunctions.getAllProducts();
				this.setState({ isLoading: false });
				this.props.navigation.push('FeaturedScreen', {
					requester,
					allProducts
				});
			} catch (error) {
				this.setState({ isLoading: false, isErrorVisible: true });
				FirebaseFunctions.logIssue(error, 'SignUpScreen');
			}
		}
	}

	render() {
		return (
			<HelpView style={screenStyle.container}>
				<View>
					<View
						style={{
							flex: 4,
							alignSelf: 'center'
						}}>
						<View
							style={{
								flex: 1,
								justifyContent: 'flex-end',
								marginBottom: Dimensions.get('window').height * 0.01
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.Name}</Text>
						</View>

						<View style={{ flex: 1, justifyContent: 'center' }}>
							<OneLineRoundedBoxInput placeholder={strings.PleaseEnterName} onChangeText={(input) => this.setState({ name: input })} value={this.state.name} password={false} maxLength={20} />
						</View>
						<View
							style={{
								flex: 1,
								justifyContent: 'flex-end',
								marginBottom: Dimensions.get('window').height * 0.01
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.State}</Text>
						</View>

						<View style={{ flex: 1, justifyContent: 'center' }}>
							<OneLineRoundedBoxInput placeholder={strings.PleaseEnterState} onChangeText={(input) => this.setState({ state: input })} value={this.state.state} password={false} maxLength={20} />
						</View>
						<View
							style={{
								flex: 1,
								justifyContent: 'flex-end',
								marginBottom: Dimensions.get('window').height * 0.01
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.City}</Text>
						</View>

						<View style={{ flex: 1, justifyContent: 'center' }}>
							<OneLineRoundedBoxInput placeholder={strings.PleaseEnterCity} onChangeText={(input) => this.setState({ city: input })} value={this.state.city} password={false} maxLength={20} />
						</View>
						<View
							style={{
								flex: 1,
								justifyContent: 'flex-end',
								marginBottom: Dimensions.get('window').height * 0.01
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.PhoneNumber}</Text>
						</View>

						<View style={{ flex: 1, justifyContent: 'center' }}>
							<OneLineRoundedBoxInput
								placeholder={strings.EnterPhoneNumber}
								onChangeText={(input) => this.setState({ phoneNumber: input.replace(/[^0-9]/g, '') })}
								value={this.state.phoneNumber}
								password={false}
								keyboardType='numeric'
								autoCompleteType={'tel'}
								maxLength={10}
							/>
						</View>
					</View>

					<View
						style={{
							height: Dimensions.get('window').height * 0.12,
							justifyContent: 'flex-end',
							alignSelf: 'center'
						}}>
						<RoundBlueButton
							title={strings.SignUp}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={() => {
								this.signUp();
							}}
							disabled={this.state.isLoading}
						/>
					</View>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<LoadingSpinner isVisible={this.state.isLoading} />
					</View>
				</View>
			</HelpView>
		);
	}
}

export default createRequesterProfileScreen;

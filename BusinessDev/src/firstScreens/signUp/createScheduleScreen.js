//This screen is going to be navigated in the first screens. It'll be used to set the business schedule. It is accessed from
//the providerAdditionalInformationScreen
import React, { Component } from 'react';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import HelpView from '../../components/HelpView';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import screenStyle from 'config/styles/screenStyle';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import HelpAlert from '../../components/HelpAlert';
import { View, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native';
import firebase from 'react-native-firebase';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../components/LoadingSpinner';

//exports and creates the class
export default class createScheduleScreen extends Component {
	//Controls the state of the screen (what type of schedule the business wants to use)
	//Also controls the loading state
	state = {
		isScreenLoading: true,
		isFromTimeShowing: false,
		isToTimeShowing: false,
		businessUpdated: false,
		isLoading: false,
		isTimesErrorVisible: false
	};

	//if this screen is to edit existing business, it will fetch the correct fields
	async componentDidMount() {
		//Determines whether its editing or not
		const { editing } = this.props.navigation.state.params;
		if (editing === true) {
			FirebaseFunctions.setCurrentScreen('EditScheduleScreen', 'createScheduleScreen');
			const {
				businessName,
				businessInfo,
				phoneNumber,
				website,
				location,
				coordinates,
				editing,
				business,
				businessID
			} = this.props.navigation.state.params;
			this.setState({
				businessName,
				businessInfo,
				phoneNumber,
				website,
				location,
				coordinates,
				editing,
				business,
				businessID,
				isScreenLoading: false,
				...business.businessHours
			});
		} else {
			FirebaseFunctions.setCurrentScreen('CreateScheduleScreen', 'createScheduleScreen');
			this.setState({
				monday: {
					from: '9:00 AM',
					to: '5:00 PM'
				},
				tuesday: {
					from: '9:00 AM',
					to: '5:00 PM'
				},
				wednesday: {
					from: '9:00 AM',
					to: '5:00 PM'
				},
				thursday: {
					from: '9:00 AM',
					to: '5:00 PM'
				},
				friday: {
					from: '9:00 AM',
					to: '5:00 PM'
				},
				saturday: {
					from: '9:00 AM',
					to: '5:00 PM'
				},
				sunday: {
					from: '9:00 AM',
					to: '5:00 PM'
				},
				editing,
				isScreenLoading: false
			});
		}
	}

	//This function takes all of the information that has been collected for the business and registers them  into the database
	//while also making sure all required fields have been adequetly filled out. That is if this is the non-editing version of the
	//screen. If this is an existing business editing their information, then it will overwrite their existing information in the data
	//base.
	async addProviderInfo() {
		Keyboard.dismiss();

		if (this.state.location === '' || this.state.phoneNumber === '') {
			this.setState({ fieldsError: true });
		} else {
			this.setState({ isLoading: true });

			const {
				businessName,
				businessInfo,
				email,
				requesterAccountExists,
				phoneNumber,
				website,
				location,
				coordinates
			} = this.props.navigation.state.params;
			const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } = this.state;
			let businessHours = { sunday, monday, tuesday, wednesday, thursday, friday, saturday };
			//Tests to make sure that the hours are in the correct order (from is before to)
			for (let key of Object.keys(businessHours)) {
				const value = businessHours[key];
				const { from, to } = value;
				if (from.indexOf('AM') !== -1 && to.indexOf('PM') !== -1) {
					//Does nothing
				} else if (from.indexOf('PM') !== -1 && to.indexOf('AM') !== -1) {
					this.setState({ isTimesErrorVisible: true, isLoading: false });
					return;
				} else {
					const fromHour = from.substring(0, from.indexOf(':'));
					const toHour = to.substring(0, to.indexOf(':'));
					if (parseInt(toHour) < parseInt(fromHour) && parseInt(fromHour) !== 12) {
						this.setState({ isTimesErrorVisible: true, isLoading: false });
						return;
					} else if (fromHour === toHour) {
						const fromMin = from.substring(from.indexOf(':') + 1, from.indexOf(' '));
						const toMin = to.substring(to.indexOf(':') + 1, to.indexOf(' '));
						if (parseInt(toMin) < parseInt(fromMin)) {
							this.setState({ isTimesErrorVisible: true, isLoading: false });
							return;
						}
					}
				}
			}

			//If this is a new profile, then it will add them to Firebase Authentication in addition to adding them to the database
			if (this.state.editing === false) {
				firebase.auth().signInAnonymously();
				const { password } = this.props.navigation.state.params;
				//Fetches the account information based on whether the business also has a customer account
				let account = '';
				if (requesterAccountExists === false) {
					account = await firebase.auth().createUserWithEmailAndPassword(email, password);
					await FirebaseFunctions.logIn(email, password);
				} else {
					account = await FirebaseFunctions.logIn(email, password);
					account = account.split(' ');
					account = account[1];
				}

				//Removes the extra fields in the businessHours
				for (let key of Object.keys(businessHours)) {
					let value = businessHours[key];
					delete value.isToTimeShowing;
					delete value.isFromTimeShowing;
					businessHours[key] = value;
				}
				//Adds the business to the databasae
				await FirebaseFunctions.call('addBusinessToDatabase', {
					//Fields for the business
					businessName,
					businessDescription: businessInfo,
					businessHours,
					coordinates,
					currentRequests: [],
					email,
					location,
					services: [],
					website,
					phoneNumber,
					isVerified: false,
					businessID: account.user.uid
				});
				//Navigates to the screen where it tells the business to wait until their account has been verified
				this.props.navigation.push('AccountNotVerifiedScreen');
			} else {
				//Removes the extra fields in the businessHours
				for (let key of Object.keys(businessHours)) {
					let value = businessHours[key];
					delete value.isToTimeShowing;
					delete value.isFromTimeShowing;
					businessHours[key] = value;
				}
				//Adds the business to the databasae
				await FirebaseFunctions.call('updateBusinessInformation', {
					//Fields for the business
					businessName,
					businessDescription: businessInfo,
					businessHours,
					coordinates,
					location,
					website,
					phoneNumber,
					businessID: this.state.businessID,
					business: this.state.business
				});
				this.setState({ isLoading: false, businessUpdated: true });
			}
		}
	}

	//this local function will convert a time object to a format that can be understood by us
	convertTime(time) {
		let hours = time.getHours();
		let minutes = time.getMinutes();
		let AMPM = '';

		if (minutes < 10) {
			minutes = '0' + minutes;
		}

		if (hours < 12) {
			AMPM = ' AM';
		} else {
			AMPM = ' PM';
		}

		if (hours === 0) {
			hours = 12;
		} else if (hours > 12) {
			hours -= 12;
		}

		return hours.toString() + ':' + minutes.toString() + AMPM;
	}

	//Creates the function that returns a time picker component for each day
	timePicker(day) {
		return (
			//If only specific times are selected, only the time pickers will be displayed
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
					width: Dimensions.get('window').width
				}}>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginHorizontal: Dimensions.get('window').height * 0.02
					}}></View>

				<TouchableOpacity
					onPress={() => {
						this.setState({
							[day]: {
								to: this.state[day].to,
								from: this.state[day].from,
								isToTimeShowing: false,
								isFromTimeShowing: true
							}
						});
					}}
					style={{
						borderWidth: 3,
						borderColor: colors.lightBlue,
						width: Dimensions.get('window').width * 0.2,
						height: Dimensions.get('window').height * 0.055,
						borderRadius: 20,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: colors.white,
						color: colors.black
					}}>
					<Text style={fontStyles.subTextStyleBlack}>{this.state[day].from}</Text>
				</TouchableOpacity>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginHorizontal: Dimensions.get('window').height * 0.02
					}}></View>

				<Text style={fontStyles.mainTextStyleBlack}>{strings.to}</Text>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginHorizontal: Dimensions.get('window').height * 0.02
					}}></View>

				<TouchableOpacity
					onPress={() => {
						//Makes sure only one is visible at a time
						this.setState({
							[day]: {
								to: this.state[day].to,
								from: this.state[day].from,
								isToTimeShowing: true,
								isFromTimeShowing: false
							}
						});
					}}
					style={{
						borderWidth: 3,
						borderColor: colors.lightBlue,
						width: Dimensions.get('window').width * 0.2,
						height: Dimensions.get('window').height * 0.055,
						borderRadius: 20,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: colors.white,
						color: colors.black
					}}>
					<Text style={fontStyles.subTextStyleBlack}>{this.state[day].to}</Text>
				</TouchableOpacity>
				<DateTimePickerModal
					is24Hour={false}
					isVisible={this.state[day].isFromTimeShowing}
					mode='time'
					headerTextIOS={strings.PickATime}
					onConfirm={(time) => {
						//Sets the selected date, and makes the picker go away
						this.setState({
							[day]: {
								to: this.state[day].to,
								from: this.convertTime(time),

								isFromTimeShowing: false,
								isToTimeShowing: false
							}
						});
					}}
					onCancel={() => {
						//Makes the picker go away
						this.setState({
							[day]: {
								to: this.state[day].to,
								from: this.state[day].from,
								isToTimeShowing: false,
								isFromTimeShowing: false
							}
						});
					}}
				/>
				<DateTimePickerModal
					is24Hour={false}
					isVisible={this.state[day].isToTimeShowing}
					mode='time'
					onConfirm={(time) => {
						//Sets the selected date, and makes the picker go away
						this.setState({
							[day]: {
								to: this.convertTime(time),
								from: this.state[day].from,
								isFromTimeShowing: false,
								isToTimeShowing: false
							}
						});
					}}
					onCancel={() => {
						//Makes the picker go away
						this.setState({
							[day]: {
								to: this.state[day].to,
								from: this.state[day].from,
								isToTimeShowing: false,
								isFromTimeShowing: false
							}
						});
					}}
				/>
			</View>
		);
	}

	//renders the screen
	render() {
		if (this.state.isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.BusinessHours}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.BusinessHours}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View
					style={{
						// flexDirection: 'column',
						alignItems: 'center',
						marginTop: Dimensions.get('window').height * 0.01
					}}>
					<View
						style={{
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.02
						}}></View>

					<View
						style={{
							width: Dimensions.get('window').width,
							justifyContent: 'flex-end',
							flexDirection: 'row',
							marginLeft: Dimensions.get('window').height * 0.15
						}}>
						<View style={{ marginTop: Dimensions.get('window').height * 0.015 }}>
							<Text style={fontStyles.bigTextStyleGray}>{strings.Sunday}</Text>
						</View>
						<View style={{ alignItems: 'flex-end' }}>{this.timePicker('sunday')}</View>
					</View>

					<View
						style={{
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.01
						}}></View>

					<View
						style={{
							width: Dimensions.get('window').width,
							justifyContent: 'flex-end',
							flexDirection: 'row',
							marginLeft: Dimensions.get('window').height * 0.15
						}}>
						<View style={{ marginTop: Dimensions.get('window').height * 0.015 }}>
							<Text style={fontStyles.bigTextStyleGray}>{strings.Monday}</Text>
						</View>
						<View style={{ alignItems: 'flex-end' }}>{this.timePicker('monday')}</View>
					</View>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.01
						}}></View>

					<View
						style={{
							width: Dimensions.get('window').width,
							justifyContent: 'flex-end',
							flexDirection: 'row',
							marginLeft: Dimensions.get('window').height * 0.15
						}}>
						<View style={{ marginTop: Dimensions.get('window').height * 0.015 }}>
							<Text style={fontStyles.bigTextStyleGray}>{strings.Tuesday}</Text>
						</View>
						<View style={{ alignItems: 'flex-end' }}>{this.timePicker('tuesday')}</View>
					</View>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.01
						}}></View>

					<View
						style={{
							width: Dimensions.get('window').width,
							justifyContent: 'flex-end',
							flexDirection: 'row',
							marginLeft: Dimensions.get('window').height * 0.15
						}}>
						<View style={{ marginTop: Dimensions.get('window').height * 0.015 }}>
							<Text style={fontStyles.bigTextStyleGray}>{strings.Wednesday}</Text>
						</View>
						<View style={{ alignItems: 'flex-end' }}>{this.timePicker('wednesday')}</View>
					</View>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.01
						}}></View>

					<View
						style={{
							width: Dimensions.get('window').width,
							justifyContent: 'flex-end',
							flexDirection: 'row',
							marginLeft: Dimensions.get('window').height * 0.15
						}}>
						<View style={{ marginTop: Dimensions.get('window').height * 0.015 }}>
							<Text style={fontStyles.bigTextStyleGray}>{strings.Thursday}</Text>
						</View>
						<View style={{ alignItems: 'flex-end' }}>{this.timePicker('thursday')}</View>
					</View>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.01
						}}></View>

					<View
						style={{
							width: Dimensions.get('window').width,
							justifyContent: 'flex-end',
							flexDirection: 'row',
							marginLeft: Dimensions.get('window').height * 0.15
						}}>
						<View style={{ marginTop: Dimensions.get('window').height * 0.015 }}>
							<Text style={fontStyles.bigTextStyleGray}>{strings.Friday}</Text>
						</View>
						<View style={{ alignItems: 'flex-end' }}>{this.timePicker('friday')}</View>
					</View>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.01
						}}></View>

					<View
						style={{
							width: Dimensions.get('window').width,
							justifyContent: 'flex-end',
							flexDirection: 'row',
							marginLeft: Dimensions.get('window').height * 0.15
						}}>
						<View style={{ marginTop: Dimensions.get('window').height * 0.015 }}>
							<Text style={fontStyles.bigTextStyleGray}>{strings.Saturday}</Text>
						</View>
						<View style={{ alignItems: 'flex-end' }}>{this.timePicker('saturday')}</View>
					</View>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.02
						}}></View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end'
						}}>
						<RoundBlueButton
							title={this.state.editing ? strings.Done : strings.SignUp}
							isLoading={this.state.isLoading}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={async () => {
								//Creates the product
								await this.addProviderInfo();
							}}
							disabled={this.state.isLoading}
						/>
					</View>
				</View>
				<HelpAlert
					isVisible={this.state.isTimesErrorVisible}
					onPress={() => {
						this.setState({ isTimesErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.ToTimeMustBeAfterFromTime}
				/>
				<HelpAlert
					isVisible={this.state.businessUpdated}
					onPress={() => {
						this.setState({ businessUpdated: false });
						this.props.navigation.push('BusinessScreens', {
							businessID: this.state.businessID
						});
					}}
					title={strings.BusinessUpdated}
					message={strings.BusinessUpdatedMessage}
				/>
			</HelpView>
		);
	}
}

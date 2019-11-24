//This screen is going to be navigated from the questions screen & will be in the create product flow from the
//business side. It allows businesses to specify when they can complete a specific job.
import React, { Component } from 'react';
import TopBanner from '../../components/TopBanner';
import strings from 'config/strings';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import HelpView from '../../components/HelpView';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import screenStyle from 'config/styles/screenStyle';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import DaysFromWeekPicker from '../../components/DaysFromWeekPicker';
import { Icon } from 'react-native-elements';
import ErrorAlert from '../../components/ErrorAlert';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import LoadingSpinner from '../../components/LoadingSpinner';
import FirebaseFunctions from '../../../config/FirebaseFunctions';

//exports and creates the class
export default class createScheduleScreen extends Component {
	//if this screen is to edit existing service, it will fetch the correct fields
	async componentDidMount() {
		//If a product has been passed in, then the correct fields will be set, other wise, the normal screen will
		//be set for user to create product
		if (this.props.navigation.state.params && this.props.navigation.state.params.product) {
			const { product } = this.props.navigation.state.params;
			const { schedule } = product;
			if (schedule.scheduleType === 'Anytime') {
				this.setState({
					scheduleType: schedule.scheduleType
				});
			} else if (schedule.scheduleType === 'SpecificDaysAndTimes') {
				this.setState({
					scheduleType: schedule.scheduleType,
					daysSelected: schedule.daysSelected,
					fromTime: schedule.fromTime,
					toTime: schedule.toTime
				});
			} else if (schedule.scheduleType === 'SpecificDays') {
				this.setState({
					scheduleType: schedule.scheduleType,
					daysSelected: schedule.daysSelected
				});
			} else {
				this.setState({
					scheduleType: schedule.scheduleType,
					fromTime: schedule.fromTime,
					toTime: schedule.toTime
				});
			}
			const { productID, providerID, newProductObject } = this.props.navigation.state.params;
			this.setState({
				productID,
				providerID,
				product,
				newProductObject,
				isScreenLoading: false
			});
		} else {
			const { providerID, newProductObject } = this.props.navigation.state.params;
			this.setState({
				providerID,
				newProductObject,
				isScreenLoading: false
			});
		}
	}
	//Controls the state of the screen (what type of schedule the business wants to use)
	//Also controls the loading state
	state = {
		scheduleType: 'SpecificDaysAndTimes',
		fromTime: '',
		toTime: '',
		toTimeObject: '',
		fromTimeObject: '',
		daysSelected: {
			Sun: false,
			Mon: false,
			Tue: false,
			Wed: false,
			Thu: false,
			Fri: false,
			Sat: false
		},
		isScreenLoading: true,
		isFromTimeGreaterErrorVisible: false,
		isFromTimeShowing: false,
		isToTimeShowing: false,
		isLoading: false,
		isTimesErrorVisible: false,
		isDaysErrorVisible: false
	};

	//Function returns true if at least one field in an object is true
	containsAtLeastOneTrue(object) {
		for (const field in object) {
			if (object[field] === true) {
				return true;
			}
		}
	}

	//Fetches all the information from the previous screens and actually creates the product and adds it to the
	//database
	async createProduct() {
		this.setState({ isLoading: true });
		const {
			scheduleType,
			fromTime,
			toTime,
			daysSelected,
			toTimeObject,
			fromTimeObject
		} = this.state;
		//Checks if the user has filled out all of the required information only if the user has NOT selected anytime
		//as their type of schedule.
		//If the time fields are empty, it checks if the schedule type selected needs it
		if (
			(fromTime === '' || toTime === '') &&
			(scheduleType === 'SpecificDaysAndTimes' || scheduleType === 'SpecificTimes')
		) {
			this.setState({ isTimesErrorVisible: true, isLoading: false });
		} else if (
			!this.containsAtLeastOneTrue(daysSelected) &&
			(scheduleType === 'SpecificDaysAndTimes' || scheduleType === 'SpecificDays')
		) {
			this.setState({ isDaysErrorVisible: true, isLoading: false });
		} else if (
			//If times are selected, makes sure the from time occurs before the to time
			fromTimeObject !== '' &&
			toTimeObject !== '' &&
			fromTimeObject.getTime() > toTimeObject.getTime()
		) {
			this.setState({ isFromTimeGreaterErrorVisible: true, isLoading: false });
		} else {
			//Creates the schedule object
			let schedule = {};
			if (scheduleType === 'Anytime') {
				schedule.scheduleType = 'Anytime';
			} else if (scheduleType === 'SpecificDaysAndTimes') {
				schedule.scheduleType = 'SpecificDaysAndTimes';
				schedule.fromTime = fromTime;
				schedule.toTime = toTime;
				schedule.daysSelected = daysSelected;
			} else if (scheduleType === 'SpecificDays') {
				schedule.scheduleType = 'SpecificDays';
				schedule.daysSelected = daysSelected;
			} else {
				schedule.scheduleType = 'SpecificTimes';
				schedule.fromTime = fromTime;
				schedule.toTime = toTime;
			}

			//Checks if this product is being edited or not. If it is, then it will overwrite the existing product
			//with the new one. If is not, this product will be added to the database
			if (this.state.product) {
				let { productID, newProductObject } = this.state;
				//Finishes adding the remaining fields to the product object
				newProductObject = {
					...newProductObject,
					schedule
				};
				await FirebaseFunctions.updateServiceInfo(productID, newProductObject);
			} else {
				let { providerID, newProductObject } = this.state;
				//Finishes adding the remaining fields to the product object
				newProductObject = {
					...newProductObject,
					schedule
				};
				await FirebaseFunctions.addProductToDatabase(providerID, newProductObject);
			}
			this.props.navigation.push('ProviderScreens', {
				providerID: this.state.providerID
			});
		}
	}

	//renders the screen
	render() {
		//Fetches the current schedule type from the stored state
		const {
			scheduleType,
			isFromTimeShowing,
			isToTimeShowing,
			toTime,
			fromTime,
			daysSelected
		} = this.state;

		//The UI for the day picker (to reduce code repition)
		const dayPicker = (
			<DaysFromWeekPicker
				daysSelected={daysSelected}
				onDaySelected={(day) => {
					let newDaysSelected = daysSelected;
					newDaysSelected[day] = true;
					this.setState({ daysSelected: newDaysSelected });
				}}
				onDayUnselected={(day) => {
					let newDaysSelected = daysSelected;
					newDaysSelected[day] = false;
					this.setState({ daysSelected: newDaysSelected });
				}}
			/>
		);

		//The UI for the time picker (to reduce repition)
		const timePicker = (
			//If only specific times are selected, only the time pickers will be displayed
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					width: Dimensions.get('window').width
				}}>
				<TouchableOpacity
					onPress={() => {
						this.setState({ isFromTimeShowing: true, isToTimeShowing: false });
					}}
					style={{
						borderWidth: 3,
						borderColor: colors.lightBlue,
						width: Dimensions.get('window').width * 0.25,
						height: Dimensions.get('window').height * 0.055,
						borderRadius: 20,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: colors.white,
						color: colors.black
					}}>
					<Text style={fontStyles.subTextStyleBlack}>{fromTime}</Text>
				</TouchableOpacity>
				<Text style={fontStyles.mainTextStyleBlack}>{strings.to}</Text>
				<TouchableOpacity
					onPress={() => {
						//Makes sure only one is visible at a time
						this.setState({ isToTimeShowing: true, isFromTimeShowing: false });
					}}
					style={{
						borderWidth: 3,
						borderColor: colors.lightBlue,
						width: Dimensions.get('window').width * 0.25,
						height: Dimensions.get('window').height * 0.055,
						borderRadius: 20,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: colors.white,
						color: colors.black
					}}>
					<Text style={fontStyles.subTextStyleBlack}>{toTime}</Text>
				</TouchableOpacity>
				<DateTimePickerModal
					isVisible={isFromTimeShowing}
					mode='time'
					headerTextIOS={strings.PickATime}
					onConfirm={(time) => {
						//Sets the selected date, and makes the picker go away
						this.setState({
							fromTimeObject: time,
							fromTime: time.toLocaleTimeString('en', {
								hour: 'numeric',
								minute: '2-digit'
							}),
							isFromTimeShowing: false
						});
					}}
					onCancel={() => {
						//Makes the picker go away
						this.setState({ isFromTimeShowing: false });
					}}
				/>
				<DateTimePickerModal
					isVisible={isToTimeShowing}
					mode='time'
					onConfirm={(time) => {
						//Sets the selected date, and makes the picker go away
						this.setState({
							toTimeObject: time,
							toTime: time.toLocaleTimeString('en', {
								hour: 'numeric',
								minute: '2-digit'
							}),
							isToTimeShowing: false
						});
					}}
					onCancel={() => {
						//Makes the picker go away
						this.setState({ isToTimeShowing: false });
					}}
				/>
			</View>
		);
		if (this.state.isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.CreateSchedule}
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
					title={strings.CreateSchedule}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View
					style={{
						flexDirection: 'column',
						alignItems: 'center',
						marginTop: Dimensions.get('window').height * 0.1
					}}>
					<Text style={fontStyles.mainTextStyleBlack}>
						{strings.AvailableTimesToCompleteService}
					</Text>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.05
						}}>
						<RNPickerSelect
							onValueChange={(value) => this.setState({ scheduleType: value })}
							items={[
								{ label: strings.SpecificDaysAndTimes, value: 'SpecificDaysAndTimes' },
								{ label: strings.SpecificDays, value: 'SpecificDays' },
								{ label: strings.SpecificTimes, value: 'SpecificTimes' },
								{ label: strings.Anytime, value: 'Anytime' }
							]}
							value={this.state.scheduleType}
							style={{
								iconContainer: {
									top: Dimensions.get('window').height * 0.014,
									right: Dimensions.get('window').width * 0.04
								},
								inputIOS: [
									{
										borderWidth: 1,
										borderColor: colors.lightBlue,
										borderRadius: 20,
										width: Dimensions.get('window').width * 0.8,
										height: Dimensions.get('window').height * 0.05,
										paddingLeft: Dimensions.get('window').height * 0.01
									},
									fontStyles.subTextStyleBlack
								],
								inputAndroid: [
									{
										borderWidth: 1,
										borderColor: colors.lightBlue,
										borderRadius: 20,
										width: Dimensions.get('window').width * 0.8,
										height: Dimensions.get('window').height * 0.05,
										paddingLeft: Dimensions.get('window').height * 0.01
									},
									fontStyles.subTextStyleBlack
								]
							}}
							Icon={() => (
								<Icon type='font-awesome' name='arrow-down' color={colors.lightBlue} size={20} />
							)}
						/>
					</View>
					{//If the value selected is anytime, then the calendar & times will NOT show
					scheduleType === 'Anytime' ? (
						<View style={{ marginBottom: Dimensions.get('window').height * 0.45 }} />
					) : //If either specific days or specific days AND times are selected, the calendar will show
					scheduleType === 'SpecificDaysAndTimes' || scheduleType === 'SpecificDays' ? (
						<View>
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									marginBottom: Dimensions.get('window').height * 0.05
								}}>
								{dayPicker}
							</View>
							{//If times need to also be displayed because of the user selected, they will be
							scheduleType === 'SpecificDaysAndTimes' ? (
								<View style={{ marginBottom: Dimensions.get('window').height * 0.27 }}>
									{timePicker}
								</View>
							) : (
								<View style={{ marginBottom: Dimensions.get('window').height * 0.325 }} />
							)}
						</View>
					) : (
						<View style={{ marginBottom: Dimensions.get('window').height * 0.3955 }}>
							{timePicker}
						</View>
					)}
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end'
						}}>
						<RoundBlueButton
							title={strings.Done}
							isLoading={this.state.isLoading}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={async () => {
								//Creates the product
								await this.createProduct();
							}}
							disabled={this.state.isLoading}
						/>
					</View>
				</View>
				<ErrorAlert
					isVisible={this.state.isDaysErrorVisible}
					onPress={() => {
						this.setState({ isDaysErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseSelectDay}
				/>
				<ErrorAlert
					isVisible={this.state.isTimesErrorVisible}
					onPress={() => {
						this.setState({ isTimesErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseSelectATime}
				/>
				<ErrorAlert
					isVisible={this.state.isFromTimeGreaterErrorVisible}
					onPress={() => {
						this.setState({ isFromTimeGreaterErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.FromTimeIsMoreThanToTime}
				/>
			</HelpView>
		);
	}
}

//This is going to be the screen in which requesters can choose from the business's specific available dates
//for the request to completed. After this screen, the actual request is requested
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import { View, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import strings from 'config/strings';
import CalendarPicker from 'react-native-calendar-picker';
import colors from 'config/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import fontStyles from '../../config/styles/fontStyles';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OptionPicker from '../components/OptionPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpAlert from '../components/HelpAlert';

//Renders the actual class
export default class requesterScheduleScreen extends Component {
	//The initial date/time which nothing is selected
	state = {
		selectedDate: '',
		selectedTime: '',
		isTimePickerShowing: false,
		isScreenLoading: false,
		scheduleType: '',
		product: '',
		requester: '',
		isLoading: false,
		isRequestVisible: false,
		isErrorVisible: false,
		isSelectDayErrorVisible: false,
		isSelectTimeErrorVisible: false,
		isSaveRequestVisible: false,
		timeSlotError: false,
		isRequestSavedSucess: false,
		isRequestSucess: false
	};

	//Detects what kind of schedule type the current product has, and displays the right UI based on that. Also
	//adds the necessary fields to the state for later use
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('RequesterScheduleScreen', 'requesterScheduleScreen');
		const { product, requester, isEditing, request } = this.props.navigation.state.params;
		if (isEditing === true) {
			this.setState({
				product,
				requester,
				selectedDate: request.daySelected,
				selectedTime: request.selectedTime,
				scheduleType: product.schedule.scheduleType
			});
		} else {
			this.setState({
				product,
				requester,
				scheduleType: product.schedule.scheduleType
			});
		}
	}

	//This function determines whether the time selected by the user is in the time  slot in which the business
	//indicated they are available only if the business has specified there's only certain times that they can work.
	isTimeValid() {
		const { scheduleType } = this.state;
		if (scheduleType === 'SpecificDaysAndTimes' || scheduleType === 'SpecificTimes') {
			const moment = require('moment');
			const { selectedTime, product } = this.state;
			const { fromTime, toTime } = product.schedule;
			let momentSelectedTime = moment(selectedTime, 'hh:mm a');
			let momentFromTime = moment(fromTime, 'hh:mm a');
			let momentToTime = moment(toTime, 'hh:mm a');
			return momentSelectedTime.isBetween(momentFromTime, momentToTime);
		} else {
			return true;
		}
	}

	//Until android supports toTimeLocaleString(), this is our own method for formatting the time
	getAndroidTime(time) {
		let hour = time.getHours();
		let minutes = time.getMinutes();
		const ampm = hour > 11 ? 'PM' : 'AM';
		if (hour === 0) {
			hour = 12;
		} else if (hour === 12) {
			hour = 12;
		} else {
			hour = hour % 12;
		}
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		return hour + ':' + minutes + ' ' + ampm;
	}

	//Requests the product by checking if all fields have been filled out correctly
	async requestProduct() {
		this.setState({
			isLoading: true
		});
		const { product, requester, scheduleType } = this.state;
		let requestObject = {
			dateRequested: this.props.navigation.state.params.isEditing
				? this.props.navigation.state.params.request.dateRequested
				: new Date().toLocaleDateString('en-US', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit'
				  }),
			requesterID: requester.requesterID,
			serviceID: product.serviceID,
			requesterName: requester.username,
			scheduleType
		};
		//Double checks that the field has been filled out
		if (this.state.selectedDate === '') {
			this.setState({ isSelectDayErrorVisible: true, isLoading: false });
			return;
		}
		//Double checks that the field has been filled out
		if (this.state.selectedTime === '') {
			this.setState({ isSelectTimeErrorVisible: true, isLoading: false });
			return;
		}
		//Double checks that the time selected is in the business's availability
		if (!this.isTimeValid()) {
			this.setState({ timeSlotError: true, isLoading: false });
			return;
		}
		requestObject = {
			...requestObject,
			selectedTime: this.state.selectedTime,
			daySelected: this.state.selectedDate
		};
		//Adds the answers to the questions if this product has any questions
		if (this.props.navigation.state.params.answers) {
			requestObject = {
				...requestObject,
				answers: this.props.navigation.state.params.answers
			};
		}
		//Sends the request up to Firebase
		try {
			//If the request is being edited, this will overwrite the request, then navigate to the featured
			//screen.
			await FirebaseFunctions.requestService(
				requestObject,
				this.props.navigation.state.params.isEditing
			);
			//Fetches all products so that it is ready to navigate to the featuredScreen
			const allProducts = await FirebaseFunctions.getAllProducts();
			this.setState({ isLoading: false, allProducts });
			if (this.props.navigation.state.params.isEditing === true) {
				this.setState({ isRequestSavedSucess: true });
			} else {
				this.setState({ isRequestSucess: true });
			}
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.logIssue(error, {
				screen: 'RequesterScheduleScreen',
				userID: 'r-' + requester.requesterID,
				productID: product.productID
			});
		}
	}

	render() {
		const { product, requester, scheduleType } = this.state;
		if (this.state.isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.Schedule}
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
					title={strings.Schedule}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View>
					<View
						style={{
							marginVertical: Dimensions.get('window').height * 0.025,
							justifyContent: 'center',
							alignItems: 'center'
						}}>
						<Text style={fontStyles.mainTextStyleBlack}>{strings.PickADate}</Text>
					</View>
					<View
						style={{
							width: Dimensions.get('window').width * 0.95,
							height: Dimensions.get('window').height * 0.35,
							borderRadius: 20,
							borderColor: colors.lightBlue,
							borderWidth: 3
						}}>
						<CalendarPicker
							textStyle={fontStyles.subTextStyleBlack}
							selectedDayTextColor={colors.white}
							width={Dimensions.get('window').width * 0.95}
							height={Dimensions.get('window').height * 0.4}
							initialDate={
								//if this is a request that is being edited, then it defaults to the previously selected
								//date
								this.props.navigation.state.params.isEditing === true
									? new Date(this.state.selectedDate)
									: new Date()
							}
							minDate={new Date()}
							todayBackgroundColor={colors.lightGray}
							todayTextStyle={fontStyles.subTextStyleBlack}
							selectedDayColor={colors.lightBlue}
							disabledDates={(date) => {
								//Only disabled certain dates for business who have specified they only work
								//certain days
								if (scheduleType === 'SpecificDaysAndTimes' || scheduleType === 'SpecificDays') {
									const dayName = new Date(date).toString().split(' ')[0];
									return !product.schedule.daysSelected[dayName];
								} else {
									return false;
								}
							}}
							onDateChange={(newDate) => {
								this.setState({
									selectedDate: new Date(newDate).toLocaleString('en-US', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit'
									})
								});
							}}
						/>
					</View>
				</View>
				<View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: Dimensions.get('window').height * 0.025,
							width: Dimensions.get('window').width * 0.8
						}}>
						<Text style={fontStyles.mainTextStyleBlack}>{strings.PickATime}</Text>
						<View style={{ height: Dimensions.get('window').height * 0.01 }} />
						{scheduleType === 'SpecificDaysAndTimes' || scheduleType === 'SpecificTimes' ? (
							<Text style={fontStyles.subTextStyleBlack}>
								{product.offeredByName} {strings.isAvailableBetween} {product.schedule.fromTime}{' '}
								{strings.and} {product.schedule.toTime}
							</Text>
						) : (
							<View></View>
						)}
					</View>
					<TouchableOpacity
						onPress={() => {
							//Makes the time picker appear
							this.setState({
								isTimePickerShowing: true
							});
						}}
						style={{
							borderWidth: 3,
							borderColor: colors.lightBlue,
							width: Dimensions.get('window').width * 0.5,
							height: Dimensions.get('window').height * 0.085,
							borderRadius: 20,
							justifyContent: 'center',
							alignItems: 'center',
							alignSelf: 'center',
							backgroundColor: colors.white,
							color: colors.black
						}}>
						<Text style={fontStyles.mainTextStyleBlack}>{this.state.selectedTime}</Text>
					</TouchableOpacity>
				</View>
				{this.props.navigation.state.params.isEditing === true ? (
					<View
						style={{
							marginTop: Dimensions.get('window').height * 0.1
						}}>
						<RoundBlueButton
							title={strings.Save}
							isLoading={this.state.isLoading}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={() => {
								this.setState({ isSaveRequestVisible: true });
							}}
							disabled={this.state.isLoading}
						/>
					</View>
				) : (
					<View
						style={{
							marginTop: Dimensions.get('window').height * 0.1
						}}>
						<RoundBlueButton
							title={strings.Request}
							isLoading={this.state.isLoading}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={() => {
								this.setState({ isRequestVisible: true });
							}}
							disabled={this.state.isLoading}
						/>
					</View>
				)}
				<OptionPicker
					isVisible={this.state.isRequestVisible}
					title={strings.FinishRequesting}
					clickOutside={false}
					message={strings.AreYouSureRequestService}
					confirmText={strings.Yes}
					confirmOnPress={() => {
						//Requests the product
						this.requestProduct();
						this.setState({ isRequestVisible: false });
					}}
					cancelText={strings.Cancel}
					cancelOnPress={() => {
						this.setState({ isRequestVisible: false });
					}}
				/>
				<OptionPicker
					isVisible={this.state.isSaveRequestVisible}
					title={strings.SaveRequest}
					clickOutside={false}
					message={strings.AreYouSureYouWantToOverwriteOldRequest}
					confirmText={strings.Yes}
					confirmOnPress={() => {
						//Requests the product
						this.requestProduct();
						this.setState({ isSaveRequestVisible: false });
					}}
					cancelText={strings.Cancel}
					cancelOnPress={() => {
						this.setState({ isSaveRequestVisible: false });
					}}
				/>
				<HelpAlert
					isVisible={this.state.isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<HelpAlert
					isVisible={this.state.isSelectDayErrorVisible}
					onPress={() => {
						this.setState({ isSelectDayErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseSelectADayForYourService}
				/>
				<HelpAlert
					isVisible={this.state.isSelectTimeErrorVisible}
					onPress={() => {
						this.setState({ isSelectTimeErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseSelectATimeForYourService}
				/>
				<HelpAlert
					isVisible={this.state.timeSlotError}
					onPress={() => {
						this.setState({ timeSlotError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseSelectATimeInWhichTheBusinessIsAvailable}
				/>
				<DateTimePickerModal
					is24Hour={false}
					timePickerModeAndroid={'default'}
					isVisible={this.state.isTimePickerShowing}
					mode='time'
					headerTextIOS={strings.PickATime}
					onConfirm={(time) => {
						//Sets the selected time, and makes the picker go away
						this.setState({
							selectedTime:
								Platform.OS === 'ios'
									? time.toLocaleTimeString('en', {
											hour: 'numeric',
											minute: '2-digit',
											hour12: true
									  })
									: this.getAndroidTime(time),
							isTimePickerShowing: false
						});
					}}
					onCancel={() => {
						//Makes the picker go away
						this.setState({ isTimePickerShowing: false });
					}}
				/>
				<HelpAlert
					isVisible={this.state.isRequestSucess}
					onPress={() => {
						this.setState({ isRequestSucess: false });
						this.props.navigation.push('FeaturedScreen', {
							requester: requester,
							allProducts: this.state.allProducts
						});
					}}
					title={strings.Success}
					message={strings.TheServiceHasBeenRequested}
				/>
				<HelpAlert
					isVisible={this.state.isRequestSavedSucess}
					onPress={() => {
						this.setState({ isRequestSavedSucess: false });
						this.props.navigation.push('FeaturedScreen', {
							requester: requester,
							allProducts: this.state.allProducts
						});
					}}
					title={strings.Success}
					message={strings.TheServiceRequestHasBeenSaved}
				/>
			</HelpView>
		);
	}
}

//This is going to be the screen in which customers can choose from the business's specific available dates
//for the request to completed. After this screen, the actual request is requested
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import { View, Dimensions, FlatList, Text } from 'react-native';
import strings from 'config/strings';
import colors from 'config/colors';
import { Calendar } from 'react-native-calendars';
import fontStyles from '../../config/styles/fontStyles';
import RoundBlueButton from '../components/RoundBlueButton';
import { screenWidth, screenHeight } from 'config/dimensions';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OptionPicker from '../components/OptionPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpAlert from '../components/HelpAlert';

//Renders the actual class
export default class businessScheduleScreen extends Component {
	//The initial date/time which nothing is selected along with other HelpAlerts
	state = {
		isLoading: false,
		isScreenLoading: true,
		availableTimes: '',
		answers: '',
		service: '',
		customer: '',
		business: '',
		isEditing: '',
		request: '',
		selectedDate: '',
		dateString: '',
		selectedTime: '',
		fieldsError: false,
		requestSummaryVisible: false,
		isErrorVisible: false,
		isRequestSavedSucess: false,
		isRequestSucess: false
	};

	//Sets the initial fields and fetches the correct business schedule for that date
	async componentDidMount() {
		const { answers, service, customer, isEditing, request } = this.props.navigation.state.params;
		//Fetches the business
		const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID: service.businessID
		});
		this.setState({ business, service, answers, customer, isEditing, request });

		if (isEditing === true) {
			//Sets the correct fields for existing request
			const { date, time } = request;
			//Sets the initial selected date
			const dateObject = new Date(date);
			let year = dateObject.getFullYear();
			let month = dateObject.getMonth() + 1;
			let day = dateObject.getDate();
			if (month < 10) {
				month = '0' + month;
			}

			if (day < 10) {
				day = '0' + day;
			}
			const dateString = year + '-' + month + '-' + day;
			this.setState({
				dateString,
				availableTimes: this.setAvailableTimes(dateObject),
				selectedDate: dateObject.toLocaleDateString('en-US'),
				selectedTime: time
			});
		} else {
			//Sets the initial selected date
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			if (month < 10) {
				month = '0' + month;
			}

			if (day < 10) {
				day = '0' + day;
			}
			const dateString = year + '-' + month + '-' + day;

			this.setState({
				dateString,
				availableTimes: this.setAvailableTimes(date),
				selectedDate: new Date().toLocaleDateString('en-US')
			});
		}
		this.setState({
			isScreenLoading: false
		});
	}

	//This method converts a specific time like 9:00 AM into how many minutes have passed since 12 AM. Returns a number
	convertToMinutes(time) {
		let hours = parseInt(time.substring(0, time.indexOf(':')));
		if (hours === 12) {
			if (time.includes('AM')) {
				hours = 0;
			} else {
				hours = 12;
			}
		} else if (time.includes('PM')) {
			hours += 12;
		}
		let minutes = parseInt(time.substring(time.indexOf(':') + 1, time.indexOf(' ')));
		return hours * 60 + minutes;
	}

	//Sets the array of available times based on the business's schedule, service duration, and amount of requests the business
	//can handle at a time. Takes in a specific date as a parameter
	setAvailableTimes(dateObject) {
		const dayOfTheWeek = [
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday'
		][dateObject.getDay()];
		const date = dateObject.toLocaleDateString('en-US');

		//Constructs the array based on the business schedule
		const { business, service } = this.state;
		const businessSchedule = business.businessHours[dayOfTheWeek];
		const { serviceDuration } = service;

		//Converts the business schedule to date objects
		let { from, to } = businessSchedule;

		let minutesInterval = 30;
		let fromTime = this.convertToMinutes(from);
		let toTime = this.convertToMinutes(to);
		let times = [];

		//loop to increment the time and push results in array
		for (let i = 0; fromTime <= toTime - serviceDuration * 60; i++) {
			let hours = Math.floor(fromTime / 60);
			let minutes = fromTime % 60;
			//Formats the result and pushes to array of times
			let hour = ('' + (hours % 12)).slice(-2);
			if (hour === '0') {
				hour = 12;
			}
			times[i] =
				hour + ':' + ('0' + minutes).slice(-2) + ' ' + ['AM', 'PM'][Math.floor(hours / 12)];

			fromTime = fromTime + minutesInterval;
		}

		//Filters for requests the business already has
		const { currentRequests } = business;
		let filteredTimes = [];
		if (currentRequests.length === 0) {
			filteredTimes = times;
		} else {
			for (let i = 0; i < times.length; i++) {
				for (const request of currentRequests) {
					let time = times[i];
					if (date === request.date) {
						//Tests if it interferes with existing request
						const beginExistingRequestTime = this.convertToMinutes(request.time);
						const endExistingRequestTime = beginExistingRequestTime + 60 * request.serviceDuration;

						const beginNewRequestTime = this.convertToMinutes(time);
						const endNewRequestTime = beginNewRequestTime + 60 * serviceDuration;

						//Tests all the scenarios for conflicts
						if (
							(endNewRequestTime < beginExistingRequestTime &&
								beginNewRequestTime < beginExistingRequestTime) ||
							(endExistingRequestTime < beginNewRequestTime &&
								beginExistingRequestTime < beginNewRequestTime) ||
							(this.state.isEditing === true && time === this.state.request.time)
						) {
							filteredTimes.push(time);
						}
					} else {
						filteredTimes.push(time);
					}
				}
			}
		}

		return filteredTimes;
	}

	//Requests the service by checking if all fields have been filled out correctly
	async requestService() {
		this.setState({
			isLoading: true
		});

		//Fetches all the required fields
		const {
			business,
			customer,
			selectedDate,
			answers,
			service,
			selectedTime,
			isEditing,
			request
		} = this.state;

		//Uploads the request to firebase
		if (isEditing === true) {
			await FirebaseFunctions.call('updateCustomerRequest', {
				requestID: request.requestID,
				status: request.status,
				customerID: request.customerID,
				businessID: request.businessID,
				serviceTitle: service.serviceTitle,
				customerName: customer.name,
				serviceID: request.serviceID,
				date: selectedDate,
				serviceDuration: service.serviceDuration,
				questions: answers,
				time: selectedTime
			});
		} else {
			await FirebaseFunctions.call('requestService', {
				assignedTo: '',
				businessID: business.businessID,
				customerID: customer.customerID,
				cash: service.cash,
				card: service.card,
				date: selectedDate,
				questions: answers,
				price: service.price,
				priceText: service.priceText,
				review: '',
				serviceTitle: service.serviceTitle,
				customerName: customer.name,
				serviceDuration: service.serviceDuration,
				serviceID: service.serviceID,
				requestedOn: new Date().toLocaleDateString('en-US'),
				status: 'AWAITING',
				time: selectedTime
			});
		}
		const allServices = await FirebaseFunctions.call('getAllServices', {});
		const updatedCustomer = await FirebaseFunctions.call('getCustomerByID', {
			customerID: customer.customerID
		});
		this.setState({
			isLoading: false,
			isRequestSucess: true,
			customer: updatedCustomer,
			allServices
		});
	}

	render() {
		const {
			customer,
			business,
			service,
			availableTimes,
			selectedDate,
			selectedTime,
			isScreenLoading,
			isErrorVisible,
			isRequestSavedSucess,
			requestSummaryVisible,
			isRequestSucess,
			allServices
		} = this.state;
		if (isScreenLoading === true) {
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
					<Calendar
						style={{ width: screenWidth }}
						theme={{
							selectedDayBackgroundColor: colors.lightBlue,
							selectedDayTextColor: colors.white,
							todayTextColor: colors.black,
							dayTextColor: colors.black,
							arrowColor: colors.lightBlue,
							monthTextColor: colors.black,
							textDayFontFamily: fontStyles.mainTextStyleBlack.fontFamily,
							textMonthFontFamily: fontStyles.mainTextStyleBlack.fontFamily,
							textDayHeaderFontFamily: fontStyles.mainTextStyleBlack.fontFamily,
							textDayFontSize: fontStyles.subTextStyleBlack.fontSize,
							textMonthFontSize: fontStyles.bigTextStyleBlack.fontSize
						}}
						markedDates={{
							[this.state.dateString]: { selected: true }
						}}
						current={this.state.selectedDate}
						minDate={this.state.isEditing === true ? null : new Date()}
						onDayPress={(newDate) => {
							const dateObject = new Date();
							dateObject.setFullYear(newDate.year);
							dateObject.setMonth(newDate.month - 1);
							dateObject.setDate(newDate.day);
							this.setState({
								selectedDate: dateObject.toLocaleDateString('en-US'),
								dateString: newDate.dateString,
								selectedTime: '',
								availableTimes: this.setAvailableTimes(dateObject)
							});
						}}
					/>
				</View>
				<View style={{ width: screenWidth, flex: 1 }}>
					<FlatList
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						numColumns={2}
						data={availableTimes}
						extraData={this.state}
						keyExtractor={(item) => item}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={
							selectedDate === '' ? (
								<View />
							) : (
								<View
									style={{
										marginVertical: screenHeight * 0.05,
										marginHorizontal: screenWidth * 0.025
									}}>
									<Text style={[fontStyles.bigTextStyleBlack, { textAlign: 'center' }]}>
										{strings.NoAvailableTimes}
									</Text>
								</View>
							)
						}
						ListFooterComponent={
							<View style={{ marginVertical: screenHeight * 0.05 }}>
								<RoundBlueButton
									title={strings.Request}
									style={roundBlueButtonStyle.MediumSizeButton}
									textStyle={fontStyles.bigTextStyleWhite}
									isLoading={this.state.isLoading}
									onPress={() => {
										if (selectedDate === '' || selectedTime === '') {
											this.setState({ fieldsError: true });
										} else {
											this.setState({ requestSummaryVisible: true });
										}
									}}
								/>
							</View>
						}
						renderItem={({ item, index }) => (
							<View
								style={{
									marginLeft: screenWidth * 0.1,
									marginTop: screenHeight * 0.025
								}}>
								<RoundBlueButton
									title={item}
									//Tests if this button is selected, if it is, then the border color will
									//be blue
									style={[
										roundBlueButtonStyle.AccountTypeButton,
										{
											//Width increased for longer text
											width: screenWidth * 0.35,
											borderColor: selectedTime === item ? colors.lightBlue : colors.white
										}
									]}
									textStyle={fontStyles.mainTextStyleBlue}
									//Method selects the business button and deselects the other
									onPress={() => {
										this.setState({ selectedTime: item });
									}}
									disabled={this.state.isLoading}
								/>
							</View>
						)}
					/>
				</View>
				<HelpAlert
					isVisible={isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<HelpAlert
					isVisible={isRequestSucess}
					onPress={() => {
						this.setState({ isRequestSucess: false });
						this.props.navigation.push('FeaturedScreen', {
							customer: customer,
							allServices: allServices
						});
					}}
					title={strings.Success}
					message={strings.TheServiceHasBeenRequested}
				/>
				<HelpAlert
					isVisible={this.state.fieldsError}
					onPress={() => {
						this.setState({ fieldsError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseFillOutAllFields}
				/>
				<HelpAlert
					isVisible={isRequestSavedSucess}
					onPress={() => {
						this.setState({ isRequestSavedSucess: false });
						this.props.navigation.push('FeaturedScreen', {
							customer: customer,
							allServices: allServices
						});
					}}
					title={strings.Success}
					message={strings.TheServiceRequestHasBeenSaved}
				/>
				<OptionPicker
					isVisible={requestSummaryVisible}
					title={strings.RequestSummary}
					clickOutside={false}
					message={
						'\n' +
						strings.ServiceColon +
						service.serviceTitle +
						'\n\n' +
						strings.OfferedByColon +
						service.businessName +
						'\n\n' +
						strings.PriceColon +
						service.priceText +
						'\n\n' +
						strings.ScheduledDateColon +
						selectedDate +
						'\n\n' +
						strings.ScheduleTimeColon +
						selectedTime +
						'\n\n'
					}
					confirmText={strings.Request}
					confirmOnPress={() => {
						//Requests the service
						this.requestService();
						this.setState({ requestSummaryVisible: false });
					}}
					cancelText={strings.Cancel}
					cancelOnPress={() => {
						this.setState({ requestSummaryVisible: false });
					}}
				/>
			</HelpView>
		);
	}
}

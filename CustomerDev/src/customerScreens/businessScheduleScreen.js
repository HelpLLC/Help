//This is going to be the screen in which customers can choose from the business's specific available dates
//for the request to completed. After this screen, the actual request is requested
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import {
	View,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Text,
	Platform,
	ScrollView
} from 'react-native';
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
		selectedTime: '',
		isSaveRequestVisible: false,
		isErrorVisible: false,
		isRequestSavedSucess: false,
		isRequestSucess: false
	};

	//Sets the initial fields and fetches the correct business schedule for that date
	async componentDidMount() {
		const { answers, service, customer, isEditing } = this.props.navigation.state.params;
		if (isEditing === true) {
			const { request } = this.props.navigation.state.params;
			//Sets the correct fields for existing request
		} else {
			//Fetches the business
			const business = await FirebaseFunctions.call('getBusinessByID', {
				businessID: service.businessID
			});

			this.setState({
				business,
				answers,
				service,
				customer,
				isEditing,
				isScreenLoading: false
			});
		}
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
								beginExistingRequestTime < beginNewRequestTime)
						) {
							filteredTimes.push(time);
						}
					} else {
						filteredTimes.push(time);
					}
				}
			}
		}

		this.setState({ availableTimes: filteredTimes });
	}

	//Requests the service by checking if all fields have been filled out correctly
	async requestService() {
		this.setState({
			isLoading: true
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
			isSaveRequestVisible,
			isErrorVisible,
			isRequestSavedSucess,
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
					<CalendarPicker
						textStyle={fontStyles.subTextStyleBlack}
						selectedDayTextColor={colors.white}
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
						onDateChange={(newDate) => {
							const dateObject = new Date(newDate);
							this.setState({ selectedDate: dateObject.toLocaleDateString(), selectedTime: '' });
							this.setAvailableTimes(dateObject);
						}}
					/>
				</View>
				<View style={{ width: Dimensions.get('window').width, flex: 1 }}>
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
										marginVertical: Dimensions.get('window').height * 0.05,
										marginHorizontal: Dimensions.get('window').width * 0.025
									}}>
									<Text style={[fontStyles.bigTextStyleBlack, { textAlign: 'center' }]}>
										{strings.NoAvailableTimes}
									</Text>
								</View>
							)
						}
						ListFooterComponent={
							<View style={{ marginVertical: Dimensions.get('window').height * 0.05 }}>
								<RoundBlueButton
									title={strings.Request}
									style={roundBlueButtonStyle.MediumSizeButton}
									textStyle={fontStyles.bigTextStyleWhite}
									isLoading={this.state.isLoading}
									onPress={() => {
										//Passes the correct parameters to the scheduling screen
										this.requestService();
									}}
								/>
							</View>
						}
						renderItem={({ item, index }) => (
							<View
								style={{
									marginLeft: Dimensions.get('window').width * 0.1,
									marginBottom: Dimensions.get('window').height * 0.02
								}}>
								<RoundBlueButton
									title={item}
									//Tests if this button is selected, if it is, then the border color will
									//be blue
									style={[
										roundBlueButtonStyle.AccountTypeButton,
										{
											//Width increased for longer text
											width: Dimensions.get('window').width * 0.35,
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
					isVisible={isSaveRequestVisible}
					title={strings.SaveRequest}
					clickOutside={false}
					message={strings.AreYouSureYouWantToOverwriteOldRequest}
					confirmText={strings.Yes}
					confirmOnPress={() => {
						//Requests the service
						this.requestService();
						this.setState({ isSaveRequestVisible: false });
					}}
					cancelText={strings.Cancel}
					cancelOnPress={() => {
						this.setState({ isSaveRequestVisible: false });
					}}
				/>
			</HelpView>
		);
	}
}

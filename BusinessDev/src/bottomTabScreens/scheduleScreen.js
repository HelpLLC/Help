//This is going to be the screen where the business's schedule is going to be displayed in a calendar format, allowing for
//customization, and interactions.
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, Dimensions, Text } from 'react-native';
import TopBanner from '../components/TopBanner/TopBanner';
import { Agenda } from 'react-native-calendars';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';
import LoadingSpinner from '../components/LoadingSpinner';
import strings from 'config/strings';
import HelpAlert from '../components/HelpAlert';
import RequestCard from '../components/RequestCard';

//Creates and exports the class
export default class scheduleScreen extends Component {
	state = {
		businessID: '',
		businessFetched: '',
		isLoading: true,
		isErrorVisible: false,
		selectedDate: '',
		business: '',
		dateString: '',
		items: {},
		markedDates: ''
	};

	//Converts a date object to the following format "YYYY-MM-DD"
	convertDateFormat(date) {
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
		return dateString;
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

	//This method is going to return the data based on the day selected so the business can see their requests on that day
	async getDayItems(day) {
		//Constructs the items based on the business's current requests
		//The format is { '2020-03-22': [{ name: 'Event 1' }, { name: 'Event 2' }] }
		let items = {};
		let markedDates = {};

		//Fetches the array of requests for that day
		let currentRequests = await FirebaseFunctions.call('getBusinessCurrentRequestsByDay', {
			day,
			businessID: this.props.navigation.state.params.businessID
		});
		currentRequests = Object.keys(currentRequests).map((requestID) => currentRequests[requestID]);
		currentRequests.sort((a, b) => {
			return new Date(a.date) - new Date(b.date);
		});
		for (const request of currentRequests) {
			let { customerName, date, serviceID, serviceTitle, time, requestID } = request;
			const image = await FirebaseFunctions.call('getServiceImageByID', { serviceID: serviceID });
			if (items[day]) {
				const array = items[day];
				array.push({
					customerName,
					serviceID,
					image,
					serviceTitle,
					time,
					requestID
				});
				array.sort((a, b) => {
					return this.convertToMinutes(a.time) - this.convertToMinutes(b.time);
				});
				items[day] = array;
			} else {
				items[day] = [
					{
						customerName,
						image,
						serviceID,
						serviceTitle,
						time,
						requestID
					}
				];
			}
			markedDates[day] = { marked: true };
		}
		return { markedDates, items };
	}

	//Declares the screen name in Firebase and fetches necessary data
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ScheduleScreen', 'scheduleScreen');
		//If navigated from launch screen or the log in screen, won't "double fetch" the business object because it'll have
		//already been fetched
		const { businessID, businessFetched } = this.props.navigation.state.params;
		let business = '';
		if (businessFetched === true) {
			business = this.props.navigation.state.params.business;
		} else {
			business = await FirebaseFunctions.call('getBusinessByID', { businessID });
		}
		let mostUpcomingDay = await FirebaseFunctions.call('getUpcomingRequestByBusinessID', {
			businessID
		});
		let formattedDateString = '';
		let initialDate = '';
		if (mostUpcomingDay === -1) {
			formattedDateString = this.convertDateFormat(new Date());
			initialDate = new Date();
		} else {
			const date = mostUpcomingDay[Object.keys(mostUpcomingDay)[0]].date;
			const dateObject = new Date(date);
			formattedDateString = this.convertDateFormat(dateObject);
			initialDate = dateObject;
		}
		const getDayItems = await this.getDayItems(formattedDateString);
		this.setState({
			business,
			selectedDate: initialDate,
			dateString: formattedDateString,
			isLoading: false,
			markedDates: getDayItems.markedDates,
			items: getDayItems.items
		});
	}

	render() {
		const { isErrorVisible, isLoading, selectedDate, dateString, markedDates, items } = this.state;
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<View>
						<TopBanner title={strings.Schedule} />
					</View>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
					<HelpAlert
						isVisible={isErrorVisible}
						onPress={() => {
							this.setState({ isErrorVisible: false });
						}}
						title={strings.Whoops}
						message={strings.SomethingWentWrong}
					/>
				</HelpView>
			);
		} else {
			return (
				//View that dismisses the keyboard when clicked anywhere else
				<View style={screenStyle.container}>
					<View>
						<TopBanner title={strings.Schedule} />
					</View>
					<Agenda
						items={items}
						style={{ width: screenWidth }}
						theme={{
							selectedDayBackgroundColor: colors.lightBlue,
							selectedDayTextColor: colors.white,
							todayTextColor: colors.black,
							dayTextColor: colors.black,
							dotColor: colors.lightBlue,
							selectedDotColor: colors.white,
							arrowColor: colors.lightBlue,
							monthTextColor: colors.black,
							textDayFontFamily: fontStyles.mainTextStyleBlack.fontFamily,
							textMonthFontFamily: fontStyles.mainTextStyleBlack.fontFamily,
							textDayHeaderFontFamily: fontStyles.mainTextStyleBlack.fontFamily,
							textDayFontSize: fontStyles.subTextStyleBlack.fontSize,
							textMonthFontSize: fontStyles.bigTextStyleBlack.fontSize
						}}
						markedDates={{
							[dateString]: { selected: true },
							...markedDates
						}}
						refreshing={false}
						//When there is nothing on that day
						renderEmptyData={() => {
							return <View style={{ justifyContent: 'center', alignItems: 'center' }}></View>;
						}}
						//How each item is rendered in the agenda
						renderItem={(item, firstItemInDay) => (
							<View
								style={
									firstItemInDay
										? {
												marginTop: screenHeight * 0.025,
												width: screenWidth * 0.7,
												borderTopColor: colors.gray,
												borderTopWidth: 1.5
										  }
										: {}
								}>
								<RequestCard
									onPress={() => {
										//Goes to the screen for the specific request
										this.props.navigation.push('CustomerRequestScreen', {
											requestID: item.requestID
										});
									}}
									image={item.image}
									serviceTitle={item.serviceTitle}
									time={item.time}
									customerName={item.customerName}
								/>
							</View>
						)}
						selected={selectedDate}
						minDate={new Date()}
						onDayPress={async (newDate) => {
							const dateObject = new Date();
							dateObject.setFullYear(newDate.year);
							dateObject.setMonth(newDate.month - 1);
							dateObject.setDate(newDate.day);
							this.setState({
								selectedDate: dateObject.toLocaleDateString(),
								dateString: newDate.dateString
							});
							const getDayItems = await this.getDayItems(newDate.dateString);
							this.setState({ markedDates: getDayItems.markedDates, items: getDayItems.items });
						}}
					/>
				</View>
			);
		}
	}
}

//This is going to be the screen where the business's schedule is going to be displayed in a calendar format, allowing for
//customization, and interactions.
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, Dimensions, Text } from 'react-native';
import TopBanner from '../components/TopBanner';
import { Agenda } from 'react-native-calendars';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
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
		items: '',
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

	//Declares the screen name in Firebase and fetches necessary data
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ScheduleScreen', 'scheduleScreen');
		try {
			//If navigated from launch screen or the log in screen, won't "double fetch" the business object because it'll have
			//already been fetched
			const { businessID, businessFetched } = this.props.navigation.state.params;
			let business = '';
			if (businessFetched === true) {
				business = this.props.navigation.state.params.business;
			} else {
				business = await FirebaseFunctions.call('getBusinessByID', { businessID });
			}

			//Constructs the items based on the business's current requests
			//The format is { '2020-03-22': [{ name: 'Event 1' }, { name: 'Event 2' }] }
			let items = {};
			let markedDates = {};
			const { currentRequests } = business;
			currentRequests.sort((a, b) => {
				return new Date(a.date) - new Date(b.date);
			});
			for (const request of currentRequests) {
				let { customerName, date, serviceID, serviceTitle, time, requestID } = request;
				const image = await FirebaseFunctions.call('getServiceImageByID', { serviceID: serviceID });
				//Converts the date to the correct date
				date = new Date(date);
				date = this.convertDateFormat(date);
				if (items[date]) {
					const array = items[date];
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
					items[date] = array;
				} else {
					items[date] = [
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
				markedDates[date] = { marked: true };
			}
			let initialDate = '';
			if (currentRequests.length === 0) {
				initialDate = new Date();
			} else {
				initialDate = new Date(currentRequests[0].date);
			}
			this.setState({
				business,
				selectedDate: initialDate,
				dateString: this.convertDateFormat(initialDate),
				isLoading: false,
				items,
				markedDates
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'ScheduleScreen',
					userID: 'b-' + this.props.navigation.state.params.businessID
				}
			});
		}
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
						style={{ width: Dimensions.get('window').width }}
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
							return <View></View>;
						}}
						//How each item is rendered in the agenda
						renderItem={(item, firstItemInDay) => {
							return (
								<View
									style={
										firstItemInDay
											? {
													marginTop: Dimensions.get('window').height * 0.025,
													width: Dimensions.get('window').width * 0.7,
													borderTopColor: colors.gray,
													borderTopWidth: 1.5
											  }
											: {}
									}>
									<RequestCard
										onPress={() => {}}
										image={item.image}
										serviceTitle={item.serviceTitle}
										time={item.time}
										customerName={item.customerName}
									/>
								</View>
							);
						}}
						selected={selectedDate}
						minDate={new Date()}
						onDayPress={(newDate) => {
							const dateObject = new Date();
							dateObject.setFullYear(newDate.year);
							dateObject.setMonth(newDate.month - 1);
							dateObject.setDate(newDate.day);
							this.setState({
								selectedDate: dateObject.toLocaleDateString(),
								dateString: newDate.dateString
							});
						}}
					/>
				</View>
			);
		}
	}
}

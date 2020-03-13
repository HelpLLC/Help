//This is going to be the screen where the business's schedule is going to be displayed in a calendar format, allowing for
//customization, and interactions.
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, Dimensions, Text } from 'react-native';
import TopBanner from '../components/TopBanner';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import LoadingSpinner from '../components/LoadingSpinner';
import strings from 'config/strings';
import HelpAlert from '../components/HelpAlert';

//Creates and exports the class
export default class scheduleScreen extends Component {
	state = {
		businessID: '',
		businessFetched: '',
		isLoading: true,
		isErrorVisible: false,
		selectedDate: new Date(),
		business: '',
		dateString: ''
	};

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

			//Sets the current date
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
			this.setState({ business, dateString, isLoading: false });
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
		const { isErrorVisible, isLoading, selectedDate, dateString, business } = this.state;
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
				<HelpView style={screenStyle.container}>
					<View>
						<TopBanner title={strings.Schedule} />
					</View>
					<Agenda
						//This is the syntax for rendering items: 
						//items={{ '2020-03-22': [{ name: 'Event 1' }, { name: 'Event 2' }] }}
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
						}}
						refreshing={false}
						//When there is nothing on that day
						renderEmptyData={() => {
							return <View />;
						}}
						//How each item is rendered in the agenda
						renderItem={(item, firstItemInDay) => {
							return (
								<View>
									<Text>{item.name}</Text>
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
				</HelpView>
			);
		}
	}
}

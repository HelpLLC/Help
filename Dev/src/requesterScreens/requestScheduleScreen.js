//This is going to be the screen in which requesters can choose from the business's specific available dates
//for the request to completed. After this screen, the actual request is requested
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import strings from 'config/strings';
import CalendarPicker from 'react-native-calendar-picker';
import colors from 'config/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import fontStyles from '../../config/styles/fontStyles';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OptionPicker from '../components/OptionPicker';
import LoadingSpinner from '../components/LoadingSpinner';

//Renders the actual class
export default class requesterScheduleScreen extends Component {
	//The initial date/time which nothing is selected
	state = {
		selectedDate: '',
		selectedTime: '',
		isTimePickerShowing: false,
		selectedTimeObject: '',
		isScreenLoading: false,
		isLoading: false,
		isRequestVisible: false
	};

	render() {
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
						marginBottom: Dimensions.get('window').height * 0.05,
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
                        minDate={new Date()}
                        todayBackgroundColor={colors.lightGray}
                        todayTextStyle={fontStyles.subTextStyleBlack}
						selectedDayColor={colors.lightBlue}
						onDateChange={(newDate) => {
							this.setState({ selectedDate: newDate });
						}}
					/>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: Dimensions.get('window').height * 0.025
					}}>
					<Text style={fontStyles.mainTextStyleBlack}>{strings.PickADate}</Text>
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
						backgroundColor: colors.white,
						color: colors.black
					}}>
					<Text style={fontStyles.mainTextStyleBlack}>{this.state.selectedTime}</Text>
				</TouchableOpacity>
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
				<OptionPicker
					isVisible={this.state.isRequestVisible}
					title={strings.FinishRequesting}
					clickOutside={false}
					message={strings.AreYouSureYouWantToRequest + '?'}
					confirmText={strings.Yes}
					confirmOnPress={() => {
						//Requests the product
						this.setState({ isRequestVisible: false });
					}}
					cancelText={strings.Cancel}
					cancelOnPress={() => {
						this.setState({ isRequestVisible: false });
					}}
				/>
				<DateTimePickerModal
					isVisible={this.state.isTimePickerShowing}
					mode='time'
					headerTextIOS={strings.PickATime}
					onConfirm={(time) => {
						//Sets the selected time, and makes the picker go away
						this.setState({
							selectedTimeObject: time,
							selectedTime: time.toLocaleTimeString('en', {
								hour: 'numeric',
								minute: '2-digit'
							}),
							isTimePickerShowing: false
						});
					}}
					onCancel={() => {
						//Makes the picker go away
						this.setState({ isTimePickerShowing: false });
					}}
				/>
			</HelpView>
		);
	}
}

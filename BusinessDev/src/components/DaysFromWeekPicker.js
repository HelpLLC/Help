//This component will represent a weekly strip in which users can click on each day to mark it as selected
//It'll be used in the create schedule screen from the business side primarily
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import PropTypes from 'prop-types';
import fontStyles from 'config/styles/fontStyles';

//Declares the class
class DaysFromWeekPicker extends Component {
	//Renders the component
	render() {
		//Renders an array of all the days of the week and creates a TouchableOpacity for each that is associated
		//with the day in the array. Also fetches the day selected from the props
		const { daysSelected, onDaySelected, onDayUnselected } = this.props;
		const arrayOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const arrayOfTouchableOpacities = [];

		for (const day of arrayOfDays) {
			arrayOfTouchableOpacities.push(
				<TouchableOpacity
                    key={day}
					style={{
                        height: screenHeight * 0.05,
                        width: screenHeight * 0.075,
                        borderRadius: screenHeight * 0.025,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: daysSelected[day] === true ? colors.lightBlue : colors.lightGray
					}}
					onPress={() => {
						if (daysSelected[day] === true) {
							onDayUnselected(day);
						} else {
							onDaySelected(day);
						}
					}}>
					<Text style={fontStyles.subTextStyleBlack}>{day}</Text>
				</TouchableOpacity>
			);
		}

		return (
			<View
				style={{
					width: screenWidth * 0.95,
                    height: screenHeight * 0.075,
                    borderColor: colors.lightBlue,
                    backgroundColor: colors.white,
                    borderWidth: 4,
                    borderRadius: screenWidth * 0.075,
					flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
				}}>
				{arrayOfTouchableOpacities}
			</View>
		);
	}
}

//Declares the props required for this component to function. It has to take an object that contains which days
//are selected and which are not. It also takes in functions to determine what to do if a day is clicked on
DaysFromWeekPicker.propTypes = {
	daysSelected: PropTypes.object.isRequired,
	onDaySelected: PropTypes.func.isRequired,
	onDayUnselected: PropTypes.func.isRequired
};

//exports the module
export default DaysFromWeekPicker;
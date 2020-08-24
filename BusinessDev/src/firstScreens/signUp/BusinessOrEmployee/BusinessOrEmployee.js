// This is the class where users will be able to select to sign up as an employee or to sign up as a business
import React from 'react';
import { View, Text, Image } from 'react-native';
import HelpButton from '../../../components/HelpButton/HelpButton';
import { screenWidth, screenHeight } from '../../../../config/dimensions';
import strings from '../../../../config/strings';
import fontStyles from '../../../../config/styles/fontStyles';
import HelpView from '../../../components/HelpView';
import screenStyle from '../../../../config/styles/screenStyle';
import logo from '../../../../assets/WhiteLogo.png';
import BusinessOrEmployeeStyle from './BusinessOrEmployeeStyle';

// Declares the functional component
const BusinessOrEmployee = (props) => {
	// Returns the UI
	return (
		<HelpView style={screenStyle.container}>
			<View style={BusinessOrEmployeeStyle.logoImageContainer}>
				<Image style={BusinessOrEmployeeStyle.logoImage} source={logo} />
			</View>
			<View style={BusinessOrEmployeeStyle.buttonsContainer}>
				<View>
					<Text style={[fontStyles.bigTextStyle, fontStyles.blue]} />
				</View>
				<View style={BusinessOrEmployeeStyle.businessButton}>
					<HelpButton
						title={strings.Business}
						width={screenWidth * 0.4356}
						height={screenHeight * 0.0566}
						onPress={() => {
							props.navigation.push('EmailPasswordScreen', {
								type: 'Business'
							});
						}}
					/>
				</View>
				<View
					style={BusinessOrEmployeeStyle.employeeButton}>
					<HelpButton
						title={strings.Employee}
						width={screenWidth * 0.4356}
						height={screenHeight * 0.0566}
						onPress={() => {
							props.navigation.push('EmailPasswordScreen', {
								type: 'Employee'
							});
						}}
					/>
				</View>
			</View>
		</HelpView>
	);
};
export default BusinessOrEmployee;

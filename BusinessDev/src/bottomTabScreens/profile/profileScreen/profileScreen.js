import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import style from './profileScreenStyle';
import fontStyles from 'config/styles/fontStyles';

//exporting the profileScreen class
export default function profileScreen(props) {
	// props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

	//a list of the options availible to click
	const options = [
		strings.ProfileEditCompanyInfo,
		strings.ProfileBusinessSchedule,
		strings.ProfilePassword,
		strings.ProfileTermsPrivacyCredits,
		strings.ProfileLogout,
	];
	const functions = [
		() => {
			props.navigation.push('CompanyInfoScreen', { businessID, businessData });
		},
		() => {
			props.navigation.push('CompanyScheduleScreen', { businessID, businessData });
		},
		() => {
			props.navigation.push('ChangePasswordScreen', { businessID, businessData });
		},
		() => {
			props.navigation.push('TermsPrivacyCreditsScreen');
		},
		() => {
			FirebaseFunctions.logOut(businessID);
			props.navigation.push('splashScreen', {});
		},
	];

	//a function for compiling the list of elements in a normalized style
	function renderOptions() {
		let elements = [];
		for (let i in options)
			elements.push(
				<TouchableOpacity
					style={options[i] == strings.ProfileLogout ? style.LogoutPositioning : null}
					onPress={functions[i]}
					key={options[i]}>
					<View
						style={[
							style.OptionContainer,
							options[i] == strings.ProfileLogout ? style.LogoutContainer : style.OptionNormal,
						]}>
						<Text
							style={[
								fontStyles.bigTextStyle,
								style.OptionText,
								options[i] == strings.ProfileLogout ? style.LogoutText : {},
							]}>
							{options[i]}
						</Text>
						{options[i] == strings.ProfileLogout ? null : (
							<Icon
								name={'angle-right'}
								type='font-awesome'
								size={40}
								color={options[i] == strings.ProfileLogout ? colors.white : colors.darkBlue}
							/>
						)}
					</View>
				</TouchableOpacity>
			);
		return elements;
	}

	//the state of the function
	const [businessID, setBusinessID] = useState('');
	const [businessData, setBusinessData] = useState({});
	const [businessPictureUri, setBusinessPictureUri] = useState('');
	const [isScreenLoading, setIsScreenLoading] = useState(true);

	async function getData() {
		//Declares the screen name in Firebase
		FirebaseFunctions.setCurrentScreen('ProfileScreen', 'profileScreen');
		const { businessID: BID } = props.navigation.state.params;

		const businessObj = await FirebaseFunctions.call('getBusinessByID', {
			businessID: BID,
		});

		setBusinessID(BID);
		setBusinessData(businessObj);
		setIsScreenLoading(false);
	}
	useEffect(() => {
		getData();
	}, []);

	//rendering the screen
	if (isScreenLoading)
		return (
			<View style={style.Body}>
				<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
					<LoadingSpinner isVisible={true} />
				</View>
			</View>
		);
	else
		return (
			<View style={style.Body}>
				<View style={style.ContentContainer}>
					<View style={style.MainContainer}>
						<Image
							source={require('./profilePicture.png')}
							style={{ width: 100, height: 100, margin: 10 }}
						/>
						<Text style={[fontStyles.bigTextStyle, style.MainText]}>
							{businessData.businessName}
						</Text>
					</View>
					{renderOptions()}
				</View>
			</View>
		);
}

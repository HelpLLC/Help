// This class is what appears when the app is first launched. The user can either select to log in
// or sign up
import React from 'react';
import { View, Image } from 'react-native';
import HelpButton from '../../components/HelpButton/HelpButton';
import { screenWidth, screenHeight } from 'config/dimensions';
import strings from 'config/strings';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import logo from '../../../assets/WhiteLogo.png';
import SplashScreenStyle from './SplashScreenStyle';

// Declares the functional component
const SplashScreen = (props) => {
	// Renders the UI for the screen
	return (
		<HelpView style={screenStyle.container}>
			<View style={SplashScreenStyle.logoImageContainer}>
				<Image style={SplashScreenStyle.logoImage} source={logo} />
			</View>
			<View style={SplashScreenStyle.buttonsContainer}>
				<View style={SplashScreenStyle.getStartedContainer}>
					<HelpButton
						title={strings.GetStarted}
						width={screenWidth * 0.4356}
						height={screenHeight * 0.0566}
						onPress={() => {
							props.navigation.push('BussinessOrEmployeeScreen');
						}}
					/>
				</View>
				<View style={SplashScreenStyle.logInContainer}>
					<HelpButton
						title={strings.LogIn}
						width={screenWidth * 0.4356}
						height={screenHeight * 0.0566}
						onPress={() => {
							props.navigation.push('LogInScreen');
						}}
					/>
				</View>
			</View>
		</HelpView>
	);
};

// Exports the component
export default SplashScreen;

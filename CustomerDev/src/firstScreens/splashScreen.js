//This class is what appears when the app is first launched. The user can either select to log in
//or sign up
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';

class splashScreen extends Component {
	
	render() {
		return (
			<HelpView style={screenStyle.container}>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text style={fontStyles.bigTitleStyleBlue}>{strings.Help}</Text>
				</View>
				<View style={{ flex: 0.75 }}>
					<View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
						<RoundBlueButton
							title={strings.SignUp}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={() => {
								this.props.navigation.push('EmailPasswordScreen');
							}}
						/>
					</View>
					<View style={{ flex: 0.000001 }}></View>
					<View style={{ flexDirection: 'row', flex: 2.5, justifyContent: 'center' }}>
						<RoundBlueButton
							title={strings.LogIn}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={() => {
								this.props.navigation.push('LogInScreen');
							}}
						/>
					</View>
				</View>
			</HelpView>
		);
	}
}

export default splashScreen;

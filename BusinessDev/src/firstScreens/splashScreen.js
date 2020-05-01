//This class is what appears when the app is first launched. The user can either select to log in
//or sign up
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import HelpButton from '../components/HelpButton/HelpButton';
 
import { screenWidth, screenHeight } from 'config/dimensions';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';

class splashScreen extends Component {
	
	render() {
		return (
			<HelpView style={screenStyle.container}>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text style={[fontStyles.bigTitleStyle, fontStyles.blue]}>{strings.Help}</Text>
				</View>
				<View style={{ flex: 0.75 }}>
					<View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
						<HelpButton
							title={strings.GetStarted}
							width={screenWidth * 0.39}
							onPress={() => {
								this.props.navigation.push('EmailPasswordScreen');
							}}
						/>
					</View>
					<View style={{ flex: 0.000001 }}></View>
					<View style={{ flexDirection: 'row', flex: 2.5, justifyContent: 'center' }}>
						<HelpButton
							title={strings.LogIn}
							width={screenWidth * 0.39}
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

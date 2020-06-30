//This class is what appears when the app is first launched. The user can either select to log in
//or sign up
import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import HelpButton from '../../../components/HelpButton/HelpButton';

import { screenWidth, screenHeight } from '../../../../config/dimensions';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import logo from '../../../../assets/WhiteLogo.png';

function waitingForVerification() {
	return (
		<View style={screenStyle.container}>
			<Image
				style={{ flex: 1, width: screenWidth * 0.8, resizeMode: 'contain' }}
				source={logo}
			/>
			<View
				style={{
					flex: 1,
					width: screenWidth * 0.8,
					marginTop: screenHeight * 0.2,
				}}
			>
				<Text
					style={[
						fontStyles.bigSubTitleStyle,
						fontStyles.blue,
						{ textAlign: 'center' },
					]}
				>
					Please wait until the business confirms you as their employee!
				</Text>
			</View>
		</View>
	);
}

export default waitingForVerification;

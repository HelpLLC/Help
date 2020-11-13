//This screen will be the about screen which will be accessed from the settings tab of the
//app from both provider and requester screens. It will have information such as the version
//number, user info, and general app info
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import WhiteCard from '../components/WhiteCard';
import { screenWidth, screenHeight } from 'config/dimensions';
import strings from 'config/strings';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../components/TopBanner/TopBanner';

class aboutScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('AboutScreen', 'aboutScreen');
	}

	render() {
		return (
			<HelpView style={screenStyle.container}>
				<View>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={[fontStyles.bigTitleStyle, fontStyles.blue]}>{strings.Help}</Text>
					</View>
					<View
						style={{
							flex: 0.75,
							justifyContent: 'center',
							width: screenWidth * 0.9,
							flexDirection: 'row',
							alignItems: 'center',
							alignSelf: 'center',
						}}>
						<Text style={[{ textAlign: 'center' }, fontStyles.bigTextStyle, fontStyles.black]}>
							{strings.MarketingMessage}
						</Text>
					</View>
					<View style={{ flexDirection: 'column', flex: 3 }}>
						<WhiteCard
							text={strings.PublishedBy}
							mainTextStyle={[fontStyles.subTextStyle, fontStyles.black]}
							comp={
								<Text style={[fontStyles.subTextStyle, fontStyles.black]}>{strings.HelpLLC}</Text>
							}
							onPress={() => {}}
						/>
						<WhiteCard
							text={strings.Contact}
							mainTextStyle={[fontStyles.subTextStyle, fontStyles.black]}
							comp={
								<Text style={[fontStyles.subTextStyle, fontStyles.black]} numberOfLines={1}>
									{strings.ContactEmail}
								</Text>
							}
							onPress={() => {}}
						/>
					</View>
				</View>
			</HelpView>
		);
	}
}

export default aboutScreen;

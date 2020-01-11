//This screen will be the about screen which will be accessed from the settings tab of the
//app from both provider and requester screens. It will have information such as the version
//number, user info, and general app info
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import WhiteCard from '../components/WhiteCard';
import strings from 'config/strings';
import whiteCardStyle from '../../config/styles/componentStyles/whiteCardStyle';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../components/TopBanner';

class aboutScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('AboutScreen', 'aboutScreen');
	}

	render() {
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.About}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={fontStyles.bigTitleStyleBlue}>{strings.Help}</Text>
					</View>
					<View
						style={{
							flex: 0.75,
							justifyContent: 'center',
							width: Dimensions.get('window').width * 0.9,
							flexDirection: 'row',
							alignItems: 'center',
							alignSelf: 'center'
						}}>
						<Text style={fontStyles.bigTextStyleBlack}>{strings.MarketingMessage}</Text>
					</View>
					<View style={{ flexDirection: 'column', flex: 3 }}>
						<WhiteCard
							style={whiteCardStyle.whiteCardStyle}
							text={strings.PublishedBy}
							mainTextStyle={fontStyles.subTextStyleBlack}
							comp={<Text style={fontStyles.subTextStyleBlack}>{strings.HelpLLC}</Text>}
							onPress={() => {}}
						/>
						<WhiteCard
							style={whiteCardStyle.whiteCardStyle}
							text={strings.Contact}
							mainTextStyle={fontStyles.subTextStyleBlack}
							comp={
								<Text style={fontStyles.subTextStyleBlack} numberOfLines={1}>
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

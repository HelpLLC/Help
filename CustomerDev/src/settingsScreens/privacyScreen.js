//The screen will contain the entire privacy policy
import React, { Component } from 'react';
import strings from 'config/strings';
import { ScrollView, Dimensions, Text } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpView from '../components/HelpView';
import screenStyle from '../../config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';

class privacyScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('PrivacyPolicyScreen', 'privacyScreen');
	}

	render() {
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.Privacy}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<ScrollView
					style={{ flex: 1, backgroundColor: colors.lightGray }}
					contentContainerStyle={{
						paddingVertical: Dimensions.get('window').height * 0.02,
						marginHorizontal: Dimensions.get('window').width * 0.02,
					}}>
					<Text style={fontStyles.subTextStyleBlack}>{strings.PrivacyPolicy}</Text>
				</ScrollView>
			</HelpView>
		);
	}
}

export default privacyScreen;

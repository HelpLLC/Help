//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { YellowBox } from 'react-native';
import codePush from 'react-native-code-push';
import { View, Linking, Platform } from 'react-native';
import ErrorAlert from './src/components/ErrorAlert';
import strings from 'config/strings'; 

//Launches the app with the persisted store
class App extends Component {
	render() {
		//Ignores a specific warning
		YellowBox.ignoreWarnings([
			'ViewPagerAndroid',
			'componentWillMount',
			'componentWillReceiveProps'
		]);
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ErrorAlert
					isVisible={true}
					onPress={() => {
						if (Platform.OS === 'ios') {
							Linking.openURL('itms-apps://itunes.apple.com/app/apple-store/id1468626210?mt=8');
						} else if (Platform.OS === 'android') {
							Linking.openURL('market://details?id=com.Help.Help');
						}
					}}
					title={strings.UpdateAvailable}
					message={strings.UpdateAvailableMessage}
				/>
			</View>
		);
	}
}

App = codePush(App);

export default App;

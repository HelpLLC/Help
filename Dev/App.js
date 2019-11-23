//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { YellowBox } from 'react-native';
import codePush from 'react-native-code-push';
import RequesterScheduleScreen from './src/requesterScreens/requestScheduleScreen';

//Launches the app with the persisted store
class App extends Component {
	render() {
		//Ignores a specific warning
		YellowBox.ignoreWarnings([
			'ViewPagerAndroid',
			'componentWillMount',
			'componentWillReceiveProps'
		]);
		return <RequesterScheduleScreen />;
	}
}

App = codePush(App);

export default App;

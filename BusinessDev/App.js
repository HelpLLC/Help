//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { YellowBox } from 'react-native';
import codePush from 'react-native-code-push';
import Icon from 'react-native-vector-icons/FontAwesome';

//Launches the app with the persisted store
class App extends Component {
	render() {
		Icon.loadFont();
		//Ignores a specific warning
		YellowBox.ignoreWarnings([
			'ViewPagerAndroid',
			'componentWillMount',
			'componentWillReceiveProps'
		]);
		return <MainStackNavigator />;
	}
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
App = codePush(codePushOptions)(App);

export default App;

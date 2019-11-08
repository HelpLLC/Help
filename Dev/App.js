//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { YellowBox } from 'react-native';
import codePush from 'react-native-code-push';

//Launches the app with the persisted store
class App extends Component {
	async componentDidMount() {
		codePush.notifyAppReady();
	}

	render() {
		//Ignores a specific warning
		YellowBox.ignoreWarnings([
			'ViewPagerAndroid',
			'componentWillMount',
			'componentWillReceiveProps'
		]);
		return <MainStackNavigator />;
	}
}

//Configures the app to connect with the code push server in order to check for updates on app
//resume from backgroud
let codePushOptions = {
	checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
	installMode: codePush.InstallMode.ON_NEXT_RESTART
};
App = codePush(codePushOptions)(App);

export default App;

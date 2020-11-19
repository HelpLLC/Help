//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { YellowBox } from 'react-native';
import codePush from 'react-native-code-push';
import Icon from 'react-native-vector-icons/FontAwesome';
import stripe from 'tipsi-stripe';
import SplashScreen from 'react-native-splash-screen';




//Launches the app with the persisted store
class App extends Component {
	//Initializes stripe for payments
	componentDidMount() {

		stripe.setOptions({
			publishableKey: 'pk_test_RP4GxbKwMWbM3NN5XMo3qzKz00lEiD2Fe1',
		});
	}
	render() {
		Icon.loadFont();
		SplashScreen.hide();
		//Ignores a specific warning
		YellowBox.ignoreWarnings([
			'ViewPagerAndroid',
			'componentWillMount',
			'componentWillReceiveProps',
		]);
		return <MainStackNavigator/>;
	}
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
App = codePush(codePushOptions)(App);

export default App;

// import stripeTesting from './stripeTesting';
// export default stripeTesting;

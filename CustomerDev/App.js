//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { YellowBox } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { screenWidth, screenHeight } from 'config/dimensions';
import codePush from 'react-native-code-push';

//Launches the app with the persisted store
class App extends Component {
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

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
App = codePush(codePushOptions)(App);

export default App;

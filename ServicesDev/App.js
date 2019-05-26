//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { YellowBox } from 'react-native';

//Launches the app with the persisted store
export default class App extends Component {
  render() {
    //Ignores a specific warning
    YellowBox.ignoreWarnings(['ViewPagerAndroid']);
    return (
          <MainStackNavigator />
    );
  }
};
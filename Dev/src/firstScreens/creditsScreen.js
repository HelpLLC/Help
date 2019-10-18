//This page will display the credits that cite all resources help uses
//This will be navigated to from the settings screen.
import React, { Component } from 'react';
import { Text, ScrollView } from 'react-native';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import FirebaseFunctions from 'config/FirebaseFunctions';

export default class creditsScreen extends Component {

  componentDidMount() {
    FirebaseFunctions.setCurrentScreen("CreditsScreen", "creditsScreen");
  }

  //Renders the screen
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.lightGray }}>
        <Text style={fontStyles.mainTextStyleBlack}>{strings.IconMadeBySmashIconsFromFlaticon}</Text>
      </ScrollView>
    );
  }
}
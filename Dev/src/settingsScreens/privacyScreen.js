//The screen will contain the entire privacy policy
import React, { Component } from 'react';
import { Text } from 'react-native';
import strings from 'config/strings';
import { ScrollView } from 'react-native-gesture-handler';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpView from '../components/HelpView';
import screenStyle from '../../config/styles/screenStyle';
import TopBanner from '../components/TopBanner';

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
          leftOnPress={() => navigation.goBack()}
        />
        <ScrollView>
          <Text>{strings.PrivacyPolicy}</Text>
        </ScrollView>
      </HelpView>
    );
  }
}

export default privacyScreen;

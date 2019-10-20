import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import HelpView from '../components/HelpView';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import colors from '../../config/colors';
//This screen is the side menu where you can navigate to all the screens for the customer
class LeftMenu extends Component {
  render() {
    return (
      <HelpView style={{ backgroundColor: colors.lightGray, flex: 1 }}>
        <View
          style={{
            flex: 1,
            marginTop: Dimensions.get('window').height * 0.1,
            marginLeft: Dimensions.get('window').width * -0.25
          }}
        >
          <TouchableOpacity
            onPress={() => {
              //Home leads to featured screen
              FirebaseFunctions.analytics.logEvent('home_card_clicked');
              this.props.navigation.push('FeaturedScreen', {
                requester: this.props.requester,
                allProducts: this.props.allProducts
              });
            }}
          >
            <Text style={[fontStyles.mainTextStyleBlue, { fontSize: 25 }]}>
              {strings.Home}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: Dimensions.get('window').height * 0.01
            }}
            onPress={() => {
              //Home leads to featured screen
              FirebaseFunctions.analytics.logEvent('category_card_clicked');
              this.props.navigation.push('RequesterCategoriesScreen', {
                requester: this.props.requester,
                allProducts: this.props.allProducts,
              });
            }}
          >
            <Text style={[fontStyles.mainTextStyleBlue, { fontSize: 25 }]}>
              {strings.Categories}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: Dimensions.get('window').height * 0.01
            }}
            onPress={() => {
              //Leads to the chats screen
              FirebaseFunctions.analytics.logEvent('chat_card_clicked');
              this.props.navigation.push('ChatsScreen', {
                requester: this.props.requester,
                allProducts: this.props.allProducts
              });
            }}
          >
            <Text style={[fontStyles.mainTextStyleBlue, { fontSize: 25 }]}>
              {strings.Chats}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: Dimensions.get('window').height * 0.01
            }}
            onPress={() => {
              //Leads to the settings screen
              FirebaseFunctions.analytics.logEvent('settings_card_clicked');
              this.props.navigation.push('SettingsScreen', {
                requester: this.props.requester,
                allProducts: this.props.allProducts
              });
            }}
          >
            <Text style={[fontStyles.mainTextStyleBlue, { fontSize: 25 }]}>
              {strings.Settings}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginBottom: Dimensions.get('window').height * 0.05,
            marginLeft: Dimensions.get('window').width * -0.25
          }}
        >
          <TouchableOpacity
            style={{
              marginTop: Dimensions.get('window').height * 0.01
            }}
            //Logs out then goes to the first screen
            onPress={async () => {
              FirebaseFunctions.analytics.logEvent('logged_out_from_sideMenu');
              await FirebaseFunctions.logOut(
                true,
                this.props.requester.requesterID
              );
              this.props.navigation.push('FirstScreens');
            }}
          >
            <Text style={[fontStyles.mainTextStyleRed, { fontSize: 25 }]}>
              {strings.LogOut}
            </Text>
          </TouchableOpacity>
        </View>
      </HelpView>
    );
  }
}

//exports side menu
export default LeftMenu;
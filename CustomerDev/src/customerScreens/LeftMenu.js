import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import HelpView from '../components/HelpView';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ImageWithBorder from '../components/ImageWithBorder';
import LeftMenuCard from '../components/LeftMenuCard';
import colors from 'config/colors';

//This screen is the side menu where you can navigate to all the screens for the customer
class LeftMenu extends Component {
  render() {
    const { customer } = this.props;
    return (
      <HelpView style={screenStyle.container}>
        <View style={{ height: Dimensions.get('window').height * 0.05 }}></View>
        <View
          style={{
            height: Dimensions.get('window').height * 0.65
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              height: Dimensions.get('window').height * 0.075,
              marginBottom: Dimensions.get('window').height * 0.01,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginRight: Dimensions.get('window').width * 0.1
            }}
            onPress={() => {
              //Home leads to featured screen
              FirebaseFunctions.analytics.logEvent('my_profile_clicked');
              this.props.navigation.push('AdditionalCustomerInfoScreen', {
                customer: this.props.customer,
                allServices: this.props.allServices,
                isEditing: true
              });
            }}>
            <ImageWithBorder
              width={Dimensions.get('window').height * 0.075}
              height={Dimensions.get('window').height * 0.075}
              imageFunction={async () => {
                //Passes in the function to retrieve the image of this customer
                return await FirebaseFunctions.call('getProfilePictureByID', {
                  ID: this.props.customer.customerID
                });
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-evenly'
              }}>
              <Text style={fontStyles.bigTextStyleBlack}>
                {//Creates a first name effect
                customer.name.trim().includes(' ')
                  ? customer.name.substring(0, customer.name.trim().indexOf(' '))
                  : customer.name}
              </Text>
              <View style={{ height: Dimensions.get('window').height * 0.01 }}></View>
              <Text style={fontStyles.subTextStyleBlack}>
                {customer.city
                  ? //Method shows only one comma in location: "Redmond, WA" not Redmond, WA, USA
                  customer.city.substring(customer.city.indexOf(',') + 1).includes(',')
                    ? customer.city.substring(0, customer.city.lastIndexOf(','))
                    : customer.city
                  : ''}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ marginLeft: Dimensions.get('window').width * 0.05 }}>
            <LeftMenuCard
              text={strings.Home}
              textColor={colors.lightBlue}
              onPress={() => {
                //Home leads to featured screen
                FirebaseFunctions.analytics.logEvent('home_card_clicked');
                this.props.navigation.push('FeaturedScreen', {
                  customer: this.props.customer,
                  allServices: this.props.allServices
                });
              }}
              renderBorder={true}
            />
            <LeftMenuCard
              text={strings.Categories}
              textColor={colors.lightBlue}
              onPress={() => {
                //Categories leads to the categories screen
                FirebaseFunctions.analytics.logEvent('category_card_clicked');
                this.props.navigation.push('CategoriesScreen', {
                  customer: this.props.customer,
                  allServices: this.props.allServices
                });
              }}
              renderBorder={true}
            />
            <LeftMenuCard
              text={strings.OrderHistory}
              textColor={colors.lightBlue}
              onPress={() => {
                //Order History leads to order history screen
                FirebaseFunctions.analytics.logEvent('order_history_card_clicked');
                this.props.navigation.push('OrderHistoryScreen', {
                  customer: this.props.customer,
                  allServices: this.props.allServices
                });
              }}
              renderBorder={true}
            />
            <LeftMenuCard
              text={strings.MyProfile}
              textColor={colors.lightBlue}
              onPress={() => {
                //Home leads to featured screen
                FirebaseFunctions.analytics.logEvent('my_profile_card_clicked');
                this.props.navigation.push('AdditionalCustomerInfoScreen', {
                  customer: this.props.customer,
                  allServices: this.props.allServices,
                  isEditing: true
                });
              }}
              renderBorder={true}
            />
            <LeftMenuCard
              text={strings.Settings}
              textColor={colors.lightBlue}
              onPress={() => {
                //Settings leads to the settings screen
                FirebaseFunctions.analytics.logEvent('settings_card_clicked');
                this.props.navigation.push('SettingsScreen', {
                  customer: this.props.customer,
                  allServices: this.props.allServices
                });
              }}
              renderBorder={false}
            />
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get('window').height * 0.25,
            justifyContent: 'flex-end',
            marginLeft: Dimensions.get('window').width * 0.05
          }}>
          <LeftMenuCard
            text={strings.LogOut}
            textColor={colors.red}
            onPress={async () => {
              //Logs the current user out and goes to first screens
              FirebaseFunctions.analytics.logEvent('logged_out_from_sideMenu');
              FirebaseFunctions.logOut(this.props.customer.customerID);
              this.props.navigation.push('SplashScreen');
            }}
            renderBorder={false}
          />
        </View>
        <View style={{ height: Dimensions.get('window').height * 0.05 }}></View>
      </HelpView>
    );
  }
}

//exports side menu
export default LeftMenu;

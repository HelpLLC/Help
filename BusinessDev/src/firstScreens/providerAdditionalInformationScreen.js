//This will be the screen in which businesses will be able to provide addtional information about their business such as a location,
//phone number, and an optional website. It will fetch the business name and description from the previosu screen and create
//the actual business in this screen
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import strings from 'config/strings';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import {
  Text,
  View,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import fontStyles from 'config/styles/fontStyles';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import GoogleCityPicker from '../components/GoogleCityPicker';
import HelpAlert from '../components/HelpAlert';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';
import TopBanner from '../components/TopBanner';

export default class providerAdditionalInformationScreen extends Component {
  //Function sets the name of the current screen & sets the correct state based on whether this is a screen to create a new provider
  //or edit an existing one
  componentDidMount() {
    const { editing } = this.props.navigation.state.params;
    if (editing === true) {
      FirebaseFunctions.setCurrentScreen(
        'EditProviderAdditionalInformationScreen',
        'providerAdditionalInformationScreen'
      );
      const { provider, providerID } = this.props.navigation.state.params;
      this.setState({
        phoneNumber: provider.phoneNumber ? provider.phoneNumber : '',
        website: provider.website ? provider.website : '',
        location: provider.location ? provider.location : '',
        coordinates: provider.coordinates ? provider.coordinates : '',
        isLoadingScreen: false,
        editing,
        provider,
        providerID
      });
    } else {
      FirebaseFunctions.setCurrentScreen(
        'ProviderAdditionalInformationScreen',
        'providerAdditionalInformationScreen'
      );
      this.setState({
        isLoadingScreen: false,
        editing
      });
    }
  }

  //Function checks that all of the fields have been filled out and goes to the next screen
  goToNextScreen() {
    const {
      businessName,
      businessInfo,
      email,
      requesterAccountExists,
      password
    } = this.props.navigation.state.params;
    const { phoneNumber, website, location, coordinates } = this.state;
    if (phoneNumber !== '' && location !== '' && coordinates !== '') {
      this.props.navigation.push('CreateBusinessSchedule', {
        businessName,
        businessInfo,
        email,
        password,
        requesterAccountExists,
        phoneNumber,
        website,
        location,
        coordinates
      });
    } else {
      this.setState({
        fieldsError: true
      })
    }
  }

  //The state which will control the value of the text inputs and the locations
  state = {
    phoneNumber: '',
    website: '',
    location: '',
    coordinates: '',
    isLoading: false,
    isLoadingScreen: true,
    fieldsError: false,
    locationInfoVisible: false,
    accountSaved: false
  };

  //This function renders the screen
  render() {
    if (this.state.isLoadingScreen === true) {
      return (
        <HelpView style={screenStyle.container}>
          <TopBanner
            title={
              this.props.navigation.state.params.editing === true
                ? strings.EditCompany
                : strings.CreateProfile
            }
            leftIconName='angle-left'
            leftOnPress={() => {
              //Method will go back to the splash screen
              this.props.navigation.goBack();
            }}
          />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <LoadingSpinner isVisible={true} />
          </View>
        </HelpView>
      );
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={screenStyle.container}>
          <TopBanner
            title={this.state.editing === true ? strings.EditCompany : strings.CreateProfile}
            leftIconName='angle-left'
            leftOnPress={() => {
              //Method will go back to the splash screen
              this.props.navigation.goBack();
            }}
          />
          <View
            style={{
              alignSelf: 'flex-start',
              justifyContent: 'flex-end',
              marginVertical: Dimensions.get('window').height * 0.02,
              marginLeft: Dimensions.get('window').width * 0.2
            }}>
            <Text style={fontStyles.bigTextStyleBlack}>{strings.Website}</Text>
          </View>

          <View style={{ justifyContent: 'center' }}>
            <OneLineRoundedBoxInput
              placeholder={strings.EnterWebsiteLink}
              onChangeText={(input) => this.setState({ website: input })}
              value={this.state.website}
              password={false}
              autoCapitalize={'none'}
            />
          </View>
          <View
            style={{
              alignSelf: 'flex-start',
              justifyContent: 'flex-end',
              marginVertical: Dimensions.get('window').height * 0.02,
              marginLeft: Dimensions.get('window').width * 0.2
            }}>
            <Text style={fontStyles.bigTextStyleBlack}>{strings.PhoneNumber}</Text>
          </View>

          <View style={{ justifyContent: 'center' }}>
            <OneLineRoundedBoxInput
              placeholder={strings.EnterPhoneNumber}
              onChangeText={(input) => this.setState({ phoneNumber: input.replace(/[^0-9]/g, '') })}
              value={this.state.phoneNumber}
              password={false}
              keyboardType='numeric'
              autoCompleteType={'tel'}
              maxLength={10}
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              alignSelf: 'flex-start',
              marginVertical: Dimensions.get('window').height * 0.02,
              marginLeft: Dimensions.get('window').width * 0.2
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ locationInfoVisible: true });
              }}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={fontStyles.bigTextStyleBlack}>{strings.LocationYouServe}</Text>
              <View style={{ width: Dimensions.get('window').width * 0.01 }}></View>
              <Icon name={'info-circle'} type='font-awesome' size={25} color={colors.lightBlue} />
            </TouchableOpacity>
          </View>
          <View style={{ height: Dimensions.get('window').height * 0.35 }}>
            <GoogleCityPicker
              initialText={this.state.location !== '' ? this.state.location : ''}
              placeholderText={strings.EnterLocation}
              onPress={(locationName, long, lat) => {
                this.setState({
                  location: locationName,
                  coordinates: { long, lat }
                });
              }}
            />
          </View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.1,
              justifyContent: 'flex-end',
              alignSelf: 'center'
            }}>
            <RoundBlueButton
              title={this.state.editing === true ? strings.Done : strings.Next}
              style={roundBlueButtonStyle.MediumSizeButton}
              textStyle={fontStyles.bigTextStyleWhite}
              isLoading={this.state.isLoading}
              onPress={() => {
                //Function goes to the next screen
                this.goToNextScreen();
               
              }}
              disabled={this.state.isLoading}
            />
          </View>
          <HelpAlert
            isVisible={this.state.fieldsError}
            onPress={() => {
              this.setState({ fieldsError: false });
            }}
            title={strings.Whoops}
            message={strings.PleaseFillOutAllFields}
          />
          <HelpAlert
            isVisible={this.state.accountSaved}
            onPress={() => {
              this.setState({ accountSaved: false });

              this.props.navigation.push('ProviderScreens', {
                providerID: this.state.providerID
              });
            }}
            title={strings.Success}
            message={strings.AccountSaved}
          />
          <HelpAlert
            isVisible={this.state.locationInfoVisible}
            onPress={() => {
              this.setState({ locationInfoVisible: false });
            }}
            title={strings.Location}
            message={strings.WhyWeUseLocation}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

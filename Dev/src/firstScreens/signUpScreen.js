//This is the screen that will pop up when users first come to sign up for the app, it will
//ask for an email and a password, and what type of account they want to create
import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import CheckBox from 'react-native-check-box';
import colors from 'config/colors';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import firebase from 'react-native-firebase';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import ErrorAlert from '../components/ErrorAlert';

//The class that will create the look of this screen
class signUpScreen extends Component {
  componentDidMount() {
    FirebaseFunctions.setCurrentScreen('SignUpScreen', 'signUpScreen');
  }

  //The state which will contain whatever the user typed in, along with the selected account type
  //Only one account can be selected at a time.
  //The state will also include warning message that will display different messages to the user
  //if they have done something wrong, such as the username given already exists, or no buttons
  //were selected, etc.
  state = {
    email: '',
    password: '',
    buttonSelected: '',
    fieldsError: false,
    emailError: false,
    buttonError: false,
    passwordError: false,
    emailExistsError: false,
    isLoading: false,
    isErrorVisible: false,
    isChecked: false,
    termsAndConditionsError: false,
    businessPhoneNumberError: false,
    invalidPhoneNumberError: false
  };

  //This method signs up the user & creates an account for them based on what they chose and their
  //username
  async signUp() {
    Keyboard.dismiss();
    //fetches the entered email and password
    let { email, password, buttonSelected, isChecked } = this.state;
    email = email.trim();
    password = password.trim();

    //If no username was entered, or all empty spaces, then an error message will pop up

    if (email.trim().length === 0 || password.trim().length === 0) {
      this.setState({ inputText: '', fieldsError: true });

      //If no button was selected a different error message would appear
    } else if (!email.includes("@")) {
        this.setState({ emailError: true });
    } else if (password.length < 6) {
        this.setState({ passwordError: true });
    } else {
      this.setState({ isLoading: true });
      //If the accout already exists, then an error will appear
      //If the account is new, then it will go through the normal process to create
      //the account
      try {
        const array = await firebase.auth().fetchSignInMethodsForEmail(email);
        if (array.length > 0) {
          this.setState({ emailExistsError: true });
          this.setState({ isLoading: false });
        } else {
          if (buttonSelected === 'Customer') {
            //If this is a customer, it will push to the createrequester screen and create profile there
            this.setState({ isLoading: false });
            this.props.navigation.push('CreateRequesterProfileScreen', {
              email,
              password
            });
          } else {
            //If this is a business account, then it will navigate to the create provider
            //profile screen to finish creating the account there
            this.setState({ isLoading: false });
            this.props.navigation.push('CreateProviderProfileScreen', {
              email,
              password,
              phoneNumber
            });
          }
        }
      } catch (error) {
        this.setState({ isLoading: false, isErrorVisible: true });
        FirebaseFunctions.logIssue(error, 'SignUpScreen');
      }
    }
  }

  render() {
    return (
      //View that dismisses the keyboard when clicked anywhere else
      <HelpView style={screenStyle.container}>
        <ScrollView>
          <View
            style={{ height: Dimensions.get('window').height * 0.03 }}
          ></View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.12,
              justifyContent: 'center',
              alignSelf: 'center'
            }}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={fontStyles.bigTextStyleBlack}>{strings.Email}</Text>
            </View>

            <View style={{ flex: 0.5 }}></View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <OneLineRoundedBoxInput
                placeholder={strings.EnterAnEmail}
                onChangeText={input => this.setState({ email: input })}
                value={this.state.email}
                password={false}
                autoCompleteType={'email'}
                keyboardType={'email-address'}
              />
            </View>
          </View>
          <View
            style={{ height: Dimensions.get('window').height * 0.03 }}
          ></View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.12,
              justifyContent: 'center',
              alignSelf: 'center'
            }}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={fontStyles.bigTextStyleBlack}>
                {strings.Password}
              </Text>
            </View>
            <View style={{ flex: 0.5 }}></View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <OneLineRoundedBoxInput
                placeholder={strings.ChooseAPassword}
                onChangeText={input => this.setState({ password: input })}
                value={this.state.password}
                password={true}
                autoCompleteType={'password'}
              />
            </View>
          </View>
          <View
            style={{ height: Dimensions.get('window').height * 0.03 }}
          ></View>
          <View
            style={{ height: Dimensions.get('window').height * 0.03 }}
          ></View>
          <View
            style={{ height: Dimensions.get('window').height * 0.03 }}
          ></View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.08,
              justifyContent: 'center',
              alignSelf: 'center'
            }}
          >
            <Text style={fontStyles.mainTextStyleBlack}>
              {strings.AccountType}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: Dimensions.get('window').width,
              justifyContent: 'space-evenly',
              height: Dimensions.get('window').height * 0.12,
              justifyContent: 'center',
              alignSelf: 'center'
            }}
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <RoundBlueButton
                title={strings.Business}
                //Tests if this button is selected, if it is, then the border color will
                //be blue
                style={[
                  roundBlueButtonStyle.AccountTypeButton,
                  {
                    borderColor:
                      this.state.buttonSelected === 'Business'
                        ? colors.lightBlue
                        : colors.white
                  }
                ]}
                textStyle={fontStyles.mainTextStyleBlue}
                //Method selects the business button and deselects the other
                onPress={() => {
                  this.setState({ buttonSelected: 'Business' });
                  Keyboard.dismiss();
                }}
                disabled={this.state.isLoading}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <RoundBlueButton
                title={strings.Customer}
                //Tests if this button is selected, if it is, then the border color will
                //be blue
                style={[
                  roundBlueButtonStyle.AccountTypeButton,
                  {
                    borderColor:
                      this.state.buttonSelected === 'Customer'
                        ? colors.lightBlue
                        : colors.white
                  }
                ]}
                textStyle={fontStyles.mainTextStyleBlue}
                //Method selects the customer button and deselects the other
                onPress={() => {
                  this.setState({ buttonSelected: 'Customer' });
                  Keyboard.dismiss();
                }}
                disabled={this.state.isLoading}
              />
            </View>
          </View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.12,
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <CheckBox
              onClick={() => {
                this.setState({ isChecked: !this.state.isChecked });
              }}
              isChecked={this.state.isChecked}
              checkedCheckBoxColor={colors.lightBlue}
              checkBoxColor={colors.lightBlue}
            />
            <Text style={fontStyles.mainTextStyleBlack}>
              {strings.IAcceptThe}
            </Text>
            <TouchableOpacity
              onPress={() => {
                //Navigates to the Terms and Conditions screen
                this.props.navigation.push('TermsAndConditionsScreen');
              }}
            >
              <Text
                style={[fontStyles.mainTextStyleBlue, { flexWrap: 'wrap' }]}
              >
                {strings.TermsAndConditions}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ height: Dimensions.get('window').height * 0.03 }}
          ></View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.12,
              justifyContent: 'flex-end',
              alignSelf: 'center'
            }}
          >
            <RoundBlueButton
              title={strings.Next}
              style={roundBlueButtonStyle.MediumSizeButton}
              textStyle={fontStyles.bigTextStyleWhite}
              onPress={() => {
                this.signUp();
              }}
              disabled={this.state.isLoading}
            />
          </View>
          <View
            style={{ height: Dimensions.get('window').height * 0.03 }}
          ></View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.05,
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <LoadingSpinner isVisible={this.state.isLoading} />
          </View>
        </ScrollView>
        <ErrorAlert
          isVisible={this.state.isErrorVisible}
          onPress={() => {
            this.setState({ isErrorVisible: false });
          }}
          title={strings.Whoops}
          message={strings.SomethingWentWrong}
        />
        <ErrorAlert
          isVisible={this.state.fieldsError}
          onPress={() => {
            this.setState({ fieldsError: false });
          }}
          title={strings.Whoops}
          message={strings.PleaseFillOutAllFields}
        />
        <ErrorAlert
          isVisible={this.state.buttonError}
          onPress={() => {
            this.setState({ buttonError: false });
          }}
          title={strings.Whoops}
          message={strings.NoButtonSelected}
        />
        <ErrorAlert
          isVisible={this.state.emailError}
          onPress={() => {
            this.setState({ emailError: false });
          }}
          title={strings.Whoops}
          message={strings.PleaseEnterAValidEmail}
        />
        <ErrorAlert
          isVisible={this.state.passwordError}
          onPress={() => {
            this.setState({ passwordError: false });
          }}
          title={strings.Whoops}
          message={strings.ShortPassword}
        />
        <ErrorAlert
          isVisible={this.state.emailExistsError}
          onPress={() => {
            this.setState({ emailExistsError: false });
          }}
          title={strings.Whoops}
          message={strings.EmailExists}
        />
        <ErrorAlert
          isVisible={this.state.businessPhoneNumberError}
          onPress={() => {
            this.setState({ businessPhoneNumberError: false });
          }}
          title={strings.Whoops}
          message={strings.BusinessPhoneNumberError}
        />
        <ErrorAlert
          isVisible={this.state.invalidPhoneNumberError}
          onPress={() => {
            this.setState({ invalidPhoneNumberError: false });
          }}
          title={strings.Whoops}
          message={strings.InvalidPhoneNumberError}
        />
        <ErrorAlert
          isVisible={this.state.termsAndConditionsError}
          onPress={() => {
            this.setState({ termsAndConditionsError: false });
          }}
          title={strings.Whoops}
          message={strings.CheckTermsAndConditions}
        />
      </HelpView>
    );
  }
}

//Exports the screen
export default signUpScreen;

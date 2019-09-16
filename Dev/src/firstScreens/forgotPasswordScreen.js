//This is the screen that will pop up when users first come to sign up for the app, it will
//ask for an email and a password, and what type of account they want to create
import React, { Component } from 'react';
import { View, Text, Dimensions, Keyboard, TouchableOpacity } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
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
class forgotPasswordScreen extends Component {

    componentDidMount() {
        FirebaseFunctions.setCurrentScreen("ForgotPasswordScreen", "forgotPasswordScreen");
    }

    //The state which will contain whatever the user typed in, along with the selected account type
    //Only one account can be selected at a time.
    //The state will also include warning message that will display different messages to the user
    //if they have done something wrong, such as the username given already exists, or no buttons
    //were selected, etc.
    state = {
        email: "",
        emailedLink: false,
        fieldsError: false,
        isLoading: false,
        isErrorVisible: false,
    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <HelpView style={screenStyle.container}>
                <View style={{ flex: 0.25 }}></View>
                <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Text style={fontStyles.bigTextStyleBlack}>{strings.Email}</Text>
                    </View>
                    <View style={{ flex: 0.5 }}></View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <OneLineRoundedBoxInput
                            placeholder={strings.EnterAnEmail}
                            onChangeText={(input) => this.setState({ email: input })}
                            value={this.state.email}
                            password={false}
                            autoCompleteType={'email'}
                            keyboardType={'email-address'}
                        />
                    </View>
                </View>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 0.5, justifyContent: 'flex-end', alignSelf: 'center' }}>
                    <RoundBlueButton
                        title={strings.EmailMe}
                        style={roundBlueButtonStyle.MediumSizeButton}
                        textStyle={fontStyles.bigTextStyleWhite}
                        onPress={async () => {
                            if (this.state.email.trim().length === 0) {
                                this.setState({ emailedLink: false, accountDNE: true });
                            } else {
                                this.setState({ isLoading: true })
                                FirebaseFunctions.forgotPassword(this.state.email);
                                this.setState({ emailedLink: true, isLoading: false });
                            }
                        }}
                        disabled={this.state.isLoading} />
                </View>
                <View style={{ flex: 0.25 }}></View>
                <View style={{ flex: 0.25, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <LoadingSpinner isVisible={this.state.isLoading} />
                </View>
                <View style={{ flex: 0.5 }}></View>
                <ErrorAlert
                    isVisible={this.state.isErrorVisible}
                    onPress={() => { this.setState({ isErrorVisible: false }) }}
                    title={strings.Whoops}
                    message={strings.SomethingWentWrong}
                />
                <ErrorAlert
                    isVisible={this.state.fieldsError}
                    onPress={() => { this.setState({ fieldsError: false }) }}
                    title={strings.Whoops}
                    message={strings.PleaseFillOutAllFields}
                />
                <ErrorAlert
                    isVisible={this.state.emailedLink}
                    onPress={() => { this.setState({ emailedLink: false }), this.props.navigation.pop(); }}
                    title={strings.Success}
                    message={strings.LinkHasBeenEmailed}
                />
            </HelpView>
        );
    }
};

//Exports the screen
export default forgotPasswordScreen;
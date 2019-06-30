//This is the screen that will pop up when users first come to sign up for the app, it will
//ask for an email and a password, and what type of account they want to create
import React, { Component } from 'react';
import { View, Text, Dimensions, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import colors from 'config/colors';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import OneLineTextInput from '../components/OneLineTextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import firebase from 'react-native-firebase';
import FirebaseFunctions from '../../config/FirebaseFunctions';


//The class that will create the look of this screen
class signUpScreen extends Component {

    //The state which will contain whatever the user typed in, along with the selected account type
    //Only one account can be selected at a time.
    //The state will also include warning message that will display different messages to the user
    //if they have done something wrong, such as the username given already exists, or no buttons
    //were selected, etc.
    state = {
        email: "",
        password: "",
        buttonSelected: "",
        warningMessage: "",
        isLoading: false
    }

    //This method signs up the user & creates an account for them based on what they chose and their
    //username
    async signUp() {
        //fetches the entered email and password
        let { email, password, buttonSelected } = this.state;
        email = email.trim();
        password = password.trim();

        //If no username was entered, or all empty spaces, then an error message will pop up
        if (email.trim().length === 0 || password.trim().length === 0) {
            this.setState({ inputText: "", warningMessage: strings.PleaseFillOutAllFields });

            //If no button was selected a different error message would appear
        } else if (buttonSelected === "") {
            this.setState({ warningMessage: strings.NoButtonSelected });
        } else if (!email.includes("@")) {
            this.setState({ warningMessage: strings.PleaseEnterAValidEmail });
        } else if (password.length < 6) {
            this.setState({ warningMessage: strings.ShortPassword });
        } else {

            this.setState({ isLoading: true });
            //If the accout already exists, then an error will appear
            //If the account is new, then it will go through the normal process to create
            //the account
            try {
                const array = await firebase.auth().fetchSignInMethodsForEmail(email);
                if (array.length > 0) {
                    this.setState({ warningMessage: strings.EmailExists });
                    this.setState({ isLoading: false });
                } else {
                    if (buttonSelected === "Customer") {
                        //If this is a customer, then the account will be created here and
                        //along with the new requester being added to the database then
                        //the screen will shift to the new account's screen
                        const account = await firebase.auth().createUserWithEmailAndPassword(email, password);
                        const requester = await FirebaseFunctions.addRequesterToDatabase(account, email);
                        await firebase.auth().signInWithEmailAndPassword(email, password);
                        const allProducts = await FirebaseFunctions.getAllProducts();
                        this.setState({ isLoading: false });
                        this.props.navigation.push('RequesterScreens', {
                            requester,
                            allProducts
                        });

                    } else {
                        //If this is a business account, then it will navigate to the create provider
                        //profile screen to finish creating the account there
                        this.setState({ isLoading: false });
                        this.props.navigation.push("CreateProviderProfileScreen", {
                            email,
                            password
                        });
                    }
                }
            } catch (error) {
                this.setState({ warningMessage: strings.SomethingWentWrong, isLoading: false });
                FirebaseFunctions.reportIssue("App Error", error.message);
            }
        }
    }

    render() {
        return (
            //View that dismisses the keyboard when clicked anywhere else
            <KeyboardAvoidingView style={screenStyle.container} enabled behavior="padding">
                <SafeAreaView>
                    <View>
                        <View style={{ flex: 1.2, justifyContent: 'center', alignSelf: 'center' }}>
                            <View>
                                <Text style={fontStyles.mainTextStyleBlack}>{strings.Email}</Text>
                            </View>

                            <View>
                                <OneLineTextInput
                                    placeholder={strings.EnterAnEmail}
                                    onChangeText={(input) => this.setState({ email: input })}
                                    value={this.state.email}
                                    password={false}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1.2, justifyContent: 'center', alignSelf: 'center' }}>
                            <View>
                                <Text style={fontStyles.mainTextStyleBlack}>{strings.Password}</Text>
                            </View>

                            <View>
                                <OneLineTextInput
                                    placeholder={strings.ChooseAPassword}
                                    onChangeText={(input) => this.setState({ password: input })}
                                    value={this.state.password}
                                    password={true}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                            <View>
                                <Text style={fontStyles.mainTextStyleBlack}>
                                    {strings.AccountType}</Text>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            width: Dimensions.get('window').width,
                            justifyContent: 'space-evenly',
                            flex: 1,
                            justifyContent: 'center',
                            alignSelf: 'center'
                        }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <RoundBlueButton
                                    title={strings.Business}
                                    //Tests if this button is selected, if it is, then the border color will
                                    //be blue
                                    style={[roundBlueButtonStyle.AccountTypeButton, {
                                        borderColor: this.state.buttonSelected === "Business" ?
                                            colors.lightBlue : colors.white
                                    }]}
                                    textStyle={fontStyles.mainTextStyleBlue}
                                    //Method selects the business button and deselects the other
                                    onPress={() => { this.setState({ buttonSelected: "Business" }) }} />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <RoundBlueButton
                                    title={strings.Customer}
                                    //Tests if this button is selected, if it is, then the border color will
                                    //be blue
                                    style={[roundBlueButtonStyle.AccountTypeButton, {
                                        borderColor: this.state.buttonSelected === "Customer" ?
                                            colors.lightBlue : colors.white
                                    }]}
                                    textStyle={fontStyles.mainTextStyleBlue}
                                    //Method selects the customer button and deselects the other
                                    onPress={() => { this.setState({ buttonSelected: "Customer" }) }} />
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                {
                                    this.state.warningMessage !== strings.EmailExists ? (
                                        <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                                    ) : (
                                            <View>
                                                <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage.substring(0, this.state.warningMessage.indexOf(".") + 1)}</Text>
                                                <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage.substring(this.state.warningMessage.indexOf(".") + 2)}</Text>
                                            </View>
                                        )
                                }

                            </View>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <RoundBlueButton
                                    title={strings.SignUp}
                                    style={roundBlueButtonStyle.MediumSizeButton}
                                    textStyle={fontStyles.bigTextStyleWhite}
                                    onPress={() => { this.signUp() }}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <LoadingSpinner isVisible={this.state.isLoading} />
                            </View>
                        </View>
                        <View style={{ flex: 1.6 }}></View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
};

//Exports the screen
export default signUpScreen;
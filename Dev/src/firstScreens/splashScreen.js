//This class is what appears when the app is first launched. The big blue "Get Started" button 
//will lead the requester pages, while the text underneath will direct the user to the working
//section of the application
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle'

class splashScreen extends Component {


    state = {
        isLoading: true,
        isErrorVisible: false,
        isUserLoggedIn: "",
        internetConnection: true
    }

    //This function will call when the component is mounted to test if a user is currently logged in
    //or not
    async componentDidMount() {
        const isConnected = await NetInfo.fetch();
        if (isConnected.isConnected && isConnected.isInternetReachable) {
            await this.isUserLoggedIn();
        } else {
            this.setState({ internetConnection: false });
        }
    }

    //If no user is logged in, the function will return false. If there is one logged in, it will return the
    //right data to navigate to the correct screen
    async isUserLoggedIn() {
        try {
            let alreadyCalled = false;
            firebase.auth().onAuthStateChanged(async (user) => {
                if (alreadyCalled === false) {
                    alreadyCalled = true;
                    if (user) {
                        const { uid } = user;
                        //Starts with searching if this is a requester since that is more common
                        const requester = await FirebaseFunctions.getRequesterByID(uid);
                        if (requester === -1) {
                            //This means this account is a provider since a requester with this ID was not found
                            this.props.navigation.push('ProviderScreens', {
                                providerID: uid
                            });
                        } else {
                            const allProducts = await FirebaseFunctions.getAllProducts();
                            //If this is a requester, then it will navigate to the screens & pass in the
                            //correct params
                            this.props.navigation.push('RequesterScreens', {
                                requester: requester,
                                allProducts
                            });
                        }
                    } else {
                        this.setState({ isUserLoggedIn: false, isLoading: false });
                    }
                }
            });
        } catch (error) {
            this.setState({ isLoading: false, isErrorVisible: true });
            FirebaseFunctions.logIssue(error);
        }
        return 0;
    }

    render() {
        const { isLoading, isUserLoggedIn, isErrorVisible, internetConnection } = this.state;
        if (isLoading === true) {
            return (
                <HelpView style={screenStyle.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LoadingSpinner isVisible={isLoading} />
                    </View>
                    <ErrorAlert
                        isVisible={isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                        title={strings.Whoops}
                        message={strings.SomethingWentWrong}
                    />
                    <ErrorAlert
                        isVisible={!internetConnection}
                        onPress={() => { this.forceUpdate() }}
                        title={strings.Whoops}
                        message={strings.NoConnection}
                    />
                </HelpView>
            );
        } else if (isUserLoggedIn === false) {
            return (
                <HelpView style={screenStyle.container}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={fontStyles.bigTitleStyleBlue}>{strings.HelpExclamation}</Text>
                    </View>
                    <View style={{ flex: 0.75 }}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <RoundBlueButton
                                title={strings.GetStarted}
                                style={roundBlueButtonStyle.MediumSizeButton}
                                textStyle={fontStyles.bigTextStyleWhite}
                                onPress={() => {
                                    this.props.navigation.push('SignUpScreen');
                                }} />
                        </View>
                        <View style={{ flex: 0.000001 }}></View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                            <Text style={fontStyles.mainTextStyleBlack}>{strings.HaveAnAccountQuestion}</Text>
                            <Text style={fontStyles.mainTextStyleBlue}> </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('LogInScreen')
                                }}>
                                <Text style={fontStyles.mainTextStyleBlue}>{strings.LogIn}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ErrorAlert
                        isVisible={isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                        title={strings.Whoops}
                        message={strings.SomethingWentWrong}
                    />
                </HelpView>
            );
        } else {
            return (
                <HelpView style={screenStyle.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LoadingSpinner isVisible={true} />
                    </View>
                    <ErrorAlert
                        isVisible={isErrorVisible}
                        onPress={() => { this.setState({ isErrorVisible: false }) }}
                        title={strings.Whoops}
                        message={strings.SomethingWentWrong}
                    />
                </HelpView>
            );
        }

    };
};

export default splashScreen;
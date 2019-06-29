//This class is what appears when the app is first launched. The big blue "Get Started" button 
//will lead the requester pages, while the text underneath will direct the user to the working
//section of the application
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import LoadingSpinner from '../components/LoadingSpinner';


class splashScreen extends Component {


    state = {
        isLoading: true,
        isUserLoggedIn: ""
    }

    //This function will call when the component is mounted to test if a user is currently logged in
    //or not
    async componentDidMount() {
        await this.isUserLoggedIn();
    }

    //If no user is logged in, the function will return false. If there is one logged in, it will return the
    //right data to navigate to the correct screen
    async isUserLoggedIn() {
        await firebase.auth().onAuthStateChanged(async (user) => {
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
        });
        return 0;
    }

    render() {
        const { isLoading, isUserLoggedIn } = this.state;
        console.log(isUserLoggedIn);
        if (isLoading === true) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LoadingSpinner isVisible={true} />
                    </View>
                </SafeAreaView>
            );
        } else if (isUserLoggedIn === false) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={fontStyles.bigTitleStyleBlue}>{strings.HelpExclamation}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <RoundBlueButton
                            title={strings.GetStarted}
                            style={roundBlueButtonStyle.MainScreenButton}
                            textStyle={fontStyles.bigTextStyleWhite}
                            onPress={() => {
                                this.props.navigation.push('SignUpScreen');
                            }} />
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={fontStyles.subTextStyleBlack}>{strings.HaveAnAccountQuestion}</Text>
                            <Text style={fontStyles.subTextStyleBlack}> </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.push('LogInScreen')
                                }}>
                                <Text style={fontStyles.subTextStyleBlue}>{strings.LogIn}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LoadingSpinner isVisible={true} />
                    </View>
                </SafeAreaView>
            );
        }

    };
};

export default splashScreen;
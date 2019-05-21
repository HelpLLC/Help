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
import Functions from 'config/Functions';
import firebase from '../../Firebase';


class splashScreen extends Component {

    constructor() {
        super();
        this.state = {
            requester: "",
            isLoading: false
        }
    }

    componentDidMount() {
        
        /*
        Functions.getProviderByID("1").then((result) => {
            this.setState({
                requester: result,
                isLoading: false
            })
        }); 
        */

    }

    render() {
        if (this.state.isLoading === false) {
            return (
                <SafeAreaView style={screenStyle.container}>
                    <View style={{ paddingTop: 95, paddingBottom: 130 }}>
                        <Text style={fontStyles.bigTitleStyleBlue}>{strings.HelpExclamation}</Text>
                    </View>
                    <RoundBlueButton
                        title={strings.GetStarted}
                        style={roundBlueButtonStyle.MainScreenButton}
                        textStyle={fontStyles.bigTextStyleWhite}
                        onPress={() => {
                            this.props.navigation.push('SignUpScreen');
                        }} />
                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                        <Text style={fontStyles.subTextStyleBlack}>{strings.HaveAnAccountQuestion}</Text>
                        <Text style={fontStyles.subTextStyleBlack}> </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('LogInScreen')
                                console.log(this.state)
                            }}>
                            <Text style={fontStyles.subTextStyleBlue}>{strings.LogIn}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        } else {
            return (
                <View></View>
            )
        }
    };
};

export default splashScreen;
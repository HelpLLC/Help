//This screen will allow the user to edit his/her company profile... which includes the name of
//of the business and the description
import React, { Component } from 'react';
import { View, Text, Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import TopBanner from '../../components/TopBanner';
import OneLineTextInput from '../../components/OneLineTextInput';
import fontStyles from 'config/styles/fontStyles';
import RoundTextInput from '../../components/RoundTextInput';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import LoadingSpinner from '../../components/LoadingSpinner';
import strings from 'config/strings';

class editCompanyProfileScreen extends Component {

    //The state containing what the user has typed into each input
    state = {
        businessName: this.props.navigation.state.params.provider.companyName,
        businessInfo: this.props.navigation.state.params.provider.companyDescription,
        warningMessage: "",
        isLoading: false
    }

    //Saves the edited company profile to the redux persist state
    saveCompanyInfo() {

        //retrieves what was entered along with the current provider
        const { provider, providerID } = this.props.navigation.state.params;
        const newBusinessName = this.state.businessName;
        const newBusinessInfo = this.state.businessInfo;

        //If either of the two inputs is empty, an error message will be displayed
        if (newBusinessName === "") {
            this.setState({ warningMessage: strings.PleaseEnterACompanyName });
        } else if (newBusinessInfo === "") {
            this.setState({ warningMessage: strings.PleaseEnterADescription });

            //This next statement checks if any information has been changed, if not, then it will
            //not update any information to save memory & simply return the previous screen
        } else if (provider.companyName === newBusinessName &&
            provider.companyDescription === newBusinessInfo) {

            this.props.navigation.goBack();
        } else {

            //Calls the firebase function to update the provider's information
            this.setState({ isLoading: true });
            FirebaseFunctions.updateProviderInfo(providerID, newBusinessName, newBusinessInfo).then(() => {
                //Navigates back to the business screen
                this.setState({ isLoading: false });
                this.props.navigation.goBack();
            });
        }
    }

    //Renders main UI
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={screenStyle.container}>
                    <View>
                        <TopBanner
                            title={strings.EditCompany}
                            leftIconName="angle-left"
                            leftOnPress={() => this.props.navigation.goBack()} />
                    </View>
                    <View style={{ flex: 0.025 }}></View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View>
                            <View style={{}}>
                                <Text style={fontStyles.mainTextStyleBlack}>
                                    {strings.EditName}</Text>
                            </View>

                            <View style={{}}>
                                <OneLineTextInput
                                    onChangeText={(input) => this.setState({ businessName: input })}
                                    value={this.state.businessName}
                                    maxLength={18}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ flex: 0.5, justifyContent: 'center' }}>
                                <Text style={fontStyles.mainTextStyleBlack}>
                                    {strings.EditDescription}</Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                                <RoundTextInput
                                    width={275}
                                    height={100}
                                    onChangeText={(input) => this.setState({ businessInfo: input })}
                                    value={this.state.businessInfo} />
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <RoundBlueButton
                                    title={strings.Done}
                                    style={roundBlueButtonStyle.MediumSizeButton}
                                    textStyle={fontStyles.bigTextStyleWhite}
                                    onPress={() => { this.saveCompanyInfo() }}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <LoadingSpinner isVisible={this.state.isLoading} />
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 0.025 }}></View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    }
}

//Exports the screen
export default editCompanyProfileScreen;
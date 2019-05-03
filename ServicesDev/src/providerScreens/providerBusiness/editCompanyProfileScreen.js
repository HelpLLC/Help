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
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import { editCompanyProfile } from '../../redux/provider/providerActions/editCompanyProfile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class editCompanyProfileScreen extends Component {

    //The state containing what the user has typed into each input
    state = {
        businessName: this.props.provider.companyName,
        businessInfo: this.props.provider.companyDescription,
        warningMessage: ""
    }

    //Saves the edited company profile to the redux persist state
    saveCompanyInfo() {

        //retrieves what was entered along with the current provider
        const { provider } = this.props;
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

            //Creates the object with the new information about the company
            let newCompanyInfoObject = {
                newBusinessName: newBusinessName,
                newBusinessInfo: newBusinessInfo
            };

            //Updates the redux state by calling the action and passing in the current user's index
            //as well as the new company info object
            let { userIndex } = this.props.navigation.state.params; 
            this.props.editCompanyProfile(userIndex, newCompanyInfoObject);

            //Navigates back to the business screen
            this.props.navigation.goBack();
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

                    <View style={{ paddingTop: 55, paddingRight: 160, paddingLeft: 10, }}>
                        <Text style={fontStyles.mainTextStyleBlack}>
                            {strings.EditName}</Text>
                    </View>

                    <View style={{ paddingTop: 20, paddingRight: 10, paddingLeft: 10 }}>
                        <OneLineTextInput
                            onChangeText={(input) => this.setState({ businessName: input })}
                            value={this.state.businessName}
                            maxLength={18}
                        />
                    </View>

                    <View style={{ paddingTop: 30, paddingRight: 105, paddingLeft: 10 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>
                            {strings.EditDescription}</Text>
                    </View>

                    <View style={{ padding: 20 }}>
                        <RoundTextInput
                            width={275}
                            height={100}
                            onChangeText={(input) => this.setState({ businessInfo: input })}
                            value={this.state.businessInfo} />
                    </View>

                    <View style={{ paddingTop: 20 }}>
                        <RoundBlueButton
                            title={strings.Done}
                            style={roundBlueButtonStyle.MediumSizeButton}
                            textStyle={fontStyles.bigTextStyleWhite}
                            onPress={() => {this.saveCompanyInfo()}}
                        />
                    </View>

                    <View style={{ padding: 20 }}>
                        <Text style={fontStyles.subTextStyleRed}>{this.state.warningMessage}</Text>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    }
}

//Connects this screens' props with the current user of the app
const mapStateToProps = (state, props) => {
    const provider = state.providerReducer.accounts[props.navigation.state.params.userIndex];
    return { provider };
};

//Connects the screen with the actions that will interact with the database.
//this action will edit the provider's company information
export const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            editCompanyProfile,
        },
        dispatch
    );

//connects the screen with the redux persist state
export default connect(mapStateToProps, mapDispatchToProps)(editCompanyProfileScreen);
import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import HelpView from '../../components/HelpView';
import TopBanner from '../../components/TopBanner';
import strings from '../../../config/strings';
import fontStyles from '../../../config/styles/fontStyles';
import RoundBlueButton from '../../components/RoundBlueButton';
import colors from '../../../config/colors';
import roundBlueButtonStyle from '../../../config/styles/componentStyles/roundBlueButtonStyle';
import BussinessQuestions from '../../components/BusinessQuestions';
import FirebaseFunctions from '../../../config/FirebaseFunctions'

class QuestionsScreen extends Component {

    state = {
        isScreenLoading: true,
        questions: []
    }

    async componentDidMount() {

        FirebaseFunctions.setCurrentScreen('ProviderQuestionsScreen', 'ProviderQuestionsScreen');
        const { productID, providerID } = this.props.navigation.state.params;
        this.setState({
            productID, providerID
        })
        const product = await FirebaseFunctions.getServiceByID(productID);

        let questions = product.questions;
        if (product.questions === undefined) {
            questions = [];
        }

        this.setState({
            questions,
            productID,
            product,
            providerID
        })

    }

    async saveQuestions() {

        const { questions, productID, providerID } = this.state;

        FirebaseFunctions.updateServiceByID(productID, {
            questions: questions
        })

        this.props.navigation.push('ProviderScreens', {
            providerID
          });

    }



    render() {
        const { questions } = this.state;
        return (
            <HelpView>
                <TopBanner
                    title={strings.CustomerInfo}
                    leftIconName='angle-left'
                    leftOnPress={() => this.props.navigation.goBack()}
                />
                <View>
                    <View style={{ justifyContent: 'flex-start', marginLeft: Dimensions.get('window').width * .01, marginTop: Dimensions.get('window').height * .02 }}>
                        <Text style={fontStyles.subTextStyleBlack}>What info do you need from the customer?</Text>
                    </View>
                    <View style={{ marginTop: Dimensions.get('window').height * .01 }}>
                        <ScrollView horizontal={true} >
                            <View style={{ flex: 1, alignItems: 'center', marginLeft: Dimensions.get('window').width * .01 }}>
                                <RoundBlueButton
                                    title={strings.Address}
                                    //Tests if this button is selected, if it is, then the border color will
                                    //be blue
                                    style={[
                                        roundBlueButtonStyle.AccountTypeButton,
                                        {
                                            borderColor:
                                                this.state.isAddressSelected === true ? colors.lightBlue : colors.gray
                                        }
                                    ]}
                                    textStyle={fontStyles.mainTextStyleBlue}
                                    //Method selects the business button and deselects the other
                                    onPress={() => {
                                        this.setState({ isAddressSelected: true });
                                    }}
                                    disabled={this.state.isLoading}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', marginLeft: Dimensions.get('window').width * .01 }}>
                                <RoundBlueButton
                                    title={strings.PhoneNumber}
                                    //Tests if this button is selected, if it is, then the border color will
                                    //be blue
                                    style={[
                                        roundBlueButtonStyle.AccountTypeButton,
                                        {
                                            borderColor:
                                                this.state.isPhoneNumberSelected === true ? colors.lightBlue : colors.gray
                                        }
                                    ]}
                                    textStyle={fontStyles.mainTextStyleBlue}
                                    onPress={() => {
                                        if (this.state.isPhoneNumberSelected === true) {
                                            this.setState({ isPhoneNumberSelected: false })
                                        } else {
                                            this.setState({ isPhoneNumberSelected: true });
                                        }
                                    }}
                                    disabled={this.state.isLoading}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', marginLeft: Dimensions.get('window').width * .01, marginRight: Dimensions.get('window').width * .01 }}>
                                <RoundBlueButton
                                    title={strings.Email}
                                    //Tests if this button is selected, if it is, then the border color will
                                    //be blue
                                    style={[
                                        roundBlueButtonStyle.AccountTypeButton,
                                        {
                                            borderColor:
                                                this.state.isEmailSelected === true ? colors.lightBlue : colors.gray
                                        }
                                    ]}
                                    textStyle={fontStyles.mainTextStyleBlue}
                                    //Method selects the business button and deselects the other
                                    onPress={() => {
                                        if (this.state.isEmailSelected === true) {
                                            this.setState({ isEmailSelected: false })
                                        } else {
                                            this.setState({ isEmailSelected: true });
                                        }
                                    }}
                                    disabled={this.state.isLoading}
                                />
                            </View>
                        </ScrollView>
                        <View style={{ marginTop: Dimensions.get('window').height * .02, borderTopColor: colors.mainTextSyleBlack, borderTopWidth: 2 }}>
                            <View style={{ marginTop: Dimensions.get('window').height * .01, marginLeft: Dimensions.get('window').height * .01 }}>
                                <Text style={fontStyles.subTextStyleBlack}>Add custom questions for the customer.</Text>
                            </View>
                            <ScrollView style={{height :Dimensions.get('window').height * .5}}>
                                <View>
                                    <BussinessQuestions questions={this.state.questions}
                                        onChangeQuestions={(questions) => {
                                            this.setState({
                                                questions: questions
                                            })
                                        }} />
                                </View>
                                <View style={{ marginTop: Dimensions.get('window').height * .02, justifyContent: 'center', alignItems: 'center', marginLeft: Dimensions.get('window').width * .3 }}>
                                    <TouchableOpacity onPress={() => {
                                        questions.push('');
                                        this.setState({
                                            questions
                                        })
                                    }}>
                                        <Text style={fontStyles.mainTextStyleBlue}>Add Question</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignContent: 'flex-end', marginTop: Dimensions.get('window').height * .03 }}>
                        <RoundBlueButton
                            title={strings.Done}
                            style={roundBlueButtonStyle.MediumSizeButton}
                            textStyle={fontStyles.bigTextStyleWhite}
                            onPress={async () => {
                                await this.saveQuestions();
                            }}
                            disabled={this.state.isLoading}
                        />
                    </View>

                </View>

            </HelpView>
        )
    }
}


export default QuestionsScreen;
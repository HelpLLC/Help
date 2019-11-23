import React, { Component } from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner';
import strings from '../../config/strings';
import CustomerQuestions from '../components/customerQuestions'
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from '../../config/styles/componentStyles/roundBlueButtonStyle';
import fontStyles from '../../config/styles/fontStyles'
import { ScrollView } from 'react-native-gesture-handler';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput'

class CustomerQuestionsScreen extends Component {

    state = {
        isLoading: false,
        answers: []
    }

    async componentDidMount() {
        const { product, requester } = this.props.navigation.state.params;
        this.setState({
            product,
            requester
        })

    }

    saveAnswers() {
        const answers = this.state.answers;
    }

    render() {
        const { product } = this.props.navigation.state.params;
        const answers = [];
        const questions = product.questions;

        return (
            <HelpView>
                <TopBanner
                    title={"Customer Info"}
                    leftIconName='angle-left'
                    leftOnPress={() => this.props.navigation.goBack()}
                />
                <View style={{ height: Dimensions.get('window').height * .7 }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={questions}
                        numColumns={1}
                        keyExtractor={item => item.categoryName}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <View key={index}>
                                <View style={{ marginLeft: Dimensions.get('window').width * .03, marginTop: Dimensions.get('window').height * .01 }}>
                                    <Text style={fontStyles.mainTextStyleBlack}>{questions[index]}</Text>
                                </View>
                                <View style={{ marginLeft: Dimensions.get('window').width * .02, marginTop: Dimensions.get('window').height * .01 }}>
                                    <MultiLineRoundedBoxInput
                                        width={Dimensions.get('window').width * 0.8}
                                        height={Dimensions.get('window').height * 0.08}
                                        placeholder={'Please answer the question here'}
                                        onChangeText={(input) => {
                                            answers[index] = input;
                                            this.setState({
                                                answers
                                            });
                                        }}
                                        value={answers[i]}
                                        maxLength={350}
                                    />

                                </View>
                            </View>
                        )}
                    />
                </View>
                <RoundBlueButton
                    title={strings.Request}
                    style={roundBlueButtonStyle.MediumSizeButton}
                    textStyle={fontStyles.bigTextStyleWhite}
                    onPress={() => {
                        this.saveAnswers();
                    }}
                />
            </HelpView>
        )
    }
}

export default CustomerQuestionsScreen;
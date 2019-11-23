import React, { Component } from "react"
import { View, Text, Dimensions, } from 'react-native';
import fontStyles from "../../config/styles/fontStyles";
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';

class CustomerQuestions extends Component {




    render() {
        const questionsList = [];
        const { product } = this.props;
        const questions = product.questions;

        const {answers} = [];

        for (let i = 0; i < questions.length; i++) {

            questionsList.push(
                <View key={i}>
                    <View style={{ marginLeft: Dimensions.get('window').width * .03, marginTop: Dimensions.get('window').height * .01 }}>
                        <Text style={fontStyles.mainTextStyleBlack}>{questions[i]}</Text>
                    </View>
                    <View style={{ marginLeft: Dimensions.get('window').width * .02, marginTop: Dimensions.get('window').height * .01 }}>
                        <MultiLineRoundedBoxInput
                            width={Dimensions.get('window').width * 0.8}
                            height={Dimensions.get('window').height * 0.08}
                            placeholder={'Please answer the question here'}
                            onChangeText={(input) => {
                                answers[i] = input;
                                this.props.onGetAnswer(answers);
                            }}
                            value={answers[i]}
                            maxLength={350}
                        />

                    </View>
                </View>
            )
        }

        return (
            <View>
                {questionsList}
            </View>
        )
    }
}

export default CustomerQuestions;
import React, { Component } from "react"
import { View, Text, Dimensions } from 'react-native';
import fontStyles from "../../config/styles/fontStyles";
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';

class CustomerQuestions extends Component {



    render() {
        const questionsList = [];
        const answers = [];
        const {product} = this.props;
        const questions = product.questions;

        for(let i = 0; i < questions.length; i++){
            questionsList.push(
                <View>
                    <Text style={fontStyles.mainTextStyleBlack}>{questions[i]}</Text>
                    <MultiLineRoundedBoxInput
							width={Dimensions.get('window').width * 0.6}
							height={Dimensions.get('window').height * 0.1}
							placeholder={'Please Answer the question here'}
							onChangeText={(input) => onChangeText(input)}
							value={}
							maxLength={350}
						/>
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
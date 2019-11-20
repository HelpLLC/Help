import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import fontStyles from '../../config/styles/fontStyles';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput'
import { Icon } from 'react-native-elements';
import colors from '../../config/colors';


class BusinessQuestions extends Component {
    render() {
        const { questions } = this.props;
        const rowOfQuestions = [];

        for (let i = 0; i < questions.length; i++) {
            rowOfQuestions.push(

                <View key={i} style={{ marginLeft: Dimensions.get('window').width * .03 }}>
                    <View style={{ marginTop: Dimensions.get('window').height * .02 }}>
                        <Text style={fontStyles.subTextStyleBlack}> {"Question " + (i + 1)} </Text>
                    </View>
                    <View style={{ marginTop: Dimensions.get('window').height * .01, flexDirection: 'row' }}>
                        <OneLineRoundedBoxInput
                            placeholder={"Example: Any special instructions you want to give me..."}
                            onChangeText={(input) => {
                                questions[i] = input;
                                this.props.onChangeQuestions(questions);
                            }}
                            value={questions[i]}
                            password={false}
                            maxLength={50}
                            width={Dimensions.get('window').width * .8}

                        />
                        <View style={{marginLeft: Dimensions.get('window').width * .05, marginTop: Dimensions.get('window').height * .01}}>
                            <Icon
                                width={40}
                                height={60}
                                name='delete'
                                color={colors.red}
                                onPress={() => {
                                    questions.splice(i, 1);
                                    this.props.onChangeQuestions(questions);
                                }}
                            />
                        </View>

                    </View>

                </View>
            )

        }

        return (
            <View>
                {rowOfQuestions}

            </View>

        )


    }
}

BusinessQuestions.propTypes = {
    questions: PropTypes.array.isRequired
};

export default BusinessQuestions;
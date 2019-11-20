import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import fontStyles from '../../config/styles/fontStyles';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';
import { Icon } from 'react-native-elements';
import strings from 'config/strings';
import colors from '../../config/colors';

class BusinessQuestions extends Component {
	render() {
		const { questions } = this.props;
		const rowOfQuestions = [];

		for (let i = 0; i < questions.length; i++) {
			rowOfQuestions.push(
				<View key={i} style={{ marginLeft: Dimensions.get('window').width * 0.03 }}>
					<View style={{ marginTop: Dimensions.get('window').height * 0.02 }}>
						<Text style={fontStyles.subTextStyleBlack}> {strings.Question + ' ' + (i + 1)} </Text>
					</View>
					<View
						style={{
							marginTop: Dimensions.get('window').height * 0.01,
							flexDirection: 'row',
							justifyContent: 'space-evenly'
						}}>
						<MultiLineRoundedBoxInput
							width={Dimensions.get('window').width * 0.8}
							height={Dimensions.get('window').height * 0.075}
							placeholder={strings.AskQuestionsForCustomers}
							onChangeText={(input) => {
								questions[i] = input;
								this.props.onChangeQuestions(questions);
							}}
							value={questions[i]}
							maxLength={300}
						/>
						<TouchableOpacity
							onPress={() => {
								questions.splice(i, 1);
								this.props.onChangeQuestions(questions);
							}}
							style={{
								width: Dimensions.get('window').width * 0.1,
								height: Dimensions.get('window').width * 0.1,
								borderRadius: Dimensions.get('window').width * 0.5,
								marginLeft: Dimensions.get('window').width * 0.02,
								backgroundColor: colors.red,
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'center'
							}}>
							<Icon
								style={{
									width: Dimensions.get('window').width * 0.1,
									height: Dimensions.get('window').width * 0.1
								}}
								name='delete'
								color={colors.white}
							/>
						</TouchableOpacity>
					</View>
				</View>
			);
		}

		return <View>{rowOfQuestions}</View>;
	}
}

//The only prop for this component is an array of the questions that are currently being rendered
BusinessQuestions.propTypes = {
	questions: PropTypes.array.isRequired
};

//Exports the module
export default BusinessQuestions;

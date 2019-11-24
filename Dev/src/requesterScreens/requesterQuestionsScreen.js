//this screen will represent the screen where requesters answer the questions which have been determined by the business
import React, { Component } from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner';
import strings from '../../config/strings';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from '../../config/styles/componentStyles/roundBlueButtonStyle';
import fontStyles from '../../config/styles/fontStyles';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';

class requesterQuestionsScreen extends Component {
	state = {
		product: '',
		requester: '',
		isLoading: false,
		answers: [],
		questions: []
	};

	//Sets the initial state with the questions and the array of empty answers
	async componentDidMount() {
		const { product, requester } = this.props.navigation.state.params;
		const { questions } = product;
		const answers = questions.map((element) => {
			return {
				question: element,
				answer: ""
			}
		});
		this.setState({
			questions,
			answers,
			product,
			requester
		});
	}

	render() {
		
		const { questions, answers } = this.state;

		return (
			<HelpView>
				<TopBanner
					title={strings.Request}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View style={{ height: Dimensions.get('window').height * 0.7 }}>
					<FlatList
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						data={questions}
						numColumns={1}
						keyExtractor={(item) => item}
						showsVerticalScrollIndicator={false}
						renderItem={({ item, index }) => (
							<View style={{
								marginLeft: Dimensions.get('window').width * 0.1,
								marginTop: Dimensions.get('window').height * 0.05,
								alignItems: 'flex-start',
								flexDirection: 'column'
							}}>
								<View style={{
									marginBottom: Dimensions.get('window').height * 0.025,
								}}>
									<Text style={fontStyles.mainTextStyleBlack}>{item}</Text>
								</View>
								<View>
									<MultiLineRoundedBoxInput
										width={Dimensions.get('window').width * 0.8}
										height={Dimensions.get('window').height * 0.08}
										placeholder={strings.AnswerHereDotDotDot}
										onChangeText={(input) => {
											answers[index] = {
												question: item,
												answer: input
											};
											this.setState({
												answers,
												[item]: input
											});
										}}
										value={this.state[item]}
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
						//Passes the correct parameters to the scheduling screen

					}}
				/>
			</HelpView>
		);
	}
}

export default requesterQuestionsScreen;

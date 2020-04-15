//this screen will represent the screen where customers answer the questions which have been determined by the business
import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner';
import strings from '../../config/strings';
import HelpButton from '../components/HelpButton';
import helpButtonStyles from '../../config/styles/helpButtonStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from '../../config/styles/fontStyles';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';
import HelpAlert from '../components/HelpAlert';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from '../../config/styles/screenStyle';

class serviceQuestionsScreen extends Component {
	state = {
		service: '',
		customer: '',
		isLoading: false,
		answers: [],
		isScreenLoading: true,
		questions: [],
		isFillOutAllFieldsVisible: false,
		isErrorVisible: false,
		isRequestSucess: false
	};

	//Sets the initial state with the questions and the array of empty answers
	async componentDidMount() {
		const { service, customer, isEditing } = this.props.navigation.state.params;
		let { questions } = service;
		let answers = [];
		//If this screen is to edit a previous request, then the answer that was previously put down will be set
		if (isEditing === true) {
			const { request } = this.props.navigation.state.params;
			FirebaseFunctions.setCurrentScreen('EditServiceQuestionsScreen', 'serviceQuestionsScreen');
			answers = request.questions;
		} else {
			FirebaseFunctions.setCurrentScreen('NewServiceQuestionsScreen', 'serviceQuestionsScreen');
			answers = questions.map((element) => {
				return {
					question: element,
					answer: ''
				};
			});
		}
		this.setState({
			isScreenLoading: false,
			isEditing,
			questions,
			answers,
			service,
			customer
		});
	}

	//This function will double check that all answers have been answered. If they have, then the app will pass
	//the answers the next step of requesting the service, which is scheduling. If they haven't a pop up will
	//appear telling them to.
	goToSchedulingScreen() {
		const { answers, service, customer, isEditing } = this.state;
		//Double checks they aren't empty strings
		for (const answer of answers) {
			if (!answer || answer.answer.trim() === '') {
				this.setState({ isFillOutAllFieldsVisible: true });
				return;
			}
		}

		//If the program has reached this stage of the clause, that means the request is good to go
		//Goes to the next step of the process which is scheduling. If it is editing an existing request,
		//then the request will also be passed
		this.props.navigation.push('BusinessScheduleScreen', {
			answers,
			service,
			customer,
			isEditing: isEditing,
			request: this.props.navigation.state.params.request
		});
	}

	//Renders the UI
	render() {
		const { questions, answers } = this.state;
		if (this.state.isScreenLoading === true) {
			return (
				<HelpView>
					<TopBanner
						title={strings.Request}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}
		return (
			<View style={screenStyle.container}>
				<TopBanner
					title={strings.Request}
					leftIconName='angle-left'
					leftOnPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<KeyboardAwareFlatList
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					data={questions}
					numColumns={1}
					keyExtractor={(item) => item}
					extraData={this.state}
					showsVerticalScrollIndicator={false}
					renderItem={({ item, index }) => (
						<View
							style={{
								marginTop: screenHeight * 0.05,
								alignItems: 'flex-start',
								flexDirection: 'column'
							}}>
							<View
								style={{
									marginBottom: screenHeight * 0.025
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>{item}</Text>
							</View>
							<View>
								<MultiLineRoundedBoxInput
									width={screenWidth * 0.8}
									height={screenHeight * 0.08}
									placeholder={strings.AnswerHereDotDotDot}
									onChangeText={(input) => {
										answers[index] = {
											question: item,
											answer: input
										};
										this.setState({
											answers
										});
									}}
									value={answers[index].answer}
									maxLength={350}
								/>
							</View>
						</View>
					)}
					ListFooterComponent={
						<View style={{ marginTop: screenHeight * 0.05, marginTop: screenHeight * 0.1 }}>
							<HelpButton
								title={strings.Next}
								style={helpButtonStyles.MediumSizeButton}
								textStyle={fontStyles.bigTextStyleWhite}
								isLoading={this.state.isLoading}
								onPress={() => {
									//Passes the correct parameters to the scheduling screen
									this.goToSchedulingScreen();
								}}
							/>
						</View>
					}
				/>
				<HelpAlert
					isVisible={this.state.isFillOutAllFieldsVisible}
					onPress={() => {
						this.setState({ isFillOutAllFieldsVisible: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseFillOutAllQuestions}
				/>
				<HelpAlert
					isVisible={this.state.isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
			</View>
		);
	}
}

export default serviceQuestionsScreen;

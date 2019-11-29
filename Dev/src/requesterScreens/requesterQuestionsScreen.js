//this screen will represent the screen where requesters answer the questions which have been determined by the business
import React, { Component } from 'react';
import { View, Text, Dimensions, FlatList, ScrollView } from 'react-native';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner';
import strings from '../../config/strings';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from '../../config/styles/componentStyles/roundBlueButtonStyle';
import fontStyles from '../../config/styles/fontStyles';
import MultiLineRoundedBoxInput from '../components/MultiLineRoundedBoxInput';
import HelpAlert from '../components/HelpAlert';
import OptionPicker from '../components/OptionPicker';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';

class requesterQuestionsScreen extends Component {
	state = {
		product: '',
		requester: '',
		isLoading: false,
		answers: [],
		isScreenLoading: true,
		questions: [],
		isFillOutAllFieldsVisible: false,
		isRequestVisible: false,
		isErrorVisible: false,
		isRequestSucess: false
	};

	//Sets the initial state with the questions and the array of empty answers
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('RequesterQuestionsScreen', 'requesterQuestionsScreen');
		const { product, requester } = this.props.navigation.state.params;
		let { questions } = product;
		//Adds the default questions to the array of qeustions if any are present
		let { defaultQuestions } = product;
		for (const defaultQuestion of defaultQuestions) {
			if (defaultQuestion.isSelected === true) {
				questions.push(defaultQuestion.question);
			}
		}
		const answers = questions.map((element) => {
			return {
				question: element,
				answer: ''
			};
		});
		this.setState({
			isScreenLoading: false,
			questions,
			answers,
			product,
			requester
		});
	}

	//This function will double check that all answers have been answered. If they have, then the app will pass
	//the answers the next step of requesting the product, which is scheduling. If they haven't a pop up will
	//appear telling them to.
	goToSchedulingScreen() {
		const { answers, product, requester } = this.state;
		//Double checks they aren't empty strings
		for (const answer of answers) {
			if (!answer || answer.answer.trim() === '') {
				this.setState({ isFillOutAllFieldsVisible: true });
				return;
			}
		}
		//If the program has reached this stage of the clause, that means the request is good to go
		//Goes to the next step of the process which is scheduling
		this.props.navigation.push('RequesterScheduleScreen', {
			answers,
			product,
			requester
		});
	}

	//Renders the UI
	render() {
		const { questions, answers, product } = this.state;
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
			<HelpView>
				<TopBanner
					title={strings.Request}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<FlatList
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
									marginLeft: Dimensions.get('window').width * 0.1,
									marginTop: Dimensions.get('window').height * 0.05,
									alignItems: 'flex-start',
									flexDirection: 'column'
								}}>
								<View
									style={{
										marginBottom: Dimensions.get('window').height * 0.025
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
												answers
											});
										}}
										value={answers[index].answer}
										maxLength={350}
									/>
								</View>
							</View>
						)}
					/>
					<View style={{ marginVertical: Dimensions.get('window').height * 0.05 }}>
						<RoundBlueButton
							title={product.schedule.scheduleType === 'Anytime' ? strings.Request : strings.Next}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							isLoading={this.state.isLoading}
							onPress={() => {
								//Passes the correct parameters to the scheduling screen
								this.goToSchedulingScreen();
							}}
						/>
					</View>
				</ScrollView>
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
				<HelpAlert
					isVisible={this.state.isRequestSucess}
					onPress={() => {
						this.setState({ isRequestSucess: false });
						this.props.navigation.push('FeaturedScreen', {
							requester: this.state.requester,
							allProducts: this.state.allProducts
						});
					}}
					title={strings.Success}
					message={strings.TheServiceHasBeenRequested}
				/>
				<OptionPicker
					isVisible={this.state.isRequestVisible}
					title={strings.RequestService}
					message={strings.AreYouSureRequestService}
					confirmText={strings.Request}
					cancelText={strings.Cancel}
					clickOutside={true}
					confirmOnPress={async () => {
						this.setState({
							isRequestVisible: false,
							isLoading: true
						});
						//This method will request this service from the company providing it by pushing the request to the
						//provider.
						//After confirming to the requester that the request has been processed, the program will
						//automatically send notification to the business
						const { product, requester } = this.state;
						try {
							await FirebaseFunctions.requestService({
								dateRequested: new Date().toLocaleDateString('en-US', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit'
								}),
								requesterID: requester.requesterID,
								serviceID: product.serviceID,
								requesterName: requester.username,
								answers: this.state.answers
							});
							//fetches all the products in preparation to go back to the featured screen
							const allProducts = await FirebaseFunctions.getAllProducts();
							this.setState({
								allProducts,
								isRequestVisible: false,
								isRequestSucess: true,
								isLoading: false
							});
						} catch (error) {
							this.setState({ isLoading: false, isRequestVisible: false, isErrorVisible: true });
							FirebaseFunctions.logIssue(error, {
								screen: 'RequesterQeustionsScreen',
								userID: 'r-' + requester.requesterID,
								productID: product.productID
							});
						}
					}}
					cancelOnPress={() => {
						this.setState({ isRequestVisible: false });
					}}
				/>
			</HelpView>
		);
	}
}

export default requesterQuestionsScreen;

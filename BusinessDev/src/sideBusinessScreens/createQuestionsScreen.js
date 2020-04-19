import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner/TopBanner';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import HelpButton from '../components/HelpButton/HelpButton';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';

import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpTextInput from '../components/HelpTextInput/HelpTextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon } from 'react-native-elements';
import HelpAlert from '../components/HelpAlert';
import screenStyle from '../../config/styles/screenStyle';

class createQuestionsScreen extends Component {
	state = {
		isScreenLoading: true,
		emptyQuestionError: false,
	};
	componentDidMount() {
		//If this product is being edited, then it is going to display the previously entered questions
		//Otherwise, an empty questions box will appear
		if (this.props.navigation.state.params.editing === true) {
			FirebaseFunctions.setCurrentScreen('EditQuestionsScreen', 'createQuestionsScreen');
			const {
				businessID,
				serviceTitle,
				serviceDescription,
				price,
				business,
				response,
				serviceID,
				service,
			} = this.props.navigation.state.params;

			const { questions } = service;
			//Structures the default questions and removes them from the questions array
			const defaultQuestions = [
				{
					name: strings.Email,
					isSelected: questions.includes(strings.WhatIsYourEmailAddressQuestion)
						? true
						: false,
					question: strings.WhatIsYourEmailAddressQuestion,
				},
				{
					name: strings.PhoneNumber,
					isSelected: questions.includes(strings.WhatIsYourPhoneNumberQuestion)
						? true
						: false,
					question: strings.WhatIsYourPhoneNumberQuestion,
				},
				{
					name: strings.Address,
					isSelected: questions.includes(strings.WhatIsYourAddressQuestion)
						? true
						: false,
					question: strings.WhatIsYourAddressQuestion,
				},
			];
			this.setState({
				//Removes the default questions from the array
				questions: questions.filter(
					(element) =>
						element !== strings.WhatIsYourAddressQuestion &&
						element !== strings.WhatIsYourPhoneNumberQuestion &&
						element !== strings.WhatIsYourEmailAddressQuestion
				),
				defaultQuestions,
				serviceID,
				businessID,
				service,
				editing: true,
				isScreenLoading: false,
				serviceTitle,
				serviceDescription,
				price,
				business,
				response,
			});
		} else {
			FirebaseFunctions.setCurrentScreen('CreateQuestionsScreen', 'createQuestionsScreen');
			const {
				businessID,
				serviceTitle,
				serviceDescription,
				price,
				response,
				business,
			} = this.props.navigation.state.params;
			this.setState({
				questions: [],
				business,
				defaultQuestions: [
					{
						name: strings.Email,
						isSelected: false,
						question: strings.WhatIsYourEmailAddressQuestion,
					},
					{
						name: strings.PhoneNumber,
						isSelected: false,
						question: strings.WhatIsYourPhoneNumberQuestion,
					},
					{
						name: strings.Address,
						isSelected: false,
						question: strings.WhatIsYourAddressQuestion,
					},
				],
				businessID,
				serviceTitle,
				editing: false,
				serviceDescription,
				price,
				response,
				isScreenLoading: false,
			});
		}
	}

	async goToAddtionalInfoScreen() {
		const {
			defaultQuestions,
			questions,
			businessID,
			serviceTitle,
			serviceDescription,
			price,
			response,
			business,
		} = this.state;

		//Checks if any questions are empty. If they are, pops up an alert
		for (const question of questions) {
			if (!question || question.trim() === '') {
				this.setState({ emptyQuestionError: true });
				return;
			}
		}

		//Converts the default questions into normal questions
		for (const question of defaultQuestions) {
			if (question.isSelected === true) {
				questions.push(question.question);
			}
		}

		//Passes the correct parameters to the next screen depending on whether the product is being edited, or being
		//created
		if (this.state.editing === true) {
			let { service, serviceID } = this.state;
			this.props.navigation.push('ServiceAdditionalInformationScreen', {
				businessID,
				service,
				serviceID,
				serviceTitle,
				serviceDescription,
				price,
				response,
				questions,
				business,
				editing: true,
			});
		} else {
			this.props.navigation.push('ServiceAdditionalInformationScreen', {
				businessID,
				serviceTitle,
				serviceDescription,
				price,
				response,
				questions,
				business,
			});
		}
	}

	render() {
		const { questions } = this.state;
		if (this.state.isScreenLoading === true) {
			return (
				<HelpView>
					<TopBanner
						title={strings.CustomerInfo}
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
					title={strings.CustomerInfo}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View style={{ marginTop: screenHeight * 0.01 }}>
					<KeyboardAwareFlatList
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						ListHeaderComponent={
							<View>
								<View
									style={{
										justifyContent: 'flex-start',
										alignItems: 'center',
										marginHorizontal: screenWidth * 0.025,
										marginVertical: screenHeight * 0.025,
									}}>
									<Text style={fontStyles.mainTextStyleBlack}>
										{strings.InfoFromCustomersQuestion}
									</Text>
								</View>
								<View
									style={{
										borderBottomColor: colors.lightBlue,
										width: screenWidth,
										alignSelf: 'center',
										borderBottomWidth: 1,
									}}>
									<View
										style={{
											marginVertical: screenHeight * 0.025,
											marginLeft: screenWidth * 0.025,
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>
											{strings.CustomQuestions}
										</Text>
									</View>
									<FlatList
										showsHorizontalScrollIndicator={false}
										showsVerticalScrollIndicator={false}
										data={this.state.defaultQuestions}
										extraData={this.state}
										horizontal={true}
										keyExtractor={(item) => item.name}
										showsVerticalScrollIndicator={false}
										renderItem={({ item, index }) => (
											<View
												style={{
													alignItems: 'center',
													marginHorizontal: screenWidth * 0.0125,
													marginBottom: screenHeight * 0.025,
												}}>
												<HelpButton
													title={item.name}
													width={screenWidth * 0.39}
													//Tests if this button is selected, if it is, then the border color will
													//be blue
													isLightButton={item.isSelected}
													//Method selects the business button and deselects the other
													onPress={() => {
														let { defaultQuestions } = this.state;
														defaultQuestions[
															index
														].isSelected = !defaultQuestions[index]
															.isSelected;
														if (
															defaultQuestions[index].isSelected ===
															true
														) {
															//Removes all spaces from the event
															const event = (
																'default_questions_' + item.name
															).replace(' ', '');
															FirebaseFunctions.analytics.logEvent(
																event
															);
														}
														this.setState({
															defaultQuestions,
														});
													}}
													disabled={this.state.isLoading}
												/>
											</View>
										)}
									/>
								</View>
							</View>
						}
						renderItem={({ item, index }) => (
							<View style={{ marginLeft: screenWidth * 0.03 }}>
								<View style={{ marginTop: screenHeight * 0.02 }}>
									<Text style={fontStyles.subTextStyleBlack}>
										{strings.Question + ' ' + (index + 1)}
									</Text>
								</View>
								<View
									style={{
										marginTop: screenHeight * 0.01,
										flexDirection: 'row',
										justifyContent: 'space-evenly',
									}}>
									<HelpTextInput
										width={screenWidth * 0.8}
										height={screenHeight * 0.075}
										placeholder={strings.AskQuestionsForCustomers}
										onChangeText={(input) => {
											questions[index] = input;
											this.setState({
												questions,
											});
										}}
										isMultiline={true}
										value={item}
										maxLength={300}
									/>
									<TouchableOpacity
										onPress={() => {
											questions.splice(index, 1);
											this.setState({
												questions,
											});
										}}
										style={{
											width: screenWidth * 0.1,
											height: screenWidth * 0.1,
											borderRadius: screenWidth * 0.5,
											marginLeft: screenWidth * 0.02,
											backgroundColor: colors.red,
											justifyContent: 'center',
											alignItems: 'center',
											alignSelf: 'center',
										}}>
										<Icon
											style={{
												width: screenWidth * 0.1,
												height: screenWidth * 0.1,
											}}
											name='delete'
											color={colors.white}
										/>
									</TouchableOpacity>
								</View>
							</View>
						)}
						ListFooterComponent={
							<View style={{ marginBottom: screenHeight * 0.2 }}>
								<TouchableOpacity
									onPress={() => {
										questions.push('');
										this.setState({
											questions,
										});
									}}
									disabled={this.state.isLoading}
									style={{
										marginTop: screenHeight * 0.02,
										justifyContent: 'center',
										alignItems: 'center',
										alignSelf: 'center',
										width: screenWidth * 0.39,
										height: screenHeight * 0.0878,
									}}>
									<Text style={fontStyles.bigTextStyleBlue}>
										{strings.AddQuestion}
									</Text>
								</TouchableOpacity>
								<View
									style={{
										marginTop: screenHeight * 0.03,
									}}>
									<HelpButton
										title={strings.Next}
										width={screenWidth * 0.39}
										onPress={async () => {
											await this.goToAddtionalInfoScreen();
										}}
										disabled={this.state.isLoading}
									/>
								</View>
								<HelpAlert
									isVisible={this.state.emptyQuestionError}
									onPress={() => {
										this.setState({ emptyQuestionError: false });
									}}
									title={strings.Whoops}
									message={strings.EmptyQuestion}
								/>
							</View>
						}
						data={questions}
						numColumns={1}
						keyExtractor={(item, index) => index + ''}
						extraData={this.state}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</View>
		);
	}
}

export default createQuestionsScreen;

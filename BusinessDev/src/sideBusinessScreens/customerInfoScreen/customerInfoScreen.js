//This is the third step of the product creation product. The business is going to enter the custom questions
//they would want the customers to answer when requesting the process.
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import HelpButton from '../../components/HelpButton/HelpButton';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import { screenHeight, screenWidth } from 'config/dimensions';
import strings from 'config/strings';
import { CheckBox } from 'react-native-elements';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import styles from './customerInfoScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import HelpAlert from '../../components/HelpAlert';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';

//Creates and exports the functional component
export default function customerInfoScreen(props) {
	//The state declarations that will be used in this screen
	const [defaultQuestions, setDefaultQuestions] = useState([
		{
			question: strings.WhatIsYourEmailAddressQuestion,
			title: strings.Email,
			isSelected: false,
		},
		{
			question: strings.WhatIsYourPhoneNumberQuestion,
			title: strings.PhoneNumber,
			isSelected: false,
		},
		{
			question: strings.WhatIsYourAddressQuestion,
			title: strings.Address,
			isSelected: false,
		},
	]);
	const [customQuestions, setCustomQuestions] = useState(['']);
	const [emptyQuestionError, setEmptyQuestionError] = useState(false);
	const [updateBoolean, setUpdateBoolean] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	//This the method that is called when the component mounts. Sets the screen in firebase, and fetches the data
	//if this service is being edited
	useEffect(() => {
		FirebaseFunctions.setCurrentScreen(
			'BusinessCreateCustomerInfoScreen',
			'customerInfoScreen'
		);
	}, []);

	//The method will check that there are no empty questions. If there are, an error will pop up. If there are, then
	//an error will pop up. If there aren't, it will construct the questions array and then get the previously created
	//information and then create the service in firestore or edit it if this is an existing service
	const saveService = async () => {
		setIsLoading(true);
		for (const customQuestion of customQuestions.slice(1)) {
			if (customQuestion.trim() === '') {
				setEmptyQuestionError(true);
				setIsLoading(false);
				return;
			}
		}

		let finalQuestions = [];
		for (const defaultQuestion of defaultQuestions) {
			if (defaultQuestion.isSelected) {
				finalQuestions.push(defaultQuestion.question);
			}
		}

		finalQuestions = customQuestions.concat(finalQuestions);
		if (finalQuestions[0].trim() === '') {
			finalQuestions.splice(0, 1);
		}

		const {
			business,
			businessID,
			serviceTitle,
			serviceDescription,
			serviceDuration,
			imageResponse,
			priceText,
			price,
			isCardSelected,
			isCashSelected,
			isPrepaySelected,
			isPostpaySelected,
		} = props.navigation.state.params;

		//Adds the product to the database & upload the image to Firebase Storage
		const serviceID = await FirebaseFunctions.call('addServiceToDatabase', {
			averageRating: 0,
			businessID,
			businessName: business.businessName,
			category: 'Cleaning',
			coordinates: business.coordinates,
			displayedReviews: [],
			serviceDuration,
			price,
			priceText,
			prepay: isPrepaySelected,
			postpay: isPostpaySelected,
			questions: finalQuestions,
			serviceDescription,
			serviceTitle,
			totalReviews: 0,
			cash: isCashSelected,
			card: isCardSelected,
		});
		//Handles the logic for uploading the image to Firebase
		//Fetches the absolute path of the image (depending on android or ios)
		let absolutePath = '';
		if (Platform.OS === 'android') {
			absolutePath = 'file://' + imageResponse.path;
		} else {
			absolutePath = imageResponse.path;
		}
		//Creates the reference & uploads the image (async)
		await FirebaseFunctions.storage.ref('services/' + serviceID).putFile(absolutePath);
		setIsLoading(false);
		props.navigation.push('BusinessScreens', {
			businessID,
		});
	};

	//Renders the UI
	return (
		<View style={screenStyle.container}>
			<TopBanner
				title={strings.CustomerInfo}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
			<KeyboardAwareFlatList
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				extraData={updateBoolean}
				keyExtractor={(item, index) => index + ' '}
				data={customQuestions}
				ListHeaderComponent={
					<View style={styles.customQuestionsContainer}>
						<View style={styles.customQuestionsText}>
							<Text style={fontStyles.bigTextStyleDarkBlue}>
								{strings.CustomQuestions}
							</Text>
							<View style={styles.textSpacer} />
							<Text style={fontStyles.mainTextStyleBlue}>
								{strings.CustomQuestionsDescription}
							</Text>
						</View>
						<FlatList
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							data={defaultQuestions}
							keyExtractor={(item) => item.question}
							extraData={updateBoolean}
							showsVerticalScrollIndicator={false}
							renderItem={({ item, index }) => (
								<View style={styles.defaultQuestionRow}>
									<CheckBox
										onClick={() => {
											const newDefaultQuestions = defaultQuestions;
											newDefaultQuestions[
												index
											].isSelected = !newDefaultQuestions[index].isSelected;
											setDefaultQuestions(newDefaultQuestions);
											setUpdateBoolean(!updateBoolean); //Used for react to know to update the screen because it can't detect changes to state arrays
										}}
										checked={item.isSelected}
										size={40}
										uncheckedColor={colors.lightBlue}
										checkedColor={colors.lightBlue}
									/>
									<HelpButton
										title={item.title}
										onPress={() => {
											const newDefaultQuestions = defaultQuestions;
											newDefaultQuestions[
												index
											].isSelected = !newDefaultQuestions[index].isSelected;
											setDefaultQuestions(newDefaultQuestions);
											setUpdateBoolean(!updateBoolean); //Used for react to know to update the screen because it can't detect changes to state arrays
										}}
										isLightButton={!item.isSelected}
										width={screenWidth * 0.65}
										height={screenHeight * 0.06}
									/>
								</View>
							)}
						/>
					</View>
				}
				renderItem={({ item, index }) => (
					<View style={styles.questionContainer}>
						<Text style={fontStyles.bigTextStyleDarkBlue}>
							{strings.Question} #{index + 1}
						</Text>
						<View style={styles.questionSpacer} />
						<View style={styles.textInputRow}>
							<HelpTextInput
								isMultiline={true}
								width={screenWidth * 0.725}
								height={screenHeight * 0.15}
								placeholder={strings.EnterAQuestionForCustomerHere}
								onChangeText={(input) => {
									const newCustomQuestion = customQuestions;
									customQuestions[index] = input;
									setCustomQuestions(newCustomQuestion);
									setUpdateBoolean(!updateBoolean);
								}}
								value={item}
								maxLength={240}
							/>
							<TouchableOpacity
								style={styles.deleteCustomQuestion}
								onPress={() => {
									if (customQuestions.length > 1) {
										const newCustomQuestions = customQuestions;
										newCustomQuestions.splice(index, 1);
										setCustomQuestions(newCustomQuestions);
										setUpdateBoolean(!updateBoolean);
									}
								}}>
								<Icon
									name={'trash'}
									type='font-awesome'
									size={30}
									color={colors.gray}
								/>
							</TouchableOpacity>
						</View>
					</View>
				)}
				ListFooterComponent={
					<View>
						<HelpButton
							title={strings.PlusSign}
							isCircleBlueButton={true}
							onPress={() => {
								setCustomQuestions(customQuestions.concat(''));
							}}
						/>
						<View style={styles.buttonSection}>
							<HelpButton
								title={strings.Next}
								width={screenWidth * 0.39}
								isLoading={isLoading}
								disabled={isLoading}
								onPress={() => {
									//Saves the service
									saveService();
								}}
							/>
						</View>
						<HelpAlert
							isVisible={emptyQuestionError}
							onPress={() => {
								setEmptyQuestionError(false);
							}}
							title={strings.Whoops}
							message={strings.EmptyQuestion}
						/>
					</View>
				}
			/>
		</View>
	);
}

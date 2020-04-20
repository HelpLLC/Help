//This is the third step of the product creation product. The business is going to enter the custom questions
//they would want the customers to answer when requesting the process.
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Picker, FlatList } from 'react-native';
import HelpButton from '../../components/HelpButton/HelpButton';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import { screenHeight, screenWidth } from 'config/dimensions';
import ImagePicker from '../../components/ImagePicker';
import strings from 'config/strings';
import RNPickerSelect from 'react-native-picker-select';
import { CheckBox } from 'react-native-elements';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import styles from './customerInfoScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import FastImage from 'react-native-fast-image';
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
	//information and then navigated to the next screen
	const goToNextScreen = () => {
		for (const customQuestion of customQuestions.slice(1)) {
			if (customQuestion.trim() === '') {
				setEmptyQuestionError(true);
				return;
			}
		}

		const finalQuestions = customQuestions;
		for (const defaultQuestion of defaultQuestions) {
			if (defaultQuestion.isSelected) {
				finalQuestions.push(defaultQuestion.question);
			}
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
		props.navigation.push('WorkerManagementScreen', {
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
			finalQuestions,
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
								onPress={() => {
									//Attempts to go to the next screen
									goToNextScreen();
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

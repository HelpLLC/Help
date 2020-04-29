import React, { useState, useEffect, useCallback } from 'react';
import './CreateProductScreen.css';
import '../../../config/fontStyles.css';
import HelpButton from '../../../components/HelpButton/HelpButton';
import strings from '../../../config/strings';
import { useLocation, useHistory } from 'react-router-dom';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import Resizer from 'react-image-file-resizer';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import colors from '../../../config/colors';
import TitleComponent from '../../../components/TitleComponent.js';
import Select from 'react-select';

export default function CreateProductScreen() {
	//Declares the hooks
	const location = useLocation();
	const onDrop = useCallback((file) => {
		const imageFile = file[0];
		//Makes sure that the file uploaded is an actual image
		if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/png') {
			//Sets the image
			setImage(imageFile);
		} else {
			//Displays an error to upload a correct file
		}
	}, []);
	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const history = useHistory();

	//Declares the state
	const [business, setBusiness] = useState(location.state.business);
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [image, setImage] = useState('');
	const [imagePreview, setImagePreview] = useState('');
	const [hours, setHours] = useState('');
	const [minutes, setMinutes] = useState('');
	const [priceType, setPriceType] = useState(strings.Fixed);
	const [priceNumber, setPriceNumber] = useState('');
	const [pricePerText, setPricePerText] = useState(strings.Hour);
	const [questions, setQuestions] = useState(['']);
	const [defaultQuestions, setDefaultQuestions] = useState([
		{
			name: strings.Email,
			isSelected: questions.includes(strings.WhatIsYourEmailAddressQuestion) ? true : false,
			question: strings.WhatIsYourEmailAddressQuestion,
		},
		{
			name: strings.PhoneNumber,
			isSelected: questions.includes(strings.WhatIsYourPhoneNumberQuestion) ? true : false,
			question: strings.WhatIsYourPhoneNumberQuestion,
		},
		{
			name: strings.Address,
			isSelected: questions.includes(strings.WhatIsYourAddressQuestion) ? true : false,
			question: strings.WhatIsYourAddressQuestion,
		},
	]);
	const [serviceDescription, setServiceDescription] = useState('');
	const [cash, setCash] = useState(false);
	const [card, setCard] = useState(false);
	const [prepay, setPrepay] = useState(false);
	const [postpay, setPostpay] = useState(false);
	const [serviceTitle, setServiceTitle] = useState('');
	const [fieldsError, setFieldsError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [imageError, setImageError] = useState(false);
	const [updateBoolean, setUpdateBoolean] = useState(true);

	let minutesArray = [];
	for (let i = 0; i < 60; i++) {
		minutesArray.push(i + '');
	}

	//The useEffect method that renders when the page is loaded
	useEffect(() => {}, []);

	//This function goes and creates the product in Firebase, then fetches the correct updates business object,
	//and navigates back to the Dashboard screen
	const createProduct = async () => {
		//Tests that all fields have been filled out
		if (
			image !== '' &&
			hours !== '' &&
			minutes !== '' &&
			parseFloat(hours) * 60 + parseFloat(minutes) > 0 &&
			priceNumber !== '' &&
			priceNumber > 0 &&
			serviceDescription.trim() !== '' &&
			(cash === true || card === true) &&
			serviceTitle.trim() !== '' &&
			!(priceType === strings.Per && pricePerText === '') &&
			(prepay === true || postpay === true)
		) {
			//Adds a pricing field
			let priceText =
				priceType === 'per'
					? '$' + priceNumber + ' ' + strings.per + ' ' + pricePerText
					: '$' + priceNumber;
			let price =
				priceType === 'per'
					? {
							priceType: 'per',
							pricePer: pricePerText,
							price: priceNumber,
					  }
					: {
							priceType: 'fixed',
							priceFixed: priceNumber,
					  };
			//Adds the default questions to the questions array
			const finalQuestions = [];
			//Double checks there are no empty questions
			for (let i = 0; i < finalQuestions.length; i++) {
				const question = questions[i];
				if (question.trim() !== '') {
					finalQuestions.push(question)
				}
			}
			for (const question of defaultQuestions) {
				if (question.isSelected === true) {
					finalQuestions.push(question.question);
				}
			}
			//Calculates how many hours this is
			const serviceDuration = (parseFloat(hours) + parseFloat(minutes) / 60).toFixed(2);

			//Creates the product in firebase (Currently hardcoded, shouldn't be eventually)
			const serviceID = await FirebaseFunctions.call('addServiceToDatabase', {
				averageRating: 0,
				businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
				businessName: 'Example Businesses',
				category: 'Cleaning',
				coordinates: { lat: -122.2054452, long: 47.76011099999999 },
				displayedReviews: [],
				serviceDuration: parseFloat(serviceDuration),
				price,
				priceText,
				prepay,
				postpay,
				questions: finalQuestions,
				serviceDescription,
				serviceTitle,
				totalReviews: 0,
				cash,
				card,
			});

			//Uploads the image to firebase as the image for this product
			await FirebaseFunctions.storage.ref('services/' + serviceID).put(image);

			history.push({ pathname: '/dashboard', state: { businessID: '' } });
		} else {
			if (image === '') {
				setImageError(true);
			} else if (serviceDescription.trim() !== '' && serviceDescription.length < 150) {
				setDescriptionError(true);
			} else {
				setFieldsError(true)
			}
		}
	};
	return (
		<div className='container'>
			<div className='stepsRow'>
				<div
					className={currentStep === 1 ? 'leftStep selected' : 'leftStep unselected'}
					onClick={() => setCurrentStep(1)}>
					<div className={currentStep === 1 ? 'selectedCircle' : 'unselectedCircle'}>
						<text
							className={
								currentStep === 1 ? 'bigTextStyle gray bold' : 'bigTextStyle lightGray bold'
							}>
							{strings.OneNumber}
						</text>
					</div>
					<text className={currentStep === 1 ? 'bigTextStyle white bold' : 'bigTextStyle gray bold'}>
						{strings.AddNewService}
					</text>
				</div>
				<div
					className={currentStep === 2 ? 'middleStep selected' : 'middleStep unselected'}
					onClick={() => setCurrentStep(2)}>
					<div className={currentStep === 2 ? 'selectedCircle' : 'unselectedCircle'}>
						<text
							className={
								currentStep === 2 ? 'bigTextStyle gray bold' : 'bigTextStyle lightGray bold'
							}>
							{strings.TwoNumber}
						</text>
					</div>
					<text className={currentStep === 2 ? 'bigTextStyle white bold' : 'bigTextStyle gray bold'}>
						{strings.PricingAndPayment}
					</text>
				</div>
				<div
					className={currentStep === 3 ? 'rightStep selected' : 'rightStep unselected'}
					onClick={() => setCurrentStep(3)}>
					<div className={currentStep === 3 ? 'selectedCircle' : 'unselectedCircle'}>
						<text
							className={
								currentStep === 3 ? 'bigTextStyle gray bold' : 'bigTextStyle lightGray bold'
							}>
							{strings.ThreeNumber}
						</text>
					</div>
					<text className={currentStep === 3 ? 'bigTextStyle white bold' : 'bigTextStyle gray bold'}>
						{strings.CustomerInfo}
					</text>
				</div>
			</div>

			<div className='innerContainer'>
				{
					//Displays the current UI based on which step the user is currently on
					currentStep === 1 ? (
						<div>
							<div className='stepTopSection'>
								<text className='bigTextStyle darkBlue'>{strings.StepOne}</text>
								<text className='bigTextStyle darkBlue bold'>{strings.AddNewService}</text>
							</div>
							<div className='stepOneBottomSection'>
								<button className='imagePickerSection'>
									<input
										type='file'
										id='upload'
										style={{ display: 'none' }}
										onChange={(e) => {
											setImagePreview(URL.createObjectURL(e.target.files[0]));
											if (e.target.files.length) {
												Resizer.imageFileResizer(
													e.target.files[0],
													400,
													250,
													'JPEG',
													100,
													0,
													(uri) => {
														setImage(uri);
													},
													'blob'
												);
											}
										}}
									/>
									<label htmlFor='upload'>
										{image.preview ? (
											<img src={image.preview} alt='dummy' width='300' height='300' />
										) : (
											<>
												{image === '' ? (
													<div className='imagePickerCircle' id='imagePickerCircle'>
														<FontAwesomeIcon icon={'camera'} color='#5cc6bc' size='7x' />
													</div>
												) : (
													<img src={imagePreview} className='serviceImage' />
												)}
											</>
										)}
									</label>
									<text className='bigTextStyle darkBlue'>{strings.EditServiceImage}</text>
								</button>
								<div className='textInputs'>
									<text className='bigTextStyle darkBlue'>{strings.ServiceTitle}</text>
									<HelpTextInput
										height={'7vh'}
										width={'45vw'}
										placeholder={strings.EnterTitleForService}
										isMultiline={false}
										onChangeText={(text) => setServiceTitle(text)}
										value={serviceTitle}
									/>
									<text className='bigTextStyle darkBlue'>{strings.ServiceDescription}</text>
									<HelpTextInput
										height={'20vh'}
										width={'45vw'}
										placeholder={strings.EnterServiceDescription}
										isMultiline={true}
										onChangeText={(text) => setServiceDescription(text)}
										value={serviceDescription}
									/>
									<text className='bigTextStyle darkBlue'>{strings.ServiceDuration}</text>
									<div className='durationRow'>
										<HelpTextInput
											height={'7vh'}
											keyboardType={'numeric'}
											width={'10vw'}
											placeholder={'0'}
											isMultiline={false}
											onChangeText={(text) => setHours(text)}
											value={hours}
										/>
										<text className='bigTextStyle darkBlue'>{strings.Hrs}</text>
										<HelpTextInput
											height={'7vh'}
											keyboardType={'numeric'}
											width={'10vw'}
											placeholder={'0 - 59'}
											isMultiline={false}
											onChangeText={(text) => setMinutes(text)}
											value={minutes}
										/>
										<text className='bigTextStyle darkBlue'>{strings.Mins}</text>
									</div>
								</div>
							</div>
						</div>
					) : currentStep === 2 ? (
						<div>
							<div className='stepTopSection'>
								<text className='bigTextStyle darkBlue'>{strings.StepTwo}</text>
								<text className='bigTextStyle darkBlue bold'>{strings.PricingAndPayment}</text>
							</div>
							<div className='pricingType'>
								<text className='bigTextStyle darkBlue'>{strings.PricingType}</text>
							</div>
							<div className='pricingTypeRow'>
								<div className='row'>
									<text className='bigTextStyle darkBlue'>{strings.DollarSign}</text>
									<HelpTextInput
										height={'7vh'}
										keyboardType={'numeric'}
										width={'10vw'}
										placeholder={'0'}
										isMultiline={false}
										onChangeText={(text) => setPriceNumber(text)}
										value={priceNumber}
									/>
								</div>
								<Select
									className='picker'
									styles={{
										control: (provided, state) => ({
											...provided,
											border: state.isFocused ? 0 : 0,
											// This line disable the blue border
											boxShadow: state.isFocused ? 0 : 0,
											'&:hover': {
												border: state.isFocused ? 0 : 0,
											},
										}),
									}}
									value={{ value: priceType, label: priceType }}
									onChange={(value) => setPriceType(value.value)}
									options={[
										{ value: strings.Fixed, label: strings.Fixed },
										{ value: strings.Per, label: strings.Per },
									]}
								/>
								{priceType === strings.Per ? (
									<Select
										className='picker'
										styles={{
											control: (provided, state) => ({
												...provided,
												border: state.isFocused ? 0 : 0,
												// This line disable the blue border
												boxShadow: state.isFocused ? 0 : 0,
												'&:hover': {
													border: state.isFocused ? 0 : 0,
												},
											}),
										}}
										value={{ value: pricePerText, label: pricePerText }}
										onChange={(value) => setPricePerText(value.value)}
										options={[{ value: strings.Hour, label: strings.Hour }]}
									/>
								) : (
									<div />
								)}
							</div>
							<div className='paymentTypeText'>
								<text className='bigTextStyle darkBlue'>{strings.PaymentType}</text>
								<div className='spacer' />
								<text className='mainTextStyle blue'>{strings.HowWillYourCustomersPayYou}</text>
							</div>
							<div className='paymentTypeButtonsDiv'>
								<HelpButton
									isLightButton={!cash}
									onPress={() => {
										setCash(true);
										setCard(false);
									}}
									title={strings.Cash}
									width={'20vw'}
								/>
								<div className='spacer' />
								<HelpButton
									isLightButton={!card}
									disabled={!business.paymentSetupStatus === 'TRUE'}
									onPress={() => {
										setCard(true);
										setCash(false);
									}}
									title={strings.CreditDebitCard}
									width={'20vw'}
								/>
							</div>
							<div className='paymentTypeText'>
								<div className='spacer' />
								<text className='mainTextStyle blue'>
									{strings.WhenDoYouWantYourCustomersToPayYou}
								</text>
							</div>
							<div className='paymentTimeButtonsDiv'>
								<HelpButton
									isLightButton={!prepay}
									onPress={() => {
										setPrepay(true);
										setPostpay(false);
									}}
									title={strings.WhenTheyOrder}
									width={'20vw'}
								/>
								<div className='spacer' />
								<HelpButton
									isLightButton={!postpay}
									onPress={() => {
										setPostpay(true);
										setPrepay(false);
									}}
									title={strings.AfterCompletion}
									width={'20vw'}
								/>
							</div>
						</div>
					) : (
						<div>
							<div className='stepTopSection'>
								<text className='bigTextStyle darkBlue'>{strings.StepTwo}</text>
								<text className='bigTextStyle darkBlue bold'>{strings.CustomerInfo}</text>
								<text className='bigTextStyle darkBlue'>{strings.CustomQuestions}</text>
								<text className='mainTextStyle blue'>{strings.WhatInformationDoYouNeed}</text>
							</div>
							<div className='defaultQuestionsRow'>
								{defaultQuestions.map((element, index) => (
									<HelpButton
										key={index}
										isLightButton={!element.isSelected}
										onPress={() => {
											const newQuestions = defaultQuestions;
											newQuestions[index].isSelected = !newQuestions[index].isSelected;
											setDefaultQuestions(newQuestions);
											setUpdateBoolean(!updateBoolean);
										}}
										title={element.name}
										width={'20vw'}
									/>
								))}
							</div>
							{questions.map((element, index) => (
								<div key={index} className='customQuestionsRow'>
									<div className='questionInput'>
										<text className='bigTextStyle darkBlue'>
											{strings.QuestionNumber} {index + 1}
										</text>
										<div className='spacer' />
										<div className='spacer' />
										<HelpTextInput
											height={'15vh'}
											width={'30vw'}
											placeholder={strings.EnterQuestionForCustomer}
											isMultiline={true}
											onChangeText={(text) => {
												const newQuestions = questions;
												newQuestions[index] = text;
												setQuestions(newQuestions);
												setUpdateBoolean(!updateBoolean);
											}}
											value={element}
										/>
									</div>
									<div className='horizontalSpacer' />
									<div className='deleteCustomQuestion'>
										<FontAwesomeIcon
											onClick={() => {
												if (index === 0) {
													const newQuestions = questions;
													newQuestions[index] = '';
													setQuestions(newQuestions);
													setUpdateBoolean(!updateBoolean);
												} else {
													const newQuestions = questions;
													newQuestions.splice(index, 1);
													setQuestions(newQuestions);
													setUpdateBoolean(!updateBoolean);
												}
											}}
											icon={'trash'}
											color='#808080'
											size='4x'
										/>
									</div>
								</div>
							))}
							<div className='addQuestionsButton'>
								<HelpButton
									title={'+'}
									isCircleBlueButton={true}
									onPress={() => {
										const newQuestions = questions;
										questions.push('');
										setQuestions(newQuestions);
										setUpdateBoolean(!updateBoolean);
									}}
									width={'6vw'}
								/>
							</div>
						</div>
					)
				}
			</div>
			{
				//Renders the correct buttons based on the current step
				currentStep === 1 ? (
					<div className='rightButton buttonsContainer'>
						<HelpButton
							title={strings.NextWithArrow}
							onPress={() => {
								setCurrentStep(2);
							}}
							width={'8vw'}
						/>
					</div>
				) : currentStep === 2 ? (
					<div className='buttonsContainer'>
						<HelpButton
							title={strings.BackWithArrow}
							onPress={() => {
								setCurrentStep(1);
							}}
							width={'8vw'}
						/>
						<HelpButton
							title={strings.NextWithArrow}
							onPress={() => {
								setCurrentStep(3);
							}}
							width={'8vw'}
						/>
					</div>
				) : (
					<div className='buttonsContainer'>
						<HelpButton
							title={strings.BackWithArrow}
							onPress={() => {
								setCurrentStep(2);
							}}
							width={'8vw'}
						/>
						<HelpButton
							title={strings.Create}
							onPress={() => {
								//Creates the product
								createProduct();
							}}
							width={'8vw'}
						/>
					</div>
				)
			}
			<Dialog
				open={fieldsError}
				onClose={() => {
					setFieldsError(false);
				}}>
				<TitleComponent text={strings.Whoops} isCentered={true} textColor={colors.darkBlue} />
				<DialogContent>
					<DialogContentText>{strings.PleaseCompleteAllFields}</DialogContentText>
				</DialogContent>
			</Dialog>
			<Dialog
				open={descriptionError}
				onClose={() => {
					setDescriptionError(false);
				}}>
				<TitleComponent text={strings.Whoops} isCentered={true} textColor={colors.darkBlue} />
				<DialogContent>
					<DialogContentText>{strings.DescriptionError}</DialogContentText>
				</DialogContent>
			</Dialog>
			<Dialog
				open={imageError}
				onClose={() => {
					setImageError(false);
				}}>
				<TitleComponent text={strings.Whoops} isCentered={true} textColor={colors.darkBlue} />
				<DialogContent>
					<DialogContentText>{strings.PleaseAddAnImage}</DialogContentText>
				</DialogContent>
			</Dialog>
		</div>
	);
}

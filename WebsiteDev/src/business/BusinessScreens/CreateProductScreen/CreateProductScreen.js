import React, { useState, useEffect } from 'react';
import './CreateProductScreen.css';
import '../../../config/fontStyles.css';
import HelpButton from '../../../components/HelpButton/HelpButton';
import strings from '../../../config/strings';
import { useLocation, useHistory } from 'react-router-dom';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import ImageUploader from 'react-images-upload';
import Resizer from 'react-image-file-resizer';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { View } from 'react-native-web';
import { screenWidth, screenHeight } from '../../../config/dimensions';

export default function CreateProductScreen() {
	//Declares the state
	const location = useLocation();
	const { getRootProps, getInputProps, isDragActive } = useDropzone();
	const history = useHistory();
	//const [business, setBusiness] = useState(location.state.business);
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [image, setImage] = useState('');
	const [hours, setHours] = useState('');
	const [minutes, setMinutes] = useState('');
	const [priceType, setPriceType] = useState('fixed');
	const [priceNumber, setPriceNumber] = useState('');
	const [pricePerText, setPricePerText] = useState('');
	const [questions, setQuestions] = useState([]);
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
	const [serviceTitle, setServiceTitle] = useState('');

	let minutesArray = [];
	for (let i = 0; i < 60; i++) {
		minutesArray.push(i + '');
	}

	//The useEffect method that renders when the page is loaded
	useEffect(() => {}, []);

	/*
	//This function goes and creates the product in Firebase, then fetches the correct updates business object,
	//and navigates back to the Dashboard screen
	const createProduct = async () => {
		//Tests that all fields have been filled out
		if (
			image !== '' &&
			serviceDuration !== '' &&
			serviceDuration > 0 &&
			simultaneousRequests !== '' &&
			simultaneousRequests > 0 &&
			priceNumber !== '' &&
			priceNumber > 0 &&
			serviceDescription.trim() !== '' &&
			(cash === true || card === true) &&
			serviceTitle.trim() !== '' &&
			!(priceType === 'per' && pricePerText === '')
		) {
			//Double checks there are no empty questions
			for (const question of questions) {
				if (question.trim() === '') {
					//Displays some kind of error
					return;
				}
			}
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
			const finalQuestions = questions;
			for (const question of defaultQuestions) {
				if (question.isSelected === true) {
					finalQuestions.push(question.question);
				}
			}
			//Creates the product in firebase
			const serviceID = await FirebaseFunctions.call('addServiceToDatabase', {
				averageRating: 0,
				businessID: business.businessID,
				businessName: business.businessName,
				category: 'Cleaning',
				coordinates: business.coordinates,
				displayedReviews: [],
				serviceDuration,
				simultaneousRequests,
				price,
				priceText,
				questions: finalQuestions,
				serviceDescription,
				cash,
				card,
				serviceTitle,
				totalReviews: 0,
			});

			//Uploads the image to firebase as the image for this product
			await FirebaseFunctions.storage.ref('services/' + serviceID).put(image);

			history.push({ pathname: '/dashboard', state: { businessID: business.businessID } });
		} else {
			//Display an error to the user to fill out all fields
		}
	};
	*/
	return (
		<div className='container'>
			<div className='stepsRow'>
				<div
					className={currentStep === 1 ? 'leftStep selected' : 'leftStep unselected'}
					onClick={() => setCurrentStep(1)}>
					<div className={currentStep === 1 ? 'selectedCircle' : 'unselectedCircle'}>
						<text
							className={
								currentStep === 1 ? 'bigTextStyleGray bold' : 'bigTextStyleLightGray bold'
							}>
							{strings.OneNumber}
						</text>
					</div>
					<text className={currentStep === 1 ? 'bigTextStyleWhite bold' : 'bigTextStyleGray bold'}>
						{strings.AddNewService}
					</text>
				</div>
				<div
					className={currentStep === 2 ? 'middleStep selected' : 'middleStep unselected'}
					onClick={() => setCurrentStep(2)}>
					<div className={currentStep === 2 ? 'selectedCircle' : 'unselectedCircle'}>
						<text
							className={
								currentStep === 2 ? 'bigTextStyleGray bold' : 'bigTextStyleLightGray bold'
							}>
							{strings.TwoNumber}
						</text>
					</div>
					<text className={currentStep === 2 ? 'bigTextStyleWhite bold' : 'bigTextStyleGray bold'}>
						{strings.PricingAndPayment}
					</text>
				</div>
				<div
					className={currentStep === 3 ? 'rightStep selected' : 'rightStep unselected'}
					onClick={() => setCurrentStep(3)}>
					<div className={currentStep === 3 ? 'selectedCircle' : 'unselectedCircle'}>
						<text
							className={
								currentStep === 3 ? 'bigTextStyleGray bold' : 'bigTextStyleLightGray bold'
							}>
							{strings.ThreeNumber}
						</text>
					</div>
					<text className={currentStep === 3 ? 'bigTextStyleWhite bold' : 'bigTextStyleGray bold'}>
						{strings.CustomerInfo}
					</text>
				</div>
			</div>

			<div className='innerContainer'>
				{
					//Displays the current UI based on which step the user is currently on
					currentStep === 1 ? (
						<div>
							<div className='stepOneTopSection'>
								<text className='bigTextStyleDarkBlue'>{strings.StepOne}</text>
								<text className='bigTextStyleDarkBlue bold'>{strings.AddNewService}</text>
							</div>
							<div className='stepOneBottomSection'>
								<button {...getRootProps()} className='imagePickerSection'>
									<input {...getInputProps()} />
									{image === '' ? (
										<div className='imagePickerCircle'>
											<FontAwesomeIcon icon={'camera'} color='#5cc6bc' size='7x' />
										</div>
									) : (
										<div />
									)}
									<text className='bigTextStyleDarkBlue'>{strings.EditServiceImage}</text>
								</button>
								<div className='textInputs'>
									<text className='bigTextStyleDarkBlue'>{strings.ServiceTitle}</text>
									<HelpTextInput
										height={'7vh'}
										width={'45vw'}
										placeholder={strings.EnterTitleForService}
										isMultiline={false}
										onChangeText={(text) => setServiceTitle(text)}
										value={serviceTitle}
									/>
									<text className='bigTextStyleDarkBlue'>{strings.ServiceDescription}</text>
									<HelpTextInput
										height={'20vh'}
										width={'45vw'}
										placeholder={strings.EnterServiceDescription}
										isMultiline={true}
										onChangeText={(text) => setServiceDescription(text)}
										value={serviceDescription}
									/>
									<text className='bigTextStyleDarkBlue'>{strings.ServiceDuration}</text>
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
										<text className='bigTextStyleDarkBlue'>{strings.Hrs}</text>
										<HelpTextInput
											height={'7vh'}
											keyboardType={'numeric'}
											width={'10vw'}
											placeholder={'0 - 59'}
											isMultiline={false}
											onChangeText={(text) => setMinutes(text)}
											value={minutes}
										/>
										<text className='bigTextStyleDarkBlue'>{strings.Mins}</text>
									</div>
								</div>
							</div>
						</div>
					) : currentStep === 2 ? (
						<div></div>
					) : (
						<div></div>
					)
				}
			</div>
			{
				//Renders the correct buttons based on the current step
				currentStep === 1 ? (
					<div className='rightButton buttonsContainer'>
						<HelpButton title={strings.NextWithArrow} onPress={() => {
							setCurrentStep(2)
						}} width={'8vw'} />
					</div>
				) : currentStep === 2 ? (
					<div className='buttonsContainer'>
						<HelpButton title={strings.BackWithArrow} onPress={() => {
							setCurrentStep(1)
						}} width={'8vw'} />
						<HelpButton title={strings.NextWithArrow} onPress={() => {
							setCurrentStep(3)
						}} width={'8vw'} />
					</div>
				) : (
					<div className='buttonsContainer'>
						<HelpButton title={strings.BackWithArrow} onPress={() => {
							setCurrentStep(2)
						}} width={'8vw'} />
						<HelpButton title={strings.Create} onPress={() => {
							//Creates the product
						}} width={'8vw'} />
					</div>
				)
			}
		</div>
	);
}

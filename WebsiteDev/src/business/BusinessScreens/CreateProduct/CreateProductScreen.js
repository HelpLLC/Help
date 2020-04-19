import React, { useState, useEffect } from 'react';
import HelpButton from '../../../components/HelpButton/HelpButton';
import strings from '../../../config/strings';
import { useLocation, useHistory } from 'react-router-dom';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import ImageUploader from 'react-images-upload';
import Resizer from 'react-image-file-resizer';
import { View } from 'react-native-web';
import { screenWidth, screenHeight } from '../../../config/dimensions';

export default function CreateProductScreen() {
	//Declares the state
	const location = useLocation();
	const history = useHistory();
	const [business, setBusiness] = useState(location.state.business);
	const [isLoading, setIsLoading] = useState(true);
	const [image, setImage] = useState('');
	const [serviceDuration, setServiceDuration] = useState('');
	const [simultaneousRequests, setSimultaneousRequests] = useState('');
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

	//The useEffect method that renders when the page is loaded
	useEffect(() => {
		setServiceDuration(1);
		setSimultaneousRequests(1);
		setPriceNumber(10);
		setQuestions(['What is your address']);
		setServiceDescription(
			'Example Description Example Description Example Description Example Description Example Description Example Description Example Description Example Description Example Description Example Description Example Description Example Description Example Description Example Description '
		);
		setCash(true);
		setServiceTitle('Example Title');
	}, []);

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

	return (
		<View>
			<HelpButton
				title={'Create'}
				onPress={() => {
					createProduct();
				}}
				width={screenWidth * 0.1}
			/>
			<ImageUploader
				singleImage={true}
				withIcon={true}
				buttonText='Choose images'
				onChange={(image) => {
					Resizer.imageFileResizer(
						image[0],
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
				}}
				label={'Click to upload'}
				imgExtension={['.jpg', '.png']}
				maxFileSize={512000}
			/>
		</View>
	);
}

//This is the screen where the business is first going to create the basic information for the new serivce
//they are creating
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Picker } from 'react-native';
import HelpButton from '../../components/HelpButton/HelpButton';
import TopBanner from '../../components/TopBanner/TopBanner';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import { screenHeight, screenWidth } from 'config/dimensions';
import ImagePicker from '../../components/ImagePicker';
import strings from 'config/strings';
import RNPickerSelect from 'react-native-picker-select';
import colors from 'config/colors';
import styles from './createServiceScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import FastImage from 'react-native-fast-image';
import HelpAlert from '../../components/HelpAlert';
import { Icon } from 'react-native-elements';

//Creates & exports the functional component
export default function createServiceScreen(props) {
	//All of the state for this screen is declared here
	const [imageSource, setImageSource] = useState('');
	const [imageResponse, setImageResponse] = useState('');
	const [isImagePickerShowing, setIsImagePickerShowing] = useState(false);
	const [serviceTitle, setServiceTitle] = useState('');
	const [serviceDescription, setServiceDescription] = useState('');
	const [serviceDurationHours, setServiceDurationHours] = useState('');
	const [serviceDurationMinutes, setServiceDurationMinutes] = useState('0');
	const [fieldsError, setFieldsError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [imageError, setImageError] = useState(false);

	//This the method that is called when the component mounts. Sets the screen in firebase, and fetches the data
	//if this service is being edited
	useEffect(() => {
		FirebaseFunctions.setCurrentScreen('BusinessCreateServiceScreen', 'createServiceScreen');
	}, []);

	//Constucts array of minutes for the duration picker
	const arrayOfNMinutes = [];
	for (let i = 0; i < 60; i++) {
		arrayOfNMinutes.push(i + '');
	}

	//This function is going to double check that all fields are filled out, the description is of sufficient length
	//and the service duration is of valid length (greater than 0), and that an image has been uploaded. If all
	//that is true, navigates to the next screen. If it is not, then an error message will pop up.
	const goToNextScreen = () => {
		if (
			serviceTitle.trim() === '' ||
			serviceDescription.trim() === '' ||
			(serviceDurationHours === '0' && serviceDurationMinutes === '0')
		) {
			setFieldsError(true);
		} else if (imageSource === '') {
			setImageError(true);
		} else if (serviceDescription.trim().length < 150) {
			setDescriptionError(true);
		} else {
			const { business, businessID } = props.navigation.state.params;
			//Calculates how many hours this is
			const serviceDuration =
				parseFloat(serviceDurationHours) * 60 + parseFloat(serviceDurationMinutes);
			props.navigation.push('PricingAndPaymentScreen', {
				business,
				businessID,
				serviceTitle,
				serviceDescription,
				serviceDuration,
				imageResponse,
			});
		}
	};

	return (
		<HelpView style={screenStyle.container}>
			<TopBanner
				title={strings.AddNewService}
				leftIconName='angle-left'
				leftOnPress={() => props.navigation.goBack()}
			/>
			<View style={styles.imageSection}>
				<TouchableOpacity onPress={() => setIsImagePickerShowing(true)}>
					{imageSource === '' ? (
						<View style={styles.imagePicker}>
							<Icon
								name={'camera'}
								type={'font-awesome'}
								size={30}
								color={colors.gray}
							/>
						</View>
					) : (
						<FastImage source={imageSource} style={styles.imagePicker} />
					)}
					<Text style={fontStyles.mainTextStyleDarkBlue}>{strings.EditServiceImage}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.inputSection}>
				<View style={styles.inputTitleStyle}>
					<Text style={fontStyles.bigTextStyleDarkBlue}>{strings.ServiceTitle}</Text>
				</View>
				<HelpTextInput
					isMultiline={false}
					width={screenWidth * 0.85}
					height={screenHeight * 0.06}
					placeholder={strings.EnterTitleForService}
					onChangeText={(input) => setServiceTitle(input)}
					value={serviceTitle}
					maxLength={21}
				/>
			</View>
			<View style={styles.inputSection}>
				<View style={styles.inputTitleStyle}>
					<Text style={fontStyles.bigTextStyleDarkBlue}>
						{strings.ServiceDescription}
					</Text>
				</View>
				<HelpTextInput
					isMultiline={true}
					width={screenWidth * 0.85}
					height={screenHeight * 0.14641}
					placeholder={strings.EnterDescriptionForCustomersDotDotDot}
					onChangeText={(input) => setServiceDescription(input)}
					value={serviceDescription}
					maxLength={240}
				/>
			</View>
			<View style={styles.inputSection}>
				<View style={styles.inputTitleStyle}>
					<Text style={fontStyles.bigTextStyleDarkBlue}>{strings.ServiceDuration}</Text>
				</View>
				<View style={styles.serviceDurationRow}>
					<HelpTextInput
						isMultiline={false}
						width={screenWidth * 0.2}
						height={screenHeight * 0.06}
						keyboardType={'numeric'}
						placeholder={'0'}
						onChangeText={(input) => setServiceDurationHours(input)}
						value={serviceDurationHours}
					/>
					<View style={styles.hoursText}>
						<Text style={fontStyles.mainTextStyleDarkBlue}>{strings.Hours}</Text>
					</View>
					<View style={styles.pickerStyle}>
						<RNPickerSelect
							onValueChange={(value) => setServiceDurationMinutes(value)}
							items={arrayOfNMinutes.map((item, index) => {
								return { label: item, value: item };
							})}
							value={serviceDurationMinutes}
							style={{
								iconContainer: {
									top: screenHeight * 0.0175,
									right: screenWidth * 0.01,
								},
								inputIOS: [
									fontStyles.subTextStyleBlack,
									{ width: screenWidth * 0.2, height: screenHeight * 0.06 },
								],
								inputAndroid: [
									fontStyles.subTextStyleBlack,
									{ width: screenWidth * 0.2, height: screenHeight * 0.06 },
								],
							}}
							Icon={() => (
								<Icon
									type='font-awesome'
									name='arrow-down'
									color={colors.lightBlue}
									size={20}
								/>
							)}
						/>
					</View>
					<Text style={fontStyles.mainTextStyleDarkBlue}>{strings.Minutes}</Text>
				</View>
			</View>
			<View style={styles.buttonSection}>
				<HelpButton
					title={strings.Next}
					width={screenWidth * 0.39}
					onPress={() => {
						//Navigates to the next screen
						goToNextScreen();
					}}
				/>
			</View>
			<ImagePicker
				imageHeight={250}
				onImageCanceled={() => {
					setIsImagePickerShowing(false);
				}}
				imageWidth={screenWidth}
				onImageSelected={(response) => {
					setIsImagePickerShowing(false);
					if (response) {
						const source = { uri: 'data:image/jpeg;base64,' + response.data };
						if (!(source.uri === 'data:image/jpeg;base64,undefined')) {
							//Sets the source of the image if one has been selected
							setImageResponse(response);
							setImageSource(source);
						}
					}
					setIsImagePickerShowing(false);
				}}
				isShowing={isImagePickerShowing}
			/>
			<HelpAlert
				isVisible={fieldsError}
				onPress={() => {
					setFieldsError(false);
				}}
				title={strings.Whoops}
				message={strings.PleaseCompleteAllTheFields}
			/>
			<HelpAlert
				isVisible={descriptionError}
				onPress={() => {
					setDescriptionError(false);
				}}
				title={strings.Whoops}
				message={strings.PleaseEnterADescriptionWithAtLeast50Characters}
			/>
			<HelpAlert
				isVisible={imageError}
				onPress={() => {
					setImageError(false);
				}}
				title={strings.Whoops}
				message={strings.PleaseAddAnImage}
			/>
		</HelpView>
	);
}

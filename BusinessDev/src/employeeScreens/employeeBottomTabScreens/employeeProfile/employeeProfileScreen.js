import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import TopBanner from '../../../components/TopBanner/TopBanner';
import HelpView from '../../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpButton from '../../../components/HelpButton/HelpButton';
import style from './employeeProfileScreenStyle';
import ServiceInfoCard from '../../../components/ServiceInfoCard/ServiceInfoCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';

const employeeProfileScreen = (props) => {
	// props = {navigation:{push:()=>{},state:{params:{businessID:'zjCzqSiCpNQELwU3ETtGBANz7hY2'}}}}; //NOTE: this line is only for testing

	const options = [
		strings.ProfileCompanyInfo,
		strings.ProfileBusinessSchedule,
		strings.ProfilePassword,
		strings.ProfileLogout,
	];
	//the state of the function
	const [employeeID, setEmployeeID] = useState('');
	const [profilePicture, setProfilePicture] = useState('');
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [imagePickerVisible, setImagePickerVisible] = useState(false);

	async function getData() {
		//Declares the screen name in Firebase
		FirebaseFunctions.setCurrentScreen('ProfileScreen', 'profileScreen');
		const { employeeID: EID } = props.navigation.state.params;

		// const businessObj = await FirebaseFunctions.call('getBusinessByID', {
		// 	businessID: BID,
		// });

		const profilePic = await FirebaseFunctions.call('getEmployeeProfilePictureByID', {
			employeeID: EID,
		});

		setEmployeeID(EID);
		setProfilePicture(profilePic);
		setIsScreenLoading(false);
	}
	useEffect(() => {
		getData();
	}, []);

	function renderOptions() {
		let elements = [];
		for (let i in options)
			elements.push(
				<TouchableOpacity
					style={
						options[i] == strings.ProfileLogout ? style.LogoutPositioning : null
					}
					key={options[i]}
				>
					<View
						style={[
							style.OptionContainer,
							options[i] == strings.ProfileLogout
								? style.LogoutContainer
								: style.OptionNormal,
						]}
					>
						<Text
							style={[
								fontStyles.mainTextStyle,
								style.OptionText,
								options[i] == strings.ProfileLogout ? style.LogoutText : {},
							]}
						>
							{options[i]}
						</Text>
						{options[i] == strings.ProfileLogout ? null : (
							<Icon
								name={'angle-right'}
								type='font-awesome'
								size={25}
								color={
									options[i] == strings.ProfileLogout
										? colors.white
										: colors.darkBlue
								}
							/>
						)}
					</View>
				</TouchableOpacity>
			);
		return elements;
	}

	if (isScreenLoading)
		return (
			<View style={style.Body}>
				<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
					<LoadingSpinner isVisible={true} />
				</View>
			</View>
		);
	else return (
		<HelpView>
			<TopBanner
				title={strings.Dashboard}
				size={30}
				leftOnPress={() => props.navigation.goBack()}
			/>
			<View style={style.Body}>
				<View style={style.ContentContainer}>
					<View style={style.MainContainer}>
						<TouchableOpacity onPress={()=>{
							setImagePickerVisible(true);
						}}>
							<Image
								source={profilePicture}
								style={{ width: 100, height: 100, margin: 10 }}
							/>
						</TouchableOpacity>
						<Text style={[fontStyles.mainTextStyle, style.MainText]}>
							Employee
            			</Text>
					</View>
					{renderOptions()}
					<ImagePicker
						imageHeight={256}
						imageWidth={256}
						onImageCanceled={() => {
							setImagePickerVisible(false);
						}}
						onImageSelected={(response) => {
							imageSelected(response);
						}}
						isShowing={imagePickerVisible}
					/>
				</View>
			</View>
		</HelpView>
	);
};

async function imageSelected(response){
	this.setState({ isShowing: false });
	const source = { uri: 'data:image/jpeg;base64,' + response.data };
	if (!(source.uri === 'data:image/jpeg;base64,undefined')) {

		let absolutePath = '';
		if (Platform.OS === 'android') {
			absolutePath = 'file://' + response.path;
		} else {
			absolutePath = response.path;
		}
		//Creates the reference & uploads the image (async)
		await FirebaseFunctions.storage
			.ref('employeeProfilePics/' + employeeID)
			.putFile(absolutePath);
		
		setProfilePicture(await FirebaseFunctions.call('getEmployeeProfilePictureByID', {employeeID}));

	}
	setImagePickerVisible(false);
}

export default employeeProfileScreen;

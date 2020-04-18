//This screen will be the service editing screen where the business will either create a new service
//or edit an old one, depending on where the screen will be accessed from
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import HelpButton from '../components/HelpButton';
import RNPickerSelect from 'react-native-picker-select';
import helpButtonStyles from 'config/styles/helpButtonStyles';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpTextInput from '../components/HelpTextInput/HelpTextInput';
import { BoxShadow } from 'react-native-shadow';
import HelpView from '../components/HelpView';
import ImagePicker from '../components/ImagePicker';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBanner from '../components/TopBanner/TopBanner';
import HelpAlert from '../components/HelpAlert';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import OptionPicker from '../components/OptionPicker';
import colors from 'config/colors';

class createServiceScreen extends Component {
	state = {
		isScreenLoading: true,
		isLoading: false,
		isDeleteServiceVisible: false,
		isErrorVisible: false,
		fieldsError: false,
		serviceDescriptionError: false,
		serviceHasInProgress: false,
		serviceDeleted: false,
		isShowing: false,
	};

	//This componentWil lMount method will decide, based on the params that are passed in, whether
	//this screen is going to edit a service or create a new one.
	async componentDidMount() {
		if (this.props.navigation.state.params.editing === true) {
			FirebaseFunctions.setCurrentScreen('EditServiceScreen', 'createServiceScreen');

			//This means that this screen is an editing screen
			const { businessID, business, serviceID, service } = this.props.navigation.state.params;
			const imageSource = await FirebaseFunctions.call('getServiceImageByID', { serviceID });

			this.setState({
				serviceTitle: service.serviceTitle,
				service,
				serviceID: serviceID,
				serviceDescription: service.serviceDescription,
				editing: true,
				imageSource,
				imageError: false,
				priceType: service.price.priceType,
				businessID,
				business,
			});

			//Sets the correct price type
			if (service.price.priceType === 'per') {
				this.setState({
					pricePerNumber: service.price.price + '',
					pricePerText: service.price.per,
					isScreenLoading: false,
				});
			} else {
				this.setState({
					priceFixed: service.price.priceFixed + '',
					isScreenLoading: false,
				});
			}
		} else {
			FirebaseFunctions.setCurrentScreen('CreateServiceScreen', 'createServiceScreen');
			//This means that this screen is going to create a new service
			this.setState({
				serviceTitle: '',
				serviceDescription: '',
				business: this.props.navigation.state.params.business,
				businessID: this.props.navigation.state.params.businessID,
				imageSource: '',
				isScreenLoading: false,
				editing: false,
				imageError: false,
				priceType: 'fixed',
				pricePerNumber: '',
				pricePerText: '',
				priceFixed: '',
			});
		}
	}

	//Chooses the image from camera roll or picture and sets it to the image source
	chooseImage() {
		Keyboard.dismiss();
		this.setState({ isShowing: true });
	}

	//Passes on the object to the next screen which will be the questions screen
	async goToQuestionsScreen() {
		Keyboard.dismiss();
		//Retrieves the state of the input fields
		const {
			serviceTitle,
			serviceDescription,
			priceType,
			response,
			imageSource,
			businessID,
			business,
		} = this.state;

		//Makes sure all the  fields are valid
		if (
			serviceTitle.trim() === '' ||
			serviceDescription.trim() === '' ||
			(priceType === 'per' &&
				(this.state.pricePerNumber === '' || this.state.pricePerText.trim() === '')) ||
			(priceType === 'fixed' && this.state.priceFixed === '')
		) {
			this.setState({ fieldsError: true });
		} else if (serviceDescription.trim().length < 150) {
			this.setState({ serviceDescriptionError: true });
		} else if (imageSource === '') {
			this.setState({ imageError: true });
		} else {
			this.setState({ isLoading: true });

			//Creates the price object
			const price = {
				priceType,
			};
			if (priceType === 'per') {
				price.price = parseFloat(this.state.pricePerNumber);
				price.per = this.state.pricePerText;
			} else {
				price.priceFixed = parseFloat(this.state.priceFixed);
			}
			//Passes the correct params to the next screen if the service is being edited, or created
			this.setState({ isLoading: false });
			if (this.state.editing === true) {
				this.props.navigation.push('CreateQuestionsScreen', {
					businessID,
					editing: true,
					serviceTitle,
					serviceDescription,
					price,
					business,
					response,
					serviceID: this.state.serviceID,
					service: this.state.service,
				});
			} else {
				this.props.navigation.push('CreateQuestionsScreen', {
					businessID,
					editing: false,
					serviceTitle,
					serviceDescription,
					price,
					business,
					response,
				});
			}
		}
	}

	render() {
		if (this.state.isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.Service}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}

		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.Service}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: screenWidth - 40,
							alignItems: 'center',
						}}>
						<View style={{ flexDirection: 'column' }}>
							<View
								style={{
									justifyContent: 'flex-end',
									marginVertical: screenHeight * 0.02,
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>
									{strings.ServiceTitle}
								</Text>
							</View>
							<View style={{ justifyContent: 'center' }}>
								<HelpTextInput
									isMultiline={false}
									height={screenHeight * 0.06}
									onChangeText={(input) => this.setState({ serviceTitle: input })}
									placeholder={strings.GiveItATitleDotDotDot}
									value={this.state.serviceTitle}
									password={false}
									maxLength={21}
									width={screenWidth * 0.35}
								/>
							</View>
						</View>

						<View
							style={{
								flexDirection: 'column',
								alignItems: 'center',
							}}>
							<TouchableOpacity
								onPress={() => {
									Keyboard.dismiss();
									this.chooseImage();
								}}
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: screenHeight * 0.02,
								}}>
								<View style={{ justifyContent: 'flex-start' }}>
									<BoxShadow
										setting={{
											width: screenWidth * 0.25,
											height: screenWidth * 0.25,
											color: colors.gray,
											border: 10,
											radius: (screenWidth * 0.25) / 2,
											opacity: 0.2,
											x: 0,
											y: 5,
										}}>
										{this.state.imageSource === '' ? (
											<View
												style={{
													width: screenWidth * 0.25,
													height: screenWidth * 0.25,
													borderColor: colors.lightBlue,
													borderWidth: (screenWidth * 0.25) / 17,
													borderRadius: (screenWidth * 0.25) / 2,
													backgroundColor: colors.white,
												}}
											/>
										) : (
											<FastImage
												source={this.state.imageSource}
												style={{
													width: screenWidth * 0.25,
													height: screenWidth * 0.25,
													borderColor: colors.lightBlue,
													borderWidth: (screenWidth * 0.25) / 17,
													borderRadius: (screenWidth * 0.25) / 2,
												}}
											/>
										)}
									</BoxShadow>
								</View>
								<View
									style={{
										justifyContent: 'flex-end',
										marginTop: screenHeight * 0.02,
									}}>
									<Text style={fontStyles.mainTextStyleBlue}>
										{strings.EditImage}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ marginTop: screenHeight * 0.05 }}>
						<View
							style={{
								marginVertical: screenHeight * 0.02,
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>
								{strings.ServiceDescription}
							</Text>
						</View>
						<HelpTextInput
							isMultiline={true}
							width={screenWidth - 40}
							height={screenHeight * 0.14641}
							placeholder={strings.EnterDescriptionForCustomersDotDotDot}
							onChangeText={(input) => this.setState({ serviceDescription: input })}
							value={this.state.serviceDescription}
							maxLength={240}
						/>
					</View>
					<View
						style={{
							justifyContent: 'flex-end',
							marginVertical: screenHeight * 0.02,
						}}>
						<View style={{ justifyContent: 'flex-end' }}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.Pricing}</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginVertical: screenHeight * 0.02,
							}}>
							<View
								style={{
									borderWidth: 3,
									borderColor: colors.lightBlue,
									backgroundColor: colors.white,
									borderRadius: 20,
									paddingHorizontal: screenWidth * 0.01,
								}}>
								<RNPickerSelect
									onValueChange={(value) => this.setState({ priceType: value })}
									items={[
										{ label: strings.Fixed, value: 'fixed' },
										{ label: strings.Per, value: 'per' },
									]}
									value={this.state.priceType}
									style={{
										iconContainer: {
											top: screenHeight * 0.015,
										},
										inputIOS: {
											width: screenWidth * 0.2,
											height: screenHeight * 0.05,
											color: colors.black,
										},
										inputAndroid: {
											width: screenWidth * 0.2,
											height: screenHeight * 0.05,
											color: colors.black,
										},
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
							{this.state.priceType === 'per' ? (
								<View style={{ flexDirection: 'row' }}>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center',
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>
											{strings.DollarSign}
										</Text>
										<View style={{ width: screenWidth * 0.01 }} />
										<HelpTextInput
											isMultiline={false}
											height={screenHeight * 0.06}
											placeholder={''}
											onChangeText={(input) =>
												this.setState({ pricePerNumber: input })
											}
											value={this.state.pricePerNumber}
											password={false}
											keyboardType={'numeric'}
											width={screenWidth * 0.2}
										/>
									</View>
									<View style={{ width: screenWidth * 0.02 }} />
									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>
											{strings.per}
										</Text>
									</View>
									<View style={{ width: screenWidth * 0.02 }} />
									<View
										style={{
											alignItems: 'flex-start',
											justifyContent: 'center',
										}}>
										<HelpTextInput
											isMultiline={false}
											height={screenHeight * 0.06}
											placeholder={strings.Hour}
											onChangeText={(input) =>
												this.setState({ pricePerText: input })
											}
											value={this.state.pricePerText}
											password={false}
											width={screenWidth * 0.2}
										/>
									</View>
								</View>
							) : this.state.priceType === 'fixed' ? (
								<View style={{ flexDirection: 'row' }}>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center',
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>
											{strings.DollarSign}
										</Text>
										<View style={{ width: screenWidth * 0.01 }} />
										<HelpTextInput
											isMultiline={false}
											height={screenHeight * 0.06}
											placeholder={''}
											onChangeText={(input) =>
												this.setState({ priceFixed: input })
											}
											value={this.state.priceFixed}
											password={false}
											keyboardType={'numeric'}
											width={screenWidth * 0.2}
										/>
									</View>
								</View>
							) : (
								<View style={{ flexDirection: 'row' }}>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center',
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>
											{strings.DollarSign}
										</Text>
										<View style={{ width: screenWidth * 0.01 }} />
										<HelpTextInput
											isMultiline={false}
											height={screenHeight * 0.06}
											placeholder={strings.Min}
											onChangeText={(input) =>
												this.setState({ priceMin: input })
											}
											value={this.state.priceMin}
											password={false}
											keyboardType={'numeric'}
											width={screenWidth * 0.2}
										/>
									</View>
									<View style={{ width: screenWidth * 0.02 }} />
									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>
											{strings.to}
										</Text>
									</View>
									<View style={{ width: screenWidth * 0.02 }} />
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>
											{strings.DollarSign}
										</Text>
										<View style={{ width: screenWidth * 0.01 }} />
										<HelpTextInput
											isMultiline={false}
											height={screenHeight * 0.06}
											placeholder={strings.Max}
											onChangeText={(input) =>
												this.setState({ priceMax: input })
											}
											value={this.state.priceMax}
											password={false}
											keyboardType={'numeric'}
											width={screenWidth * 0.2}
										/>
									</View>
								</View>
							)}
						</View>
					</View>
					<View>
						{this.state.isLoading === true ? (
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<LoadingSpinner isVisible={true} />
							</View>
						) : this.state.editing === true ? (
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-evenly',
									alignItems: 'center',
								}}>
								<HelpButton
									title={strings.Delete}
									style={helpButtonStyles.MediumSizeButtonRed}
									textStyle={fontStyles.bigTextStyleWhite}
									onPress={() => {
										this.setState({ isDeleteServiceVisible: true });
									}}
									disabled={this.state.isLoading}
								/>

								<HelpButton
									title={strings.Next}
									style={helpButtonStyles.MediumSizeButton}
									textStyle={fontStyles.bigTextStyleWhite}
									onPress={async () => {
										await this.goToQuestionsScreen();
									}}
									disabled={this.state.isLoading}
								/>
							</View>
						) : (
							<View style={{ alignItems: 'center', justifyContent: 'center' }}>
								<HelpButton
									title={strings.Next}
									style={helpButtonStyles.MediumSizeButton}
									textStyle={fontStyles.bigTextStyleWhite}
									onPress={async () => {
										await this.goToQuestionsScreen();
									}}
									disabled={this.state.isLoading}
								/>
							</View>
						)}
					</View>
				</View>
				<HelpAlert
					isVisible={this.state.isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<HelpAlert
					isVisible={this.state.serviceHasInProgress}
					onPress={() => {
						this.setState({ serviceHasInProgress: false });
					}}
					title={strings.Whoops}
					message={strings.TheServiceHasInProgressRequests}
				/>
				<HelpAlert
					isVisible={this.state.serviceDeleted}
					onPress={() => {
						this.setState({ serviceDeleted: false });
						this.props.navigation.push('BusinessScreens', {
							businessID: this.state.businessID,
						});
					}}
					title={strings.Success}
					message={strings.TheServiceHasBeenDeleted}
				/>
				<HelpAlert
					isVisible={this.state.fieldsError}
					onPress={() => {
						this.setState({ fieldsError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseCompleteAllTheFields}
				/>
				<HelpAlert
					isVisible={this.state.serviceDescriptionError}
					onPress={() => {
						this.setState({ serviceDescriptionError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseEnterADescriptionWithAtLeast50Characters}
				/>
				<HelpAlert
					isVisible={this.state.imageError}
					onPress={() => {
						this.setState({ imageError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseAddAnImage}
				/>
				<OptionPicker
					isVisible={this.state.isDeleteServiceVisible}
					title={strings.DeleteService}
					message={strings.AreYouSureDeleteService}
					confirmText={strings.Yes}
					cancelText={strings.Cancel}
					clickOutside={true}
					confirmOnPress={async () => {
						this.setState({ isLoading: true, isDeleteServiceVisible: false });
						try {
							const result = await FirebaseFunctions.call('deleteService', {
								serviceID: this.state.serviceID,
								businessID: this.state.businessID,
							});
							if (result === 'IN_PROGRESS_REQUESTS') {
								this.setState({ isLoading: false, serviceHasInProgress: true });
							} else {
								this.setState({ isLoading: false, serviceDeleted: true });
							}
						} catch (error) {
							this.setState({ isLoading: false, isErrorVisible: true });
							FirebaseFunctions.call('logIssue', {
								error,
								userID: {
									screen: 'CreateServiceScreen',
									userID: 'b-' + this.state.businessID,
									businessID: this.state.businessID,
								},
							});
						}
					}}
					cancelOnPress={() => {
						this.setState({ isDeleteServiceVisible: false });
					}}
				/>
				<ImagePicker
					imageHeight={250}
					onImageCanceled={() => {
						this.setState({ isShowing: false });
					}}
					imageWidth={screenWidth}
					onImageSelected={(response) => {
						this.setState({ isShowing: false });
						if (response) {
							const source = { uri: 'data:image/jpeg;base64,' + response.data };
							if (!(source.uri === 'data:image/jpeg;base64,undefined')) {
								//Sets the source of the image if one has been selected
								this.setState({
									imageSource: source,
									response,
								});
							}
						}
						this.setState({ isShowing: false });
					}}
					isShowing={this.state.isShowing}
				/>
			</HelpView>
		);
	}
}

//Exports the class
export default createServiceScreen;

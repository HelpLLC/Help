//This screen will be the product editing screen where the business will either create a new product
//or edit an old one, depending on where the screen will be accessed from
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import RoundBlueButton from '../../components/RoundBlueButton';
import RNPickerSelect from 'react-native-picker-select';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import OneLineRoundedBoxInput from '../../components/OneLineRoundedBoxInput';
import { BoxShadow } from 'react-native-shadow';
import HelpView from '../../components/HelpView';
import MultiLineRoundedBoxInput from '../../components/MultiLineRoundedBoxInput';
import images from 'config/images/images';
import ImagePicker from '../../components/ImagePicker';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import LoadingSpinner from '../../components/LoadingSpinner';
import TopBanner from '../../components/TopBanner';
import ErrorAlert from '../../components/ErrorAlert';
import { Icon } from 'react-native-elements';
import { CachedImage } from 'react-native-img-cache';
import OptionPicker from '../../components/OptionPicker';
import colors from 'config/colors';

class createProductScreen extends Component {
	state = {
		isScreenLoading: true,
		isLoading: false,
		isDeleteProductVisible: false
	};

	//This componentWil lMount method will decide, based on the params that are passed in, whether
	//this screen is going to edit a product or create a new one.
	async componentDidMount() {
		if (this.props.navigation.state.params && this.props.navigation.state.params.product) {
			FirebaseFunctions.setCurrentScreen('EditProductScreen', 'editProductScreen');

			//This means that this screen is an editing screen
			const { product, productID } = this.props.navigation.state.params;
			const imageSource = await FirebaseFunctions.getProductImageByID(productID);

			this.setState({
				serviceTitle: product.serviceTitle,
				serviceID: productID,
				serviceDescription: product.serviceDescription,
				isEditing: true,
				imageSource,
				isLoading: false,
				isScreenLoading: true,
				isErrorVisible: false,
				fieldsError: false,
				serviceDescriptionError: false,
				productDeleted: false,
				imageError: false,
				priceType: product.price.priceType,
				pricePerNumber: '',
				pricePerText: '',
				priceMin: '',
				priceMax: '',
				priceFixed: ''
			});

			//Sets the correct price type
			if (product.price.priceType === 'per') {
				this.setState({
					pricePerNumber: product.price.price + '',
					pricePerText: product.price.per,
					isScreenLoading: false
				});
			} else if (product.price.priceType === 'range') {
				this.setState({
					priceMin: product.price.min + '',
					priceMax: product.price.max + '',
					isScreenLoading: false
				});
			} else {
				this.setState({
					priceFixed: product.price.priceFixed + '',
					isScreenLoading: false
				});
			}
		} else {
			FirebaseFunctions.setCurrentScreen('CreateProductScreen', 'createProductScreen');
			//This means that this screen is going to create a new product
			this.setState({
				serviceTitle: '',
				serviceDescription: '',
				imageSource: images.BlankWhite,
				isLoading: false,
				isScreenLoading: false,
				isErrorVisible: false,
				fieldsError: false,
				serviceDescriptionError: false,
				isEditing: false,
				productDeleted: false,
				imageError: false,
				priceType: 'fixed',
				pricePerNumber: '',
				pricePerText: '',
				priceMin: '',
				isShowing: false,
				priceMax: '',
				priceFixed: ''
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
		const { serviceTitle, serviceDescription, priceType, response, imageSource } = this.state;
		const { productID, providerID } = this.props.navigation.state.params;
		if (
			serviceTitle.trim() === '' ||
			serviceDescription.trim() === '' ||
			(priceType === 'per' &&
				(this.state.pricePerNumber === '' || this.state.pricePerText.trim() === '')) ||
			(priceType === 'range' && (this.state.priceMax === '' || this.state.priceMin === '')) ||
			(priceType === 'fixed' && this.state.priceFixed === '')
		) {
			this.setState({ fieldsError: true });
		} else if (serviceDescription.trim().length < 150) {
			this.setState({ serviceDescriptionError: true });
		} else if (imageSource === images.BlankWhite) {
			this.setState({ imageError: true });
		} else {
			this.setState({ isLoading: true });

			//Creates the price object
			const price = {
				priceType
			};
			if (priceType === 'per') {
				price.price = parseFloat(this.state.pricePerNumber);
				price.per = this.state.pricePerText;
			} else if (priceType === 'range') {
				price.min = parseFloat(this.state.priceMin);
				price.max = parseFloat(this.state.priceMax);
			} else {
				price.priceFixed = parseFloat(this.state.priceFixed);
			}
			let newProductObject = {
				serviceTitle,
				serviceDescription,
				price
			};
			if (!this.state.response) {
				newProductObject = {
					...newProductObject,
					response: null
				};
			} else {
				newProductObject = {
					...newProductObject,
					response: response
				};
			}

			//Passes the correct params to the next screen if the product is being edited, or created
			this.setState({ isLoading: false });
			if (this.state.isEditing) {
				this.props.navigation.push('ProviderCreateQuestionsScreen', {
					providerID,
					productID,
					product: this.props.navigation.state.params.product,
					newProductObject
				});
			} else {
				this.props.navigation.push('ProviderCreateQuestionsScreen', {
					providerID,
					newProductObject
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
					<View style={{ flex: 0.25 }}></View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: Dimensions.get('window').width - 40,
							flex: 1,
							alignItems: 'center'
						}}>
						<View style={{ flexDirection: 'column' }}>
							<View style={{ flex: 1, justifyContent: 'flex-end' }}>
								<Text style={fontStyles.bigTextStyleBlack}>{strings.ServiceTitle}</Text>
							</View>

							<View style={{ flex: 1, justifyContent: 'center' }}>
								<OneLineRoundedBoxInput
									onChangeText={(input) => this.setState({ serviceTitle: input })}
									placeholder={strings.GiveItATitleDotDotDot}
									value={this.state.serviceTitle}
									password={false}
									maxLength={21}
									width={Dimensions.get('window').width * 0.35}
								/>
							</View>
						</View>

						<View style={{ flexDirection: 'column', alignItems: 'center' }}>
							<TouchableOpacity
								onPress={() => {
									Keyboard.dismiss();
									this.chooseImage();
								}}
								style={{ justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ justifyContent: 'flex-start' }}>
									<BoxShadow
										setting={{
											width: Dimensions.get('window').width * 0.25,
											height: Dimensions.get('window').width * 0.25,
											color: colors.gray,
											border: 10,
											radius: (Dimensions.get('window').width * 0.25) / 2,
											opacity: 0.2,
											x: 0,
											y: 5
										}}>
										<CachedImage
											source={this.state.imageSource}
											style={{
												width: Dimensions.get('window').width * 0.25,
												height: Dimensions.get('window').width * 0.25,
												borderColor: colors.lightBlue,
												borderWidth: (Dimensions.get('window').width * 0.25) / 17,
												borderRadius: (Dimensions.get('window').width * 0.25) / 2
											}}
										/>
									</BoxShadow>
								</View>
								<Text> </Text>
								<View style={{ justifyContent: 'flex-end' }}>
									<Text style={fontStyles.mainTextStyleBlue}>{strings.EditImage}</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ marginTop: Dimensions.get('window').height * 0.05 }}>
						<View
							style={{
								marginVertical: Dimensions.get('window').height * 0.01
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.ServiceDescription}</Text>
						</View>
						<MultiLineRoundedBoxInput
							width={Dimensions.get('window').width - 40}
							height={Dimensions.get('window').height * 0.14641}
							placeholder={strings.EnterDescriptionForCustomersDotDotDot}
							onChangeText={(input) => this.setState({ serviceDescription: input })}
							value={this.state.serviceDescription}
							maxLength={240}
						/>
					</View>
					<View style={{ flex: 1, justifyContent: 'flex-end' }}>
						<View style={{ flex: 1, justifyContent: 'flex-end' }}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.Pricing}</Text>
						</View>
						<View
							style={{
								flex: 1.5,
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<View style={{ flex: 0.5 }}>
								<RNPickerSelect
									onValueChange={(value) => this.setState({ priceType: value })}
									items={[
										{ label: strings.Fixed, value: 'fixed' },
										{ label: strings.Per, value: 'per' },
										{ label: strings.Range, value: 'range' }
									]}
									value={this.state.priceType}
									style={{
										iconContainer: {
											top: Dimensions.get('window').height * 0.014,
											right: Dimensions.get('window').width * 0.11
										},
										inputIOS: {
											borderWidth: 1,
											borderColor: colors.lightBlue,
											borderRadius: 20,
											width: Dimensions.get('window').width * 0.2,
											height: Dimensions.get('window').height * 0.05,
											paddingLeft: Dimensions.get('window').height * 0.01,
											color: colors.black
										},
										inputAndroid: {
											borderWidth: 1,
											borderColor: colors.lightBlue,
											borderRadius: 20,
											width: Dimensions.get('window').width * 0.2,
											height: Dimensions.get('window').height * 0.05,
											paddingLeft: Dimensions.get('window').height * 0.01,
											color: colors.black
										}
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
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<View
										style={{
											flex: 1.4,
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center'
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.DollarSign}</Text>
										<Text> </Text>
										<OneLineRoundedBoxInput
											placeholder={''}
											onChangeText={(input) => this.setState({ pricePerNumber: input })}
											value={this.state.pricePerNumber}
											password={false}
											keyboardType={'numeric'}
											width={Dimensions.get('window').width * 0.2}
										/>
									</View>
									<View
										style={{
											flex: 0.8,
											justifyContent: 'center',
											alignItems: 'center'
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.per}</Text>
									</View>
									<View
										style={{
											flex: 1.4,
											alignItems: 'flex-start',
											justifyContent: 'center'
										}}>
										<OneLineRoundedBoxInput
											placeholder={strings.Hour}
											onChangeText={(input) => this.setState({ pricePerText: input })}
											value={this.state.pricePerText}
											password={false}
											width={Dimensions.get('window').width * 0.2}
										/>
									</View>
								</View>
							) : this.state.priceType === 'fixed' ? (
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<View
										style={{
											flex: 1.4,
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center'
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.DollarSign}</Text>
										<Text> </Text>
										<OneLineRoundedBoxInput
											placeholder={''}
											onChangeText={(input) => this.setState({ priceFixed: input })}
											value={this.state.priceFixed}
											password={false}
											keyboardType={'numeric'}
											width={Dimensions.get('window').width * 0.2}
										/>
									</View>
								</View>
							) : (
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<View
										style={{
											flex: 1.4,
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center'
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.DollarSign}</Text>
										<Text> </Text>
										<OneLineRoundedBoxInput
											placeholder={strings.Min}
											onChangeText={(input) => this.setState({ priceMin: input })}
											value={this.state.priceMin}
											password={false}
											keyboardType={'numeric'}
											width={Dimensions.get('window').width * 0.2}
										/>
									</View>
									<View
										style={{
											flex: 0.8,
											justifyContent: 'center',
											alignItems: 'center'
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.to}</Text>
									</View>
									<View
										style={{
											flex: 1.4,
											flexDirection: 'row',
											alignItems: 'center'
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.DollarSign}</Text>
										<Text> </Text>
										<OneLineRoundedBoxInput
											placeholder={strings.Max}
											onChangeText={(input) => this.setState({ priceMax: input })}
											value={this.state.priceMax}
											password={false}
											keyboardType={'numeric'}
											width={Dimensions.get('window').width * 0.2}
										/>
									</View>
								</View>
							)}
						</View>
					</View>
					<View style={{ flex: 0.25 }}></View>
					<View
						style={{
							flex: 1
						}}>
						{this.state.isLoading === true ? (
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<LoadingSpinner isVisible={true} />
							</View>
						) : this.state.isEditing === true ? (
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-evenly',
									alignItems: 'center'
								}}>
								<RoundBlueButton
									title={strings.Delete}
									style={roundBlueButtonStyle.MediumSizeButtonRed}
									textStyle={fontStyles.bigTextStyleWhite}
									onPress={() => {
										this.setState({ isDeleteProductVisible: true });
									}}
									disabled={this.state.isLoading}
								/>

								<RoundBlueButton
									title={strings.Next}
									style={roundBlueButtonStyle.MediumSizeButton}
									textStyle={fontStyles.bigTextStyleWhite}
									onPress={async () => {
										await this.goToQuestionsScreen();
									}}
									disabled={this.state.isLoading}
								/>
							</View>
						) : (
							<View style={{ alignItems: 'center', justifyContent: 'center' }}>
								<RoundBlueButton
									title={strings.Next}
									style={roundBlueButtonStyle.MediumSizeButton}
									textStyle={fontStyles.bigTextStyleWhite}
									onPress={async () => {
										await this.goToQuestionsScreen();
									}}
									disabled={this.state.isLoading}
								/>
							</View>
						)}
					</View>
					<View style={{ flex: 0.5 }}></View>
					<View style={{ flex: 1 }}></View>
				</View>
				<ErrorAlert
					isVisible={this.state.isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<ErrorAlert
					isVisible={this.state.productDeleted}
					onPress={() => {
						this.setState({ productDeleted: false });
						this.props.navigation.push('ProviderScreens', {
							providerID: this.props.navigation.state.params.providerID
						});
					}}
					title={strings.Success}
					message={strings.ProductDeleted}
				/>
				<ErrorAlert
					isVisible={this.state.fieldsError}
					onPress={() => {
						this.setState({ fieldsError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseCompleteAllTheFields}
				/>
				<ErrorAlert
					isVisible={this.state.serviceDescriptionError}
					onPress={() => {
						this.setState({ serviceDescriptionError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseEnterADescriptionWithAtLeast50Characters}
				/>
				<ErrorAlert
					isVisible={this.state.imageError}
					onPress={() => {
						this.setState({ imageError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseAddAnImage}
				/>
				<OptionPicker
					isVisible={this.state.isDeleteProductVisible}
					title={strings.DeleteService}
					message={strings.AreYouSureDeleteService}
					confirmText={strings.Yes}
					cancelText={strings.Cancel}
					clickOutside={true}
					confirmOnPress={async () => {
						const { productID, providerID } = this.props.navigation.state.params;
						this.setState({ isLoading: true, isDeleteProductVisible: false });
						try {
							await FirebaseFunctions.deleteService(productID, providerID);
							this.setState({ isLoading: false, productDeleted: true });
						} catch (error) {
							this.setState({ isLoading: false, isErrorVisible: true });
							FirebaseFunctions.logIssue(error, {
								screen: 'EditProductScreen',
								userID: 'p-' + providerID,
								productID
							});
						}
					}}
					cancelOnPress={() => {
						this.setState({ isDeleteProductVisible: false });
					}}
				/>
				<ImagePicker
					imageHeight={250}
					imageWidth={Dimensions.get('window').width}
					onImageSelected={(response) => {
						this.setState({ isShowing: false });
						if (response) {
							const source = { uri: 'data:image/jpeg;base64,' + response.data };
							if (!(source.uri === 'data:image/jpeg;base64,undefined')) {
								//Sets the source of the image if one has been selected
								this.setState({
									imageSource: source,
									response
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
export default createProductScreen;

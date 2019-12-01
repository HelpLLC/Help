//This screen is going to allow customers to view a service that they've already requested & the questions and
//the date that it was scheduled. The user, from this screen, will be able to cancel the request, message the business
//or edit certain aspects of the request
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import { View, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import OptionPicker from '../components/OptionPicker';
import strings from 'config/strings';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import { CachedImage } from 'react-native-img-cache';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import HelpAlert from '../components/HelpAlert';

//Creates the class and exports it
export default class serviceRequestedScreen extends Component {
	//The initial state containing the passed in params
	state = {
		isLoading: false,
		isScreenLoading: true,
		product: this.props.navigation.state.params.product,
		requester: this.props.navigation.state.params.requester,
		request: '',
		isErrorVisible: false,
		isCancelRequestVisible: false,
		requestCancelled: false,
		image: ''
	};
	//Fetches the image for this product along with getting the specifc request from the product's current requests
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ServiceRequestedScreen', 'serviceRequestedScreen');
		const image = await FirebaseFunctions.getProductImageByID(this.state.product.serviceID);
		const request = this.state.product.requests.currentRequests.find((element) => {
			return element.requesterID === this.state.requester.requesterID;
		});
		this.setState({ isScreenLoading: false, image, request });
	}

	//This method returns true if any of the fields in a default question object are true. Other wise returns false
	isObjectTruthy(object) {
		for (const field in object) {
			if (object[field].isSelected === true) {
				return true;
			}
		}
		return false;
	}

	//Renders the view
	render() {
		//Fetches the state
		const {
			product,
			request,
			isScreenLoading,
			image,
			isCancelRequestVisible,
			isErrorVisible,
			requester,
			requestCancelled
		} = this.state;
		if (isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.CustomerRequest}
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
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.CustomerRequest}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<View
						style={{
							flexDirection: 'row',
							width: Dimensions.get('window').width - 40,
							alignItems: 'center',
							alignSelf: 'center',
							justifyContent: 'space-between'
						}}>
						<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
							<View
								style={{
									justifyContent: 'flex-end',
									marginVertical: Dimensions.get('window').height * 0.03
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>{product.serviceTitle}</Text>
							</View>
							<View>
								<Text style={fontStyles.mainTextStyleBlack}>{strings.RequestedOn}</Text>
								<View style={{ height: Dimensions.get('window').height * 0.01 }}></View>
								<Text style={fontStyles.mainTextStyleBlack}>{request.dateRequested}</Text>
							</View>
						</View>
						<CachedImage
							source={image}
							style={{
								width: Dimensions.get('window').width * 0.25,
								height: Dimensions.get('window').width * 0.25,
								borderColor: colors.lightBlue,
								borderWidth: (Dimensions.get('window').width * 0.25) / 17,
								borderRadius: (Dimensions.get('window').width * 0.25) / 2
							}}
						/>
					</View>
					{//Renders the scheduled time if there is one
					request.daySelected ? (
						request.selectedTime ? (
							<View
								style={{
									width: Dimensions.get('window').width * 0.9,
									marginTop: Dimensions.get('window').height * 0.05,
									alignSelf: 'center',
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>
									{strings.ScheduledOn} {request.daySelected} {strings.at} {request.selectedTime}
								</Text>
							</View>
						) : (
							<View
								style={{
									width: Dimensions.get('window').width * 0.9,
									marginTop: Dimensions.get('window').height * 0.05,
									alignSelf: 'center',
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>
									{strings.ScheduledOn} {request.daySelected}
								</Text>
							</View>
						)
					) : request.selectedTime ? (
						<View
							style={{
								width: Dimensions.get('window').width * 0.9,
								marginTop: Dimensions.get('window').height * 0.05,
								alignSelf: 'center',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>
								{strings.ScheduledAt} {request.selectedTime}
							</Text>
						</View>
					) : (
						<View></View>
					)}
					{request.answers ? (
						<View
							style={{
								marginTop: Dimensions.get('window').height * 0.025,
								borderBottomColor: colors.lightBlue,
								borderBottomWidth: 1,
								paddingBottom: Dimensions.get('window').width * 0.01
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.Questions}</Text>
						</View>
					) : (
						<View></View>
					)}
					<FlatList
						data={request.answers}
						extraData={this.state}
						keyExtractor={(item, index) => item.question}
						renderItem={({ item, index }) => (
							<View
								style={{
									width: Dimensions.get('window').width * 0.9,
									alignSelf: 'center',
									marginVertical: Dimensions.get('window').height * 0.02
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>{item.question}</Text>
								<View
									style={{
										backgroundColor: colors.white,
										marginTop: Dimensions.get('window').height * 0.01,
										alignItems: 'flex-start',
										justifyContent: 'flex-start',
										paddingVertical: Dimensions.get('window').height * 0.01,
										width: Dimensions.get('window').width * 0.9,
										borderRadius: Dimensions.get('window').height * 0.0292825769,
										borderWidth: 3,
										borderColor: colors.lightBlue
									}}>
									<View
										style={{
											marginHorizontal: Dimensions.get('window').width * 0.025
										}}>
										<Text style={fontStyles.subTextStyleBlack}>{item.answer}</Text>
									</View>
								</View>
							</View>
						)}
					/>
					{this.state.isLoading === true ? (
						<View
							style={{
								marginTop: Dimensions.get('window').height * 0.025,
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<LoadingSpinner isVisible={true} />
						</View>
					) : (
						<View
							style={{
								marginTop: Dimensions.get('window').height * 0.025,
								flexDirection: 'row',
								justifyContent: 'space-evenly'
							}}>
							<RoundBlueButton
								title={strings.Cancel}
								style={roundBlueButtonStyle.SmallSizeButton}
								textStyle={fontStyles.mainTextStyleWhite}
								onPress={() => {
									this.setState({
										isCancelRequestVisible: true
									});
								}}
								disabled={this.state.isLoading}
							/>
							<RoundBlueButton
								title={strings.Message}
								style={roundBlueButtonStyle.SmallSizeButton}
								textStyle={fontStyles.mainTextStyleWhite}
								onPress={() => {
									this.props.navigation.push('MessagingScreen', {
										title: request.requesterName,
										providerID: product.offeredByID,
										requesterID: requester.requesterID,
										userID: requester.requesterID
									});
								}}
								disabled={this.state.isLoading}
							/>
							<RoundBlueButton
								title={strings.Edit}
								style={roundBlueButtonStyle.SmallSizeButton}
								textStyle={fontStyles.mainTextStyleWhite}
								onPress={() => {
									//Goes to the screens to edit the service
									const { product, requester, request } = this.state;
									//If the product has questions associated with it, then it will
									//go to the questions screen. If it only has a schedule associated
									//with it, it will go to the scheduling screen.
									if (
										product.questions.length > 0 ||
										this.isObjectTruthy(product.defaultQuestions)
									) {
										this.props.navigation.push('RequesterQuestionsScreen', {
											product,
											requester,
											isEditing: true,
											request
										});
									}
									//All products would require scheduling, so it goes to the
									//scheduling screen no matter what
									else {
										//Navigates to the scheduling screen
										this.props.navigation.push('RequesterScheduleScreen', {
											product,
											requester,
											isEditing: true,
											request
										});
									}
								}}
								disabled={this.state.isLoading}
							/>
						</View>
					)}
				</ScrollView>
				<OptionPicker
					isVisible={isCancelRequestVisible}
					title={strings.CancelRequest}
					message={strings.AreYouSureCancelRequest}
					confirmText={strings.Yes}
					cancelText={strings.Cancel}
					clickOutside={true}
					confirmOnPress={async () => {
						this.setState({ isCancelRequestVisible: false, isLoading: true });
						//This method will cancel the request by making sure the user wants to cancel it
						const { product, requester } = this.state;
						try {
							await FirebaseFunctions.deleteRequest(product.serviceID, requester.requesterID);
							const newRequesterObject = await FirebaseFunctions.getRequesterByID(
								requester.requesterID
							);
							const allProducts = await FirebaseFunctions.getAllProducts();
							this.setState({
								requestCancelled: true,
								isLoading: false,
								newRequesterObject,
								allProducts
							});
						} catch (error) {
							this.setState({ isLoading: false, isErrorVisible: true });
							FirebaseFunctions.logIssue(error, {
								screen: 'RequesterRequestedServiceScreen',
								userID: 'r-' + requester.requesterID,
								productID: product.productID
							});
						}
					}}
					cancelOnPress={() => {
						this.setState({ isCancelRequestVisible: false });
					}}
				/>
				<HelpAlert
					isVisible={isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<HelpAlert
					isVisible={requestCancelled}
					onPress={() => {
						this.setState({ requestCancelled: false });
						this.props.navigation.push('FeaturedScreen', {
							requester: this.state.newRequesterObject,
							allProducts: this.state.allProducts
						});
					}}
					title={strings.Success}
					message={strings.RequestHasBeenCancelled}
				/>
			</HelpView>
		);
	}
}

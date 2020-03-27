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
import FastImage from 'react-native-fast-image';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpAlert from '../components/HelpAlert';

//Creates the class and exports it
export default class serviceRequestedScreen extends Component {
	//The initial state containing the passed in params
	state = {
		isLoading: false,
		isScreenLoading: true,
		request: '',
		service: '',
		isErrorVisible: false,
		isCancelRequestVisible: false,
		requestCancelled: false,
		image: ''
	};
	//Fetches the image for this service along with getting the specifc request from the service's current requests
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ServiceRequestedScreen', 'serviceRequestedScreen');

		//Fetches the request object
		const { requestID, customer } = this.props.navigation.state.params;
		const request = await FirebaseFunctions.call('getRequestByID', {
			requestID
		});
		const service = await FirebaseFunctions.call('getServiceByID', {
			serviceID: request.serviceID
		});
		const image = await FirebaseFunctions.call('getServiceImageByID', {
			serviceID: request.serviceID
		});
		this.setState({ isScreenLoading: false, image, request, service, customer });
	}

	//Renders the view
	render() {
		//Fetches the state
		const {
			service,
			request,
			customer,
			isScreenLoading,
			image,
			isCancelRequestVisible,
			isErrorVisible,
			requestCancelled,
			completed
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
			<View style={screenStyle.container}>
				<TopBanner
					title={strings.CustomerRequest}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<FlatList
					data={request.questions}
					extraData={this.state}
					keyExtractor={(item, index) => item.question}
					ListHeaderComponent={
						<View>
							<View
								style={{
									flexDirection: 'row',
									width: screenWidth - 40,
									alignItems: 'center',
									alignSelf: 'center',
									justifyContent: 'space-between'
								}}>
								<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
									<View
										style={{
											justifyContent: 'flex-end',
											marginVertical: screenHeight * 0.03
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>{service.serviceTitle}</Text>
									</View>
									<View>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.RequestedOn}</Text>
										<View style={{ height: screenHeight * 0.01 }}></View>
										<Text style={fontStyles.mainTextStyleBlack}>{request.requestedOn}</Text>
									</View>
								</View>
								<FastImage
									source={image}
									style={{
										width: screenWidth * 0.25,
										height: screenWidth * 0.25,
										borderColor: colors.lightBlue,
										borderWidth: (screenWidth * 0.25) / 17,
										borderRadius: (screenWidth * 0.25) / 2
									}}
								/>
							</View>
							<View
								style={{
									width: screenWidth * 0.9,
									marginTop: screenHeight * 0.05,
									alignSelf: 'center',
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								{request.status === 'COMPLETE' ? (
									<Text style={fontStyles.mainTextStyleBlack}>
										{strings.CompletedOn} {request.date}
									</Text>
								) : (
									<Text style={fontStyles.mainTextStyleBlack}>
										{strings.ScheduledOn} {request.date} {strings.at} {request.time}
									</Text>
								)}
							</View>
							{request.questions.length > 0 ? (
								<View
									style={{
										marginTop: screenHeight * 0.025,
										borderBottomColor: colors.lightBlue,
										borderBottomWidth: 1,
										paddingBottom: screenWidth * 0.01
									}}>
									<Text style={fontStyles.bigTextStyleBlack}>{strings.Questions}</Text>
								</View>
							) : (
								<View></View>
							)}
						</View>
					}
					renderItem={({ item, index }) => (
						<View
							style={{
								width: screenWidth * 0.9,
								alignSelf: 'center',
								marginVertical: screenHeight * 0.02
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>{item.question}</Text>
							<View
								style={{
									backgroundColor: colors.white,
									marginTop: screenHeight * 0.01,
									alignItems: 'flex-start',
									justifyContent: 'flex-start',
									paddingVertical: screenHeight * 0.01,
									width: screenWidth * 0.9,
									borderRadius: screenHeight * 0.0292825769,
									borderWidth: 3,
									borderColor: colors.lightBlue
								}}>
								<View
									style={{
										marginHorizontal: screenWidth * 0.025
									}}>
									<Text style={fontStyles.subTextStyleBlack}>{item.answer}</Text>
								</View>
							</View>
						</View>
					)}
					ListFooterComponent={
						<View style={{ marginBottom: screenHeight * 0.1 }}>
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: screenHeight * 0.025
								}}>
								{request.status === 'COMPLETE' ? (
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											width: screenWidth * 0.9,
											marginBottom: screenHeight * 0.015
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.BilledAmount}</Text>
										<Text style={fontStyles.mainTextStyleBlack}>
											{strings.DollarSign + request.billedAmount}
										</Text>
									</View>
								) : (
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											width: screenWidth * 0.9,
											marginBottom: screenHeight * 0.015
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.Price}</Text>
										<Text style={fontStyles.mainTextStyleBlack}>{request.priceText}</Text>
									</View>
								)}
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										width: screenWidth * 0.9,
										marginBottom: screenHeight * 0.015
									}}>
									<Text style={fontStyles.mainTextStyleBlack}>{strings.Date}</Text>
									<Text style={fontStyles.mainTextStyleBlack}>{request.date}</Text>
								</View>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										width: screenWidth * 0.9,
										marginBottom: screenHeight * 0.015
									}}>
									<Text style={fontStyles.mainTextStyleBlack}>{strings.Time}</Text>
									<Text style={fontStyles.mainTextStyleBlack}>{request.time}</Text>
								</View>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										width: screenWidth * 0.9,
										marginBottom: screenHeight * 0.015
									}}>
									<Text style={fontStyles.mainTextStyleBlack}>{strings.PaymentType}</Text>
									<Text style={fontStyles.mainTextStyleBlack}>
										{request.cash === true ? strings.Cash : strings.Card}
									</Text>
								</View>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										width: screenWidth * 0.9,
										marginBottom: screenHeight * 0.015
									}}>
									<Text style={fontStyles.mainTextStyleBlack}>{strings.RequestID}</Text>
									<Text style={fontStyles.smallTextStyleBlack}>{request.requestID}</Text>
								</View>
							</View>
							{this.state.isLoading === true ? (
								<View
									style={{
										marginTop: screenHeight * 0.025,
										justifyContent: 'center',
										alignItems: 'center'
									}}>
									<LoadingSpinner isVisible={true} />
								</View>
							) : request.status === 'COMPLETE' ? (
								<View
									style={{
										marginTop: screenHeight * 0.025,
										flexDirection: 'row',
										justifyContent: 'space-evenly'
									}}>
									<RoundBlueButton
										title={strings.OrderAgain}
										style={roundBlueButtonStyle.MediumSizeButton}
										textStyle={fontStyles.bigTextStyleWhite}
										onPress={() => {
											this.props.navigation.push('RequesterServiceScreen', {
												serviceID: service.serviceID,
												customerID: service.customerID,
												businessID: request.businessID
											});
										}}
										disabled={this.state.isLoading}
									/>
								</View>
							) : (
								<View
									style={{
										marginTop: screenHeight * 0.025,
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
										title={strings.Edit}
										style={roundBlueButtonStyle.SmallSizeButton}
										textStyle={fontStyles.mainTextStyleWhite}
										onPress={() => {
											//If the product has questions associated with it, then it will
											//go to the questions screen. If it only has a schedule associated
											//with it, it will go to the scheduling screen.
											if (service.questions.length > 0) {
												this.props.navigation.push('ServiceQuestionsScreen', {
													service,
													customer,
													isEditing: true,
													request
												});
											}
											//All products would require scheduling, so it goes to the
											//scheduling screen no matter what
											else {
												//Navigates to the scheduling screen
												this.props.navigation.push('BusinessScheduleScreen', {
													service,
													customer,
													isEditing: true,
													request
												});
											}
										}}
										disabled={this.state.isLoading}
									/>
								</View>
							)}
						</View>
					}
				/>
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
						const { service, customer } = this.state;
						try {
							await FirebaseFunctions.call('deleteRequest', {
								serviceID: service.serviceID,
								customerID: customer.customerID,
								businessID: request.businessID,
								requestID: request.requestID
							});
							const newCustomerObject = await FirebaseFunctions.call('getCustomerByID', {
								customerID: customer.customerID
							});
							const allServices = await FirebaseFunctions.call('getAllServices', {});
							this.setState({
								requestCancelled: true,
								isLoading: false,
								newCustomerObject,
								allServices
							});
						} catch (error) {
							this.setState({ isLoading: false, isErrorVisible: true });
							FirebaseFunctions.call('logIssue', {
								error,
								userID: {
									screen: 'CustomerRequestedServiceScreen',
									userID: 'c-' + customer.customerID,
									serviceID: service.serviceID
								}
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
							customer: this.state.newCustomerObject,
							allServices: this.state.allServices
						});
					}}
					title={strings.Success}
					message={strings.RequestHasBeenCancelled}
				/>
			</View>
		);
	}
}

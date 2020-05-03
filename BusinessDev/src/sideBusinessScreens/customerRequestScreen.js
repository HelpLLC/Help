//This screen is going to represent a specific request for bsinesses for a specific service. It will
//show the scheduled date, if applicable, along with answers to the qestions, if applicable
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import { View, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import OptionPicker from '../components/OptionPicker';
import strings from 'config/strings';
import TopBanner from '../components/TopBanner/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import FastImage from 'react-native-fast-image';
import { screenWidth, screenHeight } from 'config/dimensions';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpButton from '../components/HelpButton/HelpButton';
 
import HelpAlert from '../components/HelpAlert';

//Creates the class and exports it
export default class customerRequestScreen extends Component {
	//Fetches the image for this requester
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CustomerRequestScreen', 'customerRequestScreen');

		const { requestID } = this.props.navigation.state.params;
		const request = await FirebaseFunctions.call('getRequestByID', { requestID });

		const image = await FirebaseFunctions.call('getProfilePictureByID', {
			customerID: request.customerID
		});
		this.setState({ isScreenLoading: false, image, request });
	}

	//The initial state containing the passed in params
	state = {
		isLoading: false,
		isScreenLoading: true,
		request: '',
		isDeleteRequestVisible: false,
		isErrorVisible: false,
		requestDeleted: false,
		image: ''
	};
	//Renders the view
	render() {
		//Fetches the state
		const {
			request,
			isScreenLoading,
			image,
			isDeleteRequestVisible,
			isErrorVisible,
			requestDeleted
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
										<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>{request.customerName}</Text>
									</View>
									<View>
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{strings.RequestedOn}</Text>
										<View style={{ height: screenHeight * 0.01 }}></View>
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{request.requestedOn}</Text>
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
								{request.status !== 'COMPLETE' ? (
									<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>
										{strings.ScheduledOn} {request.date} {strings.at} {request.time}
									</Text>
								) : (
									<View></View>
								)}
							</View>
							{request.questions.length > 0 ? (
								<View
									style={{
										marginTop: screenHeight * 0.025,
										borderBottomColor: colors.lightBlue,
										width: screenWidth * 0.9,
										alignSelf: 'center',
										borderBottomWidth: 1,
										paddingBottom: screenWidth * 0.01
									}}>
									<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>{strings.CustomerAnswers}</Text>
								</View>
							) : (
								<View></View>
							)}
						</View>
					}
					data={request.questions}
					extraData={this.state}
					keyExtractor={(item, index) => item.question}
					renderItem={({ item, index }) => (
						<View
							style={{
								width: screenWidth * 0.9,
								alignSelf: 'center',
								marginVertical: screenHeight * 0.02
							}}>
							<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{item.question}</Text>
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
									<Text style={[fontStyles.subTextStyle, fontStyles.black]}>{item.answer}</Text>
								</View>
							</View>
						</View>
					)}
					ListFooterComponent={
						<View>
							{this.state.isLoading === true ? (
								<View
									style={{
										marginTop: screenHeight * 0.025,
										justifyContent: 'center',
										alignItems: 'center'
									}}>
									<LoadingSpinner isVisible={true} />
								</View>
							) : (
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
											<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{strings.BilledAmount}</Text>
											<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>
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
											<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{strings.Price}</Text>
											<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{request.priceText}</Text>
										</View>
									)}
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											width: screenWidth * 0.9,
											marginBottom: screenHeight * 0.015
										}}>
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{strings.Date}</Text>
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{request.date}</Text>
									</View>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											width: screenWidth * 0.9,
											marginBottom: screenHeight * 0.015
										}}>
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{strings.Time}</Text>
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{request.time}</Text>
									</View>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											width: screenWidth * 0.9,
											marginBottom: screenHeight * 0.015
										}}>
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{strings.PaymentType}</Text>
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>
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
										<Text style={[fontStyles.mainTextStyle, fontStyles.black]}>{strings.RequestID}</Text>
										<Text style={[fontStyles.smallTextStyle, fontStyles.black]}>{request.requestID}</Text>
									</View>
									{request.status !== 'COMPLETE' ? (
										<View
											style={{
												marginTop: screenHeight * 0.025,
												width: screenWidth,
												flexDirection: 'row',
												justifyContent: 'space-evenly'
											}}>
											<HelpButton
												title={strings.Delete}
												width={screenWidth * 0.278}
												onPress={() => {
													this.setState({
														isDeleteRequestVisible: true
													});
												}}
												disabled={this.state.isLoading}
											/>
											<HelpButton
												title={strings.Complete}
												width={screenWidth * 0.278}
												onPress={() => {
													this.props.navigation.push('BillCustomerScreen', {
														request: request
													});
												}}
												disabled={this.state.isLoading}
											/>
										</View>
									) : (
										<View></View>
									)}
								</View>
							)}
							<OptionPicker
								isVisible={isDeleteRequestVisible}
								title={strings.DeleteRequest}
								message={strings.AreYouSureDeleteRequest}
								clickOutside={true}
								confirmText={strings.Delete}
								cancelText={strings.Cancel}
								confirmOnPress={async () => {
									this.setState({ isDeleteRequestVisible: false });
									//This method will delete a specific request based on the passed in requester ID
									try {
										this.setState({ isLoading: true });
										await FirebaseFunctions.call('deleteRequest', {
											serviceID: request.serviceID,
											requesterID: request.requesterID,
											requestID: request.requestID
										});
										this.setState({
											requestDeleted: true,
											isLoading: false
										});
									} catch (error) {
										this.setState({ isLoading: false, isErrorVisible: true });
										FirebaseFunctions.call('logIssue', {
											error,
											userID: {
												screen: 'BusinessCustomerRequestScreen',
												userID: 'b-' + request.buesinssID,
												serviceID: request.serviceID
											}
										});
									}
								}}
								cancelOnPress={() => {
									this.setState({ isDeleteRequestVisible: false });
								}}
							/>
							<HelpAlert
								isVisible={requestDeleted}
								onPress={() => {
									this.setState({ requestDeleted: false });
									//Updates the state of the screen to remove the request from
									//the screen
									this.props.navigation.push('BusinessScreens', {
										businessID: request.serviceID
									});
								}}
								title={strings.RequestDeleted}
								message={strings.RequestHasBeenDeleted}
							/>
							<HelpAlert
								isVisible={isErrorVisible}
								onPress={() => {
									this.setState({ isErrorVisible: false });
								}}
								title={strings.Whoops}
								message={strings.SomethingWentWrong}
							/>
						</View>
					}
				/>
			</View>
		);
	}
}

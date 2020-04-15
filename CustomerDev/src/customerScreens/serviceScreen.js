//This screen will be the one where the user will be able to view a service's details, price, name
//of the business providing it, etc. There will be a button at the bottom of the screen allowing the
//customer to request the service.
import React, { Component } from 'react';
import {
	View,
	Dimensions,
	TouchableOpacity,
	Text,
	ScrollView,
	Linking,
	FlatList
} from 'react-native';
import HelpView from '../components/HelpView';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import HelpButton from '../components/HelpButton';
import helpButtonStyles from 'config/styles/helpButtonStyles';
import LoadingSpinner from '../components/LoadingSpinner';
import { screenWidth, screenHeight } from 'config/dimensions';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import HelpAlert from '../components/HelpAlert';
import OptionPicker from '../components/OptionPicker';
import screenStyle from 'config/styles/screenStyle';
import images from '../../config/images/images';
import FastImage from 'react-native-fast-image';
import TopBanner from '../components/TopBanner';
import ViewMoreText from 'react-native-view-more-text';
import call from 'react-native-phone-call';
import email from 'react-native-email';
import CustomerReviewCard from '../components/CustomerReviewCard';
import { Icon } from 'react-native-elements';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ActionSheet from 'react-native-actionsheet';

class serviceScreen extends Component {
	state = {
		isLoading: true,
		service: '',
		isRequested: '',
		isErrorVisible: false,
		isRequestServiceVisible: false,
		businessID: '',
		business: '',
		customerID: '',
		customer: '',
		reviews: '',
		isCancelRequestVisible: false,
		image: images.BlankWhite,
		isBusinessReportedVisible: false,
		isBlockBusinessVisible: false,
		isBusinessBlockedVisible: false
	};

	//This will fetch the data about this business and the service from firestore
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CustomerServiceScreen', 'serviceScreen');
		const { serviceID, customerID, businessID } = this.props.navigation.state.params;
		try {
			//Records that the customer viewed the service
			await FirebaseFunctions.call('viewService', {
				serviceID,
				businessID
			});
			const customer = await FirebaseFunctions.call('getCustomerByID', { customerID });
			const business = await FirebaseFunctions.call('getBusinessByID', { businessID });
			const service = await FirebaseFunctions.call('getServiceByID', { serviceID });
			const url = await FirebaseFunctions.call('getServiceImageByID', { serviceID: serviceID });

			const isRequested = customer.currentRequests.find(
				(element) => element.serviceID === serviceID
			);

			if (isRequested) {
				this.setState({
					isLoading: false,
					business,
					businessID,
					customer,
					customerID,
					isRequested: true,
					service,
					image: url,
					requestID: isRequested.requestID,
					reviews: service.displayedReviews
				});
			} else {
				this.setState({
					isLoading: false,
					business,
					businessID,
					customer,
					customerID,
					isRequested: false,
					service,
					image: url,
					reviews: service.displayedReviews
				});
			}
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'CustomerServiceScreen',
					userID: 'c-' + customerID,
					serviceID
				}
			});
		}
		this.setState({ isLoading: false });
	}

	callNumber(phoneNumber) {
		const args = {
			number: phoneNumber, // String value with the number to call
			prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call
		};
		const { customer } = this.state;
		try {
			call(args);
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'ServiceScreen',
					userID: 'c-' + customer.customerID,
					serviceID: serviceID
				}
			});
		}
	}

	handleEmail(emailAddress) {
		const { customer } = this.state;
		const to = [emailAddress]; // string or array of email addresses
		try {
			email(to, {
				// Optional additional arguments
				subject: 'Your Service on Help ' + this.state.service.serviceTitle
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'ServiceScreen',
					userID: 'c-' + customer.customerID,
					serviceID: service.serviceID
				}
			});
		}
	}

	async blockBusiness() {
		const { business, customer } = this.state;

		//First blocks the user
		this.setState({ isLoading: true });
		await FirebaseFunctions.call('blockBusiness', {
			customerID: customer.customerID,
			businessID: business.businessID
		});

		//Navigates back to the request screen
		try {
			const newCustomerObject = await FirebaseFunctions.call('getCustomerByID', {
				customerID: customer.customerID
			});
			const allServices = await FirebaseFunctions.call('getAllServices', {});
			this.setState({
				isLoading: false,
				isBusinessBlockedVisible: true,
				allServices,
				newCustomerObject
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
		}
	}

	reportBusiness() {
		const { business, customer } = this.state;
		FirebaseFunctions.call('reportIssue', {
			userID: customer.customerID,
			issue: 'Report against business #' + business.businessID
		});
		this.setState({ isBusinessReportedVisible: true });
	}

	//Renders the UI
	render() {
		const {
			service,
			isLoading,
			isRequested,
			customer,
			business,
			businessID,
			customerID
		} = this.state;
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.Service}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
						<LoadingSpinner isVisible={isLoading} />
					</View>
				</HelpView>
			);
		} else {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.Service}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<ScrollView>
						<View>
							<View
								style={{
									flexDirection: 'column',
									marginTop: screenHeight * 0.02,
									width: screenWidth
								}}>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										width: screenWidth
									}}>
									<View
										style={{
											justifyContent: 'flex-start',
											marginLeft: screenWidth * 0.05,
											flexDirection: 'column'
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>{service.serviceTitle}</Text>
									</View>
								</View>
								<View
									style={{
										marginLeft: screenWidth * 0.04,
										alignItems: 'center',
										justifyContent: 'space-between',
										flexDirection: 'row'
									}}>
									<View style={{ flexDirection: 'row' }}>
										<AirbnbRating
											count={5}
											size={15}
											isDisabled={true}
											defaultRating={service.averageRating}
											showRating={false}
										/>
										<Text style={fontStyles.subTextStyleBlack}> ({service.totalReviews})</Text>
									</View>
									<View
										style={{
											marginRight: screenWidth * 0.05
										}}>
										<TouchableOpacity onPress={() => this.ActionSheet.show()}>
											<Icon
												name='ellipsis-h'
												type='font-awesome'
												size={40}
												color={colors.lightBlue}
											/>
										</TouchableOpacity>
									</View>
								</View>
								<View
									style={{
										justifyContent: 'flex-start',
										marginLeft: screenWidth * 0.05
									}}>
									<View>
										<Text style={fontStyles.subTextStyleGray}>{strings.OfferedBy}</Text>
									</View>
									<TouchableOpacity
										onPress={() => {
											this.props.navigation.push('BusinessProfileScreen', {
												business,
												customer
											});
										}}>
										<Text style={fontStyles.bigTextStyleBlue}>{business.businessName}</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View
								style={{
									borderBottomColor: colors.lightBlue,
									borderTopColor: colors.lightBlue,
									borderBottomWidth: 4,
									borderTopWidth: 4,
									width: screenWidth,
									height: 258,
									marginVertical: screenHeight * 0.02
								}}>
								<FastImage
									style={{
										width: screenWidth,
										height: 250
									}}
									source={this.state.image}
								/>
							</View>
							<View
								style={{
									marginVertical: screenHeight * 0.03
								}}>
								<View
									style={{
										justifyContent: 'center',
										width: screenWidth * 0.92,
										marginLeft: screenWidth * 0.04
									}}>
									<ViewMoreText
										numberOfLines={3}
										renderViewMore={(onPress) => {
											return (
												<TouchableOpacity
													onPress={onPress}
													style={{
														width: screenWidth * 0.3,
														height: screenHeight * 0.1
													}}>
													<Text style={fontStyles.mainTextStyleBlue}>{strings.ReadMore}</Text>
												</TouchableOpacity>
											);
										}}
										renderViewLess={(onPress) => {
											return (
												<TouchableOpacity
													onPress={onPress}
													style={{
														width: screenWidth * 0.3,
														height: screenHeight * 0.1
													}}>
													<Text style={fontStyles.mainTextStyleBlue}>{strings.ReadLess}</Text>
												</TouchableOpacity>
											);
										}}
										textStyle={{ textAlign: 'left' }}>
										<Text style={fontStyles.subTextStyleBlack}>{service.serviceDescription}</Text>
									</ViewMoreText>
								</View>
								<View
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										marginBottom: screenHeight * 0.04
									}}>
									<Text style={fontStyles.bigTextStyleBlack}>{service.priceText}</Text>
								</View>

								{//First tests if the service has been removed by the business (in this case, the service
								//is probably being accessed from order history). If the service still exists, it will test
								//if the service has been requested or not
								this.state.service.isDeleted && this.state.service.isDeleted === true ? (
									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											marginTop: screenHeight * 0.05,
											width: screenWidth * 0.95
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>{strings.ServiceDeleted}</Text>
									</View>
								) : isRequested === false ? (
									<View
										style={{
											flex: 1,
											justifyContent: 'center',
											alignItems: 'center',
											marginTop: screenHeight * 0.05
										}}>
										<HelpButton
											title={strings.Request}
											style={helpButtonStyles.MediumSizeButton}
											textStyle={fontStyles.bigTextStyleWhite}
											onPress={() => {
												const { service, customer } = this.state;
												//If the service has questions associated with it, then it will
												//go to the questions screen. If it only has a schedule associated
												//with it, it will go to the scheduling screen.
												if (service.questions.length > 0) {
													this.props.navigation.push('ServiceQuestionsScreen', {
														service,
														customer,
														isEditing: false
													});
												}
												//All services would require scheduling, so it goes to the
												//scheduling screen no matter what
												else {
													//Navigates to the scheduling screen
													this.props.navigation.push('BusinessScheduleScreen', {
														service,
														customer,
														isEditing: false
													});
												}
											}}
										/>
									</View>
								) : (
									<View
										style={{
											flex: 1,
											justifyContent: 'center',
											alignItems: 'center',
											marginTop: screenHeight * 0.05
										}}>
										<HelpButton
											title={strings.ViewRequest}
											style={[helpButtonStyles.MediumSizeButton, { width: screenWidth * 0.45 }]}
											textStyle={fontStyles.bigTextStyleWhite}
											onPress={() => {
												//This take the user to the screen to view their request for this service
												this.props.navigation.push('ServiceRequestedScreen', {
													requestID: this.state.requestID,
													customer
												});
											}}
										/>
									</View>
								)}
							</View>
							<View
								style={{
									marginTop: screenHeight * 0.05,
									justifyContent: 'center',
									flexDirection: 'column',
									alignSelf: 'center',
									borderBottomWidth: 0.5,
									borderBottomColor: colors.gray,
									width: screenWidth * 0.9
								}}>
								<View
									style={{
										flexDirection: 'row',
										width: screenWidth * 0.9,
										justifyContent: 'space-between',
										alignSelf: 'center',
										borderTopWidth: 0.5,
										borderTopColor: colors.gray
									}}>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-start',
											marginTop: screenHeight * 0.01,
											marginBottom: screenHeight * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.BusinessName}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: screenHeight * 0.01,
											alignItems: 'flex-end'
										}}>
										<TouchableOpacity
											onPress={() => {
												this.props.navigation.push('BusinessProfileScreen', {
													business,
													customer
												});
											}}>
											<Text style={fontStyles.mainTextStyleBlue}>{business.businessName}</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										width: screenWidth * 0.9,
										justifyContent: 'space-between',
										alignSelf: 'center',
										borderTopWidth: 0.5,
										borderTopColor: colors.gray
									}}>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-start',
											marginTop: screenHeight * 0.01,
											marginBottom: screenHeight * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.PhoneNumber}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: screenHeight * 0.01,
											alignItems: 'flex-end'
										}}>
										<TouchableOpacity
											onPress={() => {
												this.callNumber(business.phoneNumber);
											}}>
											<Text style={fontStyles.mainTextStyleBlue}>{business.phoneNumber}</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										width: screenWidth * 0.9,
										justifyContent: 'space-between',
										alignSelf: 'center',
										borderTopWidth: 0.5,
										borderTopColor: colors.gray
									}}>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-start',
											marginTop: screenHeight * 0.01,
											marginBottom: screenHeight * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.Email}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: screenHeight * 0.01,
											alignItems: 'flex-end'
										}}>
										<TouchableOpacity
											onPress={() => {
												this.handleEmail(business.email);
											}}>
											<Text style={fontStyles.mainTextStyleBlue}>
												{business.email.length > 14
													? business.email.substring(0, 13) + strings.DotDotDot
													: business.email}
											</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										width: screenWidth * 0.9,
										justifyContent: 'space-between',
										alignSelf: 'center',
										borderTopWidth: 0.5,
										borderTopColor: colors.gray
									}}>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-start',
											marginTop: screenHeight * 0.01,
											marginBottom: screenHeight * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.City}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: screenHeight * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{business.location}</Text>
									</View>
								</View>
								{business.website && business.website.length > 0 ? (
									<View
										style={{
											flexDirection: 'row',
											width: screenWidth * 0.9,
											justifyContent: 'space-between',
											alignSelf: 'center',
											borderTopWidth: 0.5,
											borderTopColor: colors.gray
										}}>
										<View
											style={{
												flexDirection: 'column',
												justifyContent: 'flex-start',
												marginTop: screenHeight * 0.01,
												marginBottom: screenHeight * 0.01
											}}>
											<Text style={fontStyles.mainTextStyleBlack}>{strings.Website}</Text>
										</View>
										<View
											style={{
												flexDirection: 'column',
												justifyContent: 'flex-end',
												marginBottom: screenHeight * 0.01,
												alignItems: 'flex-end'
											}}>
											<TouchableOpacity
												onPress={() => {
													try {
														Linking.openURL('https://' + business.website);
													} catch (error) {
														this.setState({
															isLoading: false,
															isErrorVisible: true
														});
														FirebaseFunctions.call('logIssue', {
															error,
															userID: {
																screen: 'ServiceScreen',
																userID: 'c-' + customer.customerID,
																serviceID: service.serviceID
															}
														});
													}
												}}>
												<Text style={fontStyles.mainTextStyleBlue}>{business.website}</Text>
											</TouchableOpacity>
										</View>
									</View>
								) : (
									<View></View>
								)}
							</View>
							<View
								style={{
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: screenHeight * 0.02,
									marginHorizontal: screenWidth * 0.05
								}}>
								<Text style={fontStyles.subTextStyleBlack}>{business.businessDescription}</Text>
							</View>
							<View
								style={{
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: screenHeight * 0.02
								}}>
								<TouchableOpacity
									onPress={() => {
										this.props.navigation.push('BusinessProfileScreen', {
											business,
											customer
										});
									}}>
									<Text style={fontStyles.mainTextStyleBlue}>{strings.MoreByThisBusiness}</Text>
								</TouchableOpacity>
							</View>
							<View style={{ height: screenHeight * 0.05 }}></View>
							{this.state.reviews.length > 0 ? (
								<View>
									<View
										style={{
											alignItems: 'flex-start',
											alignSelf: 'center',
											width: screenWidth * 0.9,
											marginBottom: screenHeight * 0.05
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.CustomerReviews}</Text>
									</View>
									<FlatList
										showsHorizontalScrollIndicator={false}
										data={this.state.reviews}
										keyExtractor={(item) => item.customerID}
										showsVerticalScrollIndicator={false}
										renderItem={({ item, index }) =>
											item.comment.trim().length > 0 ? (
												<View key={index}>
													<CustomerReviewCard
														stars={item.stars}
														comment={item.comment}
														customerName={item.name}
														customerID={item.customerID}
													/>
												</View>
											) : (
												<View></View>
											)
										}
									/>
								</View>
							) : (
								<View></View>
							)}
							<View style={{ height: screenHeight * 0.05 }}></View>
						</View>
					</ScrollView>
					<HelpAlert
						isVisible={this.state.isErrorVisible}
						onPress={() => {
							this.setState({ isErrorVisible: false });
						}}
						title={strings.Whoops}
						message={strings.SomethingWentWrong}
					/>
					<HelpAlert
						isVisible={this.state.isBusinessReportedVisible}
						onPress={() => {
							this.setState({ isBusinessReportedVisible: false });
						}}
						title={strings.BusinessReported}
						message={strings.BusinessHasBeenReported}
					/>
					<HelpAlert
						isVisible={this.state.isBusinessBlockedVisible}
						onPress={() => {
							this.setState({ isBusinessBlockedVisible: false });
							this.props.navigation.push('FeaturedScreen', {
								customer: this.state.newCustomerObject,
								allServices: this.state.allServices
							});
						}}
						title={strings.BusinessBlocked}
						message={strings.BusinessHasBeenBlocked}
					/>
					<ActionSheet
						ref={(o) => (this.ActionSheet = o)}
						title={business.businessName}
						options={[strings.Report, strings.Block, strings.Cancel]}
						cancelButtonIndex={3}
						styles={{
							titleText: fontStyles.subTextStyleBlue
						}}
						destructiveButtonIndex={3}
						onPress={(index) => {
							if (index === 0) {
								this.reportBusiness();
							} else if (index === 1) {
								this.setState({ isBlockBusinessVisible: true });
							}
						}}
					/>
					<OptionPicker
						isVisible={this.state.isBlockBusinessVisible}
						title={strings.Block}
						message={strings.AreYouSureYouWantToBlock + ' ' + business.businessName + '?'}
						confirmText={strings.Yes}
						cancelText={strings.Cancel}
						clickOutside={true}
						confirmOnPress={() => {
							this.setState({ isBlockBusinessVisible: false });
							this.blockBusiness();
						}}
						cancelOnPress={() => {
							this.setState({ isBlockBusinessVisible: false });
						}}
					/>
				</HelpView>
			);
		}
	}
}

//Exports the screen
export default serviceScreen;

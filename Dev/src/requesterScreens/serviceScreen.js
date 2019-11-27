//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the
//requester to request the service.
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
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import LoadingSpinner from '../components/LoadingSpinner';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import ErrorAlert from '../components/ErrorAlert';
import OptionPicker from '../components/OptionPicker';
import screenStyle from 'config/styles/screenStyle';
import images from '../../config/images/images';
import { CachedImage } from 'react-native-img-cache';
import TopBanner from '../components/TopBanner';
import ViewMoreText from 'react-native-view-more-text';
import call from 'react-native-phone-call';
import email from 'react-native-email';
import CustomerReviewCard from '../components/CustomerReviewCard';
import { Icon } from 'react-native-elements';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ActionSheet from 'react-native-actionsheet';

class serviceScreen extends Component {
	//This constructor and componentDidMount will wait until all the products loaded if there are any
	constructor() {
		super();
		this.state = {
			isLoading: true,
			product: '',
			isRequested: '',
			isErrorVisible: false,
			isRequestServiceVisible: false,
			isCancelRequestVisible: false,
			image: images.BlankWhite,
			isCompanyReportedVisible: false,
			isBlockCompanyVisible: false
		};
	}

	//Fetches the data associated with this screen
	async fetchDatabaseData() {
		try {
			const { productID, requester, providerID } = this.props.navigation.state.params;
			const provider = await FirebaseFunctions.getProviderByID(providerID);
			const product = await FirebaseFunctions.getServiceByID(productID);
			const url = await FirebaseFunctions.getProductImageByID(product.serviceID);
			const isRequested = product.requests.currentRequests.findIndex((request) => {
				return request.requesterID === requester.requesterID;
			});

			if (isRequested === -1) {
				this.setState({
					isLoading: false,
					provider,
					isRequested: false,
					product,
					image: url
				});
			} else {
				this.setState({
					isLoading: false,
					provider,
					isRequested: true,
					product,
					image: url
				});
			}
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.logIssue(error, {
				screen: 'RequesterServiceScreen',
				userID: 'r-' + requesterID,
				productID
			});
		}

		return 0;
	}

	//This will fetch the data about this provider and his products from firestore
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('requesterServiceScreen', 'serviceScreen');

		this.setState({ isLoading: true });
		//Adds the listener to add the listener to refetch the data once this component is returned to
		this.willFocusListener = this.props.navigation.addListener('willFocus', async () => {
			await this.fetchDatabaseData();
			this.setState({ isLoading: false });
		});
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

	//Removes the listener when the screen is switched away from
	componentWillUnmount() {
		this.willFocusListener.remove();
	}

	callNumber(phoneNumber) {
		const args = {
			number: phoneNumber, // String value with the number to call
			prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call
		};

		try {
			call(args);
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.logIssue(error, {
				screen: 'RequesterServiceScreen',
				userID: 'r-' + requester.requesterID,
				productID: product.productID
			});
		}
	}

	handleEmail(emailAddress) {
		const to = [emailAddress]; // string or array of email addresses
		try {
			email(to, {
				// Optional additional arguments
				subject: 'Your Service on Help ' + this.state.product.serviceTitle
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.logIssue(error, {
				screen: 'RequesterServiceScreen',
				userID: 'r-' + requester.requesterID,
				productID: product.productID
			});
		}
	}

	messageProvider() {
		const { requester } = this.props.navigation.state.params;
		const { provider } = this.state;
		this.props.navigation.push('MessagingScreen', {
			title: provider.companyName,
			providerID: provider.providerID,
			requesterID: requester.requesterID,
			userID: requester.requesterID
		});
	}

	async blockCompany() {
		const { requester } = this.props.navigation.state.params;
		const { provider } = this.state;

		//First blocks the user
		this.setState({ isLoading: true });
		await FirebaseFunctions.blockCompany(requester, provider);

		//Navigates back to the request screen
		try {
			const newRequesterObject = await FirebaseFunctions.getRequesterByID(requester.requesterID);
			const allProducts = await FirebaseFunctions.getAllProducts();
			this.props.navigation.push('FeaturedScreen', {
				requester: newRequesterObject,
				allProducts
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
		}
	}

	reportCompany() {
		const { requester } = this.props.navigation.state.params;
		const { provider } = this.state;
		FirebaseFunctions.reportIssue(requester, {
			report: 'Report against a company',
			companyID: provider.providerID,
			companyName: provider.companyName
		});
		this.setState({ isCompanyReportedVisible: true });
	}

	//Renders the UI
	render() {
		const {
			product,
			isLoading,
			isRequested,
			isCancelRequestVisible,
			isRequestServiceVisible
		} = this.state;
		const { requester } = this.props.navigation.state.params;
		const { provider } = this.state;
		if (isLoading === true || isRequested === '') {
			return (
				<HelpView style={screenStyle.container}>
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
									marginTop: Dimensions.get('window').height * 0.02,
									width: Dimensions.get('window').width
								}}>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										width: Dimensions.get('window').width
									}}>
									<View
										style={{
											justifyContent: 'flex-start',
											marginLeft: Dimensions.get('window').width * 0.05,
											flexDirection: 'column'
										}}>
										<Text style={fontStyles.bigTextStyleBlack}>{product.serviceTitle}</Text>
									</View>
								</View>
								<View
									style={{
										marginLeft: Dimensions.get('window').width * 0.04,
										alignItems: 'center',
										justifyContent: 'space-between',
										flexDirection: 'row'
									}}>
									<View style={{ flexDirection: 'row' }}>
										<AirbnbRating
											count={5}
											size={15}
											isDisabled={true}
											defaultRating={product.averageRating}
											showRating={false}
										/>
										<Text style={fontStyles.subTextStyleBlack}> ({product.totalReviews})</Text>
									</View>
									<View
										style={{
											marginRight: Dimensions.get('window').width * 0.05
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
										marginLeft: Dimensions.get('window').width * 0.05
									}}>
									<View>
										<Text style={fontStyles.subTextStyleGray}>{strings.OfferedBy}</Text>
									</View>
									<TouchableOpacity
										onPress={() => {
											this.props.navigation.push('RequesterCompanyProfileScreen', {
												provider,
												requester
											});
										}}>
										<Text style={fontStyles.bigTextStyleBlue}>{provider.companyName}</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View
								style={{
									borderBottomColor: colors.lightBlue,
									borderTopColor: colors.lightBlue,
									borderBottomWidth: 4,
									borderTopWidth: 4,
									width: Dimensions.get('window').width,
									height: 258,
									marginVertical: Dimensions.get('window').height * 0.02
								}}>
								<CachedImage
									style={{
										width: Dimensions.get('window').width,
										height: 250
									}}
									source={this.state.image}
								/>
							</View>
							<View
								style={{
									marginVertical: Dimensions.get('window').height * 0.03
								}}>
								<View
									style={{
										justifyContent: 'center',
										width: Dimensions.get('window').width * 0.92,
										marginLeft: Dimensions.get('window').width * 0.04
									}}>
									<ViewMoreText
										numberOfLines={3}
										renderViewMore={(onPress) => {
											return (
												<TouchableOpacity
													onPress={onPress}
													style={{
														width: Dimensions.get('window').width * 0.3,
														height: Dimensions.get('window').height * 0.1
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
														width: Dimensions.get('window').width * 0.3,
														height: Dimensions.get('window').height * 0.1
													}}>
													<Text style={fontStyles.mainTextStyleBlue}>{strings.ReadLess}</Text>
												</TouchableOpacity>
											);
										}}
										textStyle={{ textAlign: 'left' }}>
										<Text style={fontStyles.subTextStyleBlack}>{product.serviceDescription}</Text>
									</ViewMoreText>
								</View>
								<View
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										marginBottom: Dimensions.get('window').height * 0.04
									}}>
									<Text style={fontStyles.bigTextStyleBlack}>{product.pricing}</Text>
								</View>

								{//Tests if this service has already been requested by the current user
								this.state.isRequested === false ? (
									<View
										style={{
											flex: 1,
											justifyContent: 'center',
											alignItems: 'center',
											marginTop: Dimensions.get('window').height * 0.05
										}}>
										<RoundBlueButton
											title={strings.Request}
											style={roundBlueButtonStyle.MediumSizeButton}
											textStyle={fontStyles.bigTextStyleWhite}
											onPress={() => {
												const { product } = this.state;
												//If the product has questions associated with it, then it will
												//go to the questions screen. If it only has a schedule associated
												//with it, it will go to the scheduling screen. Otherwise, it will
												//display a pop up confirming the user wants to request the product
												if (
													product.questions.length > 0 ||
													this.isObjectTruthy(product.defaultQuestions)
												) {
													const { requester } = this.props.navigation.state.params;
													this.props.navigation.push('RequesterQuestionsScreen', {
														product,
														requester
													});
												}
												//All products would require scheduling, so it goes to the
												//scheduling screen no matter what
												else {
													//Navigates to the scheduling screen
													this.props.navigation.push('RequesterScheduleScreen', {
														product,
														requester
													});
												}
											}}
										/>
									</View>
								) : (
									<View
										style={{
											justifyContent: 'space-evenly',
											alignItems: 'center'
										}}>
										<View
											style={{
												marginBottom: Dimensions.get('window').height * 0.04
											}}>
											<Text style={fontStyles.bigTextStyleBlue}>{strings.ServiceRequested}</Text>
										</View>
										<TouchableOpacity
											onPress={() => this.setState({ isCancelRequestVisible: true })}>
											<Text style={fontStyles.mainTextStyleRed}>{strings.CancelRequest}</Text>
										</TouchableOpacity>
									</View>
								)}
							</View>
							<View
								style={{
									marginTop: Dimensions.get('window').height * 0.05,
									justifyContent: 'center',
									flexDirection: 'column',
									alignSelf: 'center',
									borderBottomWidth: 0.5,
									borderBottomColor: colors.gray,
									width: Dimensions.get('window').width * 0.9
								}}>
								<View
									style={{
										flexDirection: 'row',
										width: Dimensions.get('window').width * 0.9,
										justifyContent: 'space-between',
										alignSelf: 'center',
										borderTopWidth: 0.5,
										borderTopColor: colors.gray
									}}>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-start',
											marginTop: Dimensions.get('window').height * 0.01,
											marginBottom: Dimensions.get('window').height * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.BusinessName}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: Dimensions.get('window').height * 0.01,
											alignItems: 'flex-end'
										}}>
										<TouchableOpacity
											onPress={() => {
												this.props.navigation.push('RequesterCompanyProfileScreen', {
													provider,
													requester
												});
											}}>
											<Text style={fontStyles.mainTextStyleBlue}>{provider.companyName}</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										width: Dimensions.get('window').width * 0.9,
										justifyContent: 'space-between',
										alignSelf: 'center',
										borderTopWidth: 0.5,
										borderTopColor: colors.gray
									}}>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-start',
											marginTop: Dimensions.get('window').height * 0.01,
											marginBottom: Dimensions.get('window').height * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.PhoneNumber}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: Dimensions.get('window').height * 0.01,
											alignItems: 'flex-end'
										}}>
										<TouchableOpacity
											onPress={() => {
												this.callNumber(provider.phoneNumber);
											}}>
											<Text style={fontStyles.mainTextStyleBlue}>{provider.phoneNumber}</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										width: Dimensions.get('window').width * 0.9,
										justifyContent: 'space-between',
										alignSelf: 'center',
										borderTopWidth: 0.5,
										borderTopColor: colors.gray
									}}>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-start',
											marginTop: Dimensions.get('window').height * 0.01,
											marginBottom: Dimensions.get('window').height * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.Email}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: Dimensions.get('window').height * 0.01,
											alignItems: 'flex-end'
										}}>
										<TouchableOpacity
											onPress={() => {
												this.handleEmail(provider.email);
											}}>
											<Text style={fontStyles.mainTextStyleBlue}>
												{provider.email.length > 14
													? provider.email.substring(0, 13) + strings.DotDotDot
													: provider.email}
											</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View
									style={{
										flexDirection: 'row',
										width: Dimensions.get('window').width * 0.9,
										justifyContent: 'space-between',
										alignSelf: 'center',
										borderTopWidth: 0.5,
										borderTopColor: colors.gray
									}}>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-start',
											marginTop: Dimensions.get('window').height * 0.01,
											marginBottom: Dimensions.get('window').height * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.City}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: Dimensions.get('window').height * 0.01
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{provider.location}</Text>
									</View>
								</View>
								{provider.website && provider.website.length > 0 ? (
									<View
										style={{
											flexDirection: 'row',
											width: Dimensions.get('window').width * 0.9,
											justifyContent: 'space-between',
											alignSelf: 'center',
											borderTopWidth: 0.5,
											borderTopColor: colors.gray
										}}>
										<View
											style={{
												flexDirection: 'column',
												justifyContent: 'flex-start',
												marginTop: Dimensions.get('window').height * 0.01,
												marginBottom: Dimensions.get('window').height * 0.01
											}}>
											<Text style={fontStyles.mainTextStyleBlack}>{strings.Website}</Text>
										</View>
										<View
											style={{
												flexDirection: 'column',
												justifyContent: 'flex-end',
												marginBottom: Dimensions.get('window').height * 0.01,
												alignItems: 'flex-end'
											}}>
											<TouchableOpacity
												onPress={() => {
													try {
														Linking.openURL('https://' + provider.website);
													} catch (error) {
														this.setState({
															isLoading: false,
															isErrorVisible: true
														});
														FirebaseFunctions.logIssue(error, {
															screen: 'RequesterServiceScreen',
															userID: 'r-' + requester.requesterID,
															productID: product.productID
														});
													}
												}}>
												<Text style={fontStyles.mainTextStyleBlue}>{provider.website}</Text>
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
									marginTop: Dimensions.get('window').height * 0.02,
									marginHorizontal: Dimensions.get('window').width * 0.05
								}}>
								<Text style={fontStyles.subTextStyleBlack}>{provider.companyDescription}</Text>
							</View>
							<View
								style={{
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: Dimensions.get('window').height * 0.02
								}}>
								<TouchableOpacity
									onPress={() => {
										this.props.navigation.push('RequesterCompanyProfileScreen', {
											provider,
											requester
										});
									}}>
									<Text style={fontStyles.mainTextStyleBlue}>{strings.MoreByThisBusiness}</Text>
								</TouchableOpacity>
							</View>
							<View style={{ height: Dimensions.get('window').height * 0.05 }}></View>
							{product.reviews.length > 0 ? (
								<View>
									<View
										style={{
											alignItems: 'flex-start',
											alignSelf: 'center',
											width: Dimensions.get('window').width * 0.9,
											marginBottom: Dimensions.get('window').height * 0.05
										}}>
										<Text style={fontStyles.mainTextStyleBlack}>{strings.CustomerReviews}</Text>
									</View>
									<FlatList
										showsHorizontalScrollIndicator={false}
										data={product.reviews}
										keyExtractor={(item) => item.requesterID}
										showsVerticalScrollIndicator={false}
										renderItem={({ item, index }) =>
											item.comment.trim().length > 0 ? (
												<View key={index}>
													<CustomerReviewCard
														stars={item.stars}
														comment={item.comment}
														customerName={item.requesterName}
														customerID={item.requesterID}
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
							<View style={{ height: Dimensions.get('window').height * 0.05 }}></View>
						</View>
					</ScrollView>
					<ErrorAlert
						isVisible={this.state.isErrorVisible}
						onPress={() => {
							this.setState({ isErrorVisible: false });
						}}
						title={strings.Whoops}
						message={strings.SomethingWentWrong}
					/>
					<ErrorAlert
						isVisible={this.state.isCompanyReportedVisible}
						onPress={() => {
							this.setState({ isCompanyReportedVisible: false });
						}}
						title={strings.CompanyReported}
						message={strings.CompanyHasBeenReported}
					/>
					<ActionSheet
						ref={(o) => (this.ActionSheet = o)}
						title={provider.companyName}
						options={[strings.Message, strings.Report, strings.Block, strings.Cancel]}
						cancelButtonIndex={3}
						styles={{
							titleText: fontStyles.subTextStyleBlue
						}}
						destructiveButtonIndex={3}
						onPress={(index) => {
							if (index === 1) {
								this.reportCompany();
							} else if (index === 2) {
								this.setState({ isBlockCompanyVisible: true });
							} else if (index === 0) {
								this.messageProvider();
							}
						}}
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
							const { product } = this.state;
							const { requester } = this.props.navigation.state.params;
							try {
								await FirebaseFunctions.deleteRequest(product.serviceID, requester.requesterID);
								this.setState({ isRequested: false, isLoading: false });
							} catch (error) {
								this.setState({ isLoading: false, isErrorVisible: true });
								FirebaseFunctions.logIssue(error, {
									screen: 'RequesterServiceScreen',
									userID: 'r-' + requester.requesterID,
									productID: product.productID
								});
							}
						}}
						cancelOnPress={() => {
							this.setState({ isCancelRequestVisible: false });
						}}
					/>
					<OptionPicker
						isVisible={this.state.isBlockCompanyVisible}
						title={strings.Block}
						message={strings.AreYouSureYouWantToBlock + ' ' + provider.companyName + '?'}
						confirmText={strings.Yes}
						cancelText={strings.Cancel}
						clickOutside={true}
						confirmOnPress={() => {
							this.blockCompany();
						}}
						cancelOnPress={() => {
							this.setState({ isBlockCompanyVisible: false });
						}}
					/>
				</HelpView>
			);
		}
	}
}

//Exports the screen
export default serviceScreen;

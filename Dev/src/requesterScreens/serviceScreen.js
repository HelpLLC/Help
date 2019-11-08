//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the
//requester to request the service.
import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';
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
import { Icon } from 'react-native-elements';
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
			const { productID, requester } = this.props.navigation.state.params;
			const product = await FirebaseFunctions.getServiceByID(productID);
			const url = await FirebaseFunctions.getProductImageByID(product.serviceID);
			const isRequested = product.requests.currentRequests.findIndex((request) => {
				return request.requesterID === requester.requesterID;
			});

			if (isRequested === -1) {
				this.setState({
					isLoading: false,
					isRequested: false,
					product,
					image: url
				});
			} else {
				this.setState({
					isLoading: false,
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

	//Removes the listener when the screen is switched away from
	componentWillUnmount() {
		this.willFocusListener.remove();
	}

	renderViewMore(onPress) {
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
	}
	renderViewLess(onPress) {
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
				subject: 'Your Service ' + this.state.product.serviceTitle
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
		const { provider, requester } = this.props.navigation.state.params;
		this.props.navigation.push('MessagingScreen', {
			title: provider.companyName,
			providerID: provider.providerID,
			requesterID: requester.requesterID,
			userID: requester.requesterID
		});
	}

	async blockCompany() {
		const { provider, requester } = this.props.navigation.state.params;

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
		const { provider, requester } = this.props.navigation.state.params;
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
		const { requester, provider } = this.props.navigation.state.params;
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
									<View style={{ marginRight: Dimensions.get('window').width * 0.05 }}>
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
									marginTop: Dimensions.get('window').height * 0.02
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
									width: Dimensions.get('window').width,
									flex: 1,
									justifyContent: 'center'
								}}>
								<View
									style={{
										flex: 1,
										justifyContent: 'center',
										marginTop: Dimensions.get('window').height * 0.01,
										width: Dimensions.get('window').width * 0.92,
										marginLeft: Dimensions.get('window').width * 0.04
									}}>
									<ViewMoreText
										numberOfLines={3}
										renderViewMore={this.renderViewMore}
										renderViewLess={this.renderViewLess}
										textStyle={{ textAlign: 'left' }}>
										<Text style={fontStyles.subTextStyleBlack}>{product.serviceDescription}</Text>
									</ViewMoreText>
								</View>

								<View
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
										marginTop: Dimensions.get('window').height * 0.04
									}}>
									<Text style={fontStyles.bigTextStyleBlack}>{product.pricing}</Text>
								</View>
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
											this.setState({ isRequestServiceVisible: true });
										}}
									/>
								</View>
							) : (
								<View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
									<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
										<Text style={fontStyles.bigTextStyleBlue}>{strings.ServiceRequested}</Text>
									</View>
									<TouchableOpacity
										onPress={() => this.setState({ isCancelRequestVisible: true })}
										style={{ flex: 1 }}>
										<Text style={fontStyles.mainTextStyleRed}>{strings.CancelRequest}</Text>
									</TouchableOpacity>
								</View>
							)}

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
										<Text style={fontStyles.subTextStyleBlack}>{strings.BusinessName}</Text>
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
											<Text style={fontStyles.subTextStyleBlue}>{provider.companyName}</Text>
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
										<Text style={fontStyles.subTextStyleBlack}>{strings.PhoneNumber}</Text>
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
											<Text style={fontStyles.subTextStyleBlue}>{provider.phoneNumber}</Text>
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
										<Text style={fontStyles.subTextStyleBlack}>{strings.Email}</Text>
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
											<Text style={fontStyles.subTextStyleBlue}>{provider.email}</Text>
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
										<Text style={fontStyles.subTextStyleBlack}>{strings.City}</Text>
									</View>
									<View
										style={{
											flexDirection: 'column',
											justifyContent: 'flex-end',
											marginBottom: Dimensions.get('window').height * 0.01
										}}>
										<Text style={fontStyles.subTextStyleBlack}>{provider.location}</Text>
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
											<Text style={fontStyles.subTextStyleBlack}>{strings.Website}</Text>
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
														this.setState({ isLoading: false, isErrorVisible: true });
														FirebaseFunctions.logIssue(error, {
															screen: 'RequesterServiceScreen',
															userID: 'r-' + requester.requesterID,
															productID: product.productID
														});
													}
												}}>
												<Text style={fontStyles.subTextStyleBlue}>{provider.website}</Text>
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

							<View style={{ height: Dimensions.get('window').height * 0.1 }}></View>
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
						isVisible={isRequestServiceVisible}
						title={strings.RequestService}
						message={strings.AreYouSureRequestService}
						confirmText={strings.Request}
						cancelText={strings.Cancel}
						clickOutside={true}
						confirmOnPress={async () => {
							this.setState({ isRequestServiceVisible: false, isLoading: true });
							//This method will request this service from the company providing it by pushing the request to the
							//provider.
							//After confirming to the requester that the request has been processed, the program will
							//automatically send a message to the provider with a default message saying that this requester wants
							//to buy this service. Then will push the requester to the chats screen.
							const { product } = this.state;
							const { requester } = this.props.navigation.state.params;
							try {
								await FirebaseFunctions.requestService(product.serviceID, requester.requesterID);
								this.setState({ isRequested: true, isLoading: false });
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
							this.setState({ isRequestServiceVisible: false });
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

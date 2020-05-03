//This screen will represent the landing screen for any given business. It will contain the
//business's profile and will be the landing screen for the user when they login.
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import strings from 'config/strings';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import FastImage from 'react-native-fast-image';
import HelpButton from '../components/HelpButton/HelpButton';
import TopBanner from '../components/TopBanner/TopBanner';
import { screenWidth, screenHeight } from 'config/dimensions';
import screenStyle from 'config/styles/screenStyle';
import fontStyles from 'config/styles/fontStyles';
import LoadingSpinner from '../components/LoadingSpinner';
import HelpAlert from '../components/HelpAlert';
import HelpView from '../components/HelpView';
import ServiceCardList from '../components/ServiceCardList';

class homeScreen extends Component {
	state = {
		isLoading: true,
		business: '',
		isErrorVisible: false,
		additionalVerificationNeeded: false,
		connectOnboardingSuccess: false,
		paymentsVerified: false,
	};

	//This will fetch the data about this business from firestore
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('HomeScreen', 'homeScreen');
		try {
			//If navigated from launch screen or the log in screen, won't "double fetch" the business object because it'll have
			//already been fetched
			const { businessID, businessFetched } = this.props.navigation.state.params;
			let business = '';
			let image = '';
			if (businessFetched === true) {
				business = this.props.navigation.state.params.business;
			} else {
				business = await FirebaseFunctions.call('getBusinessByID', { businessID });
			}
			//Fetches the image if the business has no services
			if (business.services.length === 0) {
				image = await FirebaseFunctions.call('getCategoryImageByID', {
					ID: 'lawn-mower.png',
				});
			}
			this.setState({ image, business });

			this.checkStripe(business);
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'HomeScreen',
					userID: 'b-' + this.props.navigation.state.params.businessID,
				},
			});
		}
	}

	//This method is going check if the business has enabled payments. If they have, it will check the status of Stripe and whether
	//any additional information is needed
	async checkStripe(business) {
		//If payments is even enabled, checks will happen
		if (business.paymentSetupStatus !== 'FALSE') {
			//Checks if onboarding needs to happen. If it does, starts that sequence.
			//If onboarding doesn't happen, and the business is pending from Stripe, then a message will pop up telling them that
			//If everything is set up correctly, the app opens as normal
			const doesNeedInformationFromStripe = await FirebaseFunctions.call(
				'checkStripeOnboardingByStripeID',
				{
					stripeID: business.stripeBusinessID,
				}
			);
			if (doesNeedInformationFromStripe.value !== false) {
				this.setState({
					connectURL: doesNeedInformationFromStripe,
					additionalVerificationNeeded: true,
				});
			} else if (business.paymentSetupStatus === 'PENDING') {
				//Checks if the business has now been verified by Stripe
				if (doesNeedInformationFromStripe.verification.length === 0) {
					await FirebaseFunctions.call('updateBusinessPaymentStatus', {
						businessID: business.businessID,
					});
					this.setState({
						paymentsVerified: true,
					});
				} else {
					this.setState({ connectOnboardingSuccess: true });
				}
			}
		}
		this.setState({ isLoading: false });
	}

	render() {
		//Gets the business & the products from the state
		const { isLoading, business } = this.state;
		//Stores the top part of this view
		const topView = (
			<View style={{ alignItems: 'center', height: screenHeight * 0.25 }}>
				<View style={{ flex: 1 }}>
					<TopBanner title={strings.Home} />
				</View>
				<View style={{ flex: 0.125 }} />
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View
						style={{
							flexDirection: 'row',
							width: screenWidth - 40,
							borderColor: colors.lightGray,
							borderBottomColor: colors.black,
							borderWidth: 0.5,
							alignItems: 'center',
							justifyContent: 'space-between',
							flex: 1,
						}}>
						<View style={{ flexDirection: 'column' }}>
							<View style={{ flex: 1, justifyContent: 'flex-end' }}>
								<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
									{business.businessName}
								</Text>
							</View>
							<View style={{ flex: 0.25 }} />
							<TouchableOpacity
								style={{ flex: 1, justifyContent: 'flex-start' }}
								onPress={() => {
									this.props.navigation.push('NameDescriptionScreen', {
										businessID: business.businessID,
										business,
										editing: true,
									});
								}}>
								<Text style={[fontStyles.mainTextStyle, fontStyles.blue]}>
									{strings.EditCompanyProfile}
								</Text>
							</TouchableOpacity>
						</View>

						<View style={{}}>
							<HelpButton
								title={strings.PlusSign}
								isCircleBlueButton={true}
								onPress={() => {
									this.props.navigation.push('CreateServiceScreen', {
										businessID: business.businessID,
										business,
										editing: false,
									});
								}}
							/>
						</View>
					</View>
				</View>
			</View>
		);

		//If the screen is loading, then the loading icon will appear. If the business does not yet have
		//any products, then the "Create first product" thing will appear. If none of that is true, then
		//the business's normal products will be displayed.
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner title={strings.Home} />
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
					<HelpAlert
						isVisible={this.state.isErrorVisible}
						onPress={() => {
							this.setState({ isErrorVisible: false });
						}}
						title={strings.Whoops}
						message={strings.SomethingWentWrong}
					/>
				</HelpView>
			);
		} else if (business.services.length === 0) {
			return (
				<HelpView style={screenStyle.container}>
					<View style={{ flex: 1.1 }}>{topView}</View>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>
							{strings.CreateYourFirstProductNowExclamation}
						</Text>
					</View>

					<View style={{ flex: 1, justifyContent: 'center' }}>
						<FastImage
							source={this.state.image}
							style={{
								width: screenWidth * 0.5,
								height: screenHeight * 0.2,
							}}
						/>
					</View>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<HelpButton
							title={strings.Create}
							width={screenWidth * 0.39}
							onPress={() => {
								this.props.navigation.push('CreateServiceScreen', {
									businessID: business.businessID,
									business,
									editing: false,
								});
							}}
						/>
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
						isVisible={this.state.connectOnboardingSuccess}
						onPress={() => {
							this.setState({ connectOnboardingSuccess: false });
						}}
						title={strings.Success}
						message={strings.OnboardingSucessMessage}
					/>
					<HelpAlert
						isVisible={this.state.additionalVerificationNeeded}
						onPress={() => {
							this.setState({ additionalVerificationNeeded: false });
							Linking.openURL(connectURL);
						}}
						title={strings.PaymentVerification}
						message={strings.PaymentVerificationMessage}
					/>
					<HelpAlert
						isVisible={this.state.paymentsVerified}
						onPress={() => {
							this.setState({ paymentsVerified: false });
						}}
						title={strings.Success}
						message={strings.PaymentsVerifiedSuccss}
					/>
				</HelpView>
			);
		} else {
			return (
				<View style={screenStyle.container}>
					{topView}
					<ServiceCardList
						services={business.services}
						onPress={(service) => {
							this.props.navigation.push('ServiceScreen', {
								serviceID: service.serviceID,
								businessID: business.businessID,
								business,
							});
						}}
					/>
					<HelpAlert
						isVisible={this.state.connectOnboardingSuccess}
						onPress={() => {
							this.setState({ connectOnboardingSuccess: false });
						}}
						title={strings.Success}
						message={strings.OnboardingSucessMessage}
					/>
					<HelpAlert
						isVisible={this.state.additionalVerificationNeeded}
						onPress={() => {
							this.setState({ additionalVerificationNeeded: false });
							Linking.openURL(this.state.connectURL);
						}}
						title={strings.PaymentVerification}
						message={strings.PaymentVerificationMessage}
					/>
					<HelpAlert
						isVisible={this.state.paymentsVerified}
						onPress={() => {
							this.setState({ paymentsVerified: false });
						}}
						title={strings.Success}
						message={strings.PaymentsVerifiedSuccss}
					/>
				</View>
			);
		}
	}
}

//Exports the screen
export default homeScreen;

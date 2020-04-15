//This screen will display the businesses that have been blocked by a requeuster and allow them to unblock those
//customers if they want to
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import { Text, FlatList, View, Dimensions, ScrollView } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { screenWidth, screenHeight } from 'config/dimensions';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import LoadingSpinner from '../components/LoadingSpinner';
import strings from '../../config/strings';
import HelpButton from '../components/HelpButton';
import helpButtonStyles from 'config/styles/helpButtonStyles';
import HelpAlert from '../components/HelpAlert';
import OptionPicker from '../components/OptionPicker';
import colors from 'config/colors';

//Creates the exports the class
export default class blockedBusinessesScreen extends Component {
	//initializes the initial loading space
	state = {
		isScreenLoading: true,
		isLoading: false,
		blockedBusinesses: '',
		customer: '',
		isUnblockCompanyVisible: false,
		companyClicked: '',
		isErrorVisible: false,
		isCompanyHasBeenUnblockedVisible: false,
		allServices: ''
	};

	//Fetches the correct variables based on the customer's array of blocked users
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('BlockedBusinessesScreen', 'blockedbusinessesScreen');
		const { customer } = this.props.navigation.state.params;
		const allServices = await FirebaseFunctions.call('getAllServices', {});

		let blocked = [];
		for (const businessID of customer.blockedBusinesses) {
			const business = await FirebaseFunctions.call('getBusinessByID', { businessID });
			blocked.push(business);
		}
		this.setState({
			allServices,
			isScreenLoading: false,
			customer,
			blockedBusinesses: blocked
		});
	}

	//Renders the UI
	render() {
		//Fetches all of the state
		const {
			isScreenLoading,
			isLoading,
			blockedBusinesses,
			customer,
			isUnblockCompanyVisible,
			companyClicked,
			isErrorVisible,
			isCompanyHasBeenUnblockedVisible
		} = this.state;
		//Renders the loading screen
		if (isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.Blocked}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}

		//If the screen has loaded, renders the main view
		return (
			<View style={screenStyle.container}>
				<TopBanner
					title={strings.Blocked}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<FlatList
					data={blockedBusinesses}
					extraData={this.state}
					keyExtractor={(item, index) => {
						return item.businessID;
					}}
					ListEmptyComponent={
						<View style={{ height: screenHeight * 0.7, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.NoBusinessesBlocked}</Text>
						</View>
					}
					renderItem={({ item, index }) => (
						<View
							style={{
								height: screenHeight * 0.07,
								marginTop: screenHeight * 0.01,
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignSelf: 'center',
								alignItems: 'center',
								width: screenWidth * 0.95,
								borderBottomColor: colors.lightBlue,
								borderBottomWidth: 1
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>{item.businessName}</Text>
							<HelpButton
								title={strings.Unblock}
								style={helpButtonStyles.SmallSizeButton}
								textStyle={fontStyles.bigTextStyleWhite}
								onPress={() => {
									this.setState({
										companyClicked: item,
										isUnblockCompanyVisible: true
									});
								}}
								disabled={isLoading}
							/>
						</View>
					)}
				/>
				<OptionPicker
					isVisible={isUnblockCompanyVisible}
					title={strings.UnblockBusiness}
					message={strings.AreYouSureYouWantToUnblock + companyClicked.businessName + '?'}
					confirmText={strings.Yes}
					cancelText={strings.Cancel}
					clickOutside={true}
					confirmOnPress={async () => {
						try {
							this.setState({ isLoading: true, isUnblockCompanyVisible: false });
							await FirebaseFunctions.call('unblockCompany', {
								customerID: customer.customerID,
								businessID: companyClicked.businessID
							});
							//Gets the updated customer
							const newCustomer = await FirebaseFunctions.call('getCustomerByID', {
								customerID: customer.customerID
							});
							this.setState({
								isCompanyHasBeenUnblockedVisible: true,
								isLoading: false,
								customer: newCustomer
							});
						} catch (error) {
							this.setState({ isLoading: false, isErrorVisible: true });
							FirebaseFunctions.call('logIssue', {
								error,
								userID: {
									screen: 'Blocked Businesses Screen',
									userID: 'c-' + customer.customerID
								}
							});
						}
					}}
					cancelOnPress={() => {
						this.setState({ isUnblockCompanyVisible: false, isLoading: false });
					}}
				/>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: screenHeight * 0.05,
						width: screenWidth
					}}>
					<LoadingSpinner isVisible={isLoading} />
				</View>
				<HelpAlert
					isVisible={isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
				<HelpAlert
					isVisible={isCompanyHasBeenUnblockedVisible}
					onPress={() => {
						this.setState({
							isCompanyHasBeenUnblockedVisible: false
						});
						this.props.navigation.push('FeaturedScreen', {
							customer: this.state.customer,
							allServices: this.state.allServices
						});
					}}
					title={strings.Success}
					message={companyClicked.businessName + ' ' + strings.HasBeenUnblocked}
				/>
			</View>
		);
	}
}

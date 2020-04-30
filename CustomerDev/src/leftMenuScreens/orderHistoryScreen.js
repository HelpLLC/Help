//This screen will display all of the services that the customer has ordered. At the top, the "inProgress" services will show up.
//Underneath them, the services that have already been completed will show up. The inProgress services will show up as NarrowServiceCards,
//while the previously completed services will show up as ServiceCards. This screen has access to the SideMenu
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import { View, Text, FlatList, ScrollView } from 'react-native';
import NarrowServiceCard from '../components/NarrowServiceCard';
import { screenWidth, screenHeight } from 'config/dimensions';
import LoadingSpinner from '../components/LoadingSpinner';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../components/TopBanner/TopBanner';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import ServiceCardList from '../components/ServiceCardList';
import HelpAlert from '../components/HelpAlert';
import colors from 'config/colors';

export default class orderHistoryScreen extends Component {
	//The initial state controlling the loading spinner along with the side menu and all the other data that will be used in this screen
	state = {
		isOpen: false,
		isLoading: true,
		customer: '',
		isErrorVisible: false,
		currentRequests: '',
		completedRequests: '',
		incompleteProfile: false
	};

	//Adds the screen analytics and loads everything into the screen
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CustomerOrderHistoryScreen', 'customerOrderHistoryScreen');

		//Fetches the most up to date version of the customer
		const { customerID } = this.props.navigation.state.params.customer;
		const customer = await FirebaseFunctions.call('getCustomerByID', {
			customerID
		});

		//Fetches the current requests and completed requests
		const completedRequests = await FirebaseFunctions.call('getCompletedRequestsByCustomerID', {
			customerID
		});
		const currentRequests = customer.currentRequests;

		this.setState({
			customer,
			currentRequests,
			completedRequests,
			isLoading: false
		});
	}

	//Renders the screen based on the isLoading part of the state
	render() {
		let { isLoading, customer, completedRequests, currentRequests } = this.state;
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner title={strings.OrderHistory} />
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		} else {
			return (
				<SideMenu
					onChange={(isOpen) => {
						this.setState({ isOpen });
					}}
					isOpen={this.state.isOpen}
					menu={
						<LeftMenu
							navigation={this.props.navigation}
							allServices={this.props.navigation.state.params.allServices}
							customer={customer}
						/>
					}>
					<View style={screenStyle.container}>
						<TopBanner
							leftIconName='navicon'
							leftOnPress={() => {
								this.setState({ isOpen: true });
							}}
							size={30}
							title={strings.OrderHistory}
						/>
						{//Displays a message if the customer has not yet requested anything
						completedRequests.length === 0 && currentRequests.length === 0 ? (
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
									width: screenWidth * 0.9
								}}>
								<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>{strings.NoRequestsYet}</Text>
							</View>
						) : (
							<View>
								<FlatList
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
									data={currentRequests}
									numColumns={2}
									maxToRenderPerBatch={2}
									initialNumToRender={2}
									windowSize={3}
									keyExtractor={(item, index) => item.serviceID + index.toString()}
									showsVerticalScrollIndicator={false}
									ListHeaderComponent={
										currentRequests.length > 0 ? (
											<View>
												<View
													style={{
														width: screenWidth * 0.9,
														height: screenHeight * 0.06,
														justifyContent: 'center',
														alignSelf: 'center',
														borderBottomColor: colors.lightBlue,
														borderBottomWidth: 1
													}}>
													<Text style={[fontStyles.bigTextStyle, fontStyles.blue]}>
														{strings.InProgress + ' (' + currentRequests.length + ')'}
													</Text>
												</View>
											</View>
										) : (
											<View></View>
										)
									}
									renderItem={({ item, index }) => (
										<View style={{ flexDirection: 'row' }}>
											{//Adds a space before the first service if there is only one service because it otherwise has justify
											//content of flex start
											currentRequests.length === 1 ? (
												<View style={{ width: screenWidth * 0.03 }} />
											) : (
												<View></View>
											)}
											<NarrowServiceCard
												serviceTitle={item.serviceTitle}
												price={item.date}
												imageFunction={async () => {
													//Passes in the function to retrieve the image of this product
													return await FirebaseFunctions.call('getServiceImageByID', {
														serviceID: item.serviceID
													});
												}}
												numCurrentRequests={0}
												//Passes all of the necessary props to the actual screen that contains
												//more information about the service
												onPress={() => {
													//This take the user to the screen to view their request for this service
													this.props.navigation.push('ServiceRequestedScreen', {
														requestID: item.requestID,
														customer
													});
												}}
											/>
											{//Adds a space in between each column
											index % 2 === 0 && currentRequests.length > 1 ? (
												<View style={{ width: screenWidth * 0.03 }} />
											) : (
												<View></View>
											)}
										</View>
									)}
									ListFooterComponent={
										completedRequests.length > 0 ? (
											<View style={{ marginBottom: screenHeight * 0.1 }}>
												<View
													style={{
														width: screenWidth * 0.9,
														height: screenHeight * 0.06,
														justifyContent: 'center',
														alignSelf: 'center',
														borderBottomColor: colors.black,
														borderBottomWidth: 1
													}}>
													<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>{strings.Completed}</Text>
												</View>
												<ServiceCardList
													services={completedRequests}
													onPress={(request) => {
														//This take the user to the screen to view their request for this service
														this.props.navigation.push('ServiceRequestedScreen', {
															requestID: request.requestID,
															customer
														});
													}}
													currentRequests={false}
												/>
											</View>
										) : (
											<View></View>
										)
									}
								/>
							</View>
						)}
						<HelpAlert
							isVisible={this.state.isErrorVisible}
							onPress={() => {
								this.setState({ isErrorVisible: false });
							}}
							title={strings.Whoops}
							message={strings.SomethingWentWrong}
						/>
					</View>
				</SideMenu>
			);
		}
	}
}

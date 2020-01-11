//This screen will display all of the services that the requester has ordered. At the top, the "inProgress" services will show up.
//Underneath them, the services that have already been completed will show up. The inProgress services will show up as NarrowServiceCards,
//while the previously completed services will show up as ServiceCards. This screen has access to the SideMenu
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../components/TopBanner';
import NarrowServiceCardList from '../components/NarrowServiceCardList';
import ServiceCardList from '../components/ServiceCardList';
import HelpAlert from '../components/HelpAlert';
import colors from 'config/colors';

export default class orderHistoryScreen extends Component {
	//The initial state controlling the loading spinner along with the side menu and all the other data that will be used in this screen
	state = {
		isOpen: false,
		isLoading: true,
		requester: '',
		serviceObjectsInProgress: '',
		serviceObjectsCompleted: '',
		isErrorVisible: false,
		incompleteProfile: false
	};

	//Adds the screen analytics and loads everything into the screen
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen(
			'RequesterOrderHistoryScreen',
			'requesterOrderHistoryScreen'
		);

		//Fetches the most up to date version of the requester
		const requesterID = this.props.navigation.state.params.requester.requesterID;
		const requester = await FirebaseFunctions.call('getRequesterByID', {
			requesterID: requesterID
		});
		//Tests to see if the requester's account has been fully completed (used for pre-2.0 users)
		if (!FirebaseFunctions.call('isRequesterUpToDate', { requesterObject: requester })) {
			this.setState({
				incompleteProfile: true,
				isLoading: false
			});
		} else {
			//Fetches both the in progress services & the completed services in order to show them on the screen
			const inProgress = await FirebaseFunctions.call('getInProgressRequestsByRequesterID', {
				requesterID
			});
			const completed = await FirebaseFunctions.call('getCompletedRequestsByRequesterID', {
				requesterID
			});
			let serviceObjectsInProgress = [];
			let serviceObjectsCompleted = [];
			for (const requestInProgess of inProgress) {
				const service = await FirebaseFunctions.call('getServiceByID', {
					serviceID: requestInProgess.serviceID
				});
				serviceObjectsInProgress.push({
					...service,
					...requestInProgess
				});
			}
			for (const requestCompleted of completed) {
				const service = await FirebaseFunctions.call('getServiceByID', {
					serviceID: requestCompleted.serviceID
				});
				serviceObjectsCompleted.push({
					...service,
					...requestCompleted
				});
			}
			this.setState({
				requester,
				serviceObjectsCompleted,
				serviceObjectsInProgress,
				isLoading: false
			});
		}
	}

	//Renders the screen based on the isLoading part of the state
	render() {
		const { isLoading, requester, serviceObjectsCompleted, serviceObjectsInProgress } = this.state;
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
							allProducts={this.props.navigation.state.params.allProducts}
							requester={requester}
						/>
					}>
					<HelpView style={screenStyle.container}>
						<TopBanner
							leftIconName='navicon'
							leftOnPress={() => {
								this.setState({ isOpen: true });
							}}
							size={30}
							title={strings.OrderHistory}
						/>
						{//Displays a message if the requester has not yet requested anything
						serviceObjectsCompleted.length === 0 && serviceObjectsInProgress.length === 0 ? (
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
									width: Dimensions.get('window').width * 0.9
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>{strings.NoRequestsYet}</Text>
							</View>
						) : (
							<ScrollView
								style={{ flex: 1 }}
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}>
								{//Displays the in progress products if there are any in NarrowServiceCards
								serviceObjectsInProgress.length > 0 ? (
									<View>
										<View
											style={{
												width: Dimensions.get('window').width * 0.9,
												height: Dimensions.get('window').height * 0.06,
												justifyContent: 'center',
												alignSelf: 'center',
												borderBottomColor: colors.lightBlue,
												borderBottomWidth: 1
											}}>
											<Text style={fontStyles.bigTextStyleBlue}>
												{strings.InProgress + ' (' + serviceObjectsInProgress.length + ')'}
											</Text>
										</View>
										<NarrowServiceCardList
											requesterID={requester.requesterID}
											navigation={this.props.navigation}
											services={serviceObjectsInProgress}
											dateSelected={true}
											onPress={(service) => {
												this.props.navigation.push('RequesterServiceRequestedScreen', {
													product: service,
													requesterID: requester.requesterID,
													requestID: service.requestID,
													completed: false
												});
											}}
										/>
									</View>
								) : (
									<View></View>
								)}
								{//Displays the completed products if there are any in ServiceCards
								serviceObjectsCompleted.length > 0 ? (
									<View>
										<View
											style={{
												width: Dimensions.get('window').width * 0.9,
												height: Dimensions.get('window').height * 0.06,
												justifyContent: 'center',
												alignSelf: 'center',
												borderBottomColor: colors.black,
												borderBottomWidth: 1
											}}>
											<Text style={fontStyles.bigTextStyleBlack}>{strings.Completed}</Text>
										</View>
										<ServiceCardList
											services={serviceObjectsCompleted}
											onPress={(service) => {
												//This take the user to the screen to view their request for this service
												this.props.navigation.push('RequesterServiceRequestedScreen', {
													product: service,
													requesterID: requester.requesterID,
													requestID: service.requestID,
													completed: true
												});
											}}
											currentRequests={false}
										/>
									</View>
								) : (
									<View></View>
								)}
								<HelpAlert
									isVisible={this.state.isErrorVisible}
									onPress={() => {
										this.setState({ isErrorVisible: false });
									}}
									title={strings.Whoops}
									message={strings.SomethingWentWrong}
								/>
							</ScrollView>
						)}
						<HelpAlert
							isVisible={this.state.incompleteProfile}
							onPress={() => {
								this.setState({ incompleteProfile: false });
								this.props.navigation.push('EditRequesterProfileScreen', {
									requester: requester,
									allProducts: this.props.navigation.state.params.allProducts,
									isEditing: true
								});
							}}
							title={strings.FinishCreatingYourProfile}
							message={strings.FinishCreatingYourProfileMessage}
							closeOnTouchOutside={false}
						/>
					</HelpView>
				</SideMenu>
			);
		}
	}
}

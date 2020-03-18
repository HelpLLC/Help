//This screen represents the service page which contains information about the service
//as well as any current requests. You will also be able to access history & edit the service from this
//screen
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import colors from 'config/colors';
import LoadingSpinner from '../components/LoadingSpinner';
import { screenWidth, screenHeight } from 'config/dimensions';
import HelpAlert from '../components/HelpAlert';
import HelpView from '../components/HelpView';
import FastImage from 'react-native-fast-image';
import ServiceCard from '../components/ServiceCard';
import TopBanner from '../components/TopBanner';

import ViewMoreText from 'react-native-view-more-text';

//The class representing the screen
class serviceScreen extends Component {
	//Initializes the loading state
	constructor() {
		super();
		this.state = {
			isLoading: true,
			service: '',
			isErrorVisible: false
		};
	}

	//This will fetch the data about this service from the database
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('BusinessServiceScreen', 'serviceScreen');

		const { serviceID, businessID, business } = this.props.navigation.state.params;
		try {
			const service = await FirebaseFunctions.call('getServiceByID', { serviceID: serviceID });
			const image = await FirebaseFunctions.call('getServiceImageByID', { serviceID: serviceID });
			this.setState({
				isLoading: false,
				service,
				business,
				businessID,
				serviceID,
				image
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'BusinessServiceScreen',
					userID: 'b-' + businessID,
					service: serviceID
				}
			});
		}
		this.setState({ isLoading: false });
	}

	//renders the UI
	render() {
		const { isLoading, service, businessID, business, serviceID } = this.state;
		//If the state is still loading, the spinner will appear
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.Service}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={isLoading} />
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
		} else {
			return (
				<View style={screenStyle.container}>
					<TopBanner
						title={strings.Service}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<ScrollView
						style={{ flex: 1 }}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}>
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

								<TouchableOpacity
									onPress={() => {
										this.props.navigation.push('CreateServiceScreen', {
											businessID,
											business,
											serviceID,
											service,
											editing: true
										});
									}}
									style={{ justifyContent: 'flex-end' }}>
									<Text style={fontStyles.bigTextStyleBlue}>{strings.EditService}</Text>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => {
										this.props.navigation.push('ServiceHistoryScreen', {
											service
										});
									}}
									style={{
										justifyContent: 'flex-end',
										marginTop: screenHeight * 0.02
									}}>
									<Text style={fontStyles.bigTextStyleBlue}>{strings.History}</Text>
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
									alignItems: 'center'
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>{service.priceText}</Text>
							</View>
						</View>
						{//Checks if the current service has any current requests and displays them if
						//it does
						service.currentRequests.length > 0 ? (
							<View>
								<View
									style={{
										width: screenWidth * 0.9,
										alignSelf: 'center',
										justifyContent: 'center',
										borderBottomColor: colors.lightBlue,
										borderWidth: 0.5,
										height: screenHeight * 0.05,
										borderColor: colors.lightGray
									}}>
									<Text style={fontStyles.bigTextStyleBlack}>{strings.CurrentRequests}</Text>
								</View>
								{service.currentRequests.map((item) => (
									<View
										key={item.requestID}
										style={{
											marginBottom: screenHeight * 0.025
										}}>
										<ServiceCard
											serviceTitle={item.customerName}
											serviceDescription={strings.ScheduledAt + ' ' + item.time}
											price={strings.ScheduledOn + ' ' + item.date}
											imageFunction={async () => {
												//Passes the function to get the profile picture of the user
												//Passes in the function to retrieve the image of this requester
												return await FirebaseFunctions.call('getProfilePictureByID', {
													customerID: item.customerID
												});
											}}
											onPress={() => {
												//Goes to the screen for the specific request
												this.props.navigation.push('CustomerRequestScreen', {
													requestID: item.requestID
												});
											}}
										/>
									</View>
								))}
							</View>
						) : (
							<View style={{ alignSelf: 'center', justifyContent: 'center' }}>
								<Text style={fontStyles.bigTextStyleBlack}>{strings.NoCurrentRequests}</Text>
							</View>
						)}
					</ScrollView>
				</View>
			);
		}
	}
}

//Exports the screen
export default serviceScreen;

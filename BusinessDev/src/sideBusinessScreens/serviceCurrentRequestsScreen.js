//This screen is going to show the current requests for a specific service for the businesses. They can then click into the
//requests to see more details about the request
import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import ServiceCard from '../components/ServiceCard';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../components/HelpView';
import { screenWidth, screenHeight } from 'config/dimensions';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ImageWithBorder from '../components/ImageWithBorder';
import TopBanner from '../components/TopBanner/TopBanner';
import LoadingSpinner from '../components/LoadingSpinner';

//The class for this screen
class serviceCurrentRequestsScreen extends Component {
	state = {
		isLoading: true,
		currentRequests: '',
		service: '',
		serviceID: ''
	};
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen(
			'ServiceCurrentRequestsScreen',
			'serviceCurrentRequestsScreen'
		);
		const { serviceID, service } = this.props.navigation.state.params;
		const currentRequests = await FirebaseFunctions.call('getConfirmedRequestsByServiceID', {
			serviceID,
			limit: false
		});
		this.setState({
			isLoading: false,
			service,
			serviceID,
			currentRequests
		});
	}

	//Renders the UI
	render() {
		const { isLoading, currentRequests, service, serviceID } = this.state;
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.CurrentRequests}
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
					title={strings.CurrentRequests}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<FlatList
					data={currentRequests}
					keyExtractor={(item, index) => {
						return item.requesterID + index.toString();
					}}
					ListEmptyComponent={
						<View
							style={{
								marginTop: screenHeight * 0.15,
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<Text style={[fontStyles.bigTextStyle, fontStyles.black, { textAlign: 'center' }]}>
								{strings.NoCurrentRequestsForThisService}
							</Text>
						</View>
					}
					ListHeaderComponent={
						<View>
							<View
								style={{
									flexDirection: 'row',
									width: screenWidth - 40,
									borderColor: colors.lightGray,
									borderBottomColor: colors.black,
									borderWidth: 0.5,
									alignSelf: 'center',
									alignItems: 'center',
									justifyContent: 'space-between',
									height: screenHeight * 0.2
								}}>
								<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>{service.serviceTitle}</Text>
								<ImageWithBorder
									width={screenWidth * 0.25}
									height={screenWidth * 0.25}
									imageFunction={async () => {
										//Passes in the function to retrieve the image of this service
										return await FirebaseFunctions.call('getServiceImageByID', {
											serviceID
										});
									}}
								/>
							</View>
						</View>
					}
					renderItem={({ item, index }) => (
						<View style={{ marginBottom: screenHeight * 0.025 }}>
							<ServiceCard
								serviceTitle={item.customerName}
								serviceDescription={' '}
								price={strings.ScheduledOn + ' ' + item.date}
								imageFunction={async () => {
									//Passes the function to get the profile picture of the user
									//Passes in the function to retrieve the image of this requester
									return item.customerID ? (await FirebaseFunctions.call('getProfilePictureByID', {
										customerID: item.customerID
									})) : null;
								}}
								onPress={() => {
									//Goes to the screen for the specific request
									this.props.navigation.push('CustomerRequestScreen', {
										requestID: item.requestID
									});
								}}
							/>
						</View>
					)}
				/>
			</View>
		);
	}
}

//Exports the screen
export default serviceCurrentRequestsScreen;

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
import HelpButton from '../components/HelpButton/HelpButton';

import TopBanner from '../components/TopBanner/TopBanner';

import ViewMoreText from 'react-native-view-more-text';

//The class representing the screen
class serviceScreen extends Component {
	//Initializes the loading state
	constructor() {
		super();
		this.state = {
			isLoading: true,
			service: '',
			isErrorVisible: false,
		};
	}

	//This will fetch the data about this service from the database
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('BusinessServiceScreen', 'serviceScreen');

		const { serviceID, businessID, business } = this.props.navigation.state.params;
		try {
			const service = await FirebaseFunctions.call('getServiceByID', {
				serviceID: serviceID,
			});
			const image = await FirebaseFunctions.call('getServiceImageByID', {
				serviceID: serviceID,
			});
			this.setState({
				isLoading: false,
				service,
				business,
				businessID,
				serviceID,
				image,
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'BusinessServiceScreen',
					userID: 'b-' + businessID,
					service: serviceID,
				},
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
					<View
						style={{
							flexDirection: 'row',
							width: screenWidth - 40,
							alignItems: 'center',
							alignSelf: 'center',
							justifyContent: 'space-between',
						}}>
						<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
							<View
								style={{
									justifyContent: 'flex-end',
									marginVertical: screenHeight * 0.03,
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>
									{service.serviceTitle}
								</Text>
							</View>

							<TouchableOpacity
								onPress={() => {
									this.props.navigation.push('CreateServiceScreen', {
										businessID,
										business,
										serviceImage: this.state.image,
										serviceID,
										service,
										editing: true,
									});
								}}
								style={{ justifyContent: 'flex-end' }}>
								<Text style={fontStyles.bigTextStyleBlue}>
									{strings.EditService}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									this.props.navigation.push('ServiceHistoryScreen', {
										serviceID,
										service,
									});
								}}
								style={{
									justifyContent: 'flex-end',
									marginTop: screenHeight * 0.02,
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
							marginVertical: screenHeight * 0.02,
						}}>
						<FastImage
							style={{
								width: screenWidth,
								height: 250,
							}}
							source={this.state.image}
						/>
					</View>
					<View
						style={{
							marginVertical: screenHeight * 0.1,
						}}>
						<HelpButton
							title={strings.ViewRequests}
							width={screenWidth * 0.525}
							onPress={() => {
								//Goes to the current requests screen for this specific service
								this.props.navigation.push('ServiceCurrentRequestsScreen', {
									service,
									serviceID,
								});
							}}
						/>
					</View>
				</View>
			);
		}
	}
}

//Exports the screen
export default serviceScreen;

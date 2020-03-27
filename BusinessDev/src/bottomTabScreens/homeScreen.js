//This screen will represent the landing screen for any given business. It will contain the
//business's profile and will be the landing screen for the user when they login.
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import strings from 'config/strings';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import FastImage from 'react-native-fast-image';
import RoundBlueButton from '../components/RoundBlueButton';
import TopBanner from '../components/TopBanner';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
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
		incompleteProfile: false
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
				image = await FirebaseFunctions.call('getCategoryImageByID', { ID: 'lawn-mower.png' });
			}

			this.setState({ image, business, isLoading: false });
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.call('logIssue', {
				error,
				userID: {
					screen: 'HomeScreen',
					userID: 'b-' + this.props.navigation.state.params.businessID
				}
			});
		}
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
				<View style={{ flex: 0.125 }}></View>
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
							flex: 1
						}}>
						<View style={{ flexDirection: 'column' }}>
							<View style={{ flex: 1, justifyContent: 'flex-end' }}>
								<Text style={fontStyles.bigTextStyleBlack}>{business.businessName}</Text>
							</View>
							<View style={{ flex: 0.25 }}></View>
							<TouchableOpacity
								style={{ flex: 1, justifyContent: 'flex-start' }}
								onPress={() => {
									this.props.navigation.push('NameDescriptionScreen', {
										businessID: business.businessID,
										business,
										editing: true
									});
								}}>
								<Text style={fontStyles.mainTextStyleBlue}>{strings.EditCompanyProfile}</Text>
							</TouchableOpacity>
						</View>

						<View style={{}}>
							<RoundBlueButton
								title={strings.PlusSign}
								textStyle={fontStyles.bigTextStyleWhite}
								style={roundBlueButtonStyle.BusinessScreenPlusButton}
								onPress={() => {
									this.props.navigation.push('CreateServiceScreen', {
										businessID: business.businessID,
										business
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
						<Text style={fontStyles.bigTextStyleBlack}>
							{strings.CreateYourFirstProductNowExclamation}
						</Text>
					</View>

					<View style={{ flex: 1, justifyContent: 'center' }}>
						<FastImage
							source={this.state.image}
							style={{
								width: screenWidth * 0.5,
								height: screenHeight * 0.2
							}}
						/>
					</View>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<RoundBlueButton
							title={strings.Create}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={() => {
								this.props.navigation.push('CreateServiceScreen', {
									businessID: business.businessID,
									business
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
								business
							});
						}}
					/>
				</View>
			);
		}
	}
}

//Exports the screen
export default homeScreen;

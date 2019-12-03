//This screen represents the product page which contains information about the product
//as well as any current requests. You will also be able to access history & edit the product from this
//screen
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native';
import fontStyles from 'config/styles/fontStyles';
import screenStyle from 'config/styles/screenStyle';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import colors from 'config/colors';
import LoadingSpinner from '../../components/LoadingSpinner';
import HelpAlert from '../../components/HelpAlert';
import HelpView from '../../components/HelpView';
import OptionPicker from '../../components/OptionPicker';
import { CachedImage } from 'react-native-img-cache';
import ServiceCard from '../../components/ServiceCard';
import TopBanner from '../../components/TopBanner';

import ViewMoreText from 'react-native-view-more-text';

//The class representing the screen
class productScreen extends Component {
	//Initializes the loading state
	constructor() {
		super();
		this.state = {
			isLoading: true,
			currentRequests: [],
			product: '',
			isErrorVisible: false,
			isCompleteRequestVisible: false,
			currentRequestID: '',
			isDeleteRequestVisible: false
		};
	}

	//Fetches the data associated with this screen
	async fetchDatabaseData() {
		try {
			const { productID } = this.props.navigation.state.params;
			const service = await FirebaseFunctions.getServiceByID(productID);
			const image = await FirebaseFunctions.getProductImageByID(productID);
			this.setState({
				isLoading: false,
				currentRequests: service.requests.currentRequests,
				product: service,
				image
			});
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.logIssue(error, {
				screen: 'ProviderProductScreen',
				userID: 'p-' + this.props.navigation.state.params.providerID,
				productID: this.props.navigation.state.params.productID
			});
		}

		return 0;
	}

	//This will fetch the data about this product from the database
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ProviderProductScreen', 'productScreen');

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

	//renders the UI
	render() {
		//fetches the params passed in (the product, productID)
		const { productID, providerID } = this.props.navigation.state.params;
		const { isLoading, product, currentRequests } = this.state;

		//If the state is still loading, the spinner will appear
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.Service}
						leftIconName='angle-left'
						leftOnPress={() =>
							this.props.navigation.push('ProviderScreens', {
								providerID: this.props.navigation.state.params.providerID
							})
						}
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
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.Service}
						leftIconName='angle-left'
						leftOnPress={() =>
							this.props.navigation.push('ProviderScreens', {
								providerID: this.props.navigation.state.params.providerID
							})
						}
					/>
					<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
						<View
							style={{
								flexDirection: 'row',
								width: Dimensions.get('window').width - 40,
								alignItems: 'center',
								alignSelf: 'center',
								justifyContent: 'space-between'
							}}>
							<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
								<View
									style={{
										justifyContent: 'flex-end',
										marginVertical: Dimensions.get('window').height * 0.03
									}}>
									<Text style={fontStyles.bigTextStyleBlack}>{product.serviceTitle}</Text>
								</View>

								<TouchableOpacity
									onPress={() => {
										this.props.navigation.push('ProviderCreateProductScreen', {
											product,
											productID,
											providerID
										});
									}}
									style={{ justifyContent: 'flex-end' }}>
									<Text style={fontStyles.bigTextStyleBlue}>{strings.EditService}</Text>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => {
										this.props.navigation.push('ProviderProductHistoryScreen', {
											product
										});
									}}
									style={{
										justifyContent: 'flex-end',
										marginTop: Dimensions.get('window').height * 0.02
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
									alignItems: 'center'
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>{product.pricing}</Text>
							</View>
						</View>
						{//Checks if the current product has any current requests and displays them if
						//it does
						currentRequests.length > 0 ? (
							<View>
								<View
									style={{
										width: Dimensions.get('window').width * 0.9,
										alignSelf: 'center',
										justifyContent: 'center',
										borderBottomColor: colors.lightBlue,
										borderWidth: 0.5,
										height: Dimensions.get('window').height * 0.05,
										borderColor: colors.lightGray
									}}>
									<Text style={fontStyles.bigTextStyleBlack}>{strings.CurrentRequests}</Text>
								</View>
								<FlatList
									data={currentRequests}
									keyExtractor={(item, index) => {
										return item.requesterID;
									}}
									renderItem={({ item, index }) => (
										<View style={{ marginBottom: Dimensions.get('window').height * 0.025 }}>
											<ServiceCard
												serviceTitle={item.requesterName}
												serviceDescription={' '}
												price={strings.RequestedOn + ' ' + item.dateRequested}
												imageFunction={async () => {
													//Passes the function to get the profile picture of the user
													//Passes in the function to retrieve the image of this requester
													return await FirebaseFunctions.getProfilePictureByID(item.requesterID);
												}}
												onPress={() => {
													//Goes to the screen for the specific request
													this.props.navigation.push('CustomerRequestScreen', {
														product: this.state.product,
														request: item,
														completed: false
													});
												}}
											/>
										</View>
									)}
								/>
							</View>
						) : (
							<View style={{ alignSelf: 'center', justifyContent: 'center' }}>
								<Text style={fontStyles.bigTextStyleBlack}>{strings.NoCurrentRequests}</Text>
							</View>
						)}
					</ScrollView>
				</HelpView>
			);
		}
	}
}

//Exports the screen
export default productScreen;

//This screen will be the one where the user will be able to view a service's details, price, name
//of the company providing it, etc. There will be a button at the bottom of the screen allowing the
//requester to request the service.
import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
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
import ImageWithBorder from '../components/ImageWithBorder';

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
			isCancelRequestVisible: false
		};
	}

	//Fetches the data associated with this screen
	async fetchDatabaseData() {
		try {
			const { productID, requester } = this.props.navigation.state.params;
			const product = await FirebaseFunctions.getServiceByID(productID);
			const isRequested = product.requests.currentRequests.findIndex((request) => {
				return request.requesterID === requester.requesterID;
			});

			if (isRequested === -1) {
				this.setState({
					isLoading: false,
					isRequested: false,
					product
				});
			} else {
				this.setState({
					isLoading: false,
					isRequested: true,
					product
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

	//Renders the UI
	render() {
		const { product, isLoading, isRequested, isCancelRequestVisible, isRequestServiceVisible } = this.state;
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
					<View>
						<View style={{ flex: 0.01 }}></View>
						<View
							style={{
								flexDirection: 'row',
								width: Dimensions.get('window').width - 40,
								borderColor: colors.lightGray,
								borderBottomColor: colors.black,
								borderWidth: 0.5,
								flex: 0.75
							}}>
							<View style={{ flexDirection: 'column', flex: 1 }}>
								<View style={{ flex: 1, justifyContent: 'center' }}>
									<Text style={fontStyles.bigTextStyleBlack}>{product.serviceTitle}</Text>
								</View>
								<View style={{ flex: 1, justifyContent: 'flex-start' }}>
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

							<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
								<ImageWithBorder
									width={Dimensions.get('window').width * 0.25}
									height={Dimensions.get('window').width * 0.25}
									imageFunction={async () => {
										//Passes in the function to retrieve the image of this product
										return await FirebaseFunctions.getProductImageByID(product.serviceID);
									}}
								/>
							</View>
						</View>
						<View
							style={{
								borderColor: colors.lightGray,
								borderBottomColor: colors.black,
								borderWidth: 0.5,
								width: Dimensions.get('window').width - 40,
								flex: 1.33
							}}>
							<View style={{ flex: 1, justifyContent: 'center' }}>
								<Text style={fontStyles.subTextStyleBlack}>{product.serviceDescription}</Text>
							</View>

							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
								<Text style={fontStyles.bigTextStyleBlack}>{product.pricing}</Text>
							</View>
						</View>

						{//Tests if this service has already been requested by the current user
							this.state.isRequested === false ? (
								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
										<TouchableOpacity onPress={() => this.setState({ isCancelRequestVisible: true })} style={{ flex: 1 }}>
											<Text style={fontStyles.mainTextStyleRed}>{strings.CancelRequest}</Text>
										</TouchableOpacity>
									</View>
								)}
					</View>
					<ErrorAlert
						isVisible={this.state.isErrorVisible}
						onPress={() => {
							this.setState({ isErrorVisible: false });
						}}
						title={strings.Whoops}
						message={strings.SomethingWentWrong}
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
				</HelpView>
			);
		}
	}
}

//Exports the screen
export default serviceScreen;

//This screen will represent the main business screen for any given provider. It will contain the
//business's profile and will be the landing screen for the user when they login. If this is the
//first time that the user logs in or if they do not yet have products, then the screen will
//display prompting the user to sign in.
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import strings from 'config/strings';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { CachedImage } from 'react-native-img-cache';
import RoundBlueButton from '../../components/RoundBlueButton';
import TopBanner from '../../components/TopBanner';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import screenStyle from 'config/styles/screenStyle';
import fontStyles from 'config/styles/fontStyles';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import HelpView from '../../components/HelpView';
import ServiceCardList from '../../components/ServiceCardList';
import OptionPicker from '../../components/OptionPicker';

class businessScreen extends Component {
	//This constructor and componentDidMount will wait until all the products loaded if there are any
	constructor() {
		super();
		this.state = {
			isLoading: true,
			serviceIDsLength: 0,
			provider: '',
			providerProducts: [],
			isErrorVisible: false,
			incompleteProfile: false
		};
	}

	//Fetches the data associated with this screen
	async fetchDatabaseData() {
		try {
			const { providerID } = this.props.navigation.state.params;
			const provider = await FirebaseFunctions.getProviderByID(providerID);
			this.setState({ provider });
			if (provider.serviceIDs.length === 0) {
				const image = await FirebaseFunctions.getCategoryImageByID('lawn-mower.png');
				this.setState({ isLoading: false, image });
			} else if (provider.serviceIDs.length !== this.state.providerProducts.length) {
				const serviceIDs = provider.serviceIDs;
				for (const ID of serviceIDs) {
					const service = await FirebaseFunctions.getServiceByID(ID);
					const newArrayOfProducts = this.state.providerProducts;
					newArrayOfProducts.push(service);
					newArrayOfProducts.sort((productA, productB) => {
						return (
							productB.requests.currentRequests.length - productA.requests.currentRequests.length
						);
					});
					this.setState({
						providerProducts: newArrayOfProducts
					});
				}
				this.setState({
					serviceIDsLength: provider.serviceIDs.length,
					isLoading: false
				});
			}
		} catch (error) {
			this.setState({ isLoading: false, isErrorVisible: true });
			FirebaseFunctions.logIssue(error, {
				screen: 'BusinessScreen',
				userID: 'p-' + this.props.navigation.state.params.providerID
			});
		}
		return 0;
	}

	//This will fetch the data about this provider and his products from firestore
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ProviderBusinessScreen', 'businessScreen');

		//Adds the listener to add the listener to refetch the data once this component is returned to
		this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
			await this.fetchDatabaseData();
			//Tests if the profile is complete or not. If it is not, a popup will appear in order to direct the user to go complete
			//their business profile.
			const { provider } = this.state;
			if (!FirebaseFunctions.isProviderUpToDate(provider)) {
				this.setState({ incompleteProfile: true });
			}
		});
	}

	//Removes the listener when the screen is switched away from
	componentWillUnmount() {
		this.willFocusListener.remove();
	}

	render() {
		//Gets the provider & the products from the state
		const { isLoading, providerProducts, serviceIDsLength, provider } = this.state;
		//Stores the top part of this view
		const topView = (
			<View style={{ alignItems: 'center', height: Dimensions.get('window').height * 0.25 }}>
				<View style={{ flex: 1 }}>
					<TopBanner title={strings.Business} />
				</View>
				<View style={{ flex: 0.125 }}></View>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View
						style={{
							flexDirection: 'row',
							width: Dimensions.get('window').width - 40,
							borderColor: colors.lightGray,
							borderBottomColor: colors.black,
							borderWidth: 0.5,
							alignItems: 'center',
							justifyContent: 'space-between',
							flex: 1
						}}>
						<View style={{ flexDirection: 'column' }}>
							<View style={{ flex: 1, justifyContent: 'flex-end' }}>
								<Text style={fontStyles.bigTextStyleBlack}>{provider.companyName}</Text>
							</View>
							<View style={{ flex: 0.25 }}></View>
							<TouchableOpacity
								style={{ flex: 1, justifyContent: 'flex-start' }}
								onPress={() => {
									this.props.navigation.push('ProviderEditCompanyProfileScreen', {
										providerID: provider.providerID,
										provider,
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
									this.props.navigation.push('ProviderCreateProductScreen', {
										providerID: provider.providerID,
										provider
									});
								}}
							/>
						</View>
					</View>
				</View>
			</View>
		);

		//If the screen is loading, then the loading icon will appear. If the provider does not yet have
		//any products, then the "Create first product" thing will appear. If none of that is true, then
		//the provider's normal products will be displayed.
		if (isLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner title={strings.Business} />
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
					<ErrorAlert
						isVisible={this.state.isErrorVisible}
						onPress={() => {
							this.setState({ isErrorVisible: false });
						}}
						title={strings.Whoops}
						message={strings.SomethingWentWrong}
					/>
				</HelpView>
			);
		} else if (serviceIDsLength === 0) {
			return (
				<HelpView style={screenStyle.container}>
					<View style={{ flex: 1.1 }}>{topView}</View>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<Text style={fontStyles.bigTextStyleBlack}>
							{strings.CreateYourFirstProductNowExclamation}
						</Text>
					</View>

					<View style={{ flex: 1, justifyContent: 'center' }}>
						<CachedImage
							source={this.state.image}
							style={{
								width: Dimensions.get('window').width * 0.5,
								height: Dimensions.get('window').height * 0.2
							}}
						/>
					</View>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<RoundBlueButton
							title={strings.Create}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={() => {
								this.props.navigation.push('ProviderCreateProductScreen', {
									providerID: provider.providerID,
									provider
								});
							}}
						/>
					</View>
					<ErrorAlert
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
					{topView}
					<ServiceCardList
						services={providerProducts}
						onPress={(service) => {
							this.props.navigation.push('ProviderProductScreen', {
								productID: service.serviceID,
								providerID: provider.providerID
							});
						}}
					/>
					<View style={{ height: Dimensions.get('window').height * 0.025 }}></View>
					<OptionPicker
						isVisible={this.state.incompleteProfile}
						title={strings.FinishCreatingYourProfile}
						oneOption={true}
						clickOutside={false}
						message={strings.FinishCreatingYourProfileMessage}
						confirmText={strings.Ok}
						confirmOnPress={() => {
							this.setState({ incompleteProfile: false });
							this.props.navigation.push('ProviderEditCompanyProfileScreen', {
								providerID: this.state.provider.providerID,
								provider: this.state.provider,
								editing: true
							});
						}}
					/>
				</HelpView>
			);
		}
	}
}

//Exports the screen
export default businessScreen;

//This screen will display the businesses that have been blocked by a requeuster and allow them to unblock those
//requesters if they want to
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import { Text, FlatList, View, Dimensions, ScrollView } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import LoadingSpinner from '../components/LoadingSpinner';
import strings from '../../config/strings';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import ErrorAlert from '../components/ErrorAlert';
import OptionPicker from '../components/OptionPicker';
import colors from 'config/colors';

//Creates the exports the class
export default class blockedBusinessesScreen extends Component {
	//initializes the initial loading space
	state = {
		isScreenLoading: true,
		isLoading: false,
		requesterID: '',
		blockedBusinesses: '',
		isUnblockCompanyVisible: false,
		companyClicked: '',
		isErrorVisible: false,
		isCompanyHasBeenUnblockedVisible: false
	};

	//Fetches the correct variables based on the requester's array of blocked users
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('BlockedBusinessesScreen', 'blockedbusinessesScreen');
		const { requesterID } = this.props.navigation.state.params;
		const requester = await FirebaseFunctions.getRequesterByID(requesterID);
		let { blockedUsers } = requester;
		let newBlockedUsersList = [];
		for (const providerID of blockedUsers) {
			const provider = await FirebaseFunctions.getProviderByID(providerID);
			newBlockedUsersList.push({
				providerID,
				companyName: provider.companyName
			});
		}
		this.setState({
			isScreenLoading: false,
			requesterID,
			blockedBusinesses: newBlockedUsersList
		});
	}

	//Renders the UI
	render() {
		//Fetches all of the state
		const {
			isScreenLoading,
			isLoading,
			requesterID,
			blockedBusinesses,
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
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.Blocked}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>

				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<FlatList
						data={blockedBusinesses}
						keyExtractor={(item, index) => {
							return item.providerID;
						}}
						renderItem={({ item, index }) => (
							<View
								style={{
									height: Dimensions.get('window').height * 0.07,
									marginTop: Dimensions.get('window').height * 0.01,
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignSelf: 'center',
									alignItems: 'center',
									width: Dimensions.get('window').width * 0.95,
									borderBottomColor: colors.lightBlue,
									borderBottomWidth: 1
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>{item.companyName}</Text>
								<RoundBlueButton
									title={strings.Unblock}
									style={roundBlueButtonStyle.SmallSizeButton}
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
						title={strings.UnblockCompany}
						message={strings.AreYouSureYouWantToUnblock + companyClicked.companyName + '?'}
						confirmText={strings.Yes}
						cancelText={strings.Cancel}
						clickOutside={true}
						confirmOnPress={async () => {
							try {
								this.setState({ isLoading: true, isUnblockCompanyVisible: false });
								await FirebaseFunctions.unblockCompany(requesterID, companyClicked.providerID);
								this.setState({ isCompanyHasBeenUnblockedVisible: true, isLoading: false });
							} catch (error) {
								this.setState({ isLoading: false, isErrorVisible: true });
								FirebaseFunctions.logIssue(error, {
									screen: 'Blocked Businesses Screen',
									userID: 'r-' + requesterID
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
                            marginTop: Dimensions.get('window').height * 0.05,
                            width: Dimensions.get('window').width
						}}>
						<LoadingSpinner isVisible={isLoading} />
					</View>
					<ErrorAlert
						isVisible={isErrorVisible}
						onPress={() => {
							this.setState({ isErrorVisible: false });
						}}
						title={strings.Whoops}
						message={strings.SomethingWentWrong}
					/>
					<ErrorAlert
						isVisible={isCompanyHasBeenUnblockedVisible}
						onPress={() => {
							let newBlockedUsers = blockedBusinesses;
							const indexOfUnblocked = newBlockedUsers.findIndex((element) => {
								return element.providerID === companyClicked.providerID;
							});
							newBlockedUsers.splice(indexOfUnblocked, 1);

							this.setState({
								isCompanyHasBeenUnblockedVisible: false,
								blockedBusinesses: newBlockedUsers
							});
						}}
						title={strings.Success}
						message={companyClicked.companyName + ' ' + strings.HasBeenUnblocked}
					/>
				</ScrollView>
			</HelpView>
		);
	}
}

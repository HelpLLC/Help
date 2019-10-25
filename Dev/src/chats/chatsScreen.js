//This screen will represent all the chats belonging to this current user
import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import ChatCard from '../components/ChatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LeftMenu from '../requesterScreens/LeftMenu';
import SideMenu from 'react-native-side-menu';

class chatsScreen extends Component {
	//The constructor that initializes the loading screen to make sure all of the chats have been loaded
	constructor() {
		super();
		this.state = {
			isLoading: true,
			userID: '',
			userConversations: '',
			isRequester: '',
			isOpen: false
		};
	}

	//The method that is called to load all of the data
	async fetchDatabaseData() {
		//First determines whether this is a requester or a provider and then sets the userID
		if (this.props.navigation.state.params.providerID) {
			//Fetches all the conversations that this user has done and stores them in an array
			const convos = await FirebaseFunctions.getAllUserConversations(this.props.navigation.state.params.providerID, false);
			this.setState({
				userID: this.props.navigation.state.params.providerID,
				isRequester: false,
				userConversations: convos,
				isLoading: false,
				isOpen: false
			});
		} else {
			//Fetches all the conversations that this user has done and stores them in an array
			const convos = await FirebaseFunctions.getAllUserConversations(this.props.navigation.state.params.requester.requesterID, true);
			this.setState({
				userID: this.props.navigation.state.params.requester.requesterID,
				isRequester: true,
				userConversations: convos,
				isLoading: false,
				isOpen: false
			});
		}
	}

	//The method that is called to load all of the data
	async componentDidMount() {
		//Adds the listener to add the listener to refetch the data once this component is returned to
		this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
			await this.fetchDatabaseData();
		});
	}

	//Removes the listener when the screen is switched away from
	componentWillUnmount() {
		this.willFocusListener.remove();
	}

	render() {
		const { isRequester } = this.state;

		if (this.state.isLoading === true) {
			return (
				<View style={screenStyle.container}>
					<View style={{ flex: 1 }}>
						{isRequester === true ? (
							<TopBanner
								leftIconName='navicon'
								leftOnPress={() => {
									FirebaseFunctions.analytics.logEvent('sidemenu_opened_from_chats');
									this.setState({ isOpen: true });
								}}
								size={30}
								title={strings.Chats}
							/>
						) : (
							<TopBanner title={strings.Chats} />
						)}
					</View>
					<View>
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center'
							}}>
							<LoadingSpinner isVisible={this.state.isLoading} />
						</View>
					</View>
				</View>
			);
		} else {
			return (
				<SideMenu
					isOpen={this.state.isOpen}
					menu={<LeftMenu navigation={this.props.navigation} allProducts={this.props.navigation.state.params.allProducts} requester={this.props.navigation.state.params.requester} />}>
					<View style={screenStyle.container}>
						<View>
							{isRequester === true ? (
								<TopBanner
									leftIconName='navicon'
									leftOnPress={() => {
										this.setState({ isOpen: true });
									}}
									size={30}
									title={strings.Chats}
								/>
							) : (
								<TopBanner title={strings.Chats} />
							)}
							{//Tests whether or not the provider has any conversations
							this.state.userConversations.length === 0 ? (
								<View
									style={{
										flex: 1,
										alignItems: 'center',
										justifyContent: 'center'
									}}>
									<Text style={fontStyles.mainTextStyleBlack}>{strings.NoMessagesYet}</Text>
								</View>
							) : (
								<View>
									<ScrollView style={{ flex: 1 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
										<FlatList
											data={this.state.userConversations}
											keyExtractor={(item, index) => {
												return 'Provider #' + item.providerID + ' + Requester #' + item.requesterID;
											}}
											renderItem={({ item, index }) => (
												<ChatCard
													username={
														//Will test if this is the provider or the requester in
														//order to know which username to display
														this.state.isRequester ? item.providerName : item.requesterName
													}
													previewText={item.conversationMessages[item.conversationMessages.length - 1].text}
													timeText={item.conversationMessages[item.conversationMessages.length - 1].createdAt}
													onPress={() => {
														this.props.navigation.push('MessagingScreen', {
															title: this.state.isRequester ? item.providerName : item.requesterName,
															providerID: item.providerID,
															requesterID: item.requesterID,
															userID: this.state.isRequester ? item.requesterID : item.providerID
														});
													}}
												/>
											)}
										/>
									</ScrollView>
								</View>
							)}
						</View>
					</View>
				</SideMenu>
			);
		}
	}
}

//exports the screen
export default chatsScreen;

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
import HelpView from '../components/HelpView';

class chatsScreen extends Component {
	//The constructor that initializes the loading screen to make sure all of the chats have been loaded
	constructor() {
		super();
		this.state = {
			isLoading: true,
			userID: '',
			userConversations: '',
			isOpen: false
		};
	}

	//The method that is called to load all of the data
	async fetchDatabaseData() {
		//Fetches all the conversations that this user has done and stores them in an array
		const convos = await FirebaseFunctions.call('getAllUserConversations', {
			userID: this.props.navigation.state.params.requester.requesterID,
			isRequester: true
		});
		this.setState({
			userID: this.props.navigation.state.params.requester.requesterID,
			userConversations: convos,
			isLoading: false,
			isOpen: false
		});
	}

	//The method that is called to load all of the data
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('ChatsScreen', 'chatsScreen');
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
		//This is going to contain the main UI because we only display the left menu if it is a requester
		const mainUI = (
			<HelpView style={screenStyle.container}>
				<View>
					<TopBanner
						leftIconName='navicon'
						leftOnPress={() => {
							this.setState({ isOpen: true });
						}}
						size={30}
						title={strings.Chats}
					/>
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
							<ScrollView
								style={{ flex: 1 }}
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}>
								<FlatList
									data={this.state.userConversations}
									keyExtractor={(item, index) => {
										return 'Provider #' + item.providerID + ' + Requester #' + item.requesterID;
									}}
									renderItem={({ item, index }) => (
										<ChatCard
											username={item.providerName}
											previewText={
												item.conversationMessages[item.conversationMessages.length - 1].text
											}
											timeText={
												item.conversationMessages[item.conversationMessages.length - 1].createdAt
											}
											onPress={() => {
												this.props.navigation.push('MessagingScreen', {
													title: item.providerName,
													providerID: item.providerID,
													requesterID: item.requesterID,
													userID: item.requesterID
												});
											}}
										/>
									)}
								/>
							</ScrollView>
						</View>
					)}
				</View>
			</HelpView>
		);

		if (this.state.isLoading === true) {
			return (
				<View style={screenStyle.container}>
					<TopBanner
						leftIconName='navicon'
						leftOnPress={() => {
							FirebaseFunctions.analytics.logEvent('sidemenu_opened_from_chats');
							this.setState({ isOpen: true });
						}}
						size={30}
						title={strings.Chats}
					/>
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						<LoadingSpinner isVisible={this.state.isLoading} />
					</View>
				</View>
			);
		} else {
			return (
				<View style={{ flex: 1 }}>
					<SideMenu
						isOpen={this.state.isOpen}
						onChange={(isOpen) => {
							this.setState({ isOpen });
						}}
						menu={
							<LeftMenu
								navigation={this.props.navigation}
								allProducts={this.props.navigation.state.params.allProducts}
								requester={this.props.navigation.state.params.requester}
							/>
						}>
						{mainUI}
					</SideMenu>
				</View>
			);
		}
	}
}

//exports the screen
export default chatsScreen;

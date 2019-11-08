//This screen will represent the actual screen where two users communicate with each other. It will be
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import { View, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBanner from '../components/TopBanner';

class messagingScreen extends Component {
	constructor() {
		super();
		this.state = {
			isLoading: true,
			messages: '',
			isNewConversation: ''
		};
	}

	async componentDidMount() {
		const { providerID, requesterID } = this.props.navigation.state.params;

		//Creates the onsnapshot method to listen for real updates in the database for this document
		const ref = firebase
			.firestore()
			.collection('messages')
			.where('providerID', '==', providerID)
			.where('requesterID', '==', requesterID)
			.limit(1);
		ref.onSnapshot(async (snapshot) => {
			//Fetches the doc changes and sets them to the new state
			if (snapshot.docChanges.length > 0) {
				const docData = await snapshot.docChanges[0].doc.data();
				//Sorts the conversation messages by time
				const conversationMessages = docData.conversationMessages.sort((a, b) => {
					return b.createdAt - a.createdAt;
				});
				this.setState({
					isLoading: false,
					messages: conversationMessages,
					isNewConversation: false
				});
			} else {
				this.setState({
					isLoading: false,
					messages: [],
					isNewConversation: true
				});
			}
		});
	}

	//sends a message to the reciever by adding it to the shared conversation document
	sendMessage(message) {
		this.setState({ isNewConversation: false });

		const { providerID, requesterID } = this.props.navigation.state.params;

		//Adds the message to the database of messages
		FirebaseFunctions.sendMessage(providerID, requesterID, message, this.state.isNewConversation);
	}

	//Renders the screen using the gifted chat module and binding it with the props of the screen
	render(props) {
		const { userID } = this.props.navigation.state.params;
		return (
			<TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss()}>
				<View style={{ flex: 1 }}>
					<TopBanner
						title={this.props.navigation.state.params.title}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ flex: 1, backgroundColor: colors.lightGray }}>
						{this.state.isLoading ? (
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
								<LoadingSpinner isVisible={this.state.isLoading} />
							</View>
						) : (
							<GiftedChat
								{...props}
								renderSend={(props) => {
									return (
										<Send {...props}>
											<View
												style={{
													width: Dimensions.get('window').width * 0.1,
													height: Dimensions.get('window').height * 0.07,
													justifyContent: 'center',
													alignItems: 'center'
												}}>
												<Icon
													name={'arrow-circle-up'}
													type='font-awesome'
													size={35}
													color={colors.lightBlue}
												/>
											</View>
										</Send>
									);
								}}
								messages={this.state.messages}
								placeholder={'Type a message...'}
								user={{
									_id: userID
								}}
								renderAvatar={null}
								onSend={(message) => {
									this.sendMessage(message);
								}}
							/>
						)}
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

export default messagingScreen;

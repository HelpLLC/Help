//This screen will represent the actual screen where two users communicate with each other. It will be
//a simple chat screen only allowing messaging.
import React, { Component } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import firebase from 'react-native-firebase';
import { View, TouchableWithoutFeedback, Keyboard, Dimensions, TextInput } from 'react-native';
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
    FirebaseFunctions.setCurrentScreen('MessagingScreen', 'messagingScreen');
    const { providerID, requesterID } = this.props.navigation.state.params;

    //Creates the onsnapshot method to listen for real updates in the database for this document
    let ref = await firebase
      .firestore()
      .collection('messages')
      .where('providerID', '==', providerID)
      .where('requesterID', '==', requesterID)
      .limit(1);
    if (ref.docs.length > 0) {
      ref.onSnapshot(async (snapshot) => {
        console.log('HEY');
        //Fetches the doc changes and sets them to the new state
        const conversationMessages = await FirebaseFuncions.getConversationByID(
          providerID,
          requesterID
        );
        this.setState({
          isLoading: false,
          messages: conversationMessages,
          isNewConversation: false
        });
      });
    } else {
      this.setState({
        isLoading: false,
        messages: [],
        isNewConversation: true
      });
    }
  }

  //sends a message to the reciever by adding it to the shared conversation document
  sendMessage(message) {
    this.setState({ isNewConversation: false });

    const { providerID, requesterID } = this.props.navigation.state.params;

    //Adds the message to the database of messages
    FirebaseFunctions.call('sendMessage', {
      providerID,
      requesterID,
      message,
      isNewConversation: this.state.isNewConversation
    });
  }

  //Renders the screen using the gifted chat module and binding it with the props of the screen
  render(props) {
    const { userID } = this.props.navigation.state.params;
    return (
      <TouchableWithoutFeedback accessible={false}>
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
                keyboardShouldPersistTaps={'handled'}
                {...props}
                renderSend={(props) => {
                  //Gifted chat doesn't use dimensions based heights and widths,
                  //which is the reason for using exact numeric margins, and sizes
                  return (
                    <Send {...props}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 5,
                          marginBottom: 3
                        }}>
                        <Icon
                          name={'arrow-circle-up'}
                          type='font-awesome'
                          size={40}
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

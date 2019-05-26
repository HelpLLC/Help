//This reducer will handle and manage the messaging functionality of the app. It will send and 
//recieve messages
import update from 'immutability-helper';
import InitialState from '../InitialState';
import actionTypes from './actionTypes';
import FirebaseFunctions from 'config/FirebaseFunctions';

//The reducer which will fetch the messages part of the state and also take in an action
export default messageReducer = (state = InitialState.messages, action) => {

    //The switch statement which will take in an action type and then perform certain commands based
    //on this action type
    switch (action.type) {

        //Determines what to do when a new message is sent
        case actionTypes.SEND_MESSAGE:

            //retrieves the information from the action
            let { providerID, requesterID, messageInfo, providerName, requesterName } = action;

            //If this is a brand new conversation between the two people, then a new one will
            //be created. If it is not, the message will be appended to the existing conversation
            if (FirebaseFunctions.isNewConversation(providerID, requesterID, state)) {

                //Creates the conversation
                let newConversation = {
                    providerID: providerID,
                    requesterID: requesterID,
                    companyName: providerName,
                    requesterName: requesterName, 
                    conversationMessages: []
                }

                //appends the new conversation to the state
                let newState = update(state, { $push: [newConversation] });

                //Adds the first sent message to the state
                //Retrieves the index of the conversation so it can append the message to
                const conversationIndex = FirebaseFunctions.getConversationIndexByID(providerID, requesterID, newState);

                //appends the message to the existing conversation
                newState = update(newState, { [conversationIndex]: { conversationMessages: { $push: messageInfo } } });

                //returns the new conversation
                return newState;

            } else {

                //Retrieves the index of the conversation so it can append the message to
                const conversationIndex = FirebaseFunctions.getConversationIndexByID(providerID, requesterID, state);

                //appends the message to the existing conversation
                let newState = update(state, { [conversationIndex]: { conversationMessages: { $push: messageInfo } } });

                //returns the new state
                return newState;
            }

        //If no action is entered, will simply return the current state
        default:
            return state;

    }
}
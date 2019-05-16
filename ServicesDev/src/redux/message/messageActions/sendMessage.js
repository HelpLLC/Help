//This action will send the message from one person to the other by providing it three parameters. The
//first two are the ID's of the provider and the reducer in order to add the message to the correct
//conversation, and the third parameter is the message information itself
import actionTypes from '../actionTypes';

export const sendMessage = (providerID, requesterID, messageInfo, providerName, requesterName) => (
    //The return object of this functions
    {
        //The type of this action
        type: actionTypes.SEND_MESSAGE,

        //returns all of the above information to be used by the reducer
        providerID,
        requesterID,
        messageInfo,
        providerName,
        requesterName
    }
)
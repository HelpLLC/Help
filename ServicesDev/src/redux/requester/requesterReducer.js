//This reducer will have all of the requester-side actions and what to do with them. The reducer
//takes in an action and the code tells it what to do with the action
import update from 'immutability-helper';
import actionTypes from './actionTypes';

//The reducer which will interpret what to do with the actions
export default requesterReducer = (state = {}, action) => {


    //This switch statement will test for which action is being called right now & will act accordingly
    switch (action.type) {

        //This will deal with what happens if there is a new requester account being created
        case actionTypes.CREATE_REQUESTER_ACCOUNT:

            //Will fetch the entered username
            let { username, requesterID } = action.accountInfo;

            //Makes a new object representing the new account using the preceding variables
            let newAccount = {
                username: username,
                requesterID: requesterID
            }

            //Will update the state with the new account that got added by adding it to the array
            //of users
            let newState = update(state, { $push: [newAccount] } );

            //returns the newly updated state
            return newState;

        //If no action is entered, will simply return the current state
        default:
            return state;
    }




};
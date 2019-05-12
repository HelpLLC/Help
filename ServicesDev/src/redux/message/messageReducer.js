//This reducer will handle and manage the messaging functionality of the app. It will send and 
//recieve messages
import update from 'immutability-helper';
import InitialState from '../InitialState';
import actionTypes from './actionTypes';

//The reducer which will fetch the messages part of the state and also take in an action
export default messageReducer = (state = InitialState.messages, action) => {

    //The switch statement which will take in an action type and then perform certain commands based
    //on this action type
    switch (action.type) {

        //If no action is entered, will simply return the current state
        default:
            return state;

    }
}
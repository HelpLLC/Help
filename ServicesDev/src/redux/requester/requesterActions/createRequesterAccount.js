//This action will create the account for the requester.
import actionTypes from '../actionTypes';

//The action, which will take in the account information
export const createRequesterAccount = (accountInfo) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            //The type of action we are dealing with
            type: actionTypes.CREATE_REQUESTER_ACCOUNT,

            //Object will contain the account info, which will be an object containing the username
            //As well as the type of account
            accountInfo
        })
    }
};
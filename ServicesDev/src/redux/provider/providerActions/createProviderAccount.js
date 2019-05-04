//This action will create the account for the provider.
import actionTypes from '../actionTypes';

//The action, which will take in the account information
export const createProviderAccount = (accountInfo) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        //Creates a firestore instance to prepare it to get sent up to the database
        const firestore = getFirestore();
        //Adds the document to the providers collection --- async
        firestore.collection('providers').add({
            ...accountInfo
        }).then(() => {
            dispatch({
                //The type of action we are dealing with
                type: actionTypes.CREATE_PROVIDER_ACCOUNT,

                //Object will contain the account info, which will be an object containing the username
                //As well as the type of account
                accountInfo
            })
        }).catch(() => {
            //Dispatch an action for errors
        });
    }
}

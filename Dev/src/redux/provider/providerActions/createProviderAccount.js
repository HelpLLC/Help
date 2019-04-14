//This action will create the account for the provider.
import actionTypes from '../actionTypes';

//The action, which will take in the account information
export const createProviderAccount = (accountInfo) => (
    {
        //The type of action we are dealing with
        type: actionTypes.CREATE_PROVIDER_ACCOUNT,
        
        //Object will contain the account info, which will be an object containing the username
        //As well as the type of account
        accountInfo
    }
);
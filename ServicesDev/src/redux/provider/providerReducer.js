//This reducer will have all of the provider-side actions and what to do with them. The reducer
//takes in an action and the code tells it what to do with the action
import update from 'immutability-helper';
import InitialState from '../InitialState';
import actionTypes from './actionTypes';
import FirebaseFunctions from 'config/FirebaseFunctions';

//The reducer which will interpret what to do with the actions
export default providerReducer = (state = InitialState.providers, action) => {

    //This switch statement will test for which action is being called right now & will act accordingly
    switch (action.type) {

        //This will deal with what happens if there is a new provider account being created
        case actionTypes.CREATE_PROVIDER_ACCOUNT:

            //Makes a new object representing the new account using the object passed into the action
            let newAccount = action.accountInfo;

            //Will update the state with the new account that got added by adding it to the array
            //of users
            let newState = update(state, { $push: [newAccount] });

            //returns the newly updated state
            return newState;

        //This will deal with the action that will create a product and add it to the specified
        //provider
        case actionTypes.ADD_PROVIDER_PRODUCT:

            //Retrieves the index of the provider to add the product to
            let { providerID, serviceID } = action;

            //Retrieves the provider's index based on the passed in provider ID
            let indexOfProvider = FirebaseFunctions.getProviderIndexByID(providerID, state);

            //updates the state once again to add the product to the provider's list of products
            newState = update(state, { [indexOfProvider]: { serviceIDs: { $push: [serviceID] } } });

            //returns the newly updated state
            return newState;

        //This will deal with the action that will edit a provider's company details
        case actionTypes.EDIT_COMPANY_PROFILE:

            //Retrieves the index of the provider whose company details will change along with the
            //new information within the companyInfo object passed into the action
            let ID = action.providerID;
            let providerIndex = FirebaseFunctions.getProviderIndexByID(ID, state);
            let newBusinessInfo = action.companyInfo;
            let newCompanyName = newBusinessInfo.newBusinessName;
            let newCompanyInfo = newBusinessInfo.newBusinessInfo;

            //Updates the state by both updating the new name of the company as well as its
            //description.
            newState = update(state, { [providerIndex]: { companyName: { $set: newCompanyName } } });
            newState = update(newState, { [providerIndex]: { companyDescription: { $set: newCompanyInfo } } });

            //returns the newly updated state
            return newState;

        //If no action is entered, will simply return the current state
        default:
            return state;
    }
};
//This reducer will have all of the provider-side actions and what to do with them. The reducer
//takes in an action and the code tells it what to do with the action
import update from 'immutability-helper';
import InitialState from '../InitialState';
import actionTypes from './actionTypes';

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
            let newState = update(state, { accounts: { $push: [newAccount] } });

            //returns the newly updated state
            return newState;

        //This will deal with the action that will create a product and add it to the specified
        //provider
        case actionTypes.CREATE_PROVIDER_PRODUCT:

            //Retrieves the index of the provider to add the product to as well as the product info
            let productInfo = action.productInfo;

            //Updates the state by pushing the new product into the array of providers
            newState = update(state, { products: { $push: [productInfo] } });

            //returns the newly updated state
            return newState;

        //This will deal with the action that will edit a provider's company details
        case actionTypes.EDIT_COMPANY_PROFILE:

            //Retrieves the index of the provider whose company details will change along with the
            //new information within the companyInfo object passed into the action
            let index = action.providerIndex;
            let newBusinessInfo = action.companyInfo;
            let newCompanyName = newBusinessInfo.newBusinessName;
            let newCompanyInfo = newBusinessInfo.newBusinessInfo;

            //Updates the state by both updating the new name of the company as well as its
            //description.
            newState = update(state, { accounts: { [index]: { companyName: { $set: newCompanyName } } } });
            newState = update(newState, { accounts: { [index]: { companyDescription: { $set: newCompanyInfo } } } });

            //returns the newly updated state
            return newState;

        //This will deal with the action that will update a specific product that already exists
        case actionTypes.UPDATE_PROVIDER_PRODUCT:

            //Retrieves the index of the provider as well as the product info
            //as well as the product's index
            const { productIndex, updatedProductInfo } = action;

            //Updates the state by pushing the new product into the array of providers
            newState = update(state, { products: { [productIndex]: { $set: updatedProductInfo } } });

            //returns the newly updated state
            return newState;

        //This will deal with what happens when a user requests a product. Note: This action is found
        //under RequestActions for clarity, but its abstraction and functionality will be located
        //here since it is interacting with the provider reducer
        case actionTypes.REQUEST_PRODUCT:

            //Fetches the ID of the product as well as the information about the product
            const { serviceID, requestInfo } = action;

            //Finds the product's index that the request will be added to by searching for it by id
            let indexOFRequestedProduct = state.products.findIndex((product) => {
                return product.serviceID === serviceID;
            });

            //Updates the state by pushing the new request to the array of current requests of the
            //product
            newState = update(state, { products: { [indexOFRequestedProduct]: { requests: { currentRequests: { $push: [requestInfo] } } } } });

            //Returns the new state
            return newState;

        //This action will delete a request from the database completely WITHOUT automatically marking
        //it as complete. This will be another action. This will remove the passed in request from the
        //database
        case actionTypes.DELETE_REQUEST:

            //Fetches the ID of the product as well as the ID of the requester who requested it
            const { productID, requesterID } = action;

            //finds the index of the requested product by the passed in ID
            indexOFRequestedProduct = state.products.findIndex((product) => {
                return product.serviceID === productID;
            });

            //Finds the index of the request within the product itself by searching for it by requester
            //ID
            let indexOfRequest = state.products[indexOFRequestedProduct].requests.currentRequests.findIndex((request) => {
                return request.requesterID === requesterID;
            });

            //Updates the state by removing the product request based on the previously found indecies
            newState = update(state, { products: { [indexOFRequestedProduct]: { requests: { currentRequests: { $splice: [[indexOfRequest, 1]] } } } } });

            //returns the new state
            return newState;

        //If no action is entered, will simply return the current state
        default:
            return state;
    }
};
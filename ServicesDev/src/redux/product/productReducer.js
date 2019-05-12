//This reducer will deal with all of the actions concerning the products' column. Reducer takes in an 
//action and then returns a new state based on the type of action it is dealing with
import update from 'immutability-helper';
import InitialState from '../InitialState';
import actionTypes from './actionTypes';

//The reducer which will determine what to do with the actions
export default productReducer = (state = InitialState.products, action) => {

    //The switch statement will test for all of the different actionTypes
    switch (action.type) {
        //This will deal with the action that will create a product and add it to the specified
        //provider
        case actionTypes.CREATE_NEW_PRODUCT:

            //Retrieves the index of the provider to add the product to as well as the product info
            let productInfo = action.productInfo;

            //Updates the state by pushing the new product into the array of providers
            newState = update(state, { $push: [productInfo] });

            //returns the newly updated state
            return newState;

        //This will deal with the action that will update a specific product that already exists
        case actionTypes.UPDATE_PROVIDER_PRODUCT:

            //Retrieves the index of the provider as well as the product info
            //as well as the product's index
            const { productIndex, updatedProductInfo } = action;

            //Updates the state by pushing the new product into the array of providers
            newState = update(state, {  { [productIndex]: { $set: updatedProductInfo } });

            //returns the newly updated state
            return newState;

        //This will deal with what happens when a user requests a product. Note: This action is found
        //under RequestActions for clarity, but its abstraction and functionality will be located
        //here since it is interacting with the provider reducer
        case actionTypes.REQUEST_PRODUCT:

            //Fetches the ID of the product as well as the information about the product
            const { serviceID, requestInfo } = action;

            //Finds the product's index that the request will be added to by searching for it by id
            let indexOFRequestedProduct = state.findIndex((product) => {
                return product.serviceID === serviceID;
            });

            //Updates the state by pushing the new request to the array of current requests of the
            //product
            newState = update(state, { [indexOFRequestedProduct]: { requests: { currentRequests: { $push: [requestInfo] } } } });

            //Returns the new state
            return newState;

        //This will deal with completing an existing request. It will only move the item from current 
        //requests to completed requests but won't actually deleted the object. This is to avoid
        //repetitive code since we alreayd have an action for deleting an object
        case actionTypes.COMPLETE_REQUEST:

            //Fetches the ID of the product and the request object
            const idOfRequester = action.requesterID;
            const idOfProduct = action.productID;

            //finds the index of the requested product by the passed in ID
            indexOFRequestedProduct = state.findIndex((product) => {
                return product.serviceID === idOfProduct;
            });

            //Finds the request within the product itself by searching for it by requester
            //ID
            let request = state[indexOFRequestedProduct].requests.currentRequests.find((request) => {
                return request.requesterID === idOfRequester;
            });

            let completedRequest = {
                dateRequested: request.dateRequested,
                dateCompleted: new Date().toLocaleDateString('en-US'),
                requesterID: idOfRequester
            }

            //Updates the state by adding the completed request to the array of completed requests
            newState = update(state, { [indexOFRequestedProduct]: { requests: { completedRequests: { $push: [completedRequest] } } } });

            //returns the new state
            return newState;

        //This action will delete a request from the database completely WITHOUT automatically marking
        //it as complete. This will be another action. This will remove the passed in request from the
        //database
        case actionTypes.DELETE_REQUEST:

            //Fetches the ID of the product as well as the ID of the requester who requested it
            const { productID, requesterID } = action;

            //finds the index of the requested product by the passed in ID
            indexOFRequestedProduct = state.findIndex((product) => {
                return product.serviceID === productID;
            });

            //Finds the index of the request within the product itself by searching for it by requester
            //ID
            let indexOfRequest = state[indexOFRequestedProduct].requests.currentRequests.findIndex((request) => {
                return request.requesterID === requesterID;
            });

            //Updates the state by removing the product request based on the previously found indecies
            newState = update(state, { [indexOFRequestedProduct]: { requests: { currentRequests: { $splice: [[indexOfRequest, 1]] } } } });

            //returns the new state
            return newState;

        //If no action is entered, will simply return the current state
        default:
            return state;
    }
}
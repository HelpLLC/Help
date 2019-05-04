//This action is going to request a product from a certain provider
//
//*Since this action will interact with the database of the provider, its reducer will be in the 
//provider reducer, while the action will be under "requester actions"* 
import actionTypes from '../actionTypes';

export const requestProduct = (serviceID, requestInfo) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            //The type of action this is
            type: actionTypes.REQUEST_PRODUCT,

            //Object will contain all information about a request including the ID of the requester who
            //request it, along with the date it was requested. This action will also the return the ID
            //of the product that is being requested
            serviceID,
            requestInfo
        })
    }
};
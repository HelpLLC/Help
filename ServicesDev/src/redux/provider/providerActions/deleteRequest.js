//This action will delete an existing request from a product's request array
import actionTypes from '../actionTypes';

//The class will take in action parameters of the product ID as well as the requester's ID which
//is how it will locate and remove the request from the current requester
export const deleteRequest = (productID, requesterID) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            //The type of this action
            type: actionTypes.DELETE_REQUEST,

            //The parameters of this object
            productID,
            requesterID
        })
    }
}
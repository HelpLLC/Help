//This action is going to complete the request by moving it from current requests to completed requests
//It will keep the object and add a "date completed" property to it
import actionTypes from '../actionTypes';

//The function will take in a product ID and the object containing the request
export const completeRequest = (productID, requesterID) => (
    //The return of this function
    {
        //The type of this action
        type: actionTypes.COMPLETE_REQUEST,

        //Will simply return the product ID and the request object
        productID,
        requesterID
    }
);
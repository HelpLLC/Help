//This action will add the productID to the provider
import actionTypes from '../actionTypes';

//The action, which will take in the account information
export const addProviderProduct = (providerID, serviceID) => (
    {
        //The type of action we are dealing with
        type: actionTypes.ADD_PROVIDER_PRODUCT,
        
        //Object will return the providerID as well as the serviceID
        providerID, 
        serviceID
    }
);
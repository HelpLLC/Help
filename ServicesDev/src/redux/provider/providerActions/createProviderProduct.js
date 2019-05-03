//This action will add the product to the company's account
import actionTypes from '../actionTypes';

//The action will take in the index of the provider (to know which provider we are dealing) with
//and will take in an object containing the product information
export const createProviderProduct = (productInfo, providerID) => (
    {
        //The type of action so the reducer knows which action we're dealing with
        type: actionTypes.CREATE_PROVIDER_PRODUCT,

        //Returns the index of the provider as well as the product info
        productInfo,
        providerID
    }
);